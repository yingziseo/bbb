import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { randomBytes, scryptSync } from 'node:crypto'
import { company, posts as seedPosts, products as seedProducts } from '../../app/data/site'

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
      company TEXT,
      email TEXT NOT NULL,
      country TEXT,
      product TEXT,
      quantity TEXT,
      message TEXT NOT NULL,
      mail_status TEXT NOT NULL DEFAULT 'pending',
      mail_error TEXT,
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
      title: 'YIYUAN NEW MATERIALS | Cling Film and Food Packaging Factory',
      description: 'China factory for cling film, fresh wrap, food packaging containers, and OEM packaging orders.',
      keywords: 'cling film factory, food packaging, OEM packaging, fresh wrap',
      ogImage: '/images/hero-factory.png',
    },
    {
      key: 'page:products',
      pageType: 'page',
      name: '产品列表页',
      path: '/products',
      title: `Products | ${company.name}`,
      description: 'Browse cling film, food containers, disposable packaging, and custom food packaging products.',
      keywords: 'food packaging products, cling film, disposable containers',
      ogImage: '/images/product-cling-film.png',
    },
    {
      key: 'page:about',
      pageType: 'page',
      name: '公司页',
      path: '/about',
      title: `About | ${company.name}`,
      description: 'Factory overview and company information for Shangqiu Yiyuan New Materials Co., Ltd.',
      keywords: 'Yiyuan New Materials, Shangqiu packaging factory',
      ogImage: '/images/about-factory.png',
    },
    {
      key: 'page:blog',
      pageType: 'page',
      name: '博客列表页',
      path: '/blog',
      title: `Blog | ${company.name}`,
      description: 'Packaging sourcing guides, material comparisons, and food packaging purchasing insights.',
      keywords: 'packaging sourcing guide, food packaging blog',
      ogImage: '/images/blog-supplier.png',
    },
    {
      key: 'page:contact',
      pageType: 'page',
      name: '联系页',
      path: '/contact',
      title: `Contact | ${company.name}`,
      description: 'Send food packaging specifications, quantity, and custom requirements for quotation.',
      keywords: 'food packaging quotation, packaging supplier contact',
      ogImage: '/images/hero-factory.png',
    },
  ]

  for (const entry of defaults) insertSeo(database, entry)

}

const defaultProductCategories = [
  {
    slug: 'cling-film',
    name: '保鲜膜',
    description: 'PE/PVC food wrap film, jumbo rolls, cutter box rolls, and private-label fresh wrap.',
    image: '/images/cat-film.png',
    sortOrder: 1,
  },
  {
    slug: 'disposable-meal-boxes',
    name: '一次性餐盒',
    description: 'Kraft paper meal boxes, PP/PET containers, bagasse clamshells, cups, and custom food boxes.',
    image: '/images/cat-containers.png',
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
    const title = product.seo_title || `${product.name} | ${company.name}`
    const description = product.seo_description || product.short_desc
    const keywords = product.seo_keywords || `${product.name}, ${product.category_name}, ${product.material}`
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
    const title = category.seo_title || `${category.name} | Products | ${company.name}`
    const description = category.seo_description || category.description || `Browse ${category.name} products from ${company.name}.`
    const keywords = category.seo_keywords || `${category.name}, food packaging products`
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
      title: `${post.title} | ${company.name}`,
      description: post.excerpt,
      keywords: 'food packaging, sourcing guide',
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
    faviconPath: '/favicon.ico',
  }

  const statement = database.prepare(`
    INSERT OR IGNORE INTO site_settings (key, value, created_at, updated_at)
    VALUES (?, ?, ?, ?)
  `)

  Object.entries(defaults).forEach(([key, value]) => {
    statement.run(key, value, timestamp, timestamp)
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
}

export const getDb = () => {
  if (db) return db

  const path = dbPath()
  mkdirSync(dirname(path), { recursive: true })
  db = new DatabaseSync(path)
  execSchema(db)
  migrateAdminUsers(db)
  migrateProductCatalog(db)
  seedDatabase(db)

  return db
}

export const touchNow = now

export const createPasswordHash = passwordHash
