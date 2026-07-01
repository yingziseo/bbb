<script setup lang="ts">
import { Message, Location, OfficeBuilding, Clock } from '@element-plus/icons-vue'

const company = await useSiteSettings()

await useManagedSeo('page:contact', {
  title: 'Contact YIYUAN | Get Food Packaging Quotes & Samples',
  description: 'Contact YIYUAN for cling film, fresh wrap, food containers, OEM/ODM packaging, samples, pricing, MOQ, lead time, and export order inquiries.',
  keywords: 'contact YIYUAN, food packaging quote, cling film quote, food wrap samples, packaging samples, OEM ODM packaging inquiry, wholesale packaging supplier, export packaging inquiry',
  image: '/images/hero-factory.webp',
})

const route = useRoute()
const defaultProduct = computed(() => (route.query.product as string) || '')
</script>

<template>
  <div>
    <section class="bg-[var(--color-navy)] text-white">
      <div class="container-x py-12">
        <el-breadcrumb separator="/" class="mb-4 [&_.el-breadcrumb__inner]:!text-white/70">
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item>Contact</el-breadcrumb-item>
        </el-breadcrumb>
        <h1 class="text-[clamp(28px,4vw,40px)] font-extrabold leading-tight">Request a Quote</h1>
        <p class="mt-3 text-[16px] text-white/80 max-w-2xl leading-relaxed">
          Submit a quick inquiry. We will follow up for details after receiving your message.
        </p>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container-x grid lg:grid-cols-3 gap-10">
        <!-- Form -->
        <div class="border border-[var(--color-line)] p-6 sm:p-8 lg:col-span-2">
          <h2 class="text-[20px] font-extrabold text-[var(--color-navy)] mb-6">Submit Inquiry</h2>
          <InquiryForm :default-product="defaultProduct" />
        </div>

        <!-- Contact info -->
        <div class="space-y-5">
          <div class="bg-[var(--color-navy)] p-6 text-white">
            <h3 class="text-[17px] font-bold">Quick Contact</h3>
            <p class="mt-2 text-[13.5px] text-white/75 leading-relaxed">Use WhatsApp for fast contact, or send a short email inquiry.</p>
            <div class="mt-5 grid gap-3">
              <el-button
                tag="a"
                :href="company.whatsappLink"
                target="_blank"
                color="#c1121f"
                size="large"
                class="!ml-0 !h-auto !min-h-12 !w-full !whitespace-normal !px-4 !py-3"
              >
                <span class="text-center leading-snug">WhatsApp {{ company.phone }}</span>
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
                  <span>Send Email</span>
                </span>
              </el-button>
            </div>
          </div>

          <ul class="divide-y divide-[var(--color-line)] border border-[var(--color-line)]">
            <li class="flex items-start gap-3 p-5">
              <el-icon :size="20" class="text-[var(--color-accent)] mt-0.5"><Message /></el-icon>
              <div>
                <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">Email</div>
                <a :href="`mailto:${company.email}`" class="text-[15px] font-semibold text-[var(--color-navy)] hover:text-[var(--color-accent)]">{{ company.email }}</a>
              </div>
            </li>
            <li class="flex items-start gap-3 p-5">
              <el-icon :size="20" class="text-[var(--color-accent)] mt-0.5"><OfficeBuilding /></el-icon>
              <div>
                <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">WhatsApp / Phone</div>
                <div class="text-[15px] font-semibold text-[var(--color-navy)]">{{ company.phone }}</div>
              </div>
            </li>
            <li class="flex items-start gap-3 p-5">
              <el-icon :size="20" class="text-[var(--color-accent)] mt-0.5"><Location /></el-icon>
              <div>
                <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">Factory Address</div>
                <div class="text-[15px] font-semibold text-[var(--color-navy)] leading-snug">{{ company.address }}</div>
              </div>
            </li>
            <li class="flex items-start gap-3 p-5">
              <el-icon :size="20" class="text-[var(--color-accent)] mt-0.5"><Clock /></el-icon>
              <div>
                <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">Registered Information</div>
                <div class="text-[15px] font-semibold text-[var(--color-navy)]">Established {{ company.founded }} · {{ company.registeredCapital }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
