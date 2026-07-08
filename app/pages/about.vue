<script setup lang="ts">
import { OfficeBuilding, Setting, Box, Histogram, Check, Promotion } from '@element-plus/icons-vue'
import { buyerDocuments } from '~/data/documents'

const company = await useSiteSettings()

await useManagedSeo('page:about', {
  title: 'About YIYUAN | China Cling Film & Food Packaging Factory',
  description: 'Learn about YIYUAN, a China food packaging supplier serving importers, wholesalers, OEM/ODM brands, and private label buyers with cling film, fresh wrap, and disposable packaging.',
  keywords: 'about YIYUAN, China food packaging factory, cling film factory, food wrap supplier, disposable packaging supplier, OEM ODM packaging factory, packaging supplier for importers, export packaging supplier',
  image: '/images/about-factory.webp',
})

const capabilities = [
  { icon: OfficeBuilding, title: 'Registered Company', desc: company.location },
  { icon: Setting, title: 'Material Focus', desc: 'Cling film, wrap, and packaging materials.' },
  { icon: Box, title: 'OEM Orders', desc: 'Custom orders and export contact.' },
  { icon: Histogram, title: 'PVC Phase I', desc: 'Public notice references 5,000 tons annual output.' },
]

const registeredFacts = [
  `Established in ${company.founded}`,
  `Registered capital: ${company.registeredCapital}`,
  `Legal representative: ${company.legalRepresentative}`,
  'Address translated from the public registration record',
  'PVC Phase I public notice references 5,000 tons annual output',
]
const qualityDocuments = [buyerDocuments.testReport]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-[var(--color-navy)] text-white">
      <div class="container-x grid lg:grid-cols-2 gap-10 py-14 items-center">
        <div>
          <el-breadcrumb separator="/" class="page-breadcrumb page-breadcrumb--dark mb-4">
            <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item>Company</el-breadcrumb-item>
          </el-breadcrumb>
          <h1 class="text-[clamp(28px,4vw,42px)] font-extrabold leading-tight text-balance">
            Factory Overview
          </h1>
          <p class="mt-5 text-[16px] leading-relaxed text-white/80 max-w-xl">
            {{ company.name }} is a Shangqiu-based company focused on cling film, fresh wrap, and related packaging materials.
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
        <div class="p-7 text-center"><div class="text-[30px] font-extrabold">{{ company.founded }}</div><div class="text-[12px] uppercase tracking-wide text-white/60 mt-1">Established</div></div>
        <div class="p-7 text-center"><div class="text-[30px] font-extrabold">{{ company.registeredCapital }}</div><div class="text-[12px] uppercase tracking-wide text-white/60 mt-1">Registered Capital</div></div>
        <div class="p-7 text-center"><div class="text-[30px] font-extrabold">5,000 t</div><div class="text-[12px] uppercase tracking-wide text-white/60 mt-1">PVC Project Phase I</div></div>
        <div class="p-7 text-center"><div class="text-[30px] font-extrabold">Henan</div><div class="text-[12px] uppercase tracking-wide text-white/60 mt-1">Registered Region</div></div>
      </div>
    </section>

    <!-- Capabilities grid -->
    <section class="section bg-white">
      <div class="container-x">
        <SectionHeading
          eyebrow="Company Facts"
          title="Factory Information"
          subtitle="Company facts and contact details."
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
          eyebrow="Quality Documents"
          title="Inspection Document"
          subtitle="View or download"
          :documents="qualityDocuments"
        />
      </div>
    </section>

    <!-- Workshop gallery -->
    <section class="section bg-white">
      <div class="container-x">
        <SectionHeading eyebrow="Factory" title="Workshop, Equipment & Storage" subtitle="Production floor, converting equipment, warehouse, and product samples." />
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
          <SectionHeading eyebrow="Contact Details" title="Company Contact" />
          <ul class="mt-8 space-y-4">
            <li class="border border-[var(--color-line)] bg-white p-5">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">Legal Name</div>
              <div class="mt-2 text-[16px] font-semibold text-[var(--color-navy)]">{{ company.name }}</div>
            </li>
            <li class="border border-[var(--color-line)] bg-white p-5">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">WhatsApp / Phone</div>
              <div class="mt-2 text-[16px] font-semibold text-[var(--color-navy)]">{{ company.phone }}</div>
            </li>
            <li class="border border-[var(--color-line)] bg-white p-5">
              <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">Email</div>
              <div class="mt-2 text-[16px] font-semibold text-[var(--color-navy)]">{{ company.email }}</div>
            </li>
          </ul>
        </div>

        <div class="border border-[var(--color-line)] bg-[var(--color-panel)] p-8">
          <h3 class="text-[20px] font-extrabold text-[var(--color-navy)]">Registered Information</h3>
          <ul class="mt-5 space-y-3.5">
            <li v-for="t in registeredFacts" :key="t" class="flex items-start gap-3">
              <el-icon :size="20" class="text-[var(--color-accent)] mt-0.5"><Check /></el-icon>
              <span class="text-[15px] text-[var(--color-graphite)] leading-relaxed">{{ t }}</span>
            </li>
          </ul>
          <NuxtLink to="/contact" class="inline-block mt-7">
            <el-button color="#c1121f" size="large">
              <el-icon><Promotion /></el-icon>
              <span>Start an Inquiry</span>
            </el-button>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-[var(--color-navy-dark)] text-white">
      <div class="container-x py-14 text-center">
        <h2 class="text-[clamp(24px,3.4vw,34px)] font-extrabold">Send Your Inquiry</h2>
        <p class="mt-3 text-white/75 max-w-xl mx-auto">Send product details by email or WhatsApp.</p>
        <div class="mt-7 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/contact">
            <el-button color="#c1121f" size="large">
              <el-icon><Promotion /></el-icon>
              <span>Get a Quote</span>
            </el-button>
          </NuxtLink>
          <el-button tag="a" :href="company.whatsappLink" target="_blank" size="large" color="#1b3c63">
            <span class="inline-flex items-center gap-1.5">
              <SocialIcon name="whatsapp" />
              <span>Contact on WhatsApp</span>
            </span>
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>
