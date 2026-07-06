<script setup lang="ts">
import { Promotion } from '@element-plus/icons-vue'
import type { Product } from '~/data/site'
defineProps<{ product: Product }>()
</script>

<template>
  <div class="group flex flex-col overflow-hidden border border-[var(--color-line)] bg-white">
    <NuxtLink :to="`/products/${product.slug}`" class="block relative aspect-[4/3] bg-[var(--color-panel)] overflow-hidden">
      <RuntimeImage
        :src="product.image"
        :alt="product.name"
        width="640"
        height="480"
        sizes="sm:100vw md:50vw lg:25vw"
        densities="1x"
        quality="82"
        image-class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        loading="lazy"
        fetchpriority="low"
        decoding="async"
      />
      <span class="absolute top-0 left-0 bg-[var(--color-navy)] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5">
        {{ product.category }}
      </span>
    </NuxtLink>

    <div class="flex flex-1 flex-col p-5">
      <h3 class="text-[17px] font-bold text-[var(--color-navy)] leading-snug">
        <NuxtLink :to="`/products/${product.slug}`" class="hover:text-[var(--color-accent)] transition-colors">{{ product.name }}</NuxtLink>
      </h3>
      <p class="mt-2 text-[14px] leading-relaxed text-[var(--color-slate-muted)] flex-1">{{ product.shortDesc }}</p>

      <div class="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-[var(--color-graphite)]">
        <span><strong class="text-[var(--color-navy)]">MOQ:</strong> {{ product.moq }}</span>
        <span v-if="product.custom" class="text-[var(--color-accent)] font-semibold">Customizable</span>
      </div>

      <div class="mt-5 flex gap-2.5">
        <NuxtLink :to="`/products/${product.slug}`" class="flex-1">
          <el-button class="w-full" plain>Details</el-button>
        </NuxtLink>
        <NuxtLink :to="`/contact?product=${encodeURIComponent(product.name)}`" class="flex-1">
          <el-button class="w-full" color="#c1121f">
            <el-icon><Promotion /></el-icon>
            <span>Inquiry</span>
          </el-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
