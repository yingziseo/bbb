import { contentPlan, contentPlanByNumber } from './content-plan.mjs'

const seo = {
  97: ['300mm vs 450mm Cling Film Rolls | Buyer Guide', 'Compare 300 mm and 450 mm cling film rolls by pan width, overlap, dispenser clearance, handling, usage, and sample approval before ordering.'],
  98: ['100m vs 300m vs 500m Cling Film Rolls | YIYUAN', 'Choose 100 m, 300 m, or 500 m cling film rolls using daily usage, roll changes, dispenser capacity, lifting, storage, and replenishment data.'],
  99: ['8 vs 10 vs 12 Micron Cling Film | Buyer Matrix', 'Select an 8, 10, or 12 micron starting specification through controlled tray trials, handling results, usable yield, and an agreed bulk tolerance.'],
  100: ['Cutter Box vs Refill Roll Cling Film | Cost Guide', 'Compare cutter boxes and refill rolls by dispenser ownership, labor, replacement rate, storage, damage, packaging waste, and usable-roll cost.'],
  101: ['Hand-Wrap vs Automatic-Overwrap Food Film | Guide', 'Separate manual food wrap from automatic tray-overwrap film using equipment, roll dimensions, unwind, cutting, trial speed, and acceptance records.'],
  102: ['Automatic Tray Wrapper Cling Film RFQ Checklist', 'Build a machine-specific cling film RFQ with wrapper model, web width, core, roll diameter, unwind direction, tray range, speed, and line-trial gates.'],
  103: ['PVC Meat Overwrap Film Roll Specification | YIYUAN', 'Specify PVC meat overwrap film by machine, width, gauge, core, roll length, tray conditions, appearance trial, documents, and production approval.'],
  104: ['Commercial Cling Film for Hotels | Multi-Station Plan', 'Plan hotel kitchen cling film by station, pan width, dispenser, shift usage, case pack, storeroom issue, backup stock, and consolidated purchasing.'],
  105: ['Cling Film for Bakeries | Commercial Roll Selection', 'Choose bakery cling film rolls for prep, proofing-area handling, ingredient pans, refrigeration, trays, display, cutting, and controlled use trials.'],
  106: ['Central Kitchen Cling Film Usage and Reorder Plan', 'Turn central-kitchen batch schedules, pan dimensions, film cuts, roll changes, handling loss, lead time, and safety stock into a reorder plan.'],
  107: ['Cling Film vs Lidding Film | Send the Right RFQ', 'Distinguish cling film from tray lidding film by package geometry, sealing method, equipment, roll format, validation owner, and required supplier data.'],
  108: ['Cling Film vs Shrink Film for Food Packaging | Guide', 'Choose between cling film and shrink film by process, heat and sealing equipment, pack outcome, food-contact scope, roll format, and validation needs.'],
  109: ['Cling Film Gauge to Micron Conversion for POs', 'Convert cling film gauge, mil, and micron without losing the controlling specification, using explicit formulas, rounding rules, and purchase-order wording.'],
  110: ['Cling Film Cost per Cover and Yield Calculator', 'Estimate cling film covers per roll and cost per completed pan cover from cut length, overlap, verified roll length, handling loss, and actual invoice cost.'],
  111: ['OEM Cling Film Cost Breakdown | Quote Comparison', 'Break an OEM cling film quote into film, core, cutter, retail box, print setup, master carton, inspection, and one-time approval costs.'],
  112: ['Stock vs Custom Cling Film for a First Order', 'Choose a lower-risk first cling film order by separating standard film, dimensions, core, cutter, labels, printed boxes, and custom commitments.'],
  113: ['Cling Film Sample Request Template for Importers', 'Send a traceable cling film sample request covering material, dimensions, core, packaging, lot identity, documents, test purpose, and shipping labels.'],
  114: ['Cling Film Factory Audit Checklist | Buyer Evidence', 'Audit a cling film site through process ownership, incoming controls, conversion, inspection, traceability, storage, subcontracting, and sampled records.'],
  115: ['Cling Film HS Code | Customs Classification Questions', 'Prepare cling film customs-classification facts covering material, structure, form, dimensions, packaging, use, destination tariff, and ruling support.'],
  116: ['Cling Film Roll Diameter Calculator | Equipment Fit', 'Estimate cling film roll outside diameter from core OD, length, and thickness; then account for winding and verify dispenser, machine, and carton clearance.'],
  117: ['Cling Film Migration Testing | Overall vs Specific', 'Scope overall and specific migration tests by film identity, intended food, time, temperature, jurisdiction, substances, sample, and laboratory brief.'],
  118: ['Cling Film Case Pack | Choose Rolls per Carton', 'Choose cling film rolls per carton from sell unit, roll weight, manual handling, cube, compression, receiving, picking, labels, and channel needs.'],
  119: ['Mixed-SKU Cling Film MOQ | Combine Widths Safely', 'Model a mixed-SKU cling film order by shared and unique film, core, cutter, artwork, box, carton, setup, sample, and quantity requirements.'],
  120: ['FOB vs CIF Cling Film Imports | Quote Comparison', 'Compare FOB and CIF cling film quotes using the same named port, shipment facts, cost boundary, risk point, insurance, destination charges, and exclusions.'],
  121: ['LCL vs FCL for Cling Film Trial Orders | Guide', 'Choose LCL or FCL for cling film using actual CBM, gross weight, origin and destination charges, handling events, timing, damage controls, and receiving needs.'],
  122: ['20GP vs 40HQ Cling Film Loading Calculator', 'Compare 20GP and 40HQ cling film loads with actual carton dimensions, gross weight, pallet pattern, container limits, loading buffer, and port-pair rates.'],
  123: ['Palletized vs Floor-Loaded Cling Film Cartons', 'Compare palletized and floor-loaded cling film shipments by cube, labor, carton pressure, route handling, unloading, warehouse rules, and claim evidence.'],
  124: ['Mixed-SKU Cling Film Container Allocation Plan', 'Allocate cling film SKUs in one container using demand cover, carton cube, gross weight, minimum lots, receiving sequence, and stockout risk.'],
  125: ['Cling Film COA, COC, DoC, and Test Reports', 'Choose the right cling film document for lot results, conformity statements, regulatory scope, test-sample evidence, traceability, and approval decisions.'],
  126: ['Cling Film Use Claims | Food, Time and Temperature', 'Approve cling film use claims only after matching material, SKU, food type, contact time, temperature, market, test scope, label wording, and change control.'],
}

export const contentMetadata = contentPlan.map((item) => {
  const values = seo[item.number]
  if (!values) throw new Error(`Missing SEO metadata for article ${item.number}`)
  return {
    ...item,
    seoTitle: values[0],
    seoDescription: values[1],
    seoKeywords: [item.primaryKeyword, ...item.longTailKeywords].join(', '),
    canonical: `https://yiyuanpack.com/blog/${item.slug}`,
    coverImage: `/images/blog/${item.slug}-cover.webp`,
  }
})

export const contentMetadataByNumber = new Map(contentMetadata.map((item) => [item.number, item]))

for (const item of contentMetadata) {
  if (contentPlanByNumber.get(item.number)?.slug !== item.slug) {
    throw new Error(`Metadata plan mismatch for article ${item.number}`)
  }
}
