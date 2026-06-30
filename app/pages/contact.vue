<script setup lang="ts">
import { Message, Location, OfficeBuilding, Clock } from '@element-plus/icons-vue'
import { company } from '~/data/site'

useHead({ title: `Contact | ${company.name}` })

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
          Send your product details by form, email, or WhatsApp.
        </p>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container-x grid lg:grid-cols-3 gap-10">
        <!-- Form -->
        <div class="border border-[var(--color-line)] p-6 sm:p-8 lg:col-span-2">
          <h2 class="text-[20px] font-extrabold text-[var(--color-navy)] mb-6">Inquiry Form</h2>
          <InquiryForm :default-product="defaultProduct" />
        </div>

        <!-- Contact info -->
        <div class="space-y-5">
          <div class="bg-[var(--color-navy)] p-6 text-white">
            <h3 class="text-[17px] font-bold">WhatsApp / Email</h3>
            <p class="mt-2 text-[13.5px] text-white/75 leading-relaxed">Use WhatsApp for quick contact. Use email for detailed requirements.</p>
            <el-button tag="a" :href="company.whatsappLink" target="_blank" color="#c1121f" size="large" class="mt-4 w-full">
              WhatsApp {{ company.phone }}
            </el-button>
            <el-button tag="a" :href="company.contactLink" plain size="large" class="mt-3 w-full !border-white/20 !bg-transparent !text-white hover:!bg-white/6">
              <el-icon class="mr-1"><Message /></el-icon>Send Email
            </el-button>
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
                <div class="text-[12px] uppercase tracking-wide text-[var(--color-slate-muted)]">Company Record</div>
                <div class="text-[15px] font-semibold text-[var(--color-navy)]">Established {{ company.founded }} · {{ company.registeredCapital }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
