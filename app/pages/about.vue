<script setup lang="ts">
import { OfficeBuilding, Setting, Box, Histogram, Check, Promotion } from '@element-plus/icons-vue'
import { buyerDocuments } from '~/data/documents'

const company = await useSiteSettings()
const { isCn, text, localePath, htmlLang, seoAlternatePaths } = useLocale()
const legalCompanyNameCn = '商丘市宜沅新材料有限公司'
const displayCompanyName = computed(() => (isCn.value ? legalCompanyNameCn : company.name))
const registeredCapitalText = computed(() => (isCn.value ? '100万人民币' : company.registeredCapital))

definePageMeta({
  alias: ['/cn/about'],
})

const page = computed(() => isCn.value ? {
  seo: {
    title: '公司介绍 | 保鲜膜与食品包装工厂 | 宜沅新材料',
    description: '了解商丘市宜沅新材料有限公司，公司专注保鲜膜、生鲜保鲜膜和食品包装材料，支持批发采购、OEM 定制和出口询盘。',
    keywords: '宜沅新材料, 公司介绍, 保鲜膜工厂, 食品包装工厂, 一次性餐盒供应商, OEM包装, 出口包装供应商',
  },
  breadcrumb: '公司介绍',
  heroTitle: '工厂概况',
  heroDesc: `${legalCompanyNameCn} 位于河南商丘，专注保鲜膜、生鲜膜和相关包装材料。`,
  statLabels: ['成立时间', '注册资本', 'PVC 一期', '注册地区'],
  factsHeading: {
    eyebrow: '公司信息',
    title: '工厂信息',
    subtitle: '公司基本信息和联系方式。',
  },
  capabilities: [
    { icon: OfficeBuilding, title: '注册公司', desc: company.location },
    { icon: Setting, title: '材料方向', desc: '保鲜膜、生鲜膜和包装材料。' },
    { icon: Box, title: 'OEM 订单', desc: '支持定制订单和出口对接。' },
    { icon: Histogram, title: 'PVC 一期', desc: '公开信息显示年产 5,000 吨。' },
  ],
  documents: {
    eyebrow: '质量文件',
    title: '检测文件',
  },
  gallery: {
    eyebrow: '工厂',
    title: '车间、设备与仓储',
    subtitle: '生产车间、设备、仓库和产品样品。',
  },
  contact: {
    eyebrow: '联系方式',
    title: '公司联系',
    legalName: '公司名称',
    phone: '电话',
    registeredTitle: '注册信息',
    inquiry: '提交询盘',
  },
  facts: [
    `成立时间：${company.founded}`,
    `注册资本：${registeredCapitalText.value}`,
    `法定代表人：${company.legalRepresentative}`,
    '地址来源于公开注册信息',
    'PVC 一期公开信息显示年产 5,000 吨',
  ],
  cta: {
    title: '发送采购需求',
    desc: '可通过邮箱、WhatsApp 或询盘表单联系。',
    whatsapp: 'WhatsApp 联系',
  },
} : {
  seo: {
    title: 'About YIYUAN | China Cling Film & Food Packaging Factory',
    description: 'Learn about YIYUAN, a China food packaging supplier serving importers, wholesalers, OEM/ODM brands, and private label buyers with cling film, fresh wrap, and disposable packaging.',
    keywords: 'about YIYUAN, China food packaging factory, cling film factory, food wrap supplier, disposable packaging supplier, OEM ODM packaging factory, packaging supplier for importers, export packaging supplier',
  },
  breadcrumb: 'Company',
  heroTitle: 'Factory Overview',
  heroDesc: `${company.name} is a Shangqiu-based company focused on cling film, fresh wrap, and related packaging materials.`,
  statLabels: ['Established', 'Registered Capital', 'PVC Project Phase I', 'Registered Region'],
  factsHeading: {
    eyebrow: 'Company Facts',
    title: 'Factory Information',
    subtitle: 'Company facts and contact details.',
  },
  capabilities: [
    { icon: OfficeBuilding, title: 'Registered Company', desc: company.location },
    { icon: Setting, title: 'Material Focus', desc: 'Cling film, wrap, and packaging materials.' },
    { icon: Box, title: 'OEM Orders', desc: 'Custom orders and export contact.' },
    { icon: Histogram, title: 'PVC Phase I', desc: 'Public notice references 5,000 tons annual output.' },
  ],
  documents: {
    eyebrow: 'Quality Documents',
    title: 'Inspection Document',
  },
  gallery: {
    eyebrow: 'Factory',
    title: 'Workshop, Equipment & Storage',
    subtitle: 'Production floor, converting equipment, warehouse, and product samples.',
  },
  contact: {
    eyebrow: 'Contact Details',
    title: 'Company Contact',
    legalName: 'Legal Name',
    phone: 'WhatsApp / Phone',
    registeredTitle: 'Registered Information',
    inquiry: 'Start an Inquiry',
  },
  facts: [
    `Established in ${company.founded}`,
    `Registered capital: ${registeredCapitalText.value}`,
    `Legal representative: ${company.legalRepresentative}`,
    'Address translated from the public registration record',
    'PVC Phase I public notice references 5,000 tons annual output',
  ],
  cta: {
    title: 'Send Your Inquiry',
    desc: 'Send product details by email or WhatsApp.',
    whatsapp: 'Contact on WhatsApp',
  },
})

await useManagedSeo('page:about', computed(() => ({
  ...page.value.seo,
  image: '/images/about-factory.webp',
})), {
  fallbackOnly: isCn,
  canonicalPath: computed(() => (isCn.value ? '/cn/about' : '/about')),
  htmlLang,
  alternatePaths: computed(() => seoAlternatePaths()),
})

const capabilities = computed(() => page.value.capabilities)
const registeredFacts = computed(() => page.value.facts)
const qualityDocuments = [buyerDocuments.testReport]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-[var(--color-navy)] text-white">
      <div class="container-x grid lg:grid-cols-2 gap-10 py-14 items-center">
        <div>
          <el-breadcrumb separator="/" class="page-breadcrumb page-breadcrumb--dark mb-4">
            <el-breadcrumb-item :to="{ path: localePath('/') }">{{ text.nav.home }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ page.breadcrumb }}</el-breadcrumb-item>
          </el-breadcrumb>
          <h1 class="text-[clamp(28px,4vw,42px)] font-extrabold leading-tight text-balance">
            {{ page.heroTitle }}
          </h1>
          <p class="mt-5 text-[16px] leading-relaxed text-white/80 max-w-xl">
            {{ page.heroDesc }}
          </p>
        </div>
        <div class="overflow-hidden border border-white/10">
          <img :src="`/images/about-factory.webp`" alt="Aerial view of the manufacturing facility" class="w-full aspect-[4/3] object-cover" />
        </div>
      </div>
    </section>

    <!-- Intro stats -->
    <section class="bg-[var(--color-navy-dark)] text-white border-t border-white/10">
      <div class="container-x grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
        <div class="p-7 text-center"><div class="text-[30px] font-extrabold">{{ company.founded }}</div><div class="text-[12px] uppercase tracking-wide text-white/60 mt-1">{{ page.statLabels[0] }}</div></div>
        <div class="p-7 text-center"><div class="text-[30px] font-extrabold">{{ registeredCapitalText }}</div><div class="text-[12px] uppercase tracking-wide text-white/60 mt-1">{{ page.statLabels[1] }}</div></div>
        <div class="p-7 text-center"><div class="text-[30px] font-extrabold">{{ isCn ? '5,000 吨' : '5,000 t' }}</div><div class="text-[12px] uppercase tracking-wide text-white/60 mt-1">{{ page.statLabels[2] }}</div></div>
        <div class="p-7 text-center"><div class="text-[30px] font-extrabold">Henan</div><div class="text-[12px] uppercase tracking-wide text-white/60 mt-1">{{ page.statLabels[3] }}</div></div>
      </div>
    </section>

    <!-- Capabilities grid -->
    <section class="section bg-white">
      <div class="container-x">
        <SectionHeading
          :eyebrow="page.factsHeading.eyebrow"
          :title="page.factsHeading.title"
          :subtitle="page.factsHeading.subtitle"
        />
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="c in capabilities" :key="c.title" class="border border-[var(--color-line)] bg-white p-6">
            <el-icon :size="30" class="text-[var(--color-accent)]"><component :is="c.icon" /></el-icon>
            <h3 class="mt-4 text-[17px] font-bold text-[var(--color-navy)]">{{ c.title }}</h3>
            <p class="mt-2 text-[14px] leading-relaxed text-[var(--color-slate-muted)]">{{ c.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Quality documents -->
    <section class="section bg-[var(--color-panel)] border-y border-[var(--color-line)]">
      <div class="container-x">
        <DocumentDownloads
          :eyebrow="page.documents.eyebrow"
          :title="page.documents.title"
          :documents="qualityDocuments"
        />
      </div>
    </section>

    <!-- Workshop gallery -->
    <section class="section bg-white">
      <div class="container-x">
        <SectionHeading :eyebrow="page.gallery.eyebrow" :title="page.gallery.title" :subtitle="page.gallery.subtitle" />
        <div class="mt-10 grid gap-4 md:grid-cols-3">
          <div class="aspect-[4/3] overflow-hidden border border-[var(--color-line)]">
            <img :src="`/images/workshop-main.webp`" alt="Injection molding workshop" class="h-full w-full object-cover" />
          </div>
          <div class="aspect-[4/3] overflow-hidden border border-[var(--color-line)]">
            <img :src="`/images/workshop-equipment.webp`" alt="Film extrusion equipment" class="h-full w-full object-cover" />
          </div>
          <div class="aspect-[4/3] overflow-hidden border border-[var(--color-line)]">
            <img :src="`/images/workshop-warehouse.webp`" alt="Finished goods warehouse" class="h-full w-full object-cover" />
          </div>
          <div class="aspect-[4/3] overflow-hidden border border-[var(--color-line)]">
            <img :src="`/images/quality-control.webp`" alt="Quality inspection station" class="h-full w-full object-cover" />
          </div>
          <div class="aspect-[4/3] overflow-hidden border border-[var(--color-line)]">
            <img :src="`/images/custom-oem.webp`" alt="Custom printed packaging samples" class="h-full w-full object-cover" />
          </div>
          <div class="aspect-[4/3] overflow-hidden border border-[var(--color-line)]">
            <img :src="`/images/hero-factory.webp`" alt="Production line overview" class="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container-x grid lg:grid-cols-2 gap-12">
        <div>
          <SectionHeading :eyebrow="page.contact.eyebrow" :title="page.contact.title" />
          <ul class="mt-8 space-y-4">
            <li class="border border-[var(--color-line)] bg-white p-5">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ page.contact.legalName }}</div>
              <div class="mt-2 text-[16px] font-semibold text-[var(--color-navy)]">{{ displayCompanyName }}</div>
            </li>
            <li class="border border-[var(--color-line)] bg-white p-5">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ page.contact.phone }}</div>
              <div class="mt-2 text-[16px] font-semibold text-[var(--color-navy)]">{{ company.phone }}</div>
            </li>
            <li class="border border-[var(--color-line)] bg-white p-5">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ text.actions.email }}</div>
              <div class="mt-2 text-[16px] font-semibold text-[var(--color-navy)]">{{ company.email }}</div>
            </li>
          </ul>
        </div>

        <div class="border border-[var(--color-line)] bg-[var(--color-panel)] p-8">
          <h3 class="text-[20px] font-extrabold text-[var(--color-navy)]">{{ page.contact.registeredTitle }}</h3>
          <ul class="mt-5 space-y-3.5">
            <li v-for="t in registeredFacts" :key="t" class="flex items-start gap-3">
              <el-icon :size="20" class="text-[var(--color-accent)] mt-0.5"><Check /></el-icon>
              <span class="text-[15px] text-[var(--color-graphite)] leading-relaxed">{{ t }}</span>
            </li>
          </ul>
          <NuxtLink :to="localePath('/contact')" class="inline-block mt-7">
            <el-button color="#c1121f" size="large">
              <el-icon><Promotion /></el-icon>
              <span>{{ page.contact.inquiry }}</span>
            </el-button>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-[var(--color-navy-dark)] text-white">
      <div class="container-x py-14 text-center">
        <h2 class="text-[clamp(24px,3.4vw,34px)] font-extrabold">{{ page.cta.title }}</h2>
        <p class="mt-3 text-white/75 max-w-xl mx-auto">{{ page.cta.desc }}</p>
        <div class="mt-7 flex flex-wrap justify-center gap-3">
          <NuxtLink :to="localePath('/contact')">
            <el-button color="#c1121f" size="large">
              <el-icon><Promotion /></el-icon>
              <span>{{ text.actions.getQuote }}</span>
            </el-button>
          </NuxtLink>
          <el-button tag="a" :href="company.whatsappLink" target="_blank" size="large" color="#1b3c63">
            <span class="inline-flex items-center gap-1.5">
              <SocialIcon name="whatsapp" />
              <span>{{ page.cta.whatsapp }}</span>
            </span>
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>
