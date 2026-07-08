export type BuyerDocument = {
  title: string
  description: string
  href: string
  filename: string
  meta: string
}

export const buyerDocuments = {
  productCatalog: {
    title: 'Product Catalog PDF',
    description: 'Disposable food containers and cling film product overview for buyer review.',
    href: '/downloads/yiyuan-food-container-cling-film-product-catalog.pdf',
    filename: 'yiyuan-food-container-cling-film-product-catalog.pdf',
    meta: 'Product information · 6 pages',
  },
  testReport: {
    title: 'Inspection / Test Report',
    description: 'Scanned inspection document provided for buyer quality review.',
    href: '/downloads/yiyuan-cling-film-test-report-ccf-000071.pdf',
    filename: 'yiyuan-cling-film-test-report-ccf-000071.pdf',
    meta: 'Quality document · 4 pages',
  },
} satisfies Record<string, BuyerDocument>

export const buyerDocumentList = [
  buyerDocuments.productCatalog,
  buyerDocuments.testReport,
]
