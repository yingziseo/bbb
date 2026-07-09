export type LocaleCode = 'en' | 'cn'

export type LanguageOption = {
  code: LocaleCode
  shortCode: string
  label: string
  nativeLabel: string
}

export const languageOptions: LanguageOption[] = [
  { code: 'en', shortCode: 'EN', label: 'English', nativeLabel: 'English' },
  { code: 'cn', shortCode: '中文', label: 'Chinese', nativeLabel: '中文' },
]

const cnPrefix = '/cn'

const splitPath = (value: string) => {
  const match = value.match(/^([^?#]*)(.*)$/)
  return {
    pathname: match?.[1] || '/',
    suffix: match?.[2] || '',
  }
}

const normalizePath = (value: string) => {
  const path = value.startsWith('/') ? value : `/${value}`
  if (path === '/') return path
  return path.replace(/\/+$/, '')
}

export const isExternalPath = (value: string) =>
  /^(https?:|mailto:|tel:|\/\/|#)/i.test(value)

export const isCnPath = (value: string) => {
  const { pathname } = splitPath(value)
  return pathname === cnPrefix || pathname.startsWith(`${cnPrefix}/`)
}

export const stripCnPrefix = (value: string) => {
  if (isExternalPath(value)) return value

  const { pathname, suffix } = splitPath(value)
  const normalized = normalizePath(pathname)

  if (normalized === cnPrefix) return `/${suffix}`
  if (normalized.startsWith(`${cnPrefix}/`)) {
    const stripped = normalized.slice(cnPrefix.length) || '/'
    return `${stripped}${suffix}`
  }

  return `${normalized}${suffix}`
}

export const isCnSupportedPath = (value: string) => {
  if (isExternalPath(value)) return false

  const { pathname } = splitPath(stripCnPrefix(value))
  const path = normalizePath(pathname)

  return (
    path === '/'
    || path === '/about'
    || path === '/products'
    || path === '/documents'
    || path === '/contact'
    || /^\/products\/category\/[^/]+$/.test(path)
    || /^\/products\/[^/]+$/.test(path)
  )
}

export const addCnPrefix = (value: string) => {
  if (isExternalPath(value)) return value

  const base = stripCnPrefix(value)
  const { pathname, suffix } = splitPath(base)
  const path = normalizePath(pathname)

  if (!isCnSupportedPath(path)) return value
  if (path === '/') return `${cnPrefix}${suffix}`
  return `${cnPrefix}${path}${suffix}`
}

export const localizePath = (value: string, locale: LocaleCode) => {
  if (isExternalPath(value)) return value
  return locale === 'cn' ? addCnPrefix(value) : stripCnPrefix(value)
}

export const switchLocalePath = (currentFullPath: string, targetLocale: LocaleCode) => {
  if (targetLocale === 'en') return stripCnPrefix(currentFullPath)
  return isCnSupportedPath(currentFullPath) ? addCnPrefix(currentFullPath) : cnPrefix
}

export const getLocaleFromPath = (path: string): LocaleCode => (isCnPath(path) ? 'cn' : 'en')

export const getSeoAlternatePaths = (path: string) => {
  const canonicalBase = stripCnPrefix(path).split('?')[0]?.split('#')[0] || '/'
  if (!isCnSupportedPath(canonicalBase)) return undefined

  return {
    'x-default': stripCnPrefix(canonicalBase),
    en: stripCnPrefix(canonicalBase),
    'zh-CN': addCnPrefix(canonicalBase),
  }
}

export const uiText = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      company: 'Company',
      documents: 'Documents',
      blog: 'Blog',
      contact: 'Contact',
    },
    actions: {
      getQuote: 'Get a Quote',
      requestQuote: 'Request Quote',
      requestExportQuote: 'Request Export Quote',
      sendInquiry: 'Send Inquiry',
      inquiry: 'Inquiry',
      details: 'Details',
      contactSales: 'Contact Sales',
      whatsapp: 'WhatsApp',
      email: 'Email',
    },
    labels: {
      allProducts: 'All Products',
      products: 'Products',
      company: 'Company',
      contact: 'Contact',
      material: 'Material',
      moq: 'MOQ',
      customization: 'Customization',
      packaging: 'Packaging',
      applications: 'Applications',
      specifications: 'Specifications',
      sizeOptions: 'Size Options',
      relatedProducts: 'Related Products',
      customizable: 'Customizable',
      customAvailable: 'Custom Production Available',
      standardOnly: 'Standard Only',
      noProducts: 'No products in this category yet.',
      document: 'Document',
      appliesTo: 'Applies To',
      standard: 'Standard / Regulation',
      standardShort: 'Standard',
      issuedBy: 'Issued By',
      date: 'Date',
      action: 'Action',
      request: 'Request',
      pdf: 'PDF',
    },
    form: {
      fullName: 'Full Name',
      namePlaceholder: 'Your name',
      email: 'Email',
      emailPlaceholder: 'you@example.com',
      country: 'Country / Region',
      countryPlaceholder: 'Select or type your country',
      requirement: 'Requirement Details',
      submit: 'Submit Inquiry',
      messagePlaceholder: 'Briefly tell us what you need.',
      productMessagePlaceholder: 'Interested in {product}. Briefly tell us what you need.',
      productMessage: 'I am interested in {product}.',
      validationName: 'Please enter your name',
      validationEmail: 'Please enter your email',
      validationEmailValid: 'Please enter a valid email',
      validationCountry: 'Please choose your country or region',
      validationMessage: 'Please describe your requirement',
      success: 'Inquiry submitted.',
      error: 'Submission failed. Please try email or WhatsApp.',
    },
    footer: {
      exportSupplier: 'Export Supplier',
      supplyFocus: 'Cling film, fresh wrap and disposable food containers for wholesale import, private label and OEM/ODM packaging orders.',
      wholesaleOrders: 'Wholesale Orders',
      oemPacking: 'OEM/ODM Packing',
      sampleSupport: 'Sample Support',
      exportSupport: 'Export Support',
      productLinks: 'Products',
      companyLinks: 'Company',
      contactInfo: 'Contact',
      friendLinks: 'Friend Links',
      copyright: '版权所有。',
    },
    fab: {
      contactUs: 'Contact Us',
      fastQuote: 'Fast Quote',
      contact: 'Contact',
      channels: 'WhatsApp, Email, or Inquiry Form',
      inquiryForm: 'Inquiry Form',
      submitRequirements: 'Submit requirements',
    },
  },
  cn: {
    nav: {
      home: '首页',
      products: '产品中心',
      company: '公司介绍',
      documents: '资料证书',
      blog: 'Blog',
      contact: '联系我们',
    },
    actions: {
      getQuote: '获取报价',
      requestQuote: '询价',
      requestExportQuote: '提交出口询盘',
      sendInquiry: '发送询盘',
      inquiry: '询盘',
      details: '查看详情',
      contactSales: '联系销售',
      whatsapp: 'WhatsApp',
      email: '邮箱',
    },
    labels: {
      allProducts: '全部产品',
      products: '产品',
      company: '公司',
      contact: '联系',
      material: '材质',
      moq: '起订量',
      customization: '定制',
      packaging: '包装方式',
      applications: '适用场景',
      specifications: '产品参数',
      sizeOptions: '可选规格',
      relatedProducts: '相关产品',
      customizable: '支持定制',
      customAvailable: '可定制',
      standardOnly: '仅标准款',
      noProducts: '该分类下暂无产品。',
      document: '文件名称',
      appliesTo: '适用产品',
      standard: '标准 / 法规',
      standardShort: '检测标准',
      issuedBy: '出具方',
      date: '日期',
      action: '操作',
      request: '按需提供',
      pdf: 'PDF',
    },
    form: {
      fullName: '姓名',
      namePlaceholder: '请输入您的姓名',
      email: '邮箱',
      emailPlaceholder: 'you@example.com',
      country: '国家 / 地区',
      countryPlaceholder: '选择或输入国家 / 地区',
      requirement: '需求说明',
      submit: '提交询盘',
      messagePlaceholder: '请简单说明产品、规格、数量或包装需求。',
      productMessagePlaceholder: '如果您对 {product} 感兴趣，请简单说明规格、数量或包装需求。',
      productMessage: '我想咨询 {product}。',
      validationName: '请填写姓名',
      validationEmail: '请填写邮箱',
      validationEmailValid: '请填写有效邮箱',
      validationCountry: '请选择或填写国家 / 地区',
      validationMessage: '请填写需求说明',
      success: '询盘已提交。',
      error: '提交失败，请尝试通过邮箱或 WhatsApp 联系我们。',
    },
    footer: {
      exportSupplier: '出口供应方向',
      supplyFocus: '面向批发进口商、品牌定制和 OEM/ODM 订单，供应保鲜膜、生鲜保鲜膜和一次性食品容器。',
      wholesaleOrders: '批发订单',
      oemPacking: 'OEM/ODM 包装',
      sampleSupport: '样品支持',
      exportSupport: '出口配合',
      productLinks: '产品',
      companyLinks: '公司',
      contactInfo: '联系',
      friendLinks: '友情链接',
      copyright: '版权所有。',
    },
    fab: {
      contactUs: '联系我们',
      fastQuote: '快速询价',
      contact: '联系',
      channels: 'WhatsApp、邮箱或询盘表单',
      inquiryForm: '询盘表单',
      submitRequirements: '提交采购需求',
    },
  },
} as const
