<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { categories } from '~/data/site'

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
  product: [{ required: true, message: 'Please select a product category', trigger: 'change' }],
  message: [{ required: true, message: 'Please describe your requirement', trigger: 'blur' }],
}

const submit = async (el?: FormInstance) => {
  if (!el) return
  await el.validate((valid) => {
    if (!valid) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      ElMessage.success('Inquiry received.')
      el.resetFields()
    }, 700)
  })
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
        <el-select v-model="form.product" size="large" placeholder="Select product" class="w-full">
          <el-option v-for="c in categories" :key="c.slug" :label="c.name" :value="c.name" />
          <el-option label="Other / Custom" value="Other / Custom" />
        </el-select>
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

    <div class="flex flex-wrap gap-3 pt-1">
      <el-button color="#c1121f" size="large" :loading="submitting" @click="submit(formRef)">
        Send Inquiry
      </el-button>
      <el-button size="large" plain @click="formRef?.resetFields()">Reset</el-button>
    </div>
  </el-form>
</template>
