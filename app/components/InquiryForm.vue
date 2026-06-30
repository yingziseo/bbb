<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const props = defineProps<{ defaultProduct?: string }>()

const formRef = ref<FormInstance>()
const submitting = ref(false)

const form = reactive({
  name: '',
  company: '',
  email: '',
  country: '',
  product: props.defaultProduct || '',
  quantity: '',
  message: '',
  website: '',
})

watch(
  () => props.defaultProduct,
  (v) => {
    if (v) form.product = v
  },
)

const rules: FormRules = {
  name: [{ required: true, message: 'Please enter your name', trigger: 'blur' }],
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' },
  ],
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
    ElMessage.success('Inquiry received.')
    el.resetFields()
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
      <el-form-item label="Company">
        <el-input v-model="form.company" size="large" placeholder="Company name" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" size="large" placeholder="you@company.com" />
      </el-form-item>
      <el-form-item label="Country / Region">
        <el-input v-model="form.country" size="large" placeholder="e.g. United States" />
      </el-form-item>
      <el-form-item label="Product" prop="product">
        <el-input v-model="form.product" size="large" placeholder="Product name or category" />
      </el-form-item>
      <el-form-item label="Estimated Quantity">
        <el-input v-model="form.quantity" size="large" placeholder="e.g. 50,000 pcs / 1 x 40HQ" />
      </el-form-item>
    </div>

    <el-form-item label="Requirement Details" prop="message">
      <el-input
        v-model="form.message"
        type="textarea"
        :rows="4"
        placeholder="Sizes, material, quantity, printing, or other requirements."
      />
    </el-form-item>

    <input v-model="form.website" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true" />

    <div class="flex flex-wrap gap-3 pt-1">
      <el-button color="#c1121f" size="large" native-type="button" :loading="submitting" @click="submit(formRef)">
        Send Inquiry
      </el-button>
      <el-button size="large" native-type="button" plain @click="formRef?.resetFields()">Reset</el-button>
    </div>
  </el-form>
</template>
