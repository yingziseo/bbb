<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { Promotion } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{ defaultProduct?: string }>()
const { text } = useLocale()

const formRef = ref<FormInstance>()
const submitting = ref(false)

const countryOptions = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Singapore',
  'Malaysia',
  'Thailand',
  'Vietnam',
  'Indonesia',
  'Philippines',
  'United Arab Emirates',
  'Saudi Arabia',
  'Germany',
  'France',
  'Netherlands',
  'Spain',
  'Italy',
  'Mexico',
  'Brazil',
  'South Africa',
]

const messagePlaceholder = computed(() =>
  props.defaultProduct
    ? text.value.form.productMessagePlaceholder.replace('{product}', props.defaultProduct)
    : text.value.form.messagePlaceholder,
)

const form = reactive({
  name: '',
  email: '',
  country: '',
  message: props.defaultProduct ? `${text.value.form.productMessage.replace('{product}', props.defaultProduct)}\n` : '',
})

watch(
  () => props.defaultProduct,
  (v) => {
    if (v && !form.message.trim()) {
      form.message = `${text.value.form.productMessage.replace('{product}', v)}\n`
    }
  },
)

const rules = computed<FormRules>(() => ({
  name: [{ required: true, message: text.value.form.validationName, trigger: 'blur' }],
  email: [
    { required: true, message: text.value.form.validationEmail, trigger: 'blur' },
    { type: 'email', message: text.value.form.validationEmailValid, trigger: 'blur' },
  ],
  country: [{ required: true, message: text.value.form.validationCountry, trigger: 'change' }],
  message: [{ required: true, message: text.value.form.validationMessage, trigger: 'blur' }],
}))

const submit = async (el?: FormInstance) => {
  if (!el || submitting.value) return

  try {
    await el.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    await $fetch('/api/inquiries', {
      method: 'POST',
      body: form,
    })
    ElMessage.success(text.value.form.success)
    el.resetFields()
    form.message = props.defaultProduct ? `${text.value.form.productMessage.replace('{product}', props.defaultProduct)}\n` : ''
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || text.value.form.error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-position="top"
    require-asterisk-position="right"
    @submit.prevent
  >
    <div class="grid gap-x-5 sm:grid-cols-2">
      <el-form-item :label="text.form.fullName" prop="name">
        <el-input v-model="form.name" size="large" :placeholder="text.form.namePlaceholder" />
      </el-form-item>
      <el-form-item :label="text.form.email" prop="email">
        <el-input v-model="form.email" size="large" :placeholder="text.form.emailPlaceholder" />
      </el-form-item>
      <el-form-item :label="text.form.country" prop="country" class="sm:col-span-2">
        <el-select
          v-model="form.country"
          size="large"
          filterable
          allow-create
          default-first-option
          :placeholder="text.form.countryPlaceholder"
          class="w-full"
        >
          <el-option v-for="country in countryOptions" :key="country" :label="country" :value="country" />
        </el-select>
      </el-form-item>
    </div>

    <el-form-item :label="text.form.requirement" prop="message">
      <el-input
        v-model="form.message"
        type="textarea"
        :rows="3"
        :placeholder="messagePlaceholder"
      />
    </el-form-item>

    <div class="pt-1">
      <el-button color="#c1121f" size="large" native-type="button" class="w-full sm:!w-auto" :loading="submitting" @click="submit(formRef)">
        <el-icon><Promotion /></el-icon>
        <span>{{ text.form.submit }}</span>
      </el-button>
    </div>
  </el-form>
</template>
