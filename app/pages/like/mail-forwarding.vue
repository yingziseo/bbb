<script setup lang="ts">
import { ElMessage } from 'element-plus'

definePageMeta({ layout: 'admin' })
useHead({ title: '转发管理 | YIYUAN' })

type MailSettings = {
  enabled: boolean
  to: string
  fromName: string
  fromEmail: string
  subjectPrefix: string
  defaultContactEmail: string
  provider: string
  apiKeyConfigured: boolean
}

const createEmptyForm = (): MailSettings => ({
  enabled: true,
  to: '',
  fromName: 'YIYUAN Website',
  fromEmail: 'inquiry@yiyuanpack.com',
  subjectPrefix: '[YIYUAN Inquiry]',
  defaultContactEmail: '',
  provider: 'resend',
  apiKeyConfigured: false,
})

const { data, pending, refresh } = await useFetch<{ settings: MailSettings }>('/api/admin/mail-settings')
const saving = ref(false)
const testing = ref(false)
const form = reactive<MailSettings>(createEmptyForm())

const applySettings = (settings?: Partial<MailSettings>) => {
  Object.assign(form, createEmptyForm(), settings || {})
}

applySettings(data.value?.settings)

watch(
  () => data.value?.settings,
  (settings) => applySettings(settings),
)

const useContactEmail = () => {
  form.to = form.defaultContactEmail
}

const saveSettings = async (showSuccess = true) => {
  saving.value = true
  try {
    const result = await $fetch<{ settings: MailSettings }>('/api/admin/mail-settings', {
      method: 'PUT',
      body: form,
    })
    applySettings(result.settings)
    if (showSuccess) {
      ElMessage.success('转发设置已保存')
    }
    await refresh()
    return true
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '保存失败')
    return false
  } finally {
    saving.value = false
  }
}

const save = async () => {
  await saveSettings()
}

const sendTest = async () => {
  testing.value = true
  try {
    const saved = await saveSettings(false)
    if (!saved) return

    const result = await $fetch<{ result: { status: string; error?: string } }>('/api/admin/mail-settings/test', {
      method: 'POST',
    })
    if (result.result.status === 'sent') {
      ElMessage.success('设置已保存，测试邮件已发送')
    } else {
      ElMessage.warning(result.result.error || `设置已保存，测试结果：${result.result.status}`)
    }
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '测试失败')
  } finally {
    testing.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-[26px] font-extrabold text-[var(--color-navy)]">转发管理</h1>
        <p class="mt-2 text-[14px] text-[var(--color-slate-muted)]">设置客户询盘提交后自动转发到哪个邮箱，以及邮件转发服务状态。</p>
      </div>
      <div class="flex gap-3">
        <el-button :loading="pending" @click="refresh">刷新</el-button>
        <el-button color="#c1121f" :loading="saving" @click="save">保存设置</el-button>
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section class="border border-[var(--color-line)] bg-white p-5 sm:p-6">
        <h2 class="mb-5 text-[18px] font-extrabold text-[var(--color-navy)]">邮件自动转发</h2>
        <el-form label-position="top">
          <div class="grid gap-4 md:grid-cols-2">
            <el-form-item label="开启自动转发">
              <el-switch v-model="form.enabled" active-text="开启" inactive-text="关闭" />
            </el-form-item>

            <el-form-item label="服务商">
              <el-input :model-value="form.provider" disabled />
            </el-form-item>

            <el-form-item label="转发收件邮箱" class="md:col-span-2">
              <div class="flex w-full flex-col gap-2 sm:flex-row">
                <el-input v-model="form.to" placeholder="默认使用网站联系邮箱" />
                <el-button plain @click="useContactEmail">使用网站联系邮箱</el-button>
              </div>
              <p class="mt-2 text-[12px] text-[var(--color-slate-muted)]">当前网站联系邮箱：{{ form.defaultContactEmail || '-' }}</p>
            </el-form-item>

            <el-form-item label="发件人名称">
              <el-input v-model="form.fromName" placeholder="YIYUAN Website" />
            </el-form-item>

            <el-form-item label="发件邮箱">
              <el-input v-model="form.fromEmail" placeholder="inquiry@yiyuanpack.com" />
            </el-form-item>

            <el-form-item label="邮件标题前缀" class="md:col-span-2">
              <el-input v-model="form.subjectPrefix" placeholder="[YIYUAN Inquiry]" />
            </el-form-item>
          </div>
        </el-form>
      </section>

      <aside class="space-y-5">
        <section class="border border-[var(--color-line)] bg-white p-5">
          <h2 class="mb-4 text-[17px] font-bold text-[var(--color-navy)]">服务状态</h2>
          <div class="space-y-3 text-[14px] text-[var(--color-graphite)]">
            <div>自动转发：{{ form.enabled ? '已开启' : '已关闭' }}</div>
            <div>API Key：{{ form.apiKeyConfigured ? '已配置' : '未配置' }}</div>
            <div>收件邮箱：{{ form.to || '-' }}</div>
            <div>发件邮箱：{{ form.fromEmail || '-' }}</div>
          </div>
          <el-button class="mt-5 w-full" color="#0f2a4a" :loading="testing" @click="sendTest">发送测试邮件</el-button>
        </section>

        <section class="border border-[var(--color-line)] bg-white p-5">
          <h2 class="mb-4 text-[17px] font-bold text-[var(--color-navy)]">说明</h2>
          <p class="text-[14px] leading-relaxed text-[var(--color-slate-muted)]">
            客户询盘仍然完整保存在“客户询盘”里。这里仅控制是否把新询盘自动转发到指定邮箱；发送失败会由服务器定时任务自动重试。
          </p>
        </section>
      </aside>
    </div>
  </div>
</template>
