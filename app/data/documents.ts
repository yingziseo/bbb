export type BuyerDocument = {
  title: string
  description: string
  href: string
  filename: string
  meta: string
}

export const buyerDocuments = {
  productCatalog: {
    title: 'Catalog',
    description: 'Product overview',
    href: '/downloads/yiyuan-food-container-cling-film-product-catalog.pdf',
    filename: 'yiyuan-food-container-cling-film-product-catalog.pdf',
    meta: '6 pages',
  },
  testReport: {
    title: 'Test Report',
    description: 'Quality document',
    href: '/downloads/yiyuan-cling-film-test-report-ccf-000071.pdf',
    filename: 'yiyuan-cling-film-test-report-ccf-000071.pdf',
    meta: '4 pages',
  },
} satisfies Record<string, BuyerDocument>

export const buyerDocumentList = [
  buyerDocuments.productCatalog,
  buyerDocuments.testReport,
]
