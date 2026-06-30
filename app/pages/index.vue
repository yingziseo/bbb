<script setup lang="ts">
import {
  CircleCheck,
  Check,
  ArrowRight,
  Message,
  Phone,
  Location,
} from '@element-plus/icons-vue'
import { products, company } from '~/data/site'

const categoryCards = [
  {
    name: 'Disposable Containers',
    desc: 'Meal boxes, bento containers, and takeaway packaging.',
    image: '/images/cat-containers.png',
    slug: 'disposable-containers',
  },
  {
    name: 'Cling Film & Fresh Wrap',
    desc: 'PE and PVC film for food wrapping and export supply.',
    image: '/images/cat-film.png',
    slug: 'cling-film',
  },
  {
    name: 'Food Packaging Containers',
    desc: 'PET, PP, and bagasse containers for food service use.',
    image: '/images/cat-food.png',
    slug: 'food-containers',
  },
  {
    name: 'Custom Packaging',
    desc: 'Printed boxes, cups, and custom packaging orders.',
    image: '/images/cat-custom.png',
    slug: 'custom-packaging',
  },
]

const stats = [
  { value: '2023', suffix: '', label: 'Established' },
  { value: '1', suffix: 'M RMB', label: 'Capital' },
  { value: '5,000', suffix: 't', label: 'PVC Phase I' },
]

const capabilities = [
  { title: 'Shangqiu Base', desc: 'Registered in Shangqiu, Henan, China.' },
  { title: 'Material Focus', desc: 'Cling film, fresh wrap, and packaging materials.' },
  { title: 'OEM Orders', desc: 'Custom orders and export contact.' },
  { title: 'Public Facts', desc: '2023 registration and 5,000-ton PVC Phase I notice.' },
]

const quality = [
  'Food-grade raw materials',
  'Incoming and pre-shipment inspection',
  'ISO-based quality management',
  'Third-party lab testing available on request',
]

const featured = products.slice(0, 4)
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="bg-[var(--color-navy)] text-white">
      <div class="container-x grid lg:grid-cols-2 gap-10 lg:gap-12 py-14 lg:py-20 items-center">
        <div>
          <span class="inline-block text-[12px] font-bold uppercase tracking-[0.16em] text-white/70 border-l-3 border-[var(--color-accent)] pl-3">
            Shangqiu, Henan, China
          </span>
          <h1 class="mt-5 text-[clamp(30px,4.4vw,46px)] font-extrabold leading-[1.12] tracking-tight text-balance">
            Cling Film and Food Packaging for OEM Orders
          </h1>
          <p class="mt-5 text-[17px] leading-relaxed text-white/80 max-w-xl">
            Custom cling film, fresh wrap, and food packaging for wholesale and OEM supply.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/contact">
              <el-button color="#c1121f" size="large">
                Get a Quote
                <el-icon class="ml-1"><ArrowRight /></el-icon>
              </el-button>
            </NuxtLink>
            <el-button tag="a" :href="company.whatsappLink" target="_blank" size="large" color="#1b3c63">
              Contact on WhatsApp
            </el-button>
          </div>
          <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13.5px] text-white/70">
            <span class="flex items-center gap-1.5"><el-icon><Check /></el-icon>Cling film</span>
            <span class="flex items-center gap-1.5"><el-icon><Check /></el-icon>OEM orders</span>
            <span class="flex items-center gap-1.5"><el-icon><Check /></el-icon>Export contact</span>
          </div>
        </div>

        <div class="relative">
          <div class="aspect-[4/3] overflow-hidden border border-white/10">
            <img :src="`/images/hero-factory.png`" alt="Food packaging production line inside our factory" class="h-full w-full object-cover" />
          </div>
          <div class="absolute -bottom-5 left-5 right-5 grid grid-cols-3 overflow-hidden border border-[var(--color-line)] bg-white text-[var(--color-navy)]">
            <div class="p-4 text-center border-r border-[var(--color-line)]">
              <div class="text-[22px] font-extrabold">2023</div>
              <div class="text-[11px] uppercase tracking-wide text-[var(--color-slate-muted)]">Established</div>
            </div>
            <div class="p-4 text-center border-r border-[var(--color-line)]">
              <div class="text-[22px] font-extrabold">1M</div>
              <div class="text-[11px] uppercase tracking-wide text-[var(--color-slate-muted)]">RMB Capital</div>
            </div>
            <div class="p-4 text-center">
              <div class="text-[22px] font-extrabold">5,000t</div>
              <div class="text-[11px] uppercase tracking-wide text-[var(--color-slate-muted)]">PVC Phase I</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRODUCT CATEGORIES -->
    <section class="section bg-white">
      <div class="container-x">
        <SectionHeading
          eyebrow="Product Range"
          title="Product Categories"
          subtitle="Main packaging lines."
        />
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="c in categoryCards"
            :key="c.slug"
            :to="`/products?category=${c.slug}`"
            class="group flex flex-col overflow-hidden border border-[var(--color-line)] bg-white"
          >
            <div class="aspect-[4/3] overflow-hidden bg-[var(--color-panel)]">
              <img :src="c.image" :alt="c.name" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
            </div>
            <div class="p-5">
              <h3 class="text-[16px] font-bold text-[var(--color-navy)] flex items-center justify-between">
                {{ c.name }}
                <el-icon class="text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight /></el-icon>
              </h3>
              <p class="mt-2 text-[13.5px] leading-relaxed text-[var(--color-slate-muted)]">{{ c.desc }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- PRODUCTION CAPACITY -->
    <section class="section bg-[var(--color-panel)] border-y border-[var(--color-line)]">
      <div class="container-x grid lg:grid-cols-2 gap-12 items-center">
        <div>
        <SectionHeading
          eyebrow="Factory Overview"
          title="Factory Overview"
          subtitle="Registered facts and basic company information."
        />
          <div class="mt-8 grid grid-cols-3 gap-px overflow-hidden border border-[var(--color-line)] bg-[var(--color-line)]">
            <div v-for="s in stats" :key="s.label" class="bg-white p-6">
              <div class="text-[30px] font-extrabold text-[var(--color-navy)] leading-none">
                {{ s.value }}<span class="text-[var(--color-accent)]">{{ s.suffix }}</span>
              </div>
              <div class="mt-2 text-[13px] uppercase tracking-wide text-[var(--color-slate-muted)]">{{ s.label }}</div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="cap in capabilities" :key="cap.title" class="border border-[var(--color-line)] bg-white p-5">
            <h4 class="text-[15px] font-bold text-[var(--color-navy)]">{{ cap.title }}</h4>
            <p class="mt-2 text-[13px] leading-relaxed text-[var(--color-slate-muted)]">{{ cap.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- EQUIPMENT & WORKSHOP -->
    <section class="section bg-white">
      <div class="container-x">
        <SectionHeading
          eyebrow="Factory"
          title="Workshop and Warehouse"
          subtitle="Extrusion, converting, and finished goods ready for shipment."
        />
        <div class="mt-10 grid gap-4 md:grid-cols-3">
          <div class="overflow-hidden border border-[var(--color-line)] md:row-span-2 md:col-span-2">
            <img :src="`/images/workshop-main.png`" alt="Main production workshop with injection molding lines" class="h-full w-full object-cover" />
          </div>
          <div class="aspect-[4/3] overflow-hidden border border-[var(--color-line)]">
            <img :src="`/images/workshop-equipment.png`" alt="Automated film extrusion equipment" class="h-full w-full object-cover" />
          </div>
          <div class="aspect-[4/3] overflow-hidden border border-[var(--color-line)]">
            <img :src="`/images/workshop-warehouse.png`" alt="Finished goods warehouse ready for export" class="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>

    <!-- CUSTOM / OEM -->
    <section class="section bg-[var(--color-navy)] text-white border-y border-white/10">
      <div class="container-x grid lg:grid-cols-2 gap-12 items-center">
        <div class="overflow-hidden border border-white/10 order-2 lg:order-1">
          <img :src="`/images/custom-oem.png`" alt="Custom printed packaging and OEM production samples" class="h-full w-full object-cover" />
        </div>
        <div class="order-1 lg:order-2">
          <SectionHeading
            eyebrow="Custom & OEM / ODM"
            title="Your brand, your specification, our production"
            subtitle="From custom sizes and printing to private-label packaging, we manufacture to your exact requirement with full tooling support."
            inverse
          />
          <ul class="mt-8 grid sm:grid-cols-2 gap-4">
            <li class="border border-white/12 bg-white/4 p-4 text-[14px] text-white/88">
              <div class="flex items-start gap-2">
                <el-icon class="mt-0.5 text-[var(--color-accent)]"><Check /></el-icon>
                <span>Custom sizes & shapes</span>
              </div>
            </li>
            <li class="border border-white/12 bg-white/4 p-4 text-[14px] text-white/88">
              <div class="flex items-start gap-2">
                <el-icon class="mt-0.5 text-[var(--color-accent)]"><Check /></el-icon>
                <span>Full-color logo printing</span>
              </div>
            </li>
            <li class="border border-white/12 bg-white/4 p-4 text-[14px] text-white/88">
              <div class="flex items-start gap-2">
                <el-icon class="mt-0.5 text-[var(--color-accent)]"><Check /></el-icon>
                <span>Private-label packaging</span>
              </div>
            </li>
            <li class="border border-white/12 bg-white/4 p-4 text-[14px] text-white/88">
              <div class="flex items-start gap-2">
                <el-icon class="mt-0.5 text-[var(--color-accent)]"><Check /></el-icon>
                <span>Custom die-cut tooling</span>
              </div>
            </li>
          </ul>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/contact">
              <el-button color="#c1121f" size="large">Request Custom Quote</el-button>
            </NuxtLink>
            <el-button tag="a" :href="company.whatsappLink" target="_blank" size="large" color="#1b3c63">
              Contact on WhatsApp
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED PRODUCTS -->
    <section class="section bg-white">
      <div class="container-x">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Selected Items" title="Featured Products" />
          <NuxtLink to="/products">
            <el-button plain>View All Products<el-icon class="ml-1"><ArrowRight /></el-icon></el-button>
          </NuxtLink>
        </div>
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="p in featured" :key="p.slug" :product="p" />
        </div>
      </div>
    </section>

    <!-- QUALITY -->
    <section class="section bg-[var(--color-panel)] border-y border-[var(--color-line)]">
      <div class="container-x grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeading
            eyebrow="Quality"
            title="Quality Control"
            subtitle="Main quality points."
          />
          <ul class="mt-8 space-y-4">
            <li v-for="q in quality" :key="q" class="flex items-start gap-3 border border-[var(--color-line)] bg-white p-4">
              <el-icon :size="20" class="text-[var(--color-accent)] mt-0.5"><CircleCheck /></el-icon>
              <span class="text-[15px] text-[var(--color-graphite)] leading-relaxed">{{ q }}</span>
            </li>
          </ul>
        </div>
        <div class="overflow-hidden border border-[var(--color-line)]">
          <img :src="`/images/quality-control.png`" alt="Quality control inspection of food containers" class="h-full w-full object-cover" />
        </div>
      </div>
    </section>

    <!-- CONTACT / QUOTE -->
    <section class="section bg-[var(--color-navy-dark)] text-white">
      <div class="container-x grid lg:grid-cols-[1.15fr_0.85fr] gap-8">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Get a Quote"
            subtitle="Send product details, size, quantity, and packaging requirements."
            inverse
          />
          <div class="mt-8 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3">
            <div class="bg-[var(--color-navy-dark)] p-5">
              <div class="flex items-center gap-2 text-white/70">
                <el-icon><Phone /></el-icon>
                <span class="text-[12px] uppercase tracking-wide">WhatsApp / Phone</span>
              </div>
              <div class="mt-3 text-[15px] font-semibold text-white">{{ company.phone }}</div>
            </div>
            <div class="bg-[var(--color-navy-dark)] p-5">
              <div class="flex items-center gap-2 text-white/70">
                <el-icon><Message /></el-icon>
                <span class="text-[12px] uppercase tracking-wide">Email</span>
              </div>
              <div class="mt-3 text-[15px] font-semibold text-white break-all">{{ company.email }}</div>
            </div>
            <div class="bg-[var(--color-navy-dark)] p-5">
              <div class="flex items-center gap-2 text-white/70">
                <el-icon><Location /></el-icon>
                <span class="text-[12px] uppercase tracking-wide">Location</span>
              </div>
              <div class="mt-3 text-[15px] font-semibold text-white">{{ company.location }}</div>
            </div>
          </div>
        </div>

        <div class="flex h-full flex-col border border-white/10 bg-white/4 p-8">
          <div class="min-h-[156px]">
            <div class="text-[12px] font-bold uppercase tracking-[0.14em] text-white/60">Get a Quote</div>
            <h3 class="mt-4 max-w-[12ch] text-[28px] font-extrabold leading-tight">Start Your Inquiry</h3>
            <p class="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-white/74">
              For fast handling, send product name, size, quantity, and custom requirements.
            </p>
          </div>
          <div class="mt-8 grid gap-3">
            <NuxtLink to="/contact" class="block w-full">
              <el-button color="#c1121f" size="large" class="w-full">Open Inquiry Form</el-button>
            </NuxtLink>
            <el-button tag="a" :href="company.whatsappLink" target="_blank" size="large" color="#1b3c63" class="w-full">
              Contact on WhatsApp
            </el-button>
            <el-button tag="a" :href="company.contactLink" size="large" plain class="w-full !border-white/16 !bg-transparent !text-white hover:!bg-white/6">
              Send Email
            </el-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
