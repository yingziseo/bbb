import {
  contentPlan37To96 as plan,
  contentPlan37To96ByNumber,
} from './content-plan-37-96.mjs'

const seo = {
  37: ['Cling Film Thickness Tolerance Checks | YIYUAN', 'Set a practical cling film thickness tolerance using agreed tools, sampling points, individual readings, retain samples, and bulk approval rules.'],
  38: ['Food Container Base and Lid Code Matching | YIYUAN', 'Prevent food container base and lid mismatches with linked component codes, clear carton labels, receiving checks, warehouse locations, and pick controls.'],
  39: ['Verify Cling Film Roll Length and Net Weight | YIYUAN', 'Verify cling film roll length by separating gross roll weight, core weight, net film weight, calculated yield, tolerances, and controlled unwind checks.'],
  40: ['Tamper-Evident vs Standard Container Lids | YIYUAN', 'Compare tamper-evident and standard food container lids by closure workflow, opening evidence, customer access, delivery trials, carton use, and total cost.'],
  41: ['Cling Film Core Size and Dispenser Fit | YIYUAN', 'Check cling film core diameter, length, wall strength, alignment, moisture condition, loaded-roll clearance, and dispenser fit before a wholesale order.'],
  42: ['Vented vs Non-Vented Hot Food Lids | YIYUAN', 'Test vented and non-vented hot food lids with the real menu, fill condition, hold time, condensation, spill risk, stack, delivery bag, and opening.'],
  43: ['Cling Film Winding and Edge Damage Checks | YIYUAN', 'Identify cling film telescoping, loose or tight winding, crushed edges, core movement, transit damage, and unwind problems with traceable sample checks.'],
  44: ['Food Container Rim Design and Lid Fit | YIYUAN', 'Understand how rim profile, flange width, corners, material variation, deformation, and matched tooling affect food container lid fit and leakage.'],
  45: ['Cling Film Unwind Force and Blocking Tests | YIYUAN', 'Compare cling film unwind force, blocking, tack, edge tracking, and start-to-end roll consistency under one repeatable food-service test method.'],
  46: ['Food Container Stack and Top-Load Tests | YIYUAN', 'Build a filled food container stack test around portion weight, lid fit, hold time, movement, lower-pack deformation, recovery, and acceptance criteria.'],
  47: ['Food Cling Film vs Pallet Stretch Film | YIYUAN', 'Avoid the wrong RFQ by separating food cling film and pallet stretch film uses, contact surfaces, roll formats, performance checks, packing, and documents.'],
  48: ['Food Container De-Nesting for Packing Lines | YIYUAN', 'Evaluate food container de-nesting through stack pitch, rim access, static, carton pressure, manual speed, automatic feeding, rejects, and line trials.'],
  49: ['Perforated vs Continuous Cling Film | YIYUAN', 'Choose perforated or continuous cling film by sheet consistency, container variety, cutting workflow, line speed, usable coverage, waste, and SKU strategy.'],
  50: ['Food Container Compartment Layout Tests | YIYUAN', 'Test food container compartments with real portions, sauce movement, divider height, lid clearance, stack pressure, transport, and customer presentation.'],
  51: ['Cling Film Cutter Types Compared | YIYUAN', 'Compare metal blades, slide cutters, and plastic cutters through repeated cutting, box structure, user handling, installation, packing, and approval risk.'],
  52: ['Hinged vs Separate-Lid Food Containers | YIYUAN', 'Compare hinged and separate-lid food containers by receiving, storage, packing labor, closure, carton density, component imbalance, damage, and usable-set cost.'],
  53: ['Cling Film Cutter Box Board Strength | YIYUAN', 'Review cling film cutter box board, folds, glue, coating, cutter fixing, humidity exposure, repeated pulling, storage, and master carton protection.'],
  54: ['Clear Food Container Lid Quality Checks | YIYUAN', 'Separate clear lid haze, scratches, scuffs, condensation, nesting marks, carton abrasion, and handling damage with controlled retail appearance checks.'],
  55: ['Cling Film Carton Compression and Drop Tests | YIYUAN', 'Plan cling film carton compression and handling tests around final roll weight, retail boxes, pallet loads, route risks, post-test product checks, and evidence.'],
  56: ['PET Food Container Cold-Crack Checks | YIYUAN', 'Investigate PET food container cracks through cold handling, rim and corner evidence, lid stress, impacts, nested stacks, carton pressure, and matched samples.'],
  57: ['Cling Film Price per Kg, Roll, or Meter | YIYUAN', 'Normalize cling film prices by kilogram, roll, and meter using net film weight, verified length, thickness, core, packaging, conversion cost, and tolerances.'],
  58: ['PP Food Container Hot-Fill Tests | YIYUAN', 'Validate PP food containers for a defined hot-fill route using the actual meal, portion, fill condition, hold time, lid, support, stack, and supplier limits.'],
  59: ['Cling Film Landed-Cost Worksheet | YIYUAN', 'Calculate cling film landed cost per usable roll with product, core, box, carton, pallet, freight, import, receiving, damage, and exchange-rate inputs.'],
  60: ['Fried Food Container Ventilation Tests | YIYUAN', 'Compare fried food packaging through steam, condensation, oil, hold time, delivery bag, customer opening, and defined crispness checks without broad claims.'],
  61: ['Cling Film Jumbo Roll Slitting and Yield | YIYUAN', 'Evaluate cling film jumbo roll value through usable width, trim, splices, winding, changeovers, finished rejects, conversion trials, and input-output yield.'],
  62: ['Soup Container Fill-Line and Leak Tests | YIYUAN', 'Test soup and curry containers with controlled food, fill line, clean and wet rims, closure, upright holding, realistic tilts, stacking, and bag movement.'],
  63: ['Cling Film Slit Width and Core Alignment | YIYUAN', 'Approve finished cling film rolls by measuring slit width, core length, overhang, edge alignment, outside diameter, sampling, and dispenser fit together.'],
  64: ['Salad Container Condensation and Label Tests | YIYUAN', 'Check salad and deli containers for internal condensation, external moisture, label adhesion, print durability, barcode scans, cold display, and shelf handling.'],
  65: ['Cling Film Pre-Shipment Inspection Plan | YIYUAN', 'Turn approved cling film specifications into a shipment check for identity, quantity, dimensions, unwind, cutting, packaging, sampling, and evidence.'],
  66: ['Frozen Meal Container Validation Checklist | YIYUAN', 'Validate frozen meal containers through filled freezing, cold handling, stack loads, closure, labels, thawing, reheating, and document scope.'],
  67: ['Cling Film Incoming Inspection | YIYUAN', 'Inspect cling film at arrival by recording the seal, load, pallets, cartons, rolls, labels, quantity, functional samples, holds, and claim evidence.'],
  68: ['Bakery and Dessert Container Buying Checks | YIYUAN', 'Select bakery and dessert containers by product height, decoration clearance, closure, visibility, labels, carton protection, display, transport, and opening.'],
  69: ['Cling Film Ocean Freight Damage Prevention | YIYUAN', 'Plan cling film ocean freight around heat exposure, stack load, pallet restraint, carton strength, roll deformation, loading photos, and arrival inspection.'],
  70: ['Food Containers for Central Kitchen Lines | YIYUAN', 'Trial food containers on central kitchen lines through repeated de-nesting, filling, lid placement, labels, stack flow, stops, rejects, and operator handling.'],
  71: ['Cling Film Warehouse Storage Controls | YIYUAN', 'Control cling film storage with lot identity, FIFO or expiry rules, supplier conditions, dry supported cartons, dispatch checks, and complaint records.'],
  72: ['Institutional Meal Container Trial Checklist | YIYUAN', 'Trial institutional meal containers for menus, portions, labels, closing speed, transport carts, receiving, opening, tenders, and reorder controls.'],
  73: ['Cling Film Odor and Taste Complaint Evidence | YIYUAN', 'Investigate cling film odor or taste complaints with lot records, sealed samples, packaging, storage, food conditions, controlled comparisons, and scoped tests.'],
  74: ['Food Container Landed Cost per Usable Set | YIYUAN', 'Calculate food container landed cost per usable base-lid set with components, carton volume, pallets, freight, import, receiving, damage, mismatch, and spares.'],
  75: ['Cloudy Cling Film: Haze and Moisture Checks | YIYUAN', 'Trace cloudy cling film through film haze, condensation, surface moisture, stretch, contamination, storage, lighting, and side-by-side wrapped-pack trials.'],
  76: ['Food Container Carton Count Checks | YIYUAN', 'Verify food container quantities across pieces, sleeves, cartons, component codes, weight alarms, base-lid ratios, recounts, and discrepancy evidence.'],
  77: ['Why Cling Film Will Not Stick to Trays | YIYUAN', 'Test cling film on clean, wet, oily, smooth, and textured tray rims while controlling temperature, stretch, overlap, dispenser, storage, and observation time.'],
  78: ['Food Container Pallet Compression Risks | YIYUAN', 'Prevent food container deformation by checking carton strength, stack height, pallet overhang, straps, heat, cargo movement, lower layers, and arrival fit.'],
  79: ['Cling Film and Food Shelf-Life Claims | YIYUAN', 'Validate food shelf-life claims by separating film function from food, hygiene, process, temperature, storage, study design, endpoints, and label wording.'],
  80: ['Food Container First-Shipment Inspection | YIYUAN', 'Inspect the first food container shipment through load evidence, component identity, counts, base-lid fit, deformation, samples, holds, and release records.'],
  81: ['PVC Cling Film Plasticizer Document Checks | YIYUAN', 'Review PVC cling film plasticizer questions by matching formulation, intended use, current market rules, report scope, sample identity, and change control.'],
  82: ['Food Container Pre-Shipment Inspection | YIYUAN', 'Build a food container shipment inspection around current sampling instructions, component identity, dimensions, filled tests, defects, packing, and photos.'],
  83: ['U.S. and EU Cling Film Document Requests | YIYUAN', 'Organize U.S. and EU cling film document requests with a product-use-market matrix, regulatory status, declarations, reports, traceability, and gap gates.'],
  84: ['Custom Food Container Mold Ownership | YIYUAN', 'Clarify custom food container mold ownership, custody, use, drawings, trials, maintenance, wear, changes, storage, transfer, and reorder terms before payment.'],
  85: ['Cling Film Change Control Checklist | YIYUAN', 'Control cling film formula, resin, thickness, core, cutter, box, artwork, carton, site, and document changes through notice, evidence, samples, and revisions.'],
  86: ['Food Container Drawings and Tolerances | YIYUAN', 'Approve food container drawings through revisions, units, functional dimensions, capacity, rim and lid interface, tolerances, measurement, and sample trials.'],
  87: ['Cling Film Sample-to-Bulk Tolerances | YIYUAN', 'Write a cling film sample-to-bulk agreement for fixed identity, measured tolerances, functional acceptance, visual references, sampling, and escalation.'],
  88: ['Food Container Branding Options Compared | YIYUAN', 'Compare sleeves, labels, and direct print for food containers by surface, moisture, artwork, claims, application labor, setup, rejects, nesting, and cartons.'],
  89: ['Cling Film Quality Complaint Evidence | YIYUAN', 'Build a cling film complaint file with carton and roll labels, defect context, photos, video, use conditions, frequency, reference samples, and containment.'],
  90: ['Custom Food Container Color Control | YIYUAN', 'Approve custom food container color with a physical standard, controlled light, molded geometry, masterbatch records, an acceptable range, and lot samples.'],
  91: ['Cling Film Distributor SKU Planning | YIYUAN', 'Plan a focused cling film assortment by channel, tray sizes, roll dimensions, cutter format, carton space, price role, trial demand, stock age, and reorders.'],
  92: ['Food Container Spare Lid Planning | YIYUAN', 'Set food container spare lid quantities from component ratios, damage, samples, separate sales, picking errors, after-sales use, carton packs, and stock risk.'],
  93: ['Private-Label Cling Film Launch Timeline | YIYUAN', 'Plan a private-label cling film launch through product, box, artwork, barcode, claims, proof, production, inspection, booking, and controlled handoff gates.'],
  94: ['Recycled Plastic Food Container Documents | YIYUAN', 'Review recycled plastic container documents by separating content claims from food-contact suitability, source, process, intended use, and market scope.'],
  95: ['Cling Film Trial Order Scorecard | YIYUAN', 'Decide whether to reorder cling film using specifications, complaints, sell-through, stock age, usable-roll cost, channel fit, and supplier actions.'],
  96: ['Food Container Quality Scorecard | YIYUAN', 'Track food container stability across three orders with consistent specifications, inspections, fit, counts, complaints, corrective actions, and cost.'],
}

export const contentMetadata37To96 = plan.map((item) => {
  const values = seo[item.number]
  if (!values) throw new Error(`Missing SEO metadata for article ${item.number}`)

  return {
    ...item,
    seoTitle: values[0],
    seoDescription: values[1],
    seoKeywords: [
      item.primaryKeyword,
      item.business === 'cling-film' ? 'cling film wholesale' : 'food containers wholesale',
      item.articleType.replaceAll('-', ' '),
    ].join(', '),
  }
})

export const contentMetadata37To96ByNumber = new Map(
  contentMetadata37To96.map((item) => [item.number, item]),
)

for (const item of contentMetadata37To96) {
  if (contentPlan37To96ByNumber.get(item.number)?.slug !== item.slug) {
    throw new Error(`Metadata plan mismatch for article ${item.number}`)
  }
}
