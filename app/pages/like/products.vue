<script setup lang="ts">
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

definePageMeta({ layout: 'admin' })
useHead({ title: '产品管理 | YIYUAN' })

type CategoryForm = {
  id?: number
  slug: string
  name: string
  description: string
  image: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  canonical: string
  sortOrder: number
  enabled: boolean
}

type ProductForm = {
  id?: number
  categoryId: number | null
  slug: string
  name: string
  shortDesc: string
  image: string
  material: string
  moq: string
  custom: boolean
  packaging: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  canonical: string
  specs: Array<{ label: string; value: string }>
  sizeOptions: Array<{ label: string; value: string; packaging: string }>
  applications: string[]
  sortOrder: number
  status: 'draft' | 'published'
}

type CategoryItem = CategoryForm & {
  id: number
  productCount: number
}

type ProductItem = ProductForm & {
  id: number
  category: string
  categorySlug: string
  categoryId: number
}

const activeTab = ref('products')
const categoryDialog = ref(false)
const productDialog = ref(false)
const categorySaving = ref(false)
const productSaving = ref(false)
const uploadLoading = ref('')

const productQuery = reactive({
  q: '',
  categoryId: '',
  status: '',
})

const { data: categoryData, pending: categoryPending, refresh: refreshCategories } = await useFetch<{ items: CategoryItem[] }>('/api/admin/product-categories')
const { data: productData, pending: productPending, refresh: refreshProducts } = await useFetch<{ items: ProductItem[] }>('/api/admin/products', {
  query: productQuery,
})

const emptyCategory = (): CategoryForm => ({
  slug: '',
  name: '',
  description: '',
  image: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  canonical: '',
  sortOrder: 0,
  enabled: true,
})

const emptyProduct = (): ProductForm => ({
  categoryId: (categoryData.value?.items?.[0] as any)?.id || null,
  slug: '',
  name: '',
  shortDesc: '',
  image: '',
  material: '食品级牛皮纸 + PE 涂层',
  moq: '10,000 件',
  custom: true,
  packaging: '每箱200个，每托盘50箱',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  canonical: '',
  specs: [
    { label: '材料', value: '食品级牛皮纸 + PE 涂层' },
    { label: '用途', value: '外卖、餐饮打包、食品配送' },
  ],
  sizeOptions: [
    { label: '500ml', value: '170x120x45mm', packaging: '300个/箱' },
    { label: '750ml', value: '190x140x50mm', packaging: '200个/箱' },
    { label: '1000ml', value: '210x160x55mm', packaging: '200个/箱' },
  ],
  applications: ['外卖餐厅', '食品配送', '餐饮打包'],
  sortOrder: 0,
  status: 'published',
})

const categoryForm = reactive<CategoryForm>(emptyCategory())
const productForm = reactive<ProductForm>(emptyProduct())

const resetCategoryForm = (item?: any) => {
  Object.assign(categoryForm, emptyCategory(), item || {})
}

const resetProductForm = (item?: any) => {
  Object.assign(productForm, emptyProduct(), {
    ...item,
    categoryId: item?.categoryId || item?.category_id || emptyProduct().categoryId,
    specs: item?.specs?.length ? item.specs.map((row: any) => ({ label: row.label || '', value: row.value || '' })) : emptyProduct().specs,
    sizeOptions: item?.sizeOptions?.length
      ? item.sizeOptions.map((row: any) => ({
          label: row.label || '',
          value: row.value || '',
          packaging: row.packaging || '',
        }))
      : emptyProduct().sizeOptions,
    applications: item?.applications?.length ? [...item.applications] : emptyProduct().applications,
  })
}

const openNewCategory = () => {
  resetCategoryForm()
  categoryDialog.value = true
}

const openEditCategory = (item: any) => {
  resetCategoryForm(item)
  categoryDialog.value = true
}

const openNewProduct = () => {
  resetProductForm()
  productDialog.value = true
}

const openEditProduct = async (item: any) => {
  const result = await $fetch<{ item: any }>(`/api/admin/products/${item.id}`)
  resetProductForm(result.item)
  productDialog.value = true
}

const saveCategory = async () => {
  categorySaving.value = true
  try {
    const path = categoryForm.id ? `/api/admin/product-categories/${categoryForm.id}` : '/api/admin/product-categories'
    await $fetch(path, {
      method: categoryForm.id ? 'PUT' : 'POST',
      body: categoryForm,
    })
    ElMessage.success('分类已保存')
    categoryDialog.value = false
    await refreshCategories()
    await refreshProducts()
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '保存失败')
  } finally {
    categorySaving.value = false
  }
}

const saveProduct = async () => {
  productSaving.value = true
  try {
    const path = productForm.id ? `/api/admin/products/${productForm.id}` : '/api/admin/products'
    await $fetch(path, {
      method: productForm.id ? 'PUT' : 'POST',
      body: productForm,
    })
    ElMessage.success('产品已保存')
    productDialog.value = false
    await refreshProducts()
    await refreshCategories()
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '保存失败')
  } finally {
    productSaving.value = false
  }
}

const removeCategory = async (item: any) => {
  try {
    await ElMessageBox.confirm(`确定删除分类「${item.name}」吗？`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await $fetch(`/api/admin/product-categories/${item.id}`, { method: 'DELETE' })
    ElMessage.success('分类已删除')
    await refreshCategories()
  } catch (error: any) {
    if (error === 'cancel') return
    ElMessage.error(error?.data?.message || error?.statusMessage || '删除失败')
  }
}

const removeProduct = async (item: any) => {
  try {
    await ElMessageBox.confirm(`确定删除产品「${item.name}」吗？删除后不可恢复。`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await $fetch(`/api/admin/products/${item.id}`, { method: 'DELETE' })
    ElMessage.success('产品已删除')
    await refreshProducts()
    await refreshCategories()
  } catch (error: any) {
    if (error === 'cancel') return
    ElMessage.error(error?.data?.message || error?.statusMessage || '删除失败')
  }
}

const uploadImage = async (option: any, target: 'category' | 'product') => {
  uploadLoading.value = target
  try {
    const body = new FormData()
    body.append('file', option.file)
    const result = await $fetch<{ path: string }>('/api/admin/uploads', { method: 'POST', body })
    if (target === 'category') categoryForm.image = result.path
    if (target === 'product') productForm.image = result.path
    ElMessage.success('图片已上传')
  } catch (error: any) {
    ElMessage.error(error?.data?.message || error?.statusMessage || '上传失败')
  } finally {
    uploadLoading.value = ''
  }
}

const addSpec = () => productForm.specs.push({ label: '', value: '' })
const removeSpec = (index: number) => productForm.specs.splice(index, 1)
const addSizeOption = () => productForm.sizeOptions.push({ label: '', value: '', packaging: '' })
const removeSizeOption = (index: number) => productForm.sizeOptions.splice(index, 1)
const addApplication = () => productForm.applications.push('')
const removeApplication = (index: number) => productForm.applications.splice(index, 1)
const refreshAll = async () => {
  await Promise.all([refreshCategories(), refreshProducts()])
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-[26px] font-extrabold text-[var(--color-navy)]">产品管理</h1>
        <p class="mt-2 text-[14px] text-[var(--color-slate-muted)]">维护产品分类、产品信息、规格尺寸、图片和发布状态。</p>
      </div>
      <div class="flex gap-3">
        <el-button :loading="categoryPending || productPending" @click="refreshAll">刷新</el-button>
        <el-button color="#c1121f" @click="openNewProduct">
          <el-icon class="mr-1"><Plus /></el-icon>
          新增产品
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" type="border-card" class="admin-products-tabs">
      <el-tab-pane label="产品列表" name="products">
        <div class="mb-4 flex flex-wrap gap-3">
          <el-input v-model="productQuery.q" placeholder="搜索产品名、slug 或材料" class="w-full sm:!w-[260px]" clearable @change="refreshProducts" />
          <el-select v-model="productQuery.categoryId" placeholder="分类" class="w-full sm:!w-[180px]" clearable @change="refreshProducts">
            <el-option v-for="item in categoryData?.items || []" :key="item.id" :label="item.name" :value="String(item.id)" />
          </el-select>
          <el-select v-model="productQuery.status" placeholder="状态" class="w-full sm:!w-[140px]" clearable @change="refreshProducts">
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
          </el-select>
          <el-button :loading="productPending" @click="refreshProducts">查询</el-button>
        </div>

        <div class="border border-[var(--color-line)] bg-white">
          <el-table :data="productData?.items || []" stripe>
            <el-table-column label="图片" width="110">
              <template #default="{ row }">
                <img v-if="row.image" :src="row.image" alt="" class="h-14 w-20 border border-[var(--color-line)] object-cover" />
                <span v-else class="text-[12px] text-[var(--color-slate-muted)]">无图片</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="产品" min-width="220" show-overflow-tooltip />
            <el-table-column prop="category" label="分类" width="130" />
            <el-table-column prop="material" label="材料" min-width="180" show-overflow-tooltip />
            <el-table-column prop="moq" label="MOQ" width="130" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'published' ? 'success' : 'info'" effect="plain" class="!rounded-none">
                  {{ row.status === 'published' ? '已发布' : '草稿' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <div class="flex gap-2">
                  <el-button size="small" color="#0f2a4a" @click="openEditProduct(row)">
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button size="small" type="danger" plain @click="removeProduct(row)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="产品分类" name="categories">
        <div class="mb-4 flex justify-end">
          <el-button color="#c1121f" @click="openNewCategory">
            <el-icon class="mr-1"><Plus /></el-icon>
            新增分类
          </el-button>
        </div>

        <div class="border border-[var(--color-line)] bg-white">
          <el-table :data="categoryData?.items || []" stripe>
            <el-table-column label="图片" width="110">
              <template #default="{ row }">
                <img v-if="row.image" :src="row.image" alt="" class="h-14 w-20 border border-[var(--color-line)] object-cover" />
                <span v-else class="text-[12px] text-[var(--color-slate-muted)]">无图片</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="分类名称" min-width="160" />
            <el-table-column prop="slug" label="Slug" min-width="180" />
            <el-table-column prop="productCount" label="产品数" width="100" />
            <el-table-column prop="sortOrder" label="排序" width="90" />
            <el-table-column label="启用" width="90">
              <template #default="{ row }">
                <el-tag :type="row.enabled ? 'success' : 'info'" effect="plain" class="!rounded-none">
                  {{ row.enabled ? '启用' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <div class="flex gap-2">
                  <el-button size="small" color="#0f2a4a" @click="openEditCategory(row)">
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button size="small" type="danger" plain @click="removeCategory(row)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="categoryDialog" :title="categoryForm.id ? '编辑分类' : '新增分类'" width="min(720px, 94vw)">
      <el-form label-position="top">
        <div class="grid gap-4 md:grid-cols-2">
          <el-form-item label="分类名称">
            <el-input v-model="categoryForm.name" placeholder="保鲜膜 / 一次性餐盒" />
          </el-form-item>
          <el-form-item label="Slug">
            <el-input v-model="categoryForm.slug" placeholder="cling-film" />
          </el-form-item>
          <el-form-item label="分类描述" class="md:col-span-2">
            <el-input v-model="categoryForm.description" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="分类图片">
            <div class="flex w-full flex-col gap-3">
              <el-input v-model="categoryForm.image" placeholder="/images/cat-film.webp" />
              <img v-if="categoryForm.image" :src="categoryForm.image" alt="" class="h-32 w-full border border-[var(--color-line)] object-cover" />
              <el-upload :show-file-list="false" :http-request="(option: any) => uploadImage(option, 'category')" accept="image/*">
                <el-button :loading="uploadLoading === 'category'">上传图片</el-button>
              </el-upload>
            </div>
          </el-form-item>
          <section class="md:col-span-2 border border-[var(--color-line)] p-4">
            <h3 class="mb-3 text-[15px] font-bold text-[var(--color-navy)]">分类 SEO</h3>
            <div class="grid gap-4 md:grid-cols-2">
              <el-form-item label="SEO Title">
                <el-input v-model="categoryForm.seoTitle" maxlength="80" show-word-limit placeholder="留空则根据分类名称自动生成" />
              </el-form-item>
              <el-form-item label="SEO Keywords">
                <el-input v-model="categoryForm.seoKeywords" placeholder="关键词用英文逗号分隔" />
              </el-form-item>
              <el-form-item label="SEO Description" class="md:col-span-2">
                <el-input v-model="categoryForm.seoDescription" type="textarea" :rows="3" maxlength="180" show-word-limit placeholder="留空则使用分类描述" />
              </el-form-item>
              <el-form-item label="Canonical" class="md:col-span-2">
                <el-input v-model="categoryForm.canonical" placeholder="可留空，或填写绝对 URL" />
              </el-form-item>
            </div>
          </section>
          <div class="grid gap-4 sm:grid-cols-2">
            <el-form-item label="排序">
              <el-input-number v-model="categoryForm.sortOrder" :min="0" controls-position="right" class="!w-full" />
            </el-form-item>
            <el-form-item label="启用">
              <el-switch v-model="categoryForm.enabled" />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="categoryDialog = false">取消</el-button>
        <el-button color="#c1121f" :loading="categorySaving" @click="saveCategory">保存分类</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="productDialog" :title="productForm.id ? '编辑产品' : '新增产品'" width="min(1040px, 94vw)" class="product-dialog">
      <el-form label-position="top">
        <div class="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div>
            <div class="grid gap-4 md:grid-cols-2">
              <el-form-item label="产品名称">
                <el-input v-model="productForm.name" placeholder="Kraft Paper Meal Box" />
              </el-form-item>
              <el-form-item label="Slug">
                <el-input v-model="productForm.slug" placeholder="kraft-meal-box" />
              </el-form-item>
              <el-form-item label="所属分类">
                <el-select v-model="productForm.categoryId" class="w-full" placeholder="选择分类">
                  <el-option v-for="item in categoryData?.items || []" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="productForm.status" class="w-full">
                  <el-option label="已发布" value="published" />
                  <el-option label="草稿" value="draft" />
                </el-select>
              </el-form-item>
              <el-form-item label="简短描述" class="md:col-span-2">
                <el-input v-model="productForm.shortDesc" type="textarea" :rows="3" maxlength="220" show-word-limit />
              </el-form-item>
              <el-form-item label="材料">
                <el-input v-model="productForm.material" placeholder="食品级牛皮纸 + PE 涂层" />
              </el-form-item>
              <el-form-item label="最小起订量">
                <el-input v-model="productForm.moq" placeholder="10,000 件" />
              </el-form-item>
              <el-form-item label="包装">
                <el-input v-model="productForm.packaging" placeholder="每箱200个，每托盘50箱" />
              </el-form-item>
              <el-form-item label="排序">
                <el-input-number v-model="productForm.sortOrder" :min="0" controls-position="right" class="!w-full" />
              </el-form-item>
              <el-form-item label="可定制">
                <el-switch v-model="productForm.custom" active-text="可提供定制生产服务" />
              </el-form-item>
            </div>

            <section class="mt-5 border border-[var(--color-line)] p-4">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="text-[15px] font-bold text-[var(--color-navy)]">规格参数</h3>
                <el-button size="small" plain @click="addSpec">新增规格</el-button>
              </div>
              <div class="space-y-3">
                <div v-for="(row, index) in productForm.specs" :key="index" class="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <el-input v-model="row.label" placeholder="参数名，如 材料" />
                  <el-input v-model="row.value" placeholder="参数值，如 食品级牛皮纸 + PE 涂层" />
                  <el-button type="danger" plain @click="removeSpec(index)">删除</el-button>
                </div>
              </div>
            </section>

            <section class="mt-5 border border-[var(--color-line)] p-4">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="text-[15px] font-bold text-[var(--color-navy)]">规格尺寸选项</h3>
                <el-button size="small" plain @click="addSizeOption">新增尺寸</el-button>
              </div>
              <div class="space-y-3">
                <div v-for="(row, index) in productForm.sizeOptions" :key="index" class="grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
                  <el-input v-model="row.label" placeholder="容量/规格，如 750ml 或 450mm x 500m" />
                  <el-input v-model="row.value" placeholder="尺寸/厚度，如 190x140x50mm 或 8-12微米" />
                  <el-input v-model="row.packaging" placeholder="包装，如 200个/箱" />
                  <el-button type="danger" plain @click="removeSizeOption(index)">删除</el-button>
                </div>
              </div>
            </section>

            <section class="mt-5 border border-[var(--color-line)] p-4">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="text-[15px] font-bold text-[var(--color-navy)]">应用场景</h3>
                <el-button size="small" plain @click="addApplication">新增场景</el-button>
              </div>
              <div class="space-y-3">
                <div v-for="(_, index) in productForm.applications" :key="index" class="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <el-input v-model="productForm.applications[index]" placeholder="外卖餐厅 / 食品配送 / 超市生鲜" />
                  <el-button type="danger" plain @click="removeApplication(index)">删除</el-button>
                </div>
              </div>
            </section>
          </div>

          <aside class="space-y-5">
            <div class="border border-[var(--color-line)] p-4">
              <h3 class="mb-3 text-[15px] font-bold text-[var(--color-navy)]">产品图片</h3>
              <div class="flex w-full flex-col gap-3">
                <el-input v-model="productForm.image" placeholder="/uploads/product.png" />
                <img v-if="productForm.image" :src="productForm.image" alt="" class="h-44 w-full border border-[var(--color-line)] object-cover" />
                <el-upload :show-file-list="false" :http-request="(option: any) => uploadImage(option, 'product')" accept="image/*">
                  <el-button :loading="uploadLoading === 'product'">上传图片</el-button>
                </el-upload>
              </div>
            </div>
            <div class="border border-[var(--color-line)] bg-[var(--color-panel)] p-4 text-[13px] leading-relaxed text-[var(--color-slate-muted)]">
              <div class="font-semibold text-[var(--color-navy)]">录入提示</div>
              <p class="mt-2">一次性餐盒常用字段：容量、尺寸、材料、涂层、是否可微波、防油防漏、每箱数量。</p>
              <p class="mt-2">保鲜膜常用字段：材料、宽度、厚度、卷长、纸芯、粘性、透明度、包装方式。</p>
            </div>
            <div class="border border-[var(--color-line)] p-4">
              <h3 class="mb-3 text-[15px] font-bold text-[var(--color-navy)]">产品 SEO</h3>
              <el-form-item label="SEO Title">
                <el-input v-model="productForm.seoTitle" maxlength="80" show-word-limit placeholder="留空则根据产品名称自动生成" />
              </el-form-item>
              <el-form-item label="SEO Description">
                <el-input v-model="productForm.seoDescription" type="textarea" :rows="3" maxlength="180" show-word-limit placeholder="留空则使用简短描述" />
              </el-form-item>
              <el-form-item label="SEO Keywords">
                <el-input v-model="productForm.seoKeywords" placeholder="关键词用英文逗号分隔" />
              </el-form-item>
              <el-form-item label="Canonical">
                <el-input v-model="productForm.canonical" placeholder="可留空，或填写绝对 URL" />
              </el-form-item>
            </div>
          </aside>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="productDialog = false">取消</el-button>
        <el-button color="#c1121f" :loading="productSaving" @click="saveProduct">保存产品</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.admin-products-tabs :deep(.el-tabs__content) {
  padding: 18px;
}

.product-dialog :deep(.el-dialog__body) {
  max-height: min(72vh, 760px);
  overflow: auto;
}
</style>
