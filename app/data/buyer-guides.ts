export type BuyerGuideStep = {
  number: string
  title: string
  summary: string
  checks: string[]
}

export type BuyerGuide = {
  slug: string
  categorySlug: string
  title: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  description: string
  coverImage: string
  coverAlt: string
  productPath: string
  productLabel: string
  inquiryProduct: string
  updatedLabel: string
  readingTime: string
  intro: string
  steps: BuyerGuideStep[]
  riskRows: Array<{ risk: string; check: string; action: string }>
  relatedArticles: Array<{ title: string; to: string }>
  faqs: Array<{ question: string; answer: string }>
}

export const buyerGuides: BuyerGuide[] = [
  {
    slug: 'source-cling-film-from-china',
    categorySlug: 'cling-film',
    title: 'How to Source Cling Film from China',
    seoTitle: 'How to Source Cling Film from China: Supplier & Import Guide | YIYUAN',
    seoDescription: 'A practical buyer guide to sourcing PE and PVC cling film from China: verify suppliers, write an RFQ, approve samples, control quality, and prepare an import order.',
    seoKeywords: 'how to source cling film from China, cling film supplier checklist, import cling film, PE cling film supplier, PVC fresh wrap supplier, cling film RFQ',
    description: 'A practical sourcing guide for importers, distributors, and private-label buyers of PE and PVC food wrap.',
    coverImage: '/images/blog/first-cling-film-import-order-checklist-cover.webp',
    coverAlt: 'Food-service cling film rolls prepared for an import order review',
    productPath: '/products/category/cling-film',
    productLabel: 'Browse Cling Film',
    inquiryProduct: 'Cling Film Sourcing Guide',
    updatedLabel: 'Updated July 23, 2026',
    readingTime: '9 min read',
    intro: 'Cling film quotes are easy to compare badly. A roll price alone does not establish the film grade, thickness tolerance, usable length, net weight, cutter-box fit, or carton strength you will receive. This guide gives procurement teams a repeatable first-order process before they commit a deposit.',
    steps: [
      {
        number: '01',
        title: 'Define the roll you need before searching',
        summary: 'Build a one-page requirement sheet so every supplier prices the same product and packing basis.',
        checks: ['Film type and intended food-contact use', 'Width, target micron range, roll length, and core size', 'Retail, food-service, jumbo-roll, or private-label packing', 'Target order quantity, destination port, and preferred shipment window'],
      },
      {
        number: '02',
        title: 'Screen suppliers with evidence, not a profile page',
        summary: 'Ask candidates to show how they control the product you are buying and how they document a batch.',
        checks: ['Company identity, factory address, and a current production contact', 'Product photos or video that match the quoted roll and cutter box', 'Relevant test-report scope and batch or sample identification', 'A written answer on MOQ, lead time, change control, and export packing'],
      },
      {
        number: '03',
        title: 'Send an RFQ that makes quotes comparable',
        summary: 'Request one quote format and require the supplier to identify assumptions instead of hiding them in a unit price.',
        checks: ['Price unit: kg, roll, meter, carton, or container', 'Net and gross weight, rolls per carton, and carton dimensions', 'Incoterm, destination, quote validity, and payment milestones', 'Artwork, barcode, cutter, label, or carton requirements where applicable'],
      },
      {
        number: '04',
        title: 'Approve samples against measurable checks',
        summary: 'Keep the approved sample, its specification sheet, and the test method together as the first production reference.',
        checks: ['Measure width, thickness, roll length or weight, and core dimensions', 'Test unwind, cling, tear, clarity, and cutter-box compatibility in your use case', 'Photograph labels, cartons, and pallet presentation', 'Record agreed tolerances and what must be reported before any material change'],
      },
      {
        number: '05',
        title: 'Control the first shipment and prepare the import file',
        summary: 'Confirm the finished product, packing count, and document set before cargo leaves the factory.',
        checks: ['Pre-shipment inspection plan, carton count, and loading photos', 'Commercial invoice, packing list, bill of lading instructions, and origin requirements', 'Destination-market food-contact and labeling requirements confirmed with your broker or local adviser', 'A post-arrival scorecard for shortages, damage, and repeat-order decisions'],
      },
    ],
    riskRows: [
      { risk: 'A low price is quoted per roll', check: 'Ask for net weight, usable length, thickness range, and packing count.', action: 'Compare cost on the same product basis before choosing a supplier.' },
      { risk: 'Sample and mass order behave differently', check: 'Agree which performance checks, tolerances, and changes require approval.', action: 'Keep the approved sample and signed specification as the reference.' },
      { risk: 'Cutter boxes arrive damaged or do not fit', check: 'Confirm blade type, box board, core, roll diameter, and carton compression protection.', action: 'Approve packed samples and request pre-shipment packing photos.' },
      { risk: 'Import documents are treated as an afterthought', check: 'Confirm document and destination requirements before production is released.', action: 'Have the importer or customs broker review the required set for the shipment.' },
    ],
    relatedArticles: [
      { title: 'Questions to Ask a Cling Film Supplier Before Paying a Deposit', to: '/blog/questions-ask-cling-film-supplier-before-deposit' },
      { title: 'Your First Cling Film Import Order: A Practical Checklist', to: '/blog/first-cling-film-import-order-checklist' },
      { title: 'Cling Film MOQ and Lead Time: What Makes a Trial Order Work', to: '/blog/cling-film-moq-lead-time-trial-order-feasibility' },
    ],
    faqs: [
      { question: 'What should a first cling film RFQ include?', answer: 'State the film type, use case, width, target thickness range, length or net weight, core, packing, quantity, destination, and any private-label requirements. Ask suppliers to identify assumptions in writing.' },
      { question: 'Can I compare suppliers by price per roll?', answer: 'Not reliably. Roll price can conceal differences in film thickness, actual weight, length, packing count, and delivered terms. Normalize the specification and commercial basis first.' },
      { question: 'Who should confirm import and food-contact requirements?', answer: 'The importer should confirm destination-specific requirements with the appropriate local authority, customs broker, or qualified adviser before placing the order. This guide is a commercial sourcing framework, not legal advice.' },
    ],
  },
  {
    slug: 'source-disposable-food-containers-from-china',
    categorySlug: 'disposable-meal-boxes',
    title: 'How to Source Disposable Food Containers from China',
    seoTitle: 'How to Source Disposable Food Containers from China: Buyer & Import Guide | YIYUAN',
    seoDescription: 'A buyer guide to sourcing disposable food containers from China: compare materials and suppliers, prepare an RFQ, test samples, manage molds and packing, and prepare an import order.',
    seoKeywords: 'how to source disposable food containers from China, food container supplier checklist, import meal boxes, disposable food container RFQ, food packaging supplier China',
    description: 'A practical sourcing guide for importers, food-service distributors, and private-label buyers of disposable food containers.',
    coverImage: '/images/blog/compare-disposable-food-container-suppliers-china-cover.webp',
    coverAlt: 'Clear disposable food containers checked for fit and packing quality',
    productPath: '/products/category/disposable-meal-boxes',
    productLabel: 'Browse Food Containers',
    inquiryProduct: 'Disposable Food Container Sourcing Guide',
    updatedLabel: 'Updated July 23, 2026',
    readingTime: '10 min read',
    intro: 'A container that looks right in a catalog can fail at the lid, hinge, stack, courier route, or destination requirement. The safest first order starts with a specific food and operating condition, then turns those conditions into a sample, packing, and shipment approval process.',
    steps: [
      {
        number: '01',
        title: 'Start with the food and operating conditions',
        summary: 'Material selection follows the meal, temperature, handling route, and expected shelf time, not just the shape.',
        checks: ['Hot, cold, frozen, oily, sauced, or high-moisture food use', 'Required capacity, footprint, compartment layout, and lid style', 'Microwave, freezer, tamper-evident, or delivery requirements', 'Target market, label space, and any sustainability claim you intend to make'],
      },
      {
        number: '02',
        title: 'Qualify suppliers by the exact construction',
        summary: 'The supplier should be able to identify the material, tooling, lid relationship, and production controls for the quoted item.',
        checks: ['Material and intended-use statement tied to the SKU', 'Base and lid code, fit method, and compatibility confirmation', 'Sample or production images of the same construction and packing', 'Clear response on tooling ownership, MOQ, lead time, and change approval'],
      },
      {
        number: '03',
        title: 'Issue a specification-led RFQ',
        summary: 'Separate the product, lid, decoration, and export packing lines so a quote does not leave critical choices open.',
        checks: ['Dimensions, capacity, material, color, and permitted tolerance', 'Lid inclusion, nesting direction, and base-to-lid matching code', 'Pieces per sleeve, carton, pallet, and container-loading assumptions', 'Custom print, mold, artwork, barcode, and approval milestones'],
      },
      {
        number: '04',
        title: 'Test samples in the real use case',
        summary: 'Do not approve a container only on appearance. Test it with the actual food, fill temperature, stacking height, and transport route.',
        checks: ['Lid fit, leakage, hinge or rim performance, and opening force', 'Deformation after hot fill, refrigeration, freezing, or microwave use as relevant', 'Nesting, de-nesting, label adhesion, and stack stability', 'Carton drop, compression, and pallet handling checks for the chosen packing'],
      },
      {
        number: '05',
        title: 'Release production with a controlled handoff',
        summary: 'The first bulk order should document the approved construction, packing, inspection points, and shipping documents in one record.',
        checks: ['Approved sample, specification, artwork, and mold terms retained by both parties', 'Pre-shipment sampling, carton count, and base/lid matching checks', 'Commercial invoice, packing list, shipping marks, and bill of lading instructions confirmed', 'Destination-market requirements checked by the importer before shipment'],
      },
    ],
    riskRows: [
      { risk: 'The base and lid are quoted separately', check: 'Confirm matching SKU codes, order ratio, fit, and spare-lid policy.', action: 'Approve a complete set and inspect base/lid matching before shipment.' },
      { risk: 'A material claim is copied from a catalog', check: 'Tie the claim to the exact SKU, intended use, and evidence available for buyer review.', action: 'Avoid making market claims until your destination requirements are confirmed.' },
      { risk: 'Mold costs or ownership are unclear', check: 'State ownership, storage, maintenance, approval, and reuse terms in writing.', action: 'Release tooling only after drawings and approval milestones are defined.' },
      { risk: 'Cartons collapse or containers deform in transit', check: 'Review nesting, top-load, carton count, pallet pattern, and container loading.', action: 'Use a packing approval and pre-shipment inspection checklist.' },
    ],
    relatedArticles: [
      { title: 'Compare Disposable Food Container Suppliers in China', to: '/blog/compare-disposable-food-container-suppliers-china' },
      { title: 'Disposable Food Container MOQ, Lead Time, Samples, Molds, and Printing', to: '/blog/disposable-food-container-moq-lead-time-samples-molds-printing' },
      { title: 'Disposable Food Container Samples: A Checklist Before Bulk Production', to: '/blog/food-container-sample-testing-checklist-bulk-production' },
    ],
    faqs: [
      { question: 'What information should I send before requesting a container quote?', answer: 'Describe the food, fill temperature, use conditions, target capacity and dimensions, material preference, lid requirement, packing, quantity, destination, and any branding or labeling requirements.' },
      { question: 'Should I approve a container based on a dry sample?', answer: 'No. Test a complete base-and-lid set with the actual food and operating conditions, including filling, stacking, storage, and delivery where relevant.' },
      { question: 'Are food-contact and import requirements the same in every market?', answer: 'No. Requirements depend on the destination and intended use. Confirm them with the appropriate local authority, customs broker, or qualified adviser before you release production.' },
    ],
  },
]

export const getBuyerGuide = (slug: string) => buyerGuides.find((guide) => guide.slug === slug)
