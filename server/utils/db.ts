import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { randomBytes, scryptSync } from 'node:crypto'
import { company, defaultHomePopupVideoUrl, posts as seedPosts, products as seedProducts } from '../../app/data/site'
import {
  makeCategorySeoDescription,
  makeCategorySeoKeywords,
  makeCategorySeoTitle,
  makeProductSeoDescription,
  makeProductSeoKeywords,
  makeProductSeoTitle,
  seoBrand,
} from './seo-copy'

let db: DatabaseSync | null = null

const now = () => new Date().toISOString()

const dbPath = () => process.env.SQLITE_PATH || join(process.cwd(), 'data/yiyuan.db')

const passwordHash = (password: string, salt = randomBytes(16).toString('hex')) => ({
  salt,
  hash: scryptSync(password, salt, 64).toString('hex'),
})

const defaultAdminUsername = () => process.env.ADMIN_USERNAME || 'admin'
const defaultAdminPassword = () => process.env.ADMIN_PASSWORD || 'admin123'

const execSchema = (database: DatabaseSync) => {
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS seo_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_key TEXT NOT NULL UNIQUE,
      page_type TEXT NOT NULL,
      entity_slug TEXT,
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      keywords TEXT,
      canonical TEXT,
      robots TEXT NOT NULL DEFAULT 'index,follow',
      og_title TEXT,
      og_description TEXT,
      og_image TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      image TEXT,
      seo_title TEXT,
      seo_description TEXT,
      seo_keywords TEXT,
      canonical TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      enabled INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      short_desc TEXT NOT NULL,
      image TEXT,
      material TEXT,
      moq TEXT,
      custom INTEGER NOT NULL DEFAULT 1,
      packaging TEXT,
      seo_title TEXT,
      seo_description TEXT,
      seo_keywords TEXT,
      canonical TEXT,
      specs_json TEXT NOT NULL DEFAULT '[]',
      size_options_json TEXT NOT NULL DEFAULT '[]',
      applications_json TEXT NOT NULL DEFAULT '[]',
      sort_order INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'published',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      cover_image TEXT,
      content_html TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      published_at TEXT,
      scheduled_publish_at TEXT,
      published_by_scheduler_at TEXT,
      seo_title TEXT,
      seo_description TEXT,
      seo_keywords TEXT,
      canonical TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      mail_status TEXT NOT NULL DEFAULT 'pending',
      mail_error TEXT,
      mail_provider TEXT,
      mail_to TEXT,
      mail_message_id TEXT,
      mail_attempts INTEGER NOT NULL DEFAULT 0,
      last_mail_attempt_at TEXT,
      next_mail_attempt_at TEXT,
      forwarded_at TEXT,
      read_at TEXT,
      handled_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform_key TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      url TEXT NOT NULL DEFAULT '',
      enabled INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      new_window INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS friend_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL DEFAULT '',
      description TEXT,
      enabled INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      new_window INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS uploaded_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `)
}

const tableColumnNames = (database: DatabaseSync, table: string) =>
  new Set((database.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>).map((column) => column.name))

const adminColumnNames = (database: DatabaseSync) => tableColumnNames(database, 'admin_users')

const migrateAdminUsers = (database: DatabaseSync) => {
  let columns = adminColumnNames(database)
  if (!columns.has('username')) {
    database.exec('ALTER TABLE admin_users ADD COLUMN username TEXT')
    columns = adminColumnNames(database)
  }

  const rows = database
    .prepare('SELECT id, username FROM admin_users ORDER BY id')
    .all() as Array<{ id: number; username: string | null }>

  rows.forEach((row, index) => {
    if (row.username) return
    database
      .prepare('UPDATE admin_users SET username = ?, updated_at = ? WHERE id = ?')
      .run(index === 0 ? defaultAdminUsername() : `admin_${row.id}`, now(), row.id)
  })

  database.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username)')
}

const addTextColumnIfMissing = (database: DatabaseSync, table: string, column: string) => {
  const columns = tableColumnNames(database, table)
  if (!columns.has(column)) {
    database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} TEXT`)
  }
}

const migrateProductCatalog = (database: DatabaseSync) => {
  ;['seo_title', 'seo_description', 'seo_keywords', 'canonical'].forEach((column) => {
    addTextColumnIfMissing(database, 'products', column)
    addTextColumnIfMissing(database, 'product_categories', column)
  })
}

const migrateStaticImagePathsToWebp = (database: DatabaseSync) => {
  const timestamp = now()
  const updates = [
    ['seo_entries', 'og_image'],
    ['product_categories', 'image'],
    ['products', 'image'],
    ['posts', 'cover_image'],
  ]

  updates.forEach(([table, column]) => {
    database
      .prepare(`
        UPDATE ${table}
        SET ${column} = REPLACE(${column}, '.png', '.webp'), updated_at = ?
        WHERE ${column} LIKE '/images/%.png'
      `)
      .run(timestamp)
  })
}

const migrateInquiriesSchema = (database: DatabaseSync) => {
  const columns = tableColumnNames(database, 'inquiries')
  const legacyColumns = ['company', 'product', 'quantity']
  const shouldRebuild = legacyColumns.some((column) => columns.has(column)) || !columns.has('country')

  if (!shouldRebuild) return

  const countrySelect = columns.has('country') ? "COALESCE(country, '')" : "''"

  database.exec(`
    CREATE TABLE inquiries_next (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      mail_status TEXT NOT NULL DEFAULT 'pending',
      mail_error TEXT,
      mail_provider TEXT,
      mail_to TEXT,
      mail_message_id TEXT,
      mail_attempts INTEGER NOT NULL DEFAULT 0,
      last_mail_attempt_at TEXT,
      next_mail_attempt_at TEXT,
      forwarded_at TEXT,
      read_at TEXT,
      handled_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    INSERT INTO inquiries_next (
      id, name, email, country, message, mail_status, mail_error,
      forwarded_at, read_at, handled_at, created_at, updated_at
    )
    SELECT
      id,
      name,
      email,
      ${countrySelect},
      message,
      mail_status,
      mail_error,
      forwarded_at,
      read_at,
      handled_at,
      created_at,
      updated_at
    FROM inquiries;

    DROP TABLE inquiries;
    ALTER TABLE inquiries_next RENAME TO inquiries;
  `)
}

const migrateInquiryMailColumns = (database: DatabaseSync) => {
  const columns = tableColumnNames(database, 'inquiries')
  const addColumn = (column: string, definition: string) => {
    if (!columns.has(column)) {
      database.exec(`ALTER TABLE inquiries ADD COLUMN ${column} ${definition}`)
    }
  }

  addColumn('mail_provider', 'TEXT')
  addColumn('mail_to', 'TEXT')
  addColumn('mail_message_id', 'TEXT')
  addColumn('mail_attempts', 'INTEGER NOT NULL DEFAULT 0')
  addColumn('last_mail_attempt_at', 'TEXT')
  addColumn('next_mail_attempt_at', 'TEXT')
}

const migrateInquirySeoCopy = (database: DatabaseSync) => {
  database
    .prepare(`
      UPDATE seo_entries
      SET description = ?, updated_at = ?
      WHERE entry_key = 'page:contact'
        AND description = ?
    `)
    .run(
      'Submit a quick food packaging inquiry and our team will follow up by email or WhatsApp.',
      now(),
      'Send food packaging specifications, quantity, and custom requirements for quotation.',
    )
}

const migratePostSchedulerColumns = (database: DatabaseSync) => {
  ;['scheduled_publish_at', 'published_by_scheduler_at'].forEach((column) => {
    addTextColumnIfMissing(database, 'posts', column)
  })
}

const insertSeo = (
  database: DatabaseSync,
  entry: {
    key: string
    pageType: string
    entitySlug?: string | null
    name: string
    path: string
    title: string
    description: string
    keywords?: string
    canonical?: string
    ogImage?: string
  },
) => {
  const timestamp = now()
  database
    .prepare(`
      INSERT OR IGNORE INTO seo_entries (
        entry_key, page_type, entity_slug, name, path, title, description, keywords,
        canonical, robots, og_title, og_description, og_image, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'index,follow', ?, ?, ?, ?, ?)
    `)
    .run(
      entry.key,
      entry.pageType,
      entry.entitySlug || null,
      entry.name,
      entry.path,
      entry.title,
      entry.description,
      entry.keywords || '',
      entry.canonical || '',
      entry.title,
      entry.description,
      entry.ogImage || '',
      timestamp,
      timestamp,
    )
}

const seedAdmin = (database: DatabaseSync) => {
  const existing = database.prepare('SELECT id FROM admin_users ORDER BY id LIMIT 1').get() as { id: number } | undefined
  const username = defaultAdminUsername()
  const password = defaultAdminPassword()
  const hashed = passwordHash(password)
  const timestamp = now()
  const columns = adminColumnNames(database)

  if (existing) {
    database
      .prepare('UPDATE admin_users SET username = ?, password_hash = ?, password_salt = ?, updated_at = ? WHERE id = ?')
      .run(username, hashed.hash, hashed.salt, timestamp, existing.id)
    return
  }

  if (columns.has('email')) {
    database
      .prepare(`
        INSERT INTO admin_users (username, email, password_hash, password_salt, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(username, username, hashed.hash, hashed.salt, timestamp, timestamp)
    return
  }

  database
    .prepare(`
      INSERT INTO admin_users (username, password_hash, password_salt, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(username, hashed.hash, hashed.salt, timestamp, timestamp)
}

const seedSeo = (database: DatabaseSync) => {
  const defaults = [
    {
      key: 'page:home',
      pageType: 'page',
      name: '首页',
      path: '/',
      title: 'Cling Film & Food Packaging Factory in China | YIYUAN',
      description: 'YIYUAN supplies PE/PVC cling film, fresh wrap, jumbo rolls, cutter box film, and disposable food packaging for importers, wholesalers, OEM/ODM brands, and private label orders.',
      keywords: 'cling film manufacturer, food packaging factory, PE cling film, PVC cling film, fresh wrap, jumbo roll film, cutter box film, disposable food packaging, OEM ODM food packaging, China packaging supplier, packaging supplier for importers',
      ogImage: '/images/hero-factory.webp',
    },
    {
      key: 'page:products',
      pageType: 'page',
      name: '产品列表页',
      path: '/products',
      title: 'Food Packaging Products | Cling Film & Containers | YIYUAN',
      description: 'Explore YIYUAN food packaging products, including PE/PVC cling film, jumbo rolls, cutter box film, meal boxes, cups, and containers for wholesale, OEM/ODM, and import supply.',
      keywords: 'food packaging products, cling film products, food wrap supplier, disposable food containers, meal boxes, cups, jumbo roll film, cutter box film, wholesale packaging, OEM ODM packaging',
      ogImage: '/images/product-cling-film.webp',
    },
    {
      key: 'page:about',
      pageType: 'page',
      name: '公司页',
      path: '/about',
      title: 'About YIYUAN | China Cling Film & Food Packaging Factory',
      description: 'Learn about YIYUAN, a China food packaging supplier serving importers, wholesalers, OEM/ODM brands, and private label buyers with cling film, fresh wrap, and disposable packaging.',
      keywords: 'about YIYUAN, China food packaging factory, cling film factory, food wrap supplier, disposable packaging supplier, OEM ODM packaging factory, packaging supplier for importers, export packaging supplier',
      ogImage: '/images/about-factory.webp',
    },
    {
      key: 'page:documents',
      pageType: 'page',
      name: '资料与检测报告页',
      path: '/documents',
      title: 'Certificates & Test Reports | YIYUAN Food Packaging Documents',
      description: 'View YIYUAN food packaging product catalog, test report, material safety files, migration test documents, and factory profile documents for buyer review.',
      keywords: 'food packaging certificates, test reports, food contact test report, cling film test report, product catalog PDF, packaging supplier documents',
      ogImage: '/images/quality-control.webp',
    },
    {
      key: 'page:blog',
      pageType: 'page',
      name: '博客列表页',
      path: '/blog',
      title: 'Food Packaging Sourcing Guides & Material Insights | YIYUAN',
      description: 'Read YIYUAN guides on cling film, food wrap, disposable containers, material selection, OEM/ODM packaging, wholesale sourcing, and export packaging trends.',
      keywords: 'food packaging blog, cling film guide, food wrap sourcing, disposable container guide, packaging material insights, OEM ODM packaging guide, wholesale packaging tips, export packaging trends',
      ogImage: '/images/blog-supplier.webp',
    },
    {
      key: 'page:contact',
      pageType: 'page',
      name: '联系页',
      path: '/contact',
      title: 'Contact YIYUAN | Get Food Packaging Quotes & Samples',
      description: 'Contact YIYUAN for cling film, fresh wrap, food containers, OEM/ODM packaging, samples, pricing, MOQ, lead time, and export order inquiries.',
      keywords: 'contact YIYUAN, food packaging quote, cling film quote, food wrap samples, packaging samples, OEM ODM packaging inquiry, wholesale packaging supplier, export packaging inquiry',
      ogImage: '/images/hero-factory.webp',
    },
  ]

  for (const entry of defaults) insertSeo(database, entry)

}

const defaultProductCategories = [
  {
    slug: 'cling-film',
    name: '保鲜膜',
    description: 'PE/PVC food wrap film, jumbo rolls, cutter box rolls, and private-label fresh wrap.',
    image: '/images/cat-film.webp',
    sortOrder: 1,
  },
  {
    slug: 'disposable-meal-boxes',
    name: '一次性餐盒',
    description: 'Kraft paper meal boxes, PP/PET containers, bagasse clamshells, cups, and custom food boxes.',
    image: '/images/cat-containers.webp',
    sortOrder: 2,
  },
]

const sizeOptionsForSeedProduct = (product: (typeof seedProducts)[number]) => {
  if (product.category === 'Cling Film & Fresh Wrap') {
    return [
      { label: '300mm x 300m', value: '8-12 micron', packaging: '24 rolls/carton' },
      { label: '450mm x 500m', value: '8-12 micron', packaging: '6 rolls/carton' },
      { label: '600mm x 1000m', value: '10-15 micron', packaging: '6 rolls/carton' },
    ]
  }

  return [
    { label: '500ml', value: '170x120x45mm', packaging: '300 pcs/carton' },
    { label: '750ml', value: '190x140x50mm', packaging: '200 pcs/carton' },
    { label: '1000ml', value: '210x160x55mm', packaging: '200 pcs/carton' },
  ]
}

const seedProductCatalog = (database: DatabaseSync) => {
  const timestamp = now()
  const categoryStatement = database.prepare(`
    INSERT OR IGNORE INTO product_categories (
      slug, name, description, image, sort_order, enabled, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, 1, ?, ?)
  `)

  defaultProductCategories.forEach((category) => {
    categoryStatement.run(
      category.slug,
      category.name,
      category.description,
      category.image,
      category.sortOrder,
      timestamp,
      timestamp,
    )
  })

  const existing = database.prepare('SELECT id FROM products LIMIT 1').get()
  if (existing) return

  const categories = database
    .prepare('SELECT id, slug FROM product_categories')
    .all() as Array<{ id: number; slug: string }>
  const categoryIdBySlug = new Map(categories.map((category) => [category.slug, category.id]))
  const productStatement = database.prepare(`
    INSERT INTO products (
      category_id, slug, name, short_desc, image, material, moq, custom, packaging,
      specs_json, size_options_json, applications_json, sort_order, status, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?)
  `)

  seedProducts.forEach((product, index) => {
    const categorySlug = product.category === 'Cling Film & Fresh Wrap' ? 'cling-film' : 'disposable-meal-boxes'
    productStatement.run(
      categoryIdBySlug.get(categorySlug),
      product.slug,
      product.name,
      product.shortDesc,
      product.image,
      product.material,
      product.moq,
      product.custom ? 1 : 0,
      product.packaging,
      JSON.stringify(product.specs),
      JSON.stringify(sizeOptionsForSeedProduct(product)),
      JSON.stringify(product.applications),
      index + 1,
      timestamp,
      timestamp,
    )
  })
}

const seedProductSeo = (database: DatabaseSync) => {
  const rows = database
    .prepare(`
      SELECT
        p.slug,
        p.name,
        p.short_desc,
        p.image,
        p.material,
        p.seo_title,
        p.seo_description,
        p.seo_keywords,
        p.canonical,
        c.name AS category_name
      FROM products p
      JOIN product_categories c ON c.id = p.category_id
    `)
    .all() as Array<{
      slug: string
      name: string
      short_desc: string
      image: string
      material: string
      seo_title: string
      seo_description: string
      seo_keywords: string
      canonical: string
      category_name: string
    }>

  for (const product of rows) {
    const title = product.seo_title || makeProductSeoTitle({ name: product.name, categoryName: product.category_name })
    const description = product.seo_description || makeProductSeoDescription({ name: product.name, shortDesc: product.short_desc })
    const keywords =
      product.seo_keywords ||
      makeProductSeoKeywords({ name: product.name, categoryName: product.category_name, material: product.material })
    insertSeo(database, {
      key: `product:${product.slug}`,
      pageType: 'product',
      entitySlug: product.slug,
      name: `产品详情：${product.name}`,
      path: `/products/${product.slug}`,
      title,
      description,
      keywords,
      canonical: product.canonical,
      ogImage: product.image,
    })
  }
}

const seedCategorySeo = (database: DatabaseSync) => {
  const rows = database
    .prepare(`
      SELECT slug, name, description, image, seo_title, seo_description, seo_keywords, canonical
      FROM product_categories
      WHERE enabled = 1
    `)
    .all() as Array<{
      slug: string
      name: string
      description: string
      image: string
      seo_title: string
      seo_description: string
      seo_keywords: string
      canonical: string
    }>

  for (const category of rows) {
    const title = category.seo_title || makeCategorySeoTitle({ name: category.name, slug: category.slug })
    const description =
      category.seo_description || makeCategorySeoDescription({ name: category.name, description: category.description })
    const keywords = category.seo_keywords || makeCategorySeoKeywords({ name: category.name, slug: category.slug })
    insertSeo(database, {
      key: `category:${category.slug}`,
      pageType: 'category',
      entitySlug: category.slug,
      name: `产品分类：${category.name}`,
      path: `/products/category/${category.slug}`,
      title,
      description,
      keywords,
      canonical: category.canonical,
      ogImage: category.image,
    })
  }
}

const seedPostsTable = (database: DatabaseSync) => {
  const existing = database.prepare('SELECT id FROM posts LIMIT 1').get()
  if (existing) return

  const timestamp = now()
  const statement = database.prepare(`
    INSERT INTO posts (
      slug, title, excerpt, cover_image, content_html, status, published_at,
      seo_title, seo_description, seo_keywords, canonical, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, '', ?, ?)
  `)

  for (const post of seedPosts) {
    statement.run(
      post.slug,
      post.title,
      post.excerpt,
      post.cover,
      post.body.map((para) => `<p>${para}</p>`).join('\n'),
      post.date,
      post.title,
      post.excerpt,
      post.category,
      timestamp,
      timestamp,
    )
  }
}

const seedPostSeo = (database: DatabaseSync) => {
  const rows = database
    .prepare('SELECT slug, title, excerpt, cover_image FROM posts')
    .all() as Array<{ slug: string; title: string; excerpt: string; cover_image: string }>

  for (const post of rows) {
    insertSeo(database, {
      key: `post:${post.slug}`,
      pageType: 'post',
      entitySlug: post.slug,
      name: `博客文章：${post.title}`,
      path: `/blog/${post.slug}`,
      title: `${post.title} | ${seoBrand}`,
      description: post.excerpt,
      keywords: 'food packaging sourcing guide, wholesale packaging, material comparison',
      ogImage: post.cover_image,
    })
  }
}

const seedSocialLinks = (database: DatabaseSync) => {
  const timestamp = now()
  const links = [
    ['facebook', 'Facebook'],
    ['instagram', 'Instagram'],
    ['x', 'X'],
    ['youtube', 'YouTube'],
    ['tiktok', 'TikTok'],
    ['linkedin', 'LinkedIn'],
    ['telegram', 'Telegram'],
  ]

  const statement = database.prepare(`
    INSERT OR IGNORE INTO social_links (
      platform_key, name, url, enabled, sort_order, new_window, created_at, updated_at
    )
    VALUES (?, ?, '', 1, ?, 1, ?, ?)
  `)

  links.forEach(([key, name], index) => {
    statement.run(key, name, index + 1, timestamp, timestamp)
  })
}

const seedSiteSettings = (database: DatabaseSync) => {
  const timestamp = now()
  const defaults: Record<string, string> = {
    siteUrl: process.env.SITE_URL || '',
    displayName: company.displayName,
    name: company.name,
    tagline: company.tagline,
    email: company.email,
    phone: company.phone,
    whatsapp: company.whatsapp,
    whatsappLink: company.whatsappLink,
    address: company.address,
    location: company.location,
    founded: String(company.founded),
    registeredCapital: company.registeredCapital,
    legalRepresentative: company.legalRepresentative,
    logoPath: '/site-logo.png',
    faviconPath: '/favicon-96x96.png',
    homePopupEnabled: 'true',
    homePopupCooldownHours: '12',
    homePopupVideoUrl: defaultHomePopupVideoUrl,
    inquiryMailEnabled: process.env.INQUIRY_MAIL_ENABLED === 'false' ? 'false' : 'true',
    inquiryMailTo: process.env.MAIL_TO || company.email,
    inquiryMailFromName: 'YIYUAN Website',
    inquiryMailFromEmail: 'inquiry@yiyuanpack.com',
    inquiryMailSubjectPrefix: process.env.MAIL_SUBJECT_PREFIX || '[YIYUAN Inquiry]',
    postSchedulerEnabled: 'true',
    postSchedulerStartTime: '09:00',
    postSchedulerEndTime: '17:30',
    postSchedulerDailyLimit: '1',
  }

  const statement = database.prepare(`
    INSERT OR IGNORE INTO site_settings (key, value, created_at, updated_at)
    VALUES (?, ?, ?, ?)
  `)

  Object.entries(defaults).forEach(([key, value]) => {
    statement.run(key, value, timestamp, timestamp)
  })
}

const migrateDefaultSeoCopy = (database: DatabaseSync) => {
  const timestamp = now()
  const seoRow = database.prepare('SELECT title, description FROM seo_entries WHERE entry_key = ?')
  const updateSeo = database.prepare(`
    UPDATE seo_entries
    SET title = ?, description = ?, keywords = ?, og_title = ?, og_description = ?, updated_at = ?
    WHERE entry_key = ?
  `)

  const updateSeoIfLegacy = (
    key: string,
    next: { title: string; description: string; keywords: string },
    legacyTitles: string[],
  ) => {
    const current = seoRow.get(key) as { title: string; description: string } | undefined
    if (!current || !legacyTitles.includes(current.title)) return
    updateSeo.run(next.title, next.description, next.keywords, next.title, next.description, timestamp, key)
  }

  const pageEntries = [
    {
      key: 'page:home',
      next: {
        title: 'Cling Film & Food Packaging Factory in China | YIYUAN',
        description: 'YIYUAN supplies PE/PVC cling film, fresh wrap, jumbo rolls, cutter box film, and disposable food packaging for importers, wholesalers, OEM/ODM brands, and private label orders.',
        keywords: 'cling film manufacturer, food packaging factory, PE cling film, PVC cling film, fresh wrap, jumbo roll film, cutter box film, disposable food packaging, OEM ODM food packaging, China packaging supplier, packaging supplier for importers',
      },
      legacyTitles: ['YIYUAN NEW MATERIALS | Cling Film and Food Packaging Factory', 'Cling Film & Disposable Food Packaging Factory in China | YIYUAN'],
    },
    {
      key: 'page:products',
      next: {
        title: 'Food Packaging Products | Cling Film & Containers | YIYUAN',
        description: 'Explore YIYUAN food packaging products, including PE/PVC cling film, jumbo rolls, cutter box film, meal boxes, cups, and containers for wholesale, OEM/ODM, and import supply.',
        keywords: 'food packaging products, cling film products, food wrap supplier, disposable food containers, meal boxes, cups, jumbo roll film, cutter box film, wholesale packaging, OEM ODM packaging',
      },
      legacyTitles: [`Products | ${company.name}`, 'Food Packaging Products | Cling Film & Meal Boxes | YIYUAN'],
    },
    {
      key: 'page:about',
      next: {
        title: 'About YIYUAN | China Cling Film & Food Packaging Factory',
        description: 'Learn about YIYUAN, a China food packaging supplier serving importers, wholesalers, OEM/ODM brands, and private label buyers with cling film, fresh wrap, and disposable packaging.',
        keywords: 'about YIYUAN, China food packaging factory, cling film factory, food wrap supplier, disposable packaging supplier, OEM ODM packaging factory, packaging supplier for importers, export packaging supplier',
      },
      legacyTitles: [`About | ${company.name}`],
    },
    {
      key: 'page:blog',
      next: {
        title: 'Food Packaging Sourcing Guides & Material Insights | YIYUAN',
        description: 'Read YIYUAN guides on cling film, food wrap, disposable containers, material selection, OEM/ODM packaging, wholesale sourcing, and export packaging trends.',
        keywords: 'food packaging blog, cling film guide, food wrap sourcing, disposable container guide, packaging material insights, OEM ODM packaging guide, wholesale packaging tips, export packaging trends',
      },
      legacyTitles: [`Blog | ${company.name}`],
    },
    {
      key: 'page:contact',
      next: {
        title: 'Contact YIYUAN | Get Food Packaging Quotes & Samples',
        description: 'Contact YIYUAN for cling film, fresh wrap, food containers, OEM/ODM packaging, samples, pricing, MOQ, lead time, and export order inquiries.',
        keywords: 'contact YIYUAN, food packaging quote, cling film quote, food wrap samples, packaging samples, OEM ODM packaging inquiry, wholesale packaging supplier, export packaging inquiry',
      },
      legacyTitles: [`Contact | ${company.name}`, 'Contact YIYUAN | Get Food Packaging Samples & Quotes'],
    },
  ]

  pageEntries.forEach((entry) => updateSeoIfLegacy(entry.key, entry.next, entry.legacyTitles))

  const updateCategorySeoFields = database.prepare(`
    UPDATE product_categories
    SET seo_title = ?, seo_description = ?, seo_keywords = ?, updated_at = ?
    WHERE slug = ?
  `)
  const categories = database
    .prepare('SELECT slug, name, description, seo_title FROM product_categories')
    .all() as Array<{ slug: string; name: string; description: string; seo_title: string | null }>

  categories.forEach((category) => {
    const next = {
      title: makeCategorySeoTitle(category),
      description: makeCategorySeoDescription(category),
      keywords: makeCategorySeoKeywords(category),
    }
    const legacyTitle = `${category.name} | Products | ${company.name}`
    if (!category.seo_title || category.seo_title === legacyTitle) {
      updateCategorySeoFields.run(next.title, next.description, next.keywords, timestamp, category.slug)
    }
    updateSeoIfLegacy(`category:${category.slug}`, next, [legacyTitle])
  })

  const updateProductSeoFields = database.prepare(`
    UPDATE products
    SET seo_title = ?, seo_description = ?, seo_keywords = ?, updated_at = ?
    WHERE slug = ?
  `)
  const products = database
    .prepare(`
      SELECT p.slug, p.name, p.short_desc, p.material, p.seo_title, c.name AS category_name
      FROM products p
      JOIN product_categories c ON c.id = p.category_id
    `)
    .all() as Array<{
      slug: string
      name: string
      short_desc: string
      material: string
      seo_title: string | null
      category_name: string
    }>

  products.forEach((product) => {
    const input = {
      name: product.name,
      shortDesc: product.short_desc,
      material: product.material,
      categoryName: product.category_name,
    }
    const next = {
      title: makeProductSeoTitle(input),
      description: makeProductSeoDescription(input),
      keywords: makeProductSeoKeywords(input),
    }
    const legacyTitle = `${product.name} | ${company.name}`
    if (!product.seo_title || product.seo_title === legacyTitle) {
      updateProductSeoFields.run(next.title, next.description, next.keywords, timestamp, product.slug)
    }
    updateSeoIfLegacy(`product:${product.slug}`, next, [legacyTitle])
  })

  const updatePostSeoFields = database.prepare(`
    UPDATE posts
    SET seo_title = ?, seo_description = ?, seo_keywords = ?, updated_at = ?
    WHERE slug = ?
  `)
  const posts = database
    .prepare('SELECT slug, title, excerpt, seo_title FROM posts')
    .all() as Array<{ slug: string; title: string; excerpt: string; seo_title: string | null }>

  posts.forEach((post) => {
    const next = {
      title: post.seo_title && post.seo_title !== post.title ? post.seo_title : `${post.title} | ${seoBrand}`,
      description: post.excerpt,
      keywords: 'food packaging sourcing guide, wholesale packaging, material comparison',
    }
    const legacyTitle = `${post.title} | ${company.name}`
    if (!post.seo_title || post.seo_title === post.title || post.seo_title === legacyTitle) {
      updatePostSeoFields.run(next.title, next.description, next.keywords, timestamp, post.slug)
    }
    updateSeoIfLegacy(`post:${post.slug}`, next, [legacyTitle])
  })
}

const seedDatabase = (database: DatabaseSync) => {
  seedAdmin(database)
  seedProductCatalog(database)
  seedSeo(database)
  seedCategorySeo(database)
  seedProductSeo(database)
  seedPostsTable(database)
  seedPostSeo(database)
  seedSocialLinks(database)
  seedSiteSettings(database)
  migrateDefaultSeoCopy(database)
}

export const getDb = () => {
  if (db) return db

  const path = dbPath()
  mkdirSync(dirname(path), { recursive: true })
  db = new DatabaseSync(path)
  execSchema(db)
  migrateAdminUsers(db)
  migrateProductCatalog(db)
  migrateStaticImagePathsToWebp(db)
  migrateInquiriesSchema(db)
  migrateInquiryMailColumns(db)
  migrateInquirySeoCopy(db)
  migratePostSchedulerColumns(db)
  seedDatabase(db)

  return db
}

export const touchNow = now

export const createPasswordHash = passwordHash
