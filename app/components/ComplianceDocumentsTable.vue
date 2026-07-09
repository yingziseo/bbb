<script setup lang="ts">
import { Download, Message, View } from '@element-plus/icons-vue'
import { getBuyerDocumentCopy, type BuyerDocument } from '~/data/documents'

defineProps<{
  documents: BuyerDocument[]
}>()

const { isCn, text, localePath } = useLocale()
const docCopy = (doc: BuyerDocument) => getBuyerDocumentCopy(doc, isCn.value)
</script>

<template>
  <div class="border border-[var(--color-line)] bg-white">
    <div class="hidden md:block">
      <table class="w-full border-collapse text-left">
        <thead class="bg-[var(--color-panel)]">
          <tr>
            <th class="px-4 py-3 text-[12px] font-extrabold uppercase text-[var(--color-navy)]">{{ text.labels.document }}</th>
            <th class="px-4 py-3 text-[12px] font-extrabold uppercase text-[var(--color-navy)]">{{ text.labels.appliesTo }}</th>
            <th class="px-4 py-3 text-[12px] font-extrabold uppercase text-[var(--color-navy)]">{{ text.labels.standard }}</th>
            <th class="px-4 py-3 text-[12px] font-extrabold uppercase text-[var(--color-navy)]">{{ text.labels.issuedBy }}</th>
            <th class="px-4 py-3 text-[12px] font-extrabold uppercase text-[var(--color-navy)]">{{ text.labels.date }}</th>
            <th class="px-4 py-3 text-[12px] font-extrabold uppercase text-[var(--color-navy)]">{{ text.labels.action }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in documents" :key="doc.document" class="border-t border-[var(--color-line)] align-top">
            <td class="px-4 py-4">
              <div class="text-[14.5px] font-extrabold text-[var(--color-navy)]">{{ docCopy(doc).document }}</div>
              <div class="mt-1 text-[12.5px] font-semibold text-[var(--color-slate-muted)]">{{ docCopy(doc).meta }}</div>
            </td>
            <td class="px-4 py-4 text-[13.5px] font-semibold leading-relaxed text-[var(--color-graphite)]">{{ docCopy(doc).appliesTo }}</td>
            <td class="px-4 py-4 text-[13.5px] leading-relaxed text-[var(--color-graphite)]">{{ docCopy(doc).standard }}</td>
            <td class="px-4 py-4 text-[13.5px] leading-relaxed text-[var(--color-graphite)]">{{ docCopy(doc).issuedBy }}</td>
            <td class="px-4 py-4 text-[13.5px] font-semibold text-[var(--color-graphite)]">{{ docCopy(doc).date }}</td>
            <td class="px-4 py-4">
              <div class="flex flex-wrap gap-2">
                <el-button
                  tag="a"
                  :href="localePath(doc.href)"
                  :target="doc.requestOnly ? undefined : '_blank'"
                  :rel="doc.requestOnly ? undefined : 'noopener'"
                  color="#1b3c63"
                  size="small"
                  class="!ml-0"
                >
                  <el-icon><Message v-if="doc.requestOnly" /><View v-else /></el-icon>
                  <span>{{ docCopy(doc).viewLabel }}</span>
                </el-button>
                <el-button
                  v-if="doc.downloadLabel"
                  tag="a"
                  :href="localePath(doc.href)"
                  :download="doc.filename"
                  plain
                  size="small"
                  class="!ml-0"
                >
                  <el-icon><Download /></el-icon>
                  <span>{{ docCopy(doc).downloadLabel }}</span>
                </el-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="divide-y divide-[var(--color-line)] md:hidden">
      <article v-for="doc in documents" :key="doc.document" class="p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="text-[16px] font-extrabold leading-snug text-[var(--color-navy)]">{{ docCopy(doc).document }}</h3>
            <p class="mt-1 text-[12.5px] font-semibold text-[var(--color-slate-muted)]">{{ docCopy(doc).meta }}</p>
          </div>
          <span class="shrink-0 border border-[var(--color-line)] bg-[var(--color-panel)] px-2 py-1 text-[11px] font-bold uppercase text-[var(--color-navy)]">
            {{ doc.requestOnly ? text.labels.request : text.labels.pdf }}
          </span>
        </div>

        <dl class="mt-4 grid gap-3 text-[13px]">
          <div>
            <dt class="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--color-slate-muted)]">{{ text.labels.appliesTo }}</dt>
            <dd class="mt-1 font-semibold leading-relaxed text-[var(--color-graphite)]">{{ docCopy(doc).appliesTo }}</dd>
          </div>
          <div>
            <dt class="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--color-slate-muted)]">{{ text.labels.standardShort }}</dt>
            <dd class="mt-1 leading-relaxed text-[var(--color-graphite)]">{{ docCopy(doc).standard }}</dd>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <dt class="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--color-slate-muted)]">{{ text.labels.issuedBy }}</dt>
              <dd class="mt-1 leading-relaxed text-[var(--color-graphite)]">{{ docCopy(doc).issuedBy }}</dd>
            </div>
            <div>
              <dt class="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--color-slate-muted)]">{{ text.labels.date }}</dt>
              <dd class="mt-1 font-semibold text-[var(--color-graphite)]">{{ docCopy(doc).date }}</dd>
            </div>
          </div>
        </dl>

        <div class="mt-4 grid gap-2 sm:grid-cols-2">
          <el-button
            tag="a"
            :href="localePath(doc.href)"
            :target="doc.requestOnly ? undefined : '_blank'"
            :rel="doc.requestOnly ? undefined : 'noopener'"
            color="#1b3c63"
            class="!ml-0 !w-full"
          >
            <el-icon><Message v-if="doc.requestOnly" /><View v-else /></el-icon>
            <span>{{ docCopy(doc).viewLabel }}</span>
          </el-button>
          <el-button
            v-if="doc.downloadLabel"
            tag="a"
            :href="localePath(doc.href)"
            :download="doc.filename"
            plain
            class="!ml-0 !w-full"
          >
            <el-icon><Download /></el-icon>
            <span>{{ docCopy(doc).downloadLabel }}</span>
          </el-button>
        </div>
      </article>
    </div>
  </div>
</template>
