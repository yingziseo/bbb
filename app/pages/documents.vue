<script setup lang="ts">
import { Document, Message, Promotion } from '@element-plus/icons-vue'
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
</script>

<template>
  <div>
    <section class="bg-[var(--color-navy)] text-white">
      <div class="container-x py-12">
        <el-breadcrumb separator="/" class="page-breadcrumb page-breadcrumb--dark mb-4">
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item>Documents</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="max-w-3xl">
          <h1 class="text-[clamp(28px,4vw,42px)] font-extrabold leading-tight text-balance">Certificates & Test Reports</h1>
          <p class="mt-4 text-[16px] leading-relaxed text-white/78">
            Review available product files, test documents, and buyer support materials before submitting a food packaging inquiry.
          </p>
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container-x">
        <SectionHeading
          eyebrow="Compliance Files"
          title="Compliance & Test Documents"
          subtitle="Structured document information for buyer quality and sourcing review."
        />
        <div class="mt-8">
          <ComplianceDocumentsTable :documents="complianceDocuments" />
        </div>
        <p class="mt-4 max-w-3xl text-[13.5px] leading-relaxed text-[var(--color-slate-muted)]">
          Standard names, issuing body, and date should be reviewed against the original PDF before using them for market-specific compliance claims.
        </p>
      </div>
    </section>

    <section class="section border-y border-[var(--color-line)] bg-[var(--color-panel)]">
      <div class="container-x">
        <SectionHeading
          eyebrow="Buyer Files"
          title="Product & Company Files"
          subtitle="Product range, specification, and factory profile documents for quotation preparation."
        />
        <div class="mt-8">
          <ComplianceDocumentsTable :documents="productDocuments" />
        </div>
      </div>
    </section>

    <section id="request-documents" class="bg-[var(--color-navy)] text-white">
      <div class="container-x flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div class="max-w-2xl">
          <div class="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-white/60">
            <el-icon><Document /></el-icon>
            Buyer Document Support
          </div>
          <h2 class="mt-3 text-[24px] font-extrabold">Request Full Certificate Package</h2>
          <p class="mt-2 text-[15px] leading-relaxed text-white/72">
            Send your target product, market, and buyer document requirements. We can follow up with available PDF files or confirm what needs a new test.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/contact?product=Certificate%20Package">
            <el-button color="#c1121f" size="large">
              <el-icon><Message /></el-icon>
              <span>Request Documents</span>
            </el-button>
          </NuxtLink>
          <NuxtLink to="/contact">
            <el-button color="#1b3c63" size="large">
              <el-icon><Promotion /></el-icon>
              <span>Send Inquiry</span>
            </el-button>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
