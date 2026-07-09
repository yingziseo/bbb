<script setup lang="ts">
import { Download, Files, Message, View } from '@element-plus/icons-vue'
import { buyerDocuments, requestDocumentRows } from '~/data/documents'

await useManagedSeo('page:documents', {
  title: 'Certificates & Test Reports | YIYUAN Food Packaging Documents',
  description: 'View YIYUAN food packaging product catalog, test report, material safety files, migration test documents, and factory profile documents for buyer review.',
  keywords: 'food packaging certificates, test reports, food contact test report, cling film test report, product catalog PDF, packaging supplier documents',
  image: '/images/quality-control.webp',
})

const complianceDocuments = [
  buyerDocuments.testReport,
  requestDocumentRows[0],
]

const productDocuments = [
  buyerDocuments.productCatalog,
  requestDocumentRows[1],
]

const documentStats = [
  { value: '2', label: 'Public PDFs' },
  { value: '4', label: 'Document Types' },
  { value: '24h', label: 'Email Follow-up' },
]

const requestFields = ['Target product', 'Destination market', 'Required files']
</script>

<template>
  <div>
    <section class="border-b border-[var(--color-line)] bg-white">
      <div class="container-x grid gap-8 py-10 lg:grid-cols-[1fr_360px] lg:items-center lg:py-12">
        <div>
          <el-breadcrumb separator="/" class="page-breadcrumb page-breadcrumb--light mb-4">
            <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item>Documents</el-breadcrumb-item>
          </el-breadcrumb>
          <h1 class="max-w-3xl text-[clamp(30px,4vw,44px)] font-extrabold leading-tight text-[var(--color-navy)] text-balance">
            Certificates & Test Reports
          </h1>
          <p class="mt-4 max-w-2xl text-[16px] leading-relaxed text-[var(--color-graphite)]">
            Review available product files and test documents before sending a sourcing inquiry.
          </p>
          <div class="mt-6 flex flex-col gap-3 sm:flex-row">
            <el-button tag="a" :href="buyerDocuments.testReport.href" target="_blank" rel="noopener" color="#1b3c63" size="large" class="!ml-0">
              <el-icon><View /></el-icon>
              <span>View Test Report</span>
            </el-button>
            <el-button tag="a" :href="buyerDocuments.productCatalog.href" :download="buyerDocuments.productCatalog.filename" plain size="large" class="!ml-0">
              <el-icon><Download /></el-icon>
              <span>Download Catalog</span>
            </el-button>
          </div>
        </div>

        <div class="border border-[var(--color-line)] bg-[var(--color-panel)] p-5">
          <div class="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.1em] text-[var(--color-accent)]">
            <el-icon><Files /></el-icon>
            Document Center
          </div>
          <div class="mt-5 grid grid-cols-3 divide-x divide-[var(--color-line)] bg-white">
            <div v-for="item in documentStats" :key="item.label" class="px-3 py-4 text-center">
              <div class="text-[24px] font-extrabold text-[var(--color-navy)]">{{ item.value }}</div>
              <div class="mt-1 text-[11px] font-bold uppercase leading-snug text-[var(--color-slate-muted)]">{{ item.label }}</div>
            </div>
          </div>
          <p class="mt-4 text-[13px] leading-relaxed text-[var(--color-slate-muted)]">
            Full certificate packages are handled by email after product and market confirmation.
          </p>
        </div>
      </div>
    </section>

    <section class="bg-[var(--color-panel)]">
      <div class="container-x grid gap-3 py-5 md:grid-cols-3">
        <div class="border border-[var(--color-line)] bg-white p-4">
          <div class="text-[12px] font-extrabold uppercase text-[var(--color-slate-muted)]">Public</div>
          <div class="mt-1 text-[15px] font-bold text-[var(--color-navy)]">View and download available PDFs</div>
        </div>
        <div class="border border-[var(--color-line)] bg-white p-4">
          <div class="text-[12px] font-extrabold uppercase text-[var(--color-slate-muted)]">Review</div>
          <div class="mt-1 text-[15px] font-bold text-[var(--color-navy)]">Check product and document scope</div>
        </div>
        <div class="border border-[var(--color-line)] bg-white p-4">
          <div class="text-[12px] font-extrabold uppercase text-[var(--color-slate-muted)]">Request</div>
          <div class="mt-1 text-[15px] font-bold text-[var(--color-navy)]">Ask for full package by market</div>
        </div>
      </div>
    </section>

    <section class="section bg-white !pt-12">
      <div class="container-x">
        <SectionHeading
          eyebrow="Compliance Files"
          title="Compliance & Test Documents"
          subtitle="Available test documents and request-only compliance files."
        />
        <div class="mt-8">
          <ComplianceDocumentsTable :documents="complianceDocuments" />
        </div>
        <p class="mt-4 max-w-3xl border-l-4 border-[var(--color-accent)] pl-4 text-[13.5px] leading-relaxed text-[var(--color-slate-muted)]">
          Market-specific claims should be checked against the original PDF and confirmed order requirements.
        </p>
      </div>
    </section>

    <section class="section border-y border-[var(--color-line)] bg-[var(--color-panel)]">
      <div class="container-x">
        <SectionHeading
          eyebrow="Buyer Files"
          title="Product & Company Files"
          subtitle="Product range and company review files for quotation preparation."
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
            <div class="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[var(--color-accent)]">Document Request</div>
            <h2 class="mt-2 text-[24px] font-extrabold leading-tight text-[var(--color-navy)]">Need More Documents?</h2>
            <p class="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--color-graphite)]">
              Send product, market, and document requirements. We will confirm available files or testing needs by email.
            </p>
            <div class="mt-5 grid gap-2 sm:grid-cols-3">
              <span v-for="field in requestFields" :key="field" class="border border-[var(--color-line)] bg-white px-3 py-2 text-[12.5px] font-bold text-[var(--color-navy)]">
                {{ field }}
              </span>
            </div>
          </div>
          <div class="flex flex-col justify-center gap-3 border border-[var(--color-line)] bg-white p-4">
            <NuxtLink to="/contact?product=Certificate%20Package">
              <el-button color="#c1121f" size="large" class="!ml-0 !w-full">
                <el-icon><Message /></el-icon>
                <span>Request Full Package</span>
              </el-button>
            </NuxtLink>
            <NuxtLink to="/contact" class="text-center text-[13px] font-bold text-[var(--color-navy)] hover:text-[var(--color-accent)]">
              Contact Sales
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
