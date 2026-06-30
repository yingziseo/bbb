<script setup lang="ts">
import { company, categories, complianceMarqueeItems } from '~/data/site'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-[var(--color-navy-dark)] text-white/80">
    <div class="footer-compliance">
      <InfoMarquee :items="complianceMarqueeItems" direction="rtl" tone="dark" />
    </div>

    <div class="container-x py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <span class="flex h-9 w-9 items-center justify-center bg-white text-[var(--color-navy)] font-extrabold text-lg">Y</span>
          <span class="font-extrabold text-[18px] text-white">{{ company.displayName }}</span>
        </div>
        <p class="text-[14px] leading-relaxed text-white/70">{{ company.tagline }}</p>
      </div>

      <div>
        <h4 class="text-white font-bold text-[14px] uppercase tracking-[0.12em] mb-4">Products</h4>
        <ul class="space-y-2.5 text-[14px]">
          <li v-for="c in categories" :key="c.slug">
            <NuxtLink :to="`/products?category=${c.slug}`" class="hover:text-white transition-colors">{{ c.name }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h4 class="text-white font-bold text-[14px] uppercase tracking-[0.12em] mb-4">Company</h4>
        <ul class="space-y-2.5 text-[14px]">
          <li><NuxtLink to="/about" class="hover:text-white transition-colors">Company Profile</NuxtLink></li>
          <li><NuxtLink to="/products" class="hover:text-white transition-colors">All Products</NuxtLink></li>
          <li><NuxtLink to="/blog" class="hover:text-white transition-colors">Blog</NuxtLink></li>
          <li><NuxtLink to="/contact" class="hover:text-white transition-colors">Contact</NuxtLink></li>
        </ul>
      </div>

      <div>
        <h4 class="text-white font-bold text-[14px] uppercase tracking-[0.12em] mb-4">Contact</h4>
        <ul class="space-y-2.5 text-[14px] text-white/70">
          <li>{{ company.phone }}</li>
          <li>{{ company.email }}</li>
          <li>{{ company.name }}</li>
          <li class="leading-relaxed">{{ company.address }}</li>
        </ul>
        <a :href="company.whatsappLink" target="_blank" class="inline-block mt-4">
          <el-button color="#c1121f">Chat on WhatsApp</el-button>
        </a>
      </div>
    </div>

    <div class="border-t border-white/10">
      <div class="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-white/55">
        <span>© {{ year }} {{ company.name }} All rights reserved.</span>
        <span>{{ company.location }}</span>
      </div>
    </div>
  </footer>
</template>
