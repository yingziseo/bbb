<script setup lang="ts">
import { Download, Files, Message, View } from '@element-plus/icons-vue'
import { buyerDocuments, requestDocumentRows } from '~/data/documents'

const { isCn, text, localePath, htmlLang, seoAlternatePaths } = useLocale()

definePageMeta({
  alias: ['/cn/documents'],
})

const page = computed(() => isCn.value ? {
  seo: {
    title: '资料证书 | 检测报告与产品资料 | 宜沅新材料',
    description: '查看商丘市宜沅新材料有限公司的产品资料、食品接触检测报告、材料安全文件和工厂资料，支持在线阅读和 PDF 下载。',
    keywords: '资料证书, 检测报告, 食品接触检测, 保鲜膜检测报告, 产品资料PDF, 食品包装证书',
  },
  breadcrumb: '资料证书',
  title: '资料证书与检测报告',
  desc: '查看可公开的产品资料和检测文件，再提交采购需求。',
  viewReport: '查看报告',
  downloadCatalog: '下载目录',
  center: '资料中心',
  centerNote: '完整资料包会在确认产品和市场后通过邮件发送。',
  stats: [
    { value: '2', label: '公开 PDF' },
    { value: '4', label: '文件类型' },
    { value: '24h', label: '邮件跟进' },
  ],
  steps: [
    { key: '公开', value: '查看和下载 PDF' },
    { key: '审核', value: '确认产品与文件范围' },
    { key: '申请', value: '按市场申请完整资料' },
  ],
  compliance: {
    eyebrow: '合规文件',
    title: '检测与合规资料',
    subtitle: '可公开查看的检测文件，以及按需提供的合规资料。',
    note: '面向特定市场的合规表述，应以原始 PDF 和订单要求为准。',
  },
  productFiles: {
    eyebrow: '买家资料',
    title: '产品与公司资料',
    subtitle: '用于报价前了解产品范围和公司信息。',
  },
  request: {
    eyebrow: '资料申请',
    title: '需要更多资料？',
    desc: '请发送产品、市场和文件要求，我们将通过邮件确认可提供资料。',
    fields: ['目标产品', '目标市场', '所需文件'],
    button: '申请资料包',
    contact: '联系销售',
  },
} : {
  seo: {
    title: 'Certificates & Test Reports | YIYUAN Food Packaging Documents',
    description: 'View YIYUAN food packaging product catalog, test report, material safety files, migration test documents, and factory profile documents for buyer review.',
    keywords: 'food packaging certificates, test reports, food contact test report, cling film test report, product catalog PDF, packaging supplier documents',
  },
  breadcrumb: 'Documents',
  title: 'Certificates & Test Reports',
  desc: 'Review available product files and test documents before sending a sourcing inquiry.',
  viewReport: 'View Test Report',
  downloadCatalog: 'Download Catalog',
  center: 'Document Center',
  centerNote: 'Full certificate packages are handled by email after product and market confirmation.',
  stats: [
    { value: '2', label: 'Public PDFs' },
    { value: '4', label: 'Document Types' },
    { value: '24h', label: 'Email Follow-up' },
  ],
  steps: [
    { key: 'Public', value: 'View and download available PDFs' },
    { key: 'Review', value: 'Check product and document scope' },
    { key: 'Request', value: 'Ask for full package by market' },
  ],
  compliance: {
    eyebrow: 'Compliance Files',
    title: 'Compliance & Test Documents',
    subtitle: 'Available test documents and request-only compliance files.',
    note: 'Market-specific claims should be checked against the original PDF and confirmed order requirements.',
  },
  productFiles: {
    eyebrow: 'Buyer Files',
    title: 'Product & Company Files',
    subtitle: 'Product range and company review files for quotation preparation.',
  },
  request: {
    eyebrow: 'Document Request',
    title: 'Need More Documents?',
    desc: 'Send product, market, and document requirements. We will confirm available files or testing needs by email.',
    fields: ['Target product', 'Destination market', 'Required files'],
    button: 'Request Full Package',
    contact: 'Contact Sales',
  },
})

await useManagedSeo('page:documents', computed(() => ({
  ...page.value.seo,
  image: '/images/quality-control.webp',
})), {
  fallbackOnly: isCn,
  canonicalPath: computed(() => (isCn.value ? '/cn/documents' : '/documents')),
  htmlLang,
  alternatePaths: computed(() => seoAlternatePaths()),
})

const complianceDocuments = [
  buyerDocuments.testReport,
  requestDocumentRows[0],
]

const productDocuments = [
  buyerDocuments.productCatalog,
  requestDocumentRows[1],
]

const documentStats = computed(() => page.value.stats)
const requestFields = computed(() => page.value.request.fields)
</script>

<template>
  <div>
    <section class="border-b border-[var(--color-line)] bg-white">
      <div class="container-x grid gap-8 py-10 lg:grid-cols-[1fr_360px] lg:items-center lg:py-12">
        <div>
          <el-breadcrumb separator="/" class="page-breadcrumb page-breadcrumb--light mb-4">
            <el-breadcrumb-item :to="{ path: localePath('/') }">{{ text.nav.home }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ page.breadcrumb }}</el-breadcrumb-item>
          </el-breadcrumb>
          <h1 class="max-w-3xl text-[clamp(30px,4vw,44px)] font-extrabold leading-tight text-[var(--color-navy)] text-balance">
            {{ page.title }}
          </h1>
          <p class="mt-4 max-w-2xl text-[16px] leading-relaxed text-[var(--color-graphite)]">
            {{ page.desc }}
          </p>
          <div class="mt-6 flex flex-col gap-3 sm:flex-row">
            <el-button tag="a" :href="buyerDocuments.testReport.href" target="_blank" rel="noopener" color="#1b3c63" size="large" class="!ml-0">
              <el-icon><View /></el-icon>
              <span>{{ page.viewReport }}</span>
            </el-button>
            <el-button tag="a" :href="buyerDocuments.productCatalog.href" :download="buyerDocuments.productCatalog.filename" plain size="large" class="!ml-0">
              <el-icon><Download /></el-icon>
              <span>{{ page.downloadCatalog }}</span>
            </el-button>
          </div>
        </div>

        <div class="border border-[var(--color-line)] bg-[var(--color-panel)] p-5">
          <div class="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.1em] text-[var(--color-accent)]">
            <el-icon><Files /></el-icon>
            {{ page.center }}
          </div>
          <div class="mt-5 grid grid-cols-3 divide-x divide-[var(--color-line)] bg-white">
            <div v-for="item in documentStats" :key="item.label" class="px-3 py-4 text-center">
              <div class="text-[24px] font-extrabold text-[var(--color-navy)]">{{ item.value }}</div>
              <div class="mt-1 text-[11px] font-bold uppercase leading-snug text-[var(--color-slate-muted)]">{{ item.label }}</div>
            </div>
          </div>
          <p class="mt-4 text-[13px] leading-relaxed text-[var(--color-slate-muted)]">
            {{ page.centerNote }}
          </p>
        </div>
      </div>
    </section>

    <section class="bg-[var(--color-panel)]">
      <div class="container-x grid gap-3 py-5 md:grid-cols-3">
        <div v-for="step in page.steps" :key="step.key" class="border border-[var(--color-line)] bg-white p-4">
          <div class="text-[12px] font-extrabold uppercase text-[var(--color-slate-muted)]">{{ step.key }}</div>
          <div class="mt-1 text-[15px] font-bold text-[var(--color-navy)]">{{ step.value }}</div>
        </div>
      </div>
    </section>

    <section class="section bg-white !pt-12">
      <div class="container-x">
        <SectionHeading
          :eyebrow="page.compliance.eyebrow"
          :title="page.compliance.title"
          :subtitle="page.compliance.subtitle"
        />
        <div class="mt-8">
          <ComplianceDocumentsTable :documents="complianceDocuments" />
        </div>
        <p class="mt-4 max-w-3xl border-l-4 border-[var(--color-accent)] pl-4 text-[13.5px] leading-relaxed text-[var(--color-slate-muted)]">
          {{ page.compliance.note }}
        </p>
      </div>
    </section>

    <section class="section border-y border-[var(--color-line)] bg-[var(--color-panel)]">
      <div class="container-x">
        <SectionHeading
          :eyebrow="page.productFiles.eyebrow"
          :title="page.productFiles.title"
          :subtitle="page.productFiles.subtitle"
        />
        <div class="mt-8">
          <ComplianceDocumentsTable :documents="productDocuments" />
        </div>
      </div>
    </section>

    <section id="request-documents" class="section bg-white !py-12">
      <div class="container-x">
        <div class="grid gap-6 border border-[var(--color-line)] bg-[var(--color-panel)] p-5 md:grid-cols-[1fr_320px] md:p-6">
          <div>
            <div class="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[var(--color-accent)]">{{ page.request.eyebrow }}</div>
            <h2 class="mt-2 text-[24px] font-extrabold leading-tight text-[var(--color-navy)]">{{ page.request.title }}</h2>
            <p class="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--color-graphite)]">
              {{ page.request.desc }}
            </p>
            <div class="mt-5 grid gap-2 sm:grid-cols-3">
              <span v-for="field in requestFields" :key="field" class="border border-[var(--color-line)] bg-white px-3 py-2 text-[12.5px] font-bold text-[var(--color-navy)]">
                {{ field }}
              </span>
            </div>
          </div>
          <div class="flex flex-col justify-center gap-3 border border-[var(--color-line)] bg-white p-4">
            <NuxtLink :to="localePath('/contact?product=Certificate%20Package')">
              <el-button color="#c1121f" size="large" class="!ml-0 !w-full">
                <el-icon><Message /></el-icon>
                <span>{{ page.request.button }}</span>
              </el-button>
            </NuxtLink>
            <NuxtLink :to="localePath('/contact')" class="text-center text-[13px] font-bold text-[var(--color-navy)] hover:text-[var(--color-accent)]">
              {{ page.request.contact }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
