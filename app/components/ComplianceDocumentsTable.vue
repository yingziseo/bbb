<script setup lang="ts">
import { Download, Message, View } from '@element-plus/icons-vue'
import type { BuyerDocument } from '~/data/documents'

defineProps<{
  documents: BuyerDocument[]
}>()
</script>

<template>
  <div class="overflow-hidden border border-[var(--color-line)] bg-white">
    <div class="table-scroll" style="--table-min-width: 960px">
      <table class="w-full border-collapse text-left">
        <thead class="bg-[var(--color-panel)]">
          <tr>
            <th class="px-4 py-3 text-[12px] font-extrabold uppercase text-[var(--color-navy)]">Document</th>
            <th class="px-4 py-3 text-[12px] font-extrabold uppercase text-[var(--color-navy)]">Applies To</th>
            <th class="px-4 py-3 text-[12px] font-extrabold uppercase text-[var(--color-navy)]">Standard / Regulation</th>
            <th class="px-4 py-3 text-[12px] font-extrabold uppercase text-[var(--color-navy)]">Issued By</th>
            <th class="px-4 py-3 text-[12px] font-extrabold uppercase text-[var(--color-navy)]">Date</th>
            <th class="px-4 py-3 text-[12px] font-extrabold uppercase text-[var(--color-navy)]">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in documents" :key="doc.document" class="border-t border-[var(--color-line)] align-top">
            <td class="px-4 py-4">
              <div class="text-[14.5px] font-extrabold text-[var(--color-navy)]">{{ doc.document }}</div>
              <div class="mt-1 text-[12.5px] font-semibold text-[var(--color-slate-muted)]">{{ doc.meta }}</div>
            </td>
            <td class="px-4 py-4 text-[13.5px] font-semibold leading-relaxed text-[var(--color-graphite)]">{{ doc.appliesTo }}</td>
            <td class="px-4 py-4 text-[13.5px] leading-relaxed text-[var(--color-graphite)]">{{ doc.standard }}</td>
            <td class="px-4 py-4 text-[13.5px] leading-relaxed text-[var(--color-graphite)]">{{ doc.issuedBy }}</td>
            <td class="px-4 py-4 text-[13.5px] font-semibold text-[var(--color-graphite)]">{{ doc.date }}</td>
            <td class="px-4 py-4">
              <div class="flex flex-wrap gap-2">
                <el-button
                  tag="a"
                  :href="doc.href"
                  :target="doc.requestOnly ? undefined : '_blank'"
                  :rel="doc.requestOnly ? undefined : 'noopener'"
                  color="#1b3c63"
                  size="small"
                  class="!ml-0"
                >
                  <el-icon><Message v-if="doc.requestOnly" /><View v-else /></el-icon>
                  <span>{{ doc.viewLabel }}</span>
                </el-button>
                <el-button
                  v-if="doc.downloadLabel"
                  tag="a"
                  :href="doc.href"
                  :download="doc.filename"
                  plain
                  size="small"
                  class="!ml-0"
                >
                  <el-icon><Download /></el-icon>
                  <span>{{ doc.downloadLabel }}</span>
                </el-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
