<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const props = defineProps<{ defaultProduct?: string }>()

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
    ? `Interested in ${props.defaultProduct}. Briefly tell us what you need.`
    : 'Briefly tell us what you need.',
)

const form = reactive({
  name: '',
  email: '',
  country: '',
  message: props.defaultProduct ? `I am interested in ${props.defaultProduct}.\n` : '',
})

watch(
  () => props.defaultProduct,
  (v) => {
    if (v && !form.message.trim()) {
      form.message = `I am interested in ${v}.\n`
    }
  },
)

const rules: FormRules = {
  name: [{ required: true, message: 'Please enter your name', trigger: 'blur' }],
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' },
  ],
  country: [{ required: true, message: 'Please choose your country or region', trigger: 'change' }],
  message: [{ required: true, message: 'Please describe your requirement', trigger: 'blur' }],
}

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
    ElMessage.success('Inquiry submitted.')
    el.resetFields()
    form.message = props.defaultProduct ? `I am interested in ${props.defaultProduct}.\n` : ''
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || 'Submission failed. Please try email or WhatsApp.')
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
      <el-form-item label="Full Name" prop="name">
        <el-input v-model="form.name" size="large" placeholder="Your name" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" size="large" placeholder="you@example.com" />
      </el-form-item>
      <el-form-item label="Country / Region" prop="country" class="sm:col-span-2">
        <el-select
          v-model="form.country"
          size="large"
          filterable
          allow-create
          default-first-option
          placeholder="Select or type your country"
          class="w-full"
        >
          <el-option v-for="country in countryOptions" :key="country" :label="country" :value="country" />
        </el-select>
      </el-form-item>
    </div>

    <el-form-item label="Requirement Details" prop="message">
      <el-input
        v-model="form.message"
        type="textarea"
        :rows="3"
        :placeholder="messagePlaceholder"
      />
    </el-form-item>

    <div class="pt-1">
      <el-button color="#c1121f" size="large" native-type="button" class="w-full sm:!w-auto" :loading="submitting" @click="submit(formRef)">
        Submit Inquiry
      </el-button>
    </div>
  </el-form>
</template>
