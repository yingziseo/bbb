export type BuyerDocument = {
  title: string
  document: string
  description: string
  href: string
  filename: string
  meta: string
  appliesTo: string
  standard: string
  issuedBy: string
  date: string
  viewLabel: string
  downloadLabel: string
  requestOnly?: boolean
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
