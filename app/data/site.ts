export const company = {
  displayName: 'YIYUAN NEW MATERIALS',
  name: 'Shangqiu Yiyuan New Materials Co., Ltd.',
  tagline: 'China Export Quality Factory',
  email: 'yiyuancoop@gmail.com',
  contactLink: 'mailto:yiyuancoop@gmail.com',
  whatsapp: '+86 131 0382 3508',
  whatsappLink: 'https://wa.me/8613103823508',
  phone: '+86 131 0382 3508',
  address: 'No. 491, Shuguang West Village, Zhanji Town, Yucheng County, Shangqiu, Henan, China',
  location: 'Shangqiu, Henan, China',
  founded: 2023,
  registeredCapital: 'RMB 1 million',
  legalRepresentative: 'Liu Ke',
}

export const headerMarqueeItems = [
  'Shangqiu, Henan, China',
  'Cling Film',
  'Fresh Wrap',
  'Packaging Materials',
  'OEM Orders',
  'Private Label',
  'Custom Converting',
  'Food Packaging',
  'Jumbo Roll Supply',
  'Cutter Box Film',
  'Wholesale Orders',
  'Export Supply',
  'Export Inquiry',
]

export const complianceMarqueeItems = [
  'ISO 9001',
  'ISO 22000',
  'HACCP',
  'BRCGS Packaging',
  'FDA 21 CFR',
  'EC 1935/2004',
  'EU 10/2011',
  'EC 2023/2006',
  'GMP Control',
  'Batch Traceability',
  'Migration Testing',
  'Food-Grade Material',
]

export interface Product {
  slug: string
  name: string
  category: string
  shortDesc: string
  image: string
  material: string
  moq: string
  custom: boolean
  specs: { label: string; value: string }[]
  applications: string[]
  packaging: string
}

export const categories = [
  { slug: 'disposable-containers', name: 'Disposable Containers' },
  { slug: 'cling-film', name: 'Cling Film & Fresh Wrap' },
  { slug: 'food-containers', name: 'Food Packaging Containers' },
  { slug: 'custom-packaging', name: 'Custom Packaging' },
]

export const products: Product[] = [
  {
    slug: 'kraft-meal-box',
    name: 'Kraft Paper Meal Box',
    category: 'Disposable Containers',
    shortDesc: 'Grease-resistant kraft lunch boxes for takeaway and food delivery, leak-proof design.',
    image: '/images/product-meal-box.png',
    material: 'Food-grade Kraft paper + PE coating',
    moq: '10,000 pcs',
    custom: true,
    specs: [
      { label: 'Capacity', value: '750ml / 1000ml / 1200ml' },
      { label: 'Material', value: 'Kraft paper + PE lining' },
      { label: 'Shape', value: 'Rectangular' },
      { label: 'Microwave Safe', value: 'Yes' },
      { label: 'Color', value: 'Brown / Custom print' },
    ],
    applications: ['Takeaway restaurants', 'Food delivery', 'Catering', 'Salad & bowls'],
    packaging: '200 pcs/carton, 50 cartons/pallet',
  },
  {
    slug: 'pp-bento-container',
    name: 'PP Injection Bento Container',
    category: 'Disposable Containers',
    shortDesc: 'Multi-compartment injection-molded bento boxes, microwave and freezer safe.',
    image: '/images/product-bento.png',
    material: 'Virgin PP (polypropylene)',
    moq: '20,000 pcs',
    custom: true,
    specs: [
      { label: 'Compartments', value: '1 / 2 / 3 grid' },
      { label: 'Material', value: 'Food-grade PP' },
      { label: 'Temperature', value: '-20°C to 120°C' },
      { label: 'Microwave Safe', value: 'Yes' },
      { label: 'Lid', value: 'Clear snap-on lid' },
    ],
    applications: ['Meal prep', 'Bento sets', 'Frozen food', 'Supermarket retail'],
    packaging: '300 sets/carton, 40 cartons/pallet',
  },
  {
    slug: 'pe-cling-film',
    name: 'PE Cling Film Jumbo Roll',
    category: 'Cling Film & Fresh Wrap',
    shortDesc: 'Industrial PE stretch cling film for food wrapping, jumbo rolls for wholesale.',
    image: '/images/product-cling-film.png',
    material: 'Food-grade PE (polyethylene)',
    moq: '5,000 kg',
    custom: true,
    specs: [
      { label: 'Width', value: '300mm / 450mm / 600mm' },
      { label: 'Thickness', value: '8 - 12 micron' },
      { label: 'Roll Length', value: 'Up to 1000m' },
      { label: 'Core', value: '1.5 inch / 3 inch' },
      { label: 'Grade', value: 'Food contact certified' },
    ],
    applications: ['Food service', 'Supermarkets', 'Repackaging', 'Household retail'],
    packaging: 'Shrink-wrapped rolls, 6 rolls/carton',
  },
  {
    slug: 'pvc-fresh-wrap',
    name: 'PVC Fresh Wrap Film',
    category: 'Cling Film & Fresh Wrap',
    shortDesc: 'High-cling PVC fresh wrap with cutter box, ideal for fresh produce and deli.',
    image: '/images/product-fresh-wrap.png',
    material: 'Food-grade PVC',
    moq: '8,000 rolls',
    custom: true,
    specs: [
      { label: 'Width', value: '290mm / 300mm' },
      { label: 'Length', value: '300m / 500m' },
      { label: 'Cling', value: 'High tack' },
      { label: 'Box', value: 'Slide cutter carton' },
      { label: 'Clarity', value: 'High transparency' },
    ],
    applications: ['Fresh produce', 'Deli counters', 'Meat & fish', 'Bakery'],
    packaging: 'Individual cutter box, 24 boxes/carton',
  },
  {
    slug: 'pet-deli-container',
    name: 'PET Clear Deli Container',
    category: 'Food Packaging Containers',
    shortDesc: 'Crystal-clear PET round containers with tamper-evident lids for cold foods.',
    image: '/images/product-deli.png',
    material: 'Food-grade PET',
    moq: '15,000 pcs',
    custom: true,
    specs: [
      { label: 'Capacity', value: '8oz / 16oz / 32oz' },
      { label: 'Material', value: 'Recyclable PET' },
      { label: 'Lid', value: 'Tamper-evident' },
      { label: 'Clarity', value: 'Crystal clear' },
      { label: 'Use', value: 'Cold food only' },
    ],
    applications: ['Salads', 'Fruit cups', 'Cold deli', 'Sauces & dips'],
    packaging: '500 sets/carton, 36 cartons/pallet',
  },
  {
    slug: 'sugarcane-clamshell',
    name: 'Bagasse Clamshell Box',
    category: 'Food Packaging Containers',
    shortDesc: 'Compostable sugarcane bagasse clamshell, sturdy and oil-resistant.',
    image: '/images/product-clamshell.png',
    material: 'Sugarcane bagasse pulp',
    moq: '12,000 pcs',
    custom: true,
    specs: [
      { label: 'Size', value: '6" / 8" / 9"' },
      { label: 'Material', value: 'Bagasse pulp' },
      { label: 'Compartments', value: '1 / 3 grid' },
      { label: 'Heat Resistance', value: 'Up to 100°C' },
      { label: 'Compostable', value: 'Yes' },
    ],
    applications: ['Takeaway', 'Burgers & sides', 'Eco restaurants', 'Catering'],
    packaging: '200 pcs/carton, 50 cartons/pallet',
  },
  {
    slug: 'custom-printed-box',
    name: 'Custom Printed Food Box',
    category: 'Custom Packaging',
    shortDesc: 'Branded food boxes with your logo, full-color print and custom sizing.',
    image: '/images/product-custom-box.png',
    material: 'Kraft / White cardboard',
    moq: '5,000 pcs',
    custom: true,
    specs: [
      { label: 'Print', value: 'Up to 6 colors / CMYK' },
      { label: 'Material', value: 'Kraft / Coated board' },
      { label: 'Finish', value: 'Matte / Gloss / Soft touch' },
      { label: 'Sizing', value: 'Fully custom' },
      { label: 'Tooling', value: 'Custom die-cut' },
    ],
    applications: ['Branded takeaway', 'Retail food', 'Gift packaging', 'Fast food chains'],
    packaging: 'Custom carton per spec',
  },
  {
    slug: 'custom-cup',
    name: 'Custom Paper Cup',
    category: 'Custom Packaging',
    shortDesc: 'Double-wall paper cups with custom branding for hot and cold beverages.',
    image: '/images/product-cup.png',
    material: 'Food-grade paper + PE/PLA',
    moq: '50,000 pcs',
    custom: true,
    specs: [
      { label: 'Capacity', value: '8oz / 12oz / 16oz' },
      { label: 'Wall', value: 'Single / Double wall' },
      { label: 'Coating', value: 'PE / PLA' },
      { label: 'Print', value: 'Custom full color' },
      { label: 'Lid', value: 'Optional matching lid' },
    ],
    applications: ['Coffee shops', 'Beverage chains', 'Events', 'Office supply'],
    packaging: '1000 pcs/carton',
  },
]

export interface Post {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
  cover: string
  readTime: string
  body: string[]
}

export const posts: Post[] = [
  {
    slug: 'choosing-food-packaging-supplier',
    title: 'How to Choose a Reliable Food Packaging Supplier for Overseas Import',
    date: '2025-11-12',
    category: 'Sourcing Guide',
    excerpt:
      'Key factors overseas buyers should evaluate when selecting a food packaging factory, from certifications to production capacity.',
    cover: '/images/blog-supplier.png',
    readTime: '6 min read',
    body: [
      'Sourcing food packaging from overseas requires more than comparing unit prices. Buyers need to verify that a supplier is a genuine source factory rather than a trading company, since this directly affects pricing, lead time and quality consistency.',
      'Start by confirming production certifications such as food-grade material reports, ISO quality systems and relevant export documentation. A real manufacturer can provide factory audit access, machine lists and capacity figures without hesitation.',
      'Next, evaluate production capacity against your order volume. A factory running automated injection and extrusion lines can guarantee stable monthly output and shorter lead times during peak seasons.',
      'Finally, assess communication and customization capability. Clear specification sheets and steady contact reduce risk across the supply chain.',
    ],
  },
  {
    slug: 'pp-vs-pet-vs-bagasse',
    title: 'PP vs PET vs Bagasse: Choosing the Right Food Container Material',
    date: '2025-10-28',
    category: 'Material Guide',
    excerpt:
      'A practical comparison of the three most common food container materials and which use cases each one fits best.',
    cover: '/images/blog-materials.png',
    readTime: '5 min read',
    body: [
      'Selecting the correct material is one of the most important decisions when ordering food containers. Each material has distinct advantages in heat resistance, clarity, cost and sustainability.',
      'PP (polypropylene) is the workhorse of hot-food packaging. It is microwave safe, durable and handles temperatures up to 120°C, making it ideal for bento boxes and reusable meal containers.',
      'PET offers crystal clarity and is best for cold applications such as salads, fruit and deli items. It is fully recyclable but should not be used for hot food.',
      'Bagasse, made from sugarcane pulp, is compostable and increasingly demanded by eco-conscious markets. It is sturdy and oil-resistant, suitable for takeaway and catering where sustainability matters.',
    ],
  },
  {
    slug: 'reduce-packaging-cost-wholesale',
    title: 'Five Ways to Reduce Packaging Costs in Wholesale Purchasing',
    date: '2025-10-09',
    category: 'Cost Optimization',
    excerpt:
      'Practical strategies importers use to lower landed cost per unit without sacrificing packaging quality.',
    cover: '/images/blog-cost.png',
    readTime: '4 min read',
    body: [
      'Packaging is a recurring cost across every order. Standardized specifications and efficient purchasing can lower landed cost per unit.',
      'First, consolidate SKUs. Standardizing on fewer container sizes increases per-item volume and unlocks better pricing tiers.',
      'Second, optimize carton and pallet configuration to maximize container loading and reduce freight cost per unit.',
      'Third, plan ahead. Booking production during off-peak periods and ordering full containers avoids rush fees and LCL shipping premiums.',
    ],
  },
]
