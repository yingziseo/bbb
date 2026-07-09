<script setup lang="ts">
import {
  CircleCheck,
  Check,
  ArrowRight,
  Document,
  Download,
  Message,
  Location,
  Promotion,
} from '@element-plus/icons-vue'
import { buyerDocuments } from '~/data/documents'
import type { Product } from '~/data/site'

const company = await useSiteSettings()
const { isCn, text, localePath, htmlLang, seoAlternatePaths } = useLocale()

definePageMeta({
  alias: ['/cn'],
})

type ProductCategory = {
  id: number
  slug: string
  name: string
  description: string
  image: string
  productCount: number
}

const { data: catalogData } = await useFetch<{ categories: ProductCategory[]; items: Product[] }>('/api/public/products')
const categoryCards = computed(() =>
  (catalogData.value?.categories || []).map((category) => ({
    name: category.name,
    desc: category.description,
    image: category.image || '/images/cat-containers.webp',
    slug: category.slug,
  })),
)

const page = computed(() => isCn.value ? {
  seo: {
    title: '保鲜膜与食品包装工厂 | 宜沅新材料',
    description: '商丘市宜沅新材料有限公司供应 PE/PVC 保鲜膜、生鲜保鲜膜、一次性食品容器和 OEM/ODM 定制包装，支持批发采购和出口询盘。',
    keywords: '保鲜膜厂家, 食品包装工厂, PE保鲜膜, PVC保鲜膜, 一次性餐盒, 食品容器, OEM包装, 出口包装供应商',
  },
  heroKicker: '中国河南商丘',
  heroTitle: '保鲜膜与食品包装 OEM 供应',
  heroDesc: '供应保鲜膜、生鲜保鲜膜和一次性食品包装，支持批发与定制订单。',
  whatsapp: 'WhatsApp 联系',
  heroTags: ['保鲜膜', 'OEM 订单', '出口对接'],
  statLabels: ['成立时间', '注册资本', 'PVC 一期'],
  productRange: {
    eyebrow: '产品范围',
    title: '主要产品',
    subtitle: '保鲜膜和食品包装产品线。',
  },
  factory: {
    eyebrow: '工厂概况',
    title: '工厂信息',
    subtitle: '公司注册信息和基础供应能力。',
  },
  capabilities: [
    { title: '商丘基地', desc: '公司注册地位于河南商丘。' },
    { title: '材料方向', desc: '保鲜膜、生鲜膜和包装材料。' },
    { title: 'OEM 订单', desc: '支持定制订单和出口对接。' },
    { title: '公开信息', desc: '2023 年注册，PVC 一期 5,000 吨。' },
  ],
  workshop: {
    eyebrow: '工厂',
    title: '车间与仓储',
    subtitle: '生产、分切和成品仓储场景。',
  },
  custom: {
    eyebrow: '定制',
    title: '按品牌和规格生产',
    subtitle: '支持尺寸、印刷、私标包装和模具定制。',
    items: ['定制尺寸', 'Logo 印刷', '私标包装', '模具定制'],
    quote: '定制报价',
  },
  featured: {
    eyebrow: '精选产品',
    title: '推荐产品',
    viewAll: '全部产品',
  },
  quality: {
    eyebrow: '质量',
    title: '质量控制',
    subtitle: '主要质量控制点。',
    items: ['食品级原料', '来料和出货检查', '质量体系管理', '可按需提供第三方检测'],
    viewReport: '查看报告',
    download: '下载 PDF',
    allDocs: '全部资料',
  },
  contact: {
    eyebrow: '联系',
    title: '获取报价',
    subtitle: '请发送产品、尺寸、数量和包装需求。',
    phone: 'WhatsApp / 电话',
    location: '地区',
  },
} : {
  seo: {
    title: 'Cling Film & Food Packaging Factory in China | YIYUAN',
    description: 'YIYUAN supplies PE/PVC cling film, fresh wrap, jumbo rolls, cutter box film, and disposable food packaging for importers, wholesalers, OEM/ODM brands, and private label orders.',
    keywords: 'cling film manufacturer, food packaging factory, PE cling film, PVC cling film, fresh wrap, jumbo roll film, cutter box film, disposable food packaging, OEM ODM food packaging, China packaging supplier, packaging supplier for importers',
  },
  heroKicker: 'Shangqiu, Henan, China',
  heroTitle: 'Cling Film and Food Packaging for OEM Orders',
  heroDesc: 'Custom cling film, fresh wrap, and food packaging for wholesale and OEM supply.',
  whatsapp: 'Contact on WhatsApp',
  heroTags: ['Cling film', 'OEM orders', 'Export contact'],
  statLabels: ['Established', 'RMB Capital', 'PVC Phase I'],
  productRange: {
    eyebrow: 'Product Range',
    title: 'Product Categories',
    subtitle: 'Main packaging lines.',
  },
  factory: {
    eyebrow: 'Factory Overview',
    title: 'Factory Overview',
    subtitle: 'Registered facts and basic company information.',
  },
  capabilities: [
    { title: 'Shangqiu Base', desc: 'Registered in Shangqiu, Henan, China.' },
    { title: 'Material Focus', desc: 'Cling film, fresh wrap, and packaging materials.' },
    { title: 'OEM Orders', desc: 'Custom orders and export contact.' },
    { title: 'Public Facts', desc: '2023 registration and 5,000-ton PVC Phase I notice.' },
  ],
  workshop: {
    eyebrow: 'Factory',
    title: 'Workshop and Warehouse',
    subtitle: 'Extrusion, converting, and finished goods ready for shipment.',
  },
  custom: {
    eyebrow: 'Custom & OEM / ODM',
    title: 'Your brand, your specification, our production',
    subtitle: 'From custom sizes and printing to private-label packaging, we manufacture to your exact requirement with full tooling support.',
    items: ['Custom sizes & shapes', 'Full-color logo printing', 'Private-label packaging', 'Custom die-cut tooling'],
    quote: 'Request Custom Quote',
  },
  featured: {
    eyebrow: 'Selected Items',
    title: 'Featured Products',
    viewAll: 'View All Products',
  },
  quality: {
    eyebrow: 'Quality',
    title: 'Quality Control',
    subtitle: 'Main quality points.',
    items: [
      'Food-grade raw materials',
      'Incoming and pre-shipment inspection',
      'ISO-based quality management',
      'Third-party lab testing available on request',
    ],
    viewReport: 'View Report',
    download: 'Download PDF',
    allDocs: 'All Documents',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Get a Quote',
    subtitle: 'Send product details, size, quantity, and packaging requirements.',
    phone: 'WhatsApp / Phone',
    location: 'Location',
  },
})

const stats = computed(() => [
  { value: '2023', suffix: '', label: page.value.statLabels[0] },
  { value: isCn.value ? '100万' : '1', suffix: isCn.value ? '' : 'M RMB', label: page.value.statLabels[1] },
  { value: '5,000', suffix: isCn.value ? '吨' : 't', label: page.value.statLabels[2] },
])

const capabilities = computed(() => page.value.capabilities)
const quality = computed(() => page.value.quality.items)
const testReport = buyerDocuments.testReport

const featured = computed(() => (catalogData.value?.items || []).slice(0, 4))

await useManagedSeo('page:home', computed(() => ({
  ...page.value.seo,
  image: '/images/hero-factory.webp',
})), {
  fallbackOnly: isCn,
  canonicalPath: computed(() => (isCn.value ? '/cn' : '/')),
  htmlLang,
  alternatePaths: computed(() => seoAlternatePaths()),
})
</script>

<template>
  <div>
    <LazyHomeLeadPopup :settings="company" />

    <!-- HERO -->
    <section class="bg-[var(--color-navy)] text-white">
      <div class="container-x grid lg:grid-cols-2 gap-10 lg:gap-12 py-14 lg:py-20 items-center">
        <div>
          <span class="inline-block text-[12px] font-bold uppercase tracking-[0.16em] text-white/70 border-l-3 border-[var(--color-accent)] pl-3">
            {{ page.heroKicker }}
          </span>
          <h1 class="mt-5 text-[clamp(30px,4.4vw,46px)] font-extrabold leading-[1.12] tracking-tight text-balance">
            {{ page.heroTitle }}
          </h1>
          <p class="mt-5 text-[17px] leading-relaxed text-white/80 max-w-xl">
            {{ page.heroDesc }}
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink :to="localePath('/contact')">
              <el-button color="#c1121f" size="large">
                <el-icon><Promotion /></el-icon>
                {{ text.actions.getQuote }}
                <el-icon class="ml-1"><ArrowRight /></el-icon>
              </el-button>
            </NuxtLink>
            <el-button tag="a" :href="company.whatsappLink" target="_blank" size="large" color="#1b3c63">
              <span class="inline-flex items-center gap-1.5">
                <SocialIcon name="whatsapp" />
                <span>{{ page.whatsapp }}</span>
              </span>
            </el-button>
          </div>
          <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13.5px] text-white/70">
            <span v-for="tag in page.heroTags" :key="tag" class="flex items-center gap-1.5"><el-icon><Check /></el-icon>{{ tag }}</span>
          </div>
        </div>

        <div class="relative">
          <div class="aspect-[4/3] overflow-hidden border border-white/10">
            <NuxtImg
              src="/images/hero-factory.webp"
              alt="Food packaging production line inside our factory"
              width="1024"
              height="1024"
              sizes="sm:100vw md:50vw lg:560px"
              quality="86"
              :preload="{ fetchPriority: 'high' }"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              class="h-full w-full object-cover"
            />
          </div>
          <div class="absolute -bottom-5 left-5 right-5 grid grid-cols-3 overflow-hidden border border-[var(--color-line)] bg-white text-[var(--color-navy)]">
            <div class="p-4 text-center border-r border-[var(--color-line)]">
              <div class="text-[22px] font-extrabold">2023</div>
              <div class="text-[11px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ page.statLabels[0] }}</div>
            </div>
            <div class="p-4 text-center border-r border-[var(--color-line)]">
              <div class="text-[22px] font-extrabold">{{ isCn ? '100万' : '1M' }}</div>
              <div class="text-[11px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ page.statLabels[1] }}</div>
            </div>
            <div class="p-4 text-center">
              <div class="text-[22px] font-extrabold">{{ isCn ? '5,000吨' : '5,000t' }}</div>
              <div class="text-[11px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ page.statLabels[2] }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRODUCT CATEGORIES -->
    <section class="section bg-white">
      <div class="container-x">
        <SectionHeading
          :eyebrow="page.productRange.eyebrow"
          :title="page.productRange.title"
          :subtitle="page.productRange.subtitle"
        />
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="c in categoryCards"
            :key="c.slug"
            :to="localePath(`/products/category/${c.slug}`)"
            class="group flex flex-col overflow-hidden border border-[var(--color-line)] bg-white"
          >
            <div class="aspect-[4/3] overflow-hidden bg-[var(--color-panel)]">
              <RuntimeImage
                :src="c.image"
                :alt="c.name"
                width="640"
                height="480"
                sizes="sm:100vw md:50vw lg:25vw"
                densities="1x"
                quality="82"
                loading="lazy"
                fetchpriority="low"
                decoding="async"
                image-class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </div>
            <div class="p-5">
              <h3 class="text-[16px] font-bold text-[var(--color-navy)] flex items-center justify-between">
                {{ c.name }}
                <el-icon class="text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight /></el-icon>
              </h3>
              <p class="mt-2 text-[13.5px] leading-relaxed text-[var(--color-slate-muted)]">{{ c.desc }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- PRODUCTION CAPACITY -->
    <section class="section bg-[var(--color-panel)] border-y border-[var(--color-line)]">
      <div class="container-x grid lg:grid-cols-2 gap-12 items-center">
        <div>
        <SectionHeading
          :eyebrow="page.factory.eyebrow"
          :title="page.factory.title"
          :subtitle="page.factory.subtitle"
        />
          <div class="mt-8 grid grid-cols-3 gap-px overflow-hidden border border-[var(--color-line)] bg-[var(--color-line)]">
            <div v-for="s in stats" :key="s.label" class="bg-white p-6">
              <div class="text-[30px] font-extrabold text-[var(--color-navy)] leading-none">
                {{ s.value }}<span class="text-[var(--color-accent)]">{{ s.suffix }}</span>
              </div>
              <div class="mt-2 text-[13px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ s.label }}</div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="cap in capabilities" :key="cap.title" class="border border-[var(--color-line)] bg-white p-5">
            <h3 class="text-[15px] font-bold text-[var(--color-navy)]">{{ cap.title }}</h3>
            <p class="mt-2 text-[13px] leading-relaxed text-[var(--color-slate-muted)]">{{ cap.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- EQUIPMENT & WORKSHOP -->
    <section class="section bg-white">
      <div class="container-x">
        <SectionHeading
          :eyebrow="page.workshop.eyebrow"
          :title="page.workshop.title"
          :subtitle="page.workshop.subtitle"
        />
        <div class="mt-10 grid gap-4 md:grid-cols-3">
          <div class="overflow-hidden border border-[var(--color-line)] md:row-span-2 md:col-span-2">
            <NuxtImg
              src="/images/workshop-main.webp"
              alt="Main production workshop with injection molding lines"
              width="1024"
              height="1024"
              sizes="sm:100vw md:66vw lg:760px"
              densities="1x"
              quality="82"
              loading="lazy"
              fetchpriority="low"
              decoding="async"
              class="h-full w-full object-cover"
            />
          </div>
          <div class="aspect-[4/3] overflow-hidden border border-[var(--color-line)]">
            <NuxtImg
              src="/images/workshop-equipment.webp"
              alt="Automated film extrusion equipment"
              width="640"
              height="480"
              sizes="sm:100vw md:33vw lg:380px"
              densities="1x"
              quality="82"
              loading="lazy"
              fetchpriority="low"
              decoding="async"
              class="h-full w-full object-cover"
            />
          </div>
          <div class="aspect-[4/3] overflow-hidden border border-[var(--color-line)]">
            <NuxtImg
              src="/images/workshop-warehouse.webp"
              alt="Finished goods warehouse ready for export"
              width="640"
              height="480"
              sizes="sm:100vw md:33vw lg:380px"
              densities="1x"
              quality="82"
              loading="lazy"
              fetchpriority="low"
              decoding="async"
              class="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CUSTOM / OEM -->
    <section class="section bg-[var(--color-navy)] text-white border-y border-white/10">
      <div class="container-x grid lg:grid-cols-2 gap-12 items-center">
        <div class="overflow-hidden border border-white/10 order-2 lg:order-1">
          <NuxtImg
            src="/images/custom-oem.webp"
            alt="Custom printed packaging and OEM production samples"
            width="1024"
            height="1024"
            sizes="sm:100vw md:50vw lg:560px"
            densities="1x"
            quality="82"
            loading="lazy"
            fetchpriority="low"
            decoding="async"
            class="h-full w-full object-cover"
          />
        </div>
        <div class="order-1 lg:order-2">
          <SectionHeading
            :eyebrow="page.custom.eyebrow"
            :title="page.custom.title"
            :subtitle="page.custom.subtitle"
            inverse
          />
          <ul class="mt-8 grid sm:grid-cols-2 gap-4">
            <li v-for="item in page.custom.items" :key="item" class="border border-white/12 bg-white/4 p-4 text-[14px] text-white/88">
              <div class="flex items-start gap-2">
                <el-icon class="mt-0.5 text-[var(--color-accent)]"><Check /></el-icon>
                <span>{{ item }}</span>
              </div>
            </li>
          </ul>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink :to="localePath('/contact')">
              <el-button color="#c1121f" size="large">
                <el-icon><Promotion /></el-icon>
                <span>{{ page.custom.quote }}</span>
              </el-button>
            </NuxtLink>
            <el-button tag="a" :href="company.whatsappLink" target="_blank" size="large" color="#1b3c63">
              <span class="inline-flex items-center gap-1.5">
                <SocialIcon name="whatsapp" />
                <span>{{ page.whatsapp }}</span>
              </span>
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED PRODUCTS -->
    <section class="section bg-white">
      <div class="container-x">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading :eyebrow="page.featured.eyebrow" :title="page.featured.title" />
          <NuxtLink :to="localePath('/products')">
            <el-button plain>{{ page.featured.viewAll }}<el-icon class="ml-1"><ArrowRight /></el-icon></el-button>
          </NuxtLink>
        </div>
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="p in featured" :key="p.slug" :product="p" />
        </div>
      </div>
    </section>

    <!-- QUALITY -->
    <section class="section bg-[var(--color-panel)] border-y border-[var(--color-line)]">
      <div class="container-x grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeading
            :eyebrow="page.quality.eyebrow"
            :title="page.quality.title"
            :subtitle="page.quality.subtitle"
          />
          <ul class="mt-8 space-y-4">
            <li v-for="q in quality" :key="q" class="flex items-start gap-3 border border-[var(--color-line)] bg-white p-4">
              <el-icon :size="20" class="text-[var(--color-accent)] mt-0.5"><CircleCheck /></el-icon>
              <span class="text-[15px] text-[var(--color-graphite)] leading-relaxed">{{ q }}</span>
            </li>
          </ul>
          <div class="mt-6 flex flex-wrap gap-3">
            <el-button tag="a" :href="testReport.href" target="_blank" rel="noopener" color="#1b3c63">
              <el-icon><Document /></el-icon>
              <span>{{ page.quality.viewReport }}</span>
            </el-button>
            <el-button tag="a" :href="testReport.href" :download="testReport.filename" plain>
              <el-icon><Download /></el-icon>
              <span>{{ page.quality.download }}</span>
            </el-button>
            <NuxtLink :to="localePath('/documents')">
              <el-button plain>{{ page.quality.allDocs }}</el-button>
            </NuxtLink>
          </div>
        </div>
        <div class="overflow-hidden border border-[var(--color-line)]">
          <NuxtImg
            src="/images/quality-control.webp"
            alt="Quality control inspection of food containers"
            width="1024"
            height="1024"
            sizes="sm:100vw md:50vw lg:560px"
            densities="1x"
            quality="82"
            loading="lazy"
            fetchpriority="low"
            decoding="async"
            class="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>

    <!-- CONTACT / QUOTE -->
    <section class="section bg-[var(--color-navy-dark)] text-white">
      <div class="container-x">
        <div>
          <SectionHeading
            :eyebrow="page.contact.eyebrow"
            :title="page.contact.title"
            :subtitle="page.contact.subtitle"
            inverse
          />
          <div class="mt-8 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3">
            <div class="bg-[var(--color-navy-dark)] p-5">
              <div class="flex items-center gap-2 text-white/70">
                <SocialIcon name="whatsapp" />
                <span class="text-[12px] uppercase tracking-wide">{{ page.contact.phone }}</span>
              </div>
              <div class="mt-3 text-[15px] font-semibold text-white">{{ company.phone }}</div>
            </div>
            <div class="bg-[var(--color-navy-dark)] p-5">
              <div class="flex items-center gap-2 text-white/70">
                <el-icon><Message /></el-icon>
                <span class="text-[12px] uppercase tracking-wide">{{ text.actions.email }}</span>
              </div>
              <div class="mt-3 text-[15px] font-semibold text-white break-all">{{ company.email }}</div>
            </div>
            <div class="bg-[var(--color-navy-dark)] p-5">
              <div class="flex items-center gap-2 text-white/70">
                <el-icon><Location /></el-icon>
                <span class="text-[12px] uppercase tracking-wide">{{ page.contact.location }}</span>
              </div>
              <div class="mt-3 text-[15px] font-semibold text-white">{{ company.location }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
