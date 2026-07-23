<script setup lang="ts">
import { ArrowRight, Check, Promotion, WarningFilled } from '@element-plus/icons-vue'
import { getBuyerGuide } from '~/data/buyer-guides'

const company = await useSiteSettings()
const route = useRoute()
const guide = getBuyerGuide(route.params.slug as string)

if (!guide) {
  throw createError({ statusCode: 404, statusMessage: 'Buyer guide not found', fatal: true })
}

await useManagedSeo(`guide:${guide.slug}`, {
  title: guide.seoTitle,
  description: guide.seoDescription,
  keywords: guide.seoKeywords,
  image: guide.coverImage,
}, {
  canonicalPath: `/guides/${guide.slug}`,
  htmlLang: 'en',
})
</script>

<template>
  <div>
    <section class="bg-[var(--color-navy)] text-white">
      <div class="container-x grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:py-14">
        <div class="min-w-0">
          <el-breadcrumb separator="/" class="page-breadcrumb page-breadcrumb--dark mb-5">
            <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/products' }">Products</el-breadcrumb-item>
            <el-breadcrumb-item>Buyer Guide</el-breadcrumb-item>
          </el-breadcrumb>
          <span class="inline-flex border border-white/25 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white/85">Buyer Guide</span>
          <h1 class="mt-4 max-w-3xl text-[clamp(30px,4.1vw,46px)] font-extrabold leading-tight text-balance">{{ guide.title }}</h1>
          <p class="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/80">{{ guide.description }}</p>
          <div class="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-white/70">
            <span>{{ guide.updatedLabel }}</span>
            <span>{{ guide.readingTime }}</span>
            <span>By YIYUAN Buyer Support</span>
          </div>
        </div>
        <div class="overflow-hidden border border-white/15 bg-[var(--color-navy-dark)]">
          <RuntimeImage
            :src="guide.coverImage"
            :alt="guide.coverAlt"
            width="840"
            height="630"
            sizes="sm:100vw lg:420px"
            :preload="{ fetchPriority: 'high' }"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            image-class="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>
    </section>

    <section class="border-b border-[var(--color-line)] bg-white">
      <div class="container-x grid gap-5 py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <p class="max-w-3xl text-[15px] leading-relaxed text-[var(--color-graphite)]">{{ guide.intro }}</p>
        <NuxtLink :to="guide.productPath" class="shrink-0">
          <el-button size="large" color="#c1121f"><span>{{ guide.productLabel }}</span><el-icon><ArrowRight /></el-icon></el-button>
        </NuxtLink>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container-x">
        <SectionHeading eyebrow="First-order workflow" title="Use one record from RFQ to shipment" subtitle="The checks below are designed to make supplier responses, sample approval, and shipment release easier to compare and audit." />
        <ol class="mt-10 grid gap-px border border-[var(--color-line)] bg-[var(--color-line)] lg:grid-cols-5">
          <li v-for="step in guide.steps" :key="step.number" class="min-w-0 bg-white p-5">
            <div class="text-[24px] font-extrabold text-[var(--color-accent)]">{{ step.number }}</div>
            <h2 class="mt-4 text-[17px] font-extrabold leading-snug text-[var(--color-navy)]">{{ step.title }}</h2>
            <p class="mt-3 text-[14px] leading-relaxed text-[var(--color-slate-muted)]">{{ step.summary }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="section border-y border-[var(--color-line)] bg-[var(--color-panel)]">
      <div class="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
        <div class="min-w-0">
          <span class="eyebrow">Detailed checks</span>
          <h2 class="mt-3 text-[26px] font-extrabold leading-tight text-[var(--color-navy)]">What to confirm at each stage</h2>
          <div class="mt-7 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)] bg-white">
            <section v-for="step in guide.steps" :key="`detail-${step.number}`" class="grid gap-5 p-5 sm:grid-cols-[80px_minmax(0,1fr)] sm:p-6">
              <div class="text-[14px] font-extrabold text-[var(--color-accent)]">STEP {{ step.number }}</div>
              <div class="min-w-0">
                <h3 class="text-[19px] font-extrabold text-[var(--color-navy)]">{{ step.title }}</h3>
                <ul class="mt-4 grid gap-2.5">
                  <li v-for="check in step.checks" :key="check" class="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-[var(--color-graphite)]">
                    <el-icon :size="18" class="mt-0.5 shrink-0 text-[var(--color-accent)]"><Check /></el-icon>
                    <span>{{ check }}</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
        <aside class="border border-[var(--color-line)] bg-white p-6">
          <span class="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[var(--color-accent)]">Evidence to retain</span>
          <h2 class="mt-3 text-[20px] font-extrabold leading-tight text-[var(--color-navy)]">Keep the decision trail with the order</h2>
          <p class="mt-3 text-[14.5px] leading-relaxed text-[var(--color-slate-muted)]">Store the RFQ, supplier response, approved sample, final specification, packing approval, and shipping instructions together. It makes a first order easier to review and a repeat order easier to control.</p>
          <NuxtLink to="/documents" class="mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold text-[var(--color-navy)] hover:text-[var(--color-accent)]">Review buyer documents <el-icon><ArrowRight /></el-icon></NuxtLink>
        </aside>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container-x">
        <SectionHeading eyebrow="Avoidable problems" title="Turn common risks into approval points" />
        <div class="mt-8 overflow-x-auto border border-[var(--color-line)]">
          <table class="min-w-[720px] w-full border-collapse text-left">
            <thead class="bg-[var(--color-navy)] text-white">
              <tr>
                <th class="p-4 text-[13px] font-bold">Risk</th>
                <th class="p-4 text-[13px] font-bold">What to check</th>
                <th class="p-4 text-[13px] font-bold">Control action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--color-line)]">
              <tr v-for="row in guide.riskRows" :key="row.risk" class="align-top">
                <td class="w-[27%] p-4 text-[14px] font-extrabold leading-relaxed text-[var(--color-navy)]"><span class="inline-flex items-start gap-2"><el-icon :size="17" class="mt-0.5 shrink-0 text-[var(--color-accent)]"><WarningFilled /></el-icon>{{ row.risk }}</span></td>
                <td class="w-[36%] p-4 text-[14px] leading-relaxed text-[var(--color-graphite)]">{{ row.check }}</td>
                <td class="w-[37%] p-4 text-[14px] leading-relaxed text-[var(--color-graphite)]">{{ row.action }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section border-y border-[var(--color-line)] bg-[var(--color-panel)]">
      <div class="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div class="min-w-0">
          <SectionHeading eyebrow="Related reading" title="Continue the product-specific review" />
          <div class="mt-7 grid gap-3">
            <NuxtLink v-for="article in guide.relatedArticles" :key="article.to" :to="article.to" class="group flex items-center justify-between gap-4 border border-[var(--color-line)] bg-white p-4 text-[15px] font-bold text-[var(--color-navy)] hover:border-[var(--color-navy)] hover:text-[var(--color-accent)]">
              <span>{{ article.title }}</span><el-icon class="shrink-0"><ArrowRight /></el-icon>
            </NuxtLink>
          </div>
        </div>
        <div class="border border-[var(--color-line)] bg-white p-6">
          <span class="eyebrow">Scope note</span>
          <p class="mt-4 text-[14.5px] leading-relaxed text-[var(--color-graphite)]">This guide shares practical commercial checks from a packaging supplier perspective. It is not legal, customs, or regulatory advice. Importers remain responsible for confirming destination-specific requirements before ordering or shipping.</p>
          <NuxtLink to="/about" class="mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold text-[var(--color-navy)] hover:text-[var(--color-accent)]">About YIYUAN <el-icon><ArrowRight /></el-icon></NuxtLink>
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div>
          <SectionHeading eyebrow="Questions buyers ask" title="FAQ" />
          <div class="mt-7 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            <details v-for="faq in guide.faqs" :key="faq.question" class="group py-5">
              <summary class="flex cursor-pointer list-none items-start justify-between gap-4 text-[16px] font-extrabold leading-snug text-[var(--color-navy)]">{{ faq.question }}<span class="shrink-0 text-[var(--color-accent)] group-open:rotate-45">+</span></summary>
              <p class="max-w-3xl pt-3 text-[14.5px] leading-relaxed text-[var(--color-graphite)]">{{ faq.answer }}</p>
            </details>
          </div>
        </div>
        <div class="bg-[var(--color-navy)] p-7 text-white">
          <h2 class="text-[22px] font-extrabold leading-tight">Have a specification ready to review?</h2>
          <p class="mt-3 text-[14.5px] leading-relaxed text-white/75">Send the product, quantity, packing, destination, and target timeline. We can help identify the details needed for a workable quotation.</p>
          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink :to="`/contact?product=${encodeURIComponent(guide.inquiryProduct)}`"><el-button color="#c1121f"><el-icon><Promotion /></el-icon><span>Start an Inquiry</span></el-button></NuxtLink>
            <el-button tag="a" :href="company.whatsappLink" target="_blank" color="#1b3c63"><span class="inline-flex items-center gap-1.5"><SocialIcon name="whatsapp" /><span>WhatsApp</span></span></el-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
