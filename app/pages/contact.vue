<script setup lang="ts">
import { Message, Location, Clock } from '@element-plus/icons-vue'
import { buyerDocumentList } from '~/data/documents'

const company = await useSiteSettings()
const { isCn, text, localePath, htmlLang, seoAlternatePaths } = useLocale()
const registeredCapitalText = computed(() => (isCn.value ? '100万人民币' : company.registeredCapital))

definePageMeta({
  alias: ['/cn/contact'],
})

const page = computed(() => isCn.value ? {
  seo: {
    title: '联系我们 | 食品包装报价与样品 | 宜沅新材料',
    description: '联系商丘市宜沅新材料有限公司，咨询保鲜膜、生鲜保鲜膜、食品容器、OEM/ODM 包装、样品、起订量、交期和出口订单。',
    keywords: '联系我们, 食品包装报价, 保鲜膜报价, 食品包装样品, OEM包装询盘, 出口包装询盘',
  },
  breadcrumb: '联系我们',
  title: '获取报价',
  desc: '提交简单需求，我们收到后会继续确认细节。',
  formTitle: '提交询盘',
  quickTitle: '快速联系',
  quickDesc: '可通过 WhatsApp 或邮箱联系。',
  sendEmail: '发邮件',
  buyerFiles: '买家资料',
  phone: 'WhatsApp / 电话',
  address: '工厂地址',
  registered: '注册信息',
  established: `成立 ${company.founded} · ${registeredCapitalText.value}`,
} : {
  seo: {
    title: 'Contact YIYUAN | Get Food Packaging Quotes & Samples',
    description: 'Contact YIYUAN for cling film, fresh wrap, food containers, OEM/ODM packaging, samples, pricing, MOQ, lead time, and export order inquiries.',
    keywords: 'contact YIYUAN, food packaging quote, cling film quote, food wrap samples, packaging samples, OEM ODM packaging inquiry, wholesale packaging supplier, export packaging inquiry',
  },
  breadcrumb: 'Contact',
  title: 'Request a Quote',
  desc: 'Submit a quick inquiry. We will follow up for details after receiving your message.',
  formTitle: 'Submit Inquiry',
  quickTitle: 'Quick Contact',
  quickDesc: 'Use WhatsApp for fast contact, or send a short email inquiry.',
  sendEmail: 'Send Email',
  buyerFiles: 'Buyer Files',
  phone: 'WhatsApp / Phone',
  address: 'Factory Address',
  registered: 'Registered Information',
  established: `Established ${company.founded} · ${registeredCapitalText.value}`,
})

await useManagedSeo('page:contact', computed(() => ({
  ...page.value.seo,
  image: '/images/hero-factory.webp',
})), {
  fallbackOnly: isCn,
  canonicalPath: computed(() => (isCn.value ? '/cn/contact' : '/contact')),
  htmlLang,
  alternatePaths: computed(() => seoAlternatePaths()),
})

const route = useRoute()
const defaultProduct = computed(() => (route.query.product as string) || '')
const contactDocuments = buyerDocumentList
</script>

<template>
  <div>
    <section class="bg-[var(--color-navy)] text-white">
      <div class="container-x py-12">
        <el-breadcrumb separator="/" class="page-breadcrumb page-breadcrumb--dark mb-4">
          <el-breadcrumb-item :to="{ path: localePath('/') }">{{ text.nav.home }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ page.breadcrumb }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="text-[clamp(28px,4vw,40px)] font-extrabold leading-tight">{{ page.title }}</h1>
        <p class="mt-3 text-[16px] text-white/80 max-w-2xl leading-relaxed">
          {{ page.desc }}
        </p>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container-x grid lg:grid-cols-3 gap-10">
        <!-- Form -->
        <div class="border border-[var(--color-line)] p-6 sm:p-8 lg:col-span-2">
          <h2 class="text-[20px] font-extrabold text-[var(--color-navy)] mb-6">{{ page.formTitle }}</h2>
          <InquiryForm :default-product="defaultProduct" />
        </div>

        <!-- Contact info -->
        <div class="space-y-5">
          <div class="bg-[var(--color-navy)] p-6 text-white">
            <h3 class="text-[17px] font-bold">{{ page.quickTitle }}</h3>
            <p class="mt-2 text-[13.5px] text-white/75 leading-relaxed">{{ page.quickDesc }}</p>
            <div class="mt-5 grid gap-3">
              <el-button
                tag="a"
                :href="company.whatsappLink"
                target="_blank"
                color="#c1121f"
                size="large"
                class="!ml-0 !h-auto !min-h-12 !w-full !whitespace-normal !px-4 !py-3"
              >
                <span class="inline-flex items-center justify-center gap-1.5 text-center leading-snug">
                  <SocialIcon name="whatsapp" />
                  <span>WhatsApp {{ company.phone }}</span>
                </span>
              </el-button>
              <el-button
                tag="a"
                :href="company.contactLink"
                plain
                size="large"
                class="!ml-0 !h-auto !min-h-12 !w-full !border-white/20 !bg-transparent !px-4 !py-3 !text-white hover:!bg-white/6"
              >
                <span class="inline-flex items-center justify-center gap-1.5">
                  <el-icon><Message /></el-icon>
                  <span>{{ page.sendEmail }}</span>
                </span>
              </el-button>
            </div>
          </div>

          <DocumentDownloads
            :title="page.buyerFiles"
            :documents="contactDocuments"
            compact
          />

          <ul class="divide-y divide-[var(--color-line)] border border-[var(--color-line)]">
            <li class="flex items-start gap-3 p-5">
              <el-icon :size="20" class="text-[var(--color-accent)] mt-0.5"><Message /></el-icon>
              <div>
                <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ text.actions.email }}</div>
                <a :href="`mailto:${company.email}`" class="text-[15px] font-semibold text-[var(--color-navy)] hover:text-[var(--color-accent)]">{{ company.email }}</a>
              </div>
            </li>
            <li class="flex items-start gap-3 p-5">
              <span class="mt-0.5 text-[var(--color-accent)]">
                <SocialIcon name="whatsapp" />
              </span>
              <div>
                <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ page.phone }}</div>
                <div class="text-[15px] font-semibold text-[var(--color-navy)]">{{ company.phone }}</div>
              </div>
            </li>
            <li class="flex items-start gap-3 p-5">
              <el-icon :size="20" class="text-[var(--color-accent)] mt-0.5"><Location /></el-icon>
              <div>
                <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ page.address }}</div>
                <div class="text-[15px] font-semibold text-[var(--color-navy)] leading-snug">{{ company.address }}</div>
              </div>
            </li>
            <li class="flex items-start gap-3 p-5">
              <el-icon :size="20" class="text-[var(--color-accent)] mt-0.5"><Clock /></el-icon>
              <div>
                <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ page.registered }}</div>
                <div class="text-[15px] font-semibold text-[var(--color-navy)]">{{ page.established }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
