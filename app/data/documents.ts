export type BuyerDocumentCopy = {
  title: string
  document: string
  description: string
  meta: string
  appliesTo: string
  standard: string
  issuedBy: string
  date: string
  viewLabel: string
  downloadLabel: string
}

export type BuyerDocument = BuyerDocumentCopy & {
  href: string
  filename: string
  requestOnly?: boolean
  cn?: Partial<BuyerDocumentCopy>
}

export const getBuyerDocumentCopy = (doc: BuyerDocument, isCn: boolean): BuyerDocument => {
  if (!isCn || !doc.cn) return doc
  return {
    ...doc,
    ...doc.cn,
  }
}

export const buyerDocuments = {
  productCatalog: {
    title: 'Product Catalog',
    document: 'Product Specification PDF',
    description: 'Product overview and specification range',
    href: '/downloads/yiyuan-food-container-cling-film-product-catalog.pdf',
    filename: 'yiyuan-food-container-cling-film-product-catalog.pdf',
    meta: '6 pages',
    appliesTo: 'Cling Film & Disposable Food Containers',
    standard: 'Product specifications',
    issuedBy: 'YIYUAN',
    date: '2026',
    viewLabel: 'View PDF',
    downloadLabel: 'Download PDF',
    cn: {
      title: '产品资料',
      document: '产品规格 PDF',
      description: '产品范围和规格说明',
      meta: '6 页',
      appliesTo: '保鲜膜和一次性食品容器',
      standard: '产品规格资料',
      viewLabel: '查看文件',
      downloadLabel: '下载 PDF',
    },
  },
  testReport: {
    title: 'Test Report',
    document: 'Food Contact Test Report',
    description: 'Quality and inspection document',
    href: '/downloads/yiyuan-cling-film-test-report-ccf-000071.pdf',
    filename: 'yiyuan-cling-film-test-report-ccf-000071.pdf',
    meta: '4 pages',
    appliesTo: 'PVC Cling Film / Fresh Wrap Film',
    standard: 'Food contact test document',
    issuedBy: 'Third-party lab',
    date: '2026',
    viewLabel: 'View Report',
    downloadLabel: 'Download PDF',
    cn: {
      title: '检测报告',
      document: '食品接触检测报告',
      description: '质量与检测文件',
      meta: '4 页',
      appliesTo: 'PVC 保鲜膜 / 生鲜保鲜膜',
      standard: '食品接触检测文件',
      issuedBy: '第三方实验室',
      viewLabel: '查看报告',
      downloadLabel: '下载 PDF',
    },
  },
} satisfies Record<string, BuyerDocument>

export const requestDocumentRows: BuyerDocument[] = [
  {
    title: 'Migration Test',
    document: 'Material Safety / Migration Test',
    description: 'Additional migration or market-specific files available by request',
    href: '/contact?product=Certificate%20Package',
    filename: '',
    meta: 'On request',
    appliesTo: 'Fresh Wrap Film',
    standard: 'Market-specific review on request',
    issuedBy: 'To be confirmed',
    date: 'On request',
    viewLabel: 'Request Documents',
    downloadLabel: '',
    requestOnly: true,
    cn: {
      title: '迁移测试',
      document: '材料安全 / 迁移测试',
      description: '可按目标市场补充迁移测试或合规文件',
      meta: '按需提供',
      appliesTo: '生鲜保鲜膜',
      standard: '按目标市场确认',
      issuedBy: '待确认',
      date: '按需提供',
      viewLabel: '申请资料',
    },
  },
  {
    title: 'Factory Profile',
    document: 'Company Registration / Factory Profile',
    description: 'Company and factory profile files available for buyer review',
    href: '/contact?product=Certificate%20Package',
    filename: '',
    meta: 'On request',
    appliesTo: 'Company Review',
    standard: 'Supplier qualification file',
    issuedBy: 'YIYUAN',
    date: 'On request',
    viewLabel: 'Request Documents',
    downloadLabel: '',
    requestOnly: true,
    cn: {
      title: '工厂资料',
      document: '公司注册 / 工厂资料',
      description: '可用于采购审核的公司和工厂资料',
      meta: '按需提供',
      appliesTo: '公司审核',
      standard: '供应商资质资料',
      date: '按需提供',
      viewLabel: '申请资料',
    },
  },
]

export const buyerDocumentList = [
  buyerDocuments.productCatalog,
  buyerDocuments.testReport,
]

export const complianceDocumentList = [
  buyerDocuments.testReport,
  buyerDocuments.productCatalog,
  ...requestDocumentRows,
]
