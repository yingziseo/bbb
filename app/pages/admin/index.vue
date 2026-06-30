<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: '后台概览 | YIYUAN' })

const { data, refresh } = await useFetch('/api/admin/stats')

const cards = computed(() => [
  { label: '文章总数', value: data.value?.posts || 0 },
  { label: '已发布文章', value: data.value?.publishedPosts || 0 },
  { label: '产品分类', value: data.value?.productCategories || 0 },
  { label: '产品总数', value: data.value?.products || 0 },
  { label: '已发布产品', value: data.value?.publishedProducts || 0 },
  { label: '询盘总数', value: data.value?.inquiries || 0 },
  { label: '未读询盘', value: data.value?.unreadInquiries || 0 },
  { label: 'SEO 条目', value: data.value?.seoEntries || 0 },
  { label: '邮件失败', value: data.value?.failedMails || 0 },
])
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-[22px] font-extrabold text-[var(--color-navy)]">后台概览</h1>
        <p class="mt-1 text-[13px] text-[var(--color-slate-muted)]">网站内容、SEO、询盘和邮件转发状态。</p>
      </div>
      <el-button size="small" @click="refresh">刷新</el-button>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <div v-for="card in cards" :key="card.label" class="flex min-h-[76px] items-center justify-between border border-[var(--color-line)] bg-white px-4 py-3">
        <div class="text-[13px] font-semibold text-[var(--color-slate-muted)]">{{ card.label }}</div>
        <div class="text-[26px] font-extrabold leading-none text-[var(--color-navy)]">{{ card.value }}</div>
      </div>
    </div>

    <div class="mt-4 grid gap-3 lg:grid-cols-2">
      <NuxtLink to="/admin/products" class="border border-[var(--color-line)] bg-white px-4 py-3 transition-colors hover:border-[var(--color-navy)]">
        <h2 class="text-[15px] font-bold text-[var(--color-navy)]">管理产品分类和产品</h2>
        <p class="mt-1 text-[13px] leading-relaxed text-[var(--color-slate-muted)]">维护保鲜膜、一次性餐盒分类，以及产品图片、材料、MOQ、规格尺寸和包装。</p>
      </NuxtLink>
      <NuxtLink to="/admin/seo" class="border border-[var(--color-line)] bg-white px-4 py-3 transition-colors hover:border-[var(--color-navy)]">
        <h2 class="text-[15px] font-bold text-[var(--color-navy)]">管理页面 TDK</h2>
        <p class="mt-1 text-[13px] leading-relaxed text-[var(--color-slate-muted)]">首页、产品页、博客页、联系页和详情页 SEO 集中管理。</p>
      </NuxtLink>
      <NuxtLink to="/admin/inquiries" class="border border-[var(--color-line)] bg-white px-4 py-3 transition-colors hover:border-[var(--color-navy)]">
        <h2 class="text-[15px] font-bold text-[var(--color-navy)]">查看询盘记录</h2>
        <p class="mt-1 text-[13px] leading-relaxed text-[var(--color-slate-muted)]">表单提交会入库，并自动尝试转发到网站邮箱。</p>
      </NuxtLink>
      <NuxtLink to="/admin/settings" class="border border-[var(--color-line)] bg-white px-4 py-3 transition-colors hover:border-[var(--color-navy)]">
        <h2 class="text-[15px] font-bold text-[var(--color-navy)]">修改网站联系方式</h2>
        <p class="mt-1 text-[13px] leading-relaxed text-[var(--color-slate-muted)]">统一维护前台电话、邮箱、WhatsApp、公司信息和 sitemap 域名。</p>
      </NuxtLink>
    </div>
  </div>
</template>
