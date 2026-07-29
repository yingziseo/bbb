import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import sanitizeHtml from 'sanitize-html'
import { contentMetadata37To96 } from './content-metadata-37-96.mjs'

const root = '/root/bbb'
const articleDir = join(root, '工作流/文章/两个月60篇-37-96')
const dbPath = process.env.SQLITE_PATH || join(root, 'data/yiyuan.db')
const apply = process.argv.includes('--apply')
const refreshExisting = process.argv.includes('--refresh-existing')

const edits = {
  37: {
    opening: `Thickness disputes rarely start with the micrometer. They usually start earlier, when a purchase order says “10 micron” but nobody records where to measure, how many rolls to sample, or whether one low edge reading or the roll average controls acceptance. This guide turns that vague number into a check both sides can repeat.`,
    heading: `Questions worth settling before the first reading`,
    questions: [
      [`Can a supplier's average thickness be enough?`, `Only if the agreement says the average controls acceptance and also sets limits for individual readings. Otherwise a good average can hide a thin edge or an isolated setup error.`],
      [`Does the public PE report prove a production tolerance?`, `No. YIYUAN's <a href="/downloads/yiyuan-cling-film-test-report-ccf-000071.pdf">PE sample report</a> identifies one submitted sample and does not set a bulk thickness tolerance. Use the <a href="/products/commercial-cling-film-roll">commercial roll page</a> to identify the offered format, then write a separate measurement and sampling agreement.`],
    ],
    keywords: `cling film thickness tolerance, how to measure cling film thickness, cling film quality inspection`,
    placement: 'early',
  },
  39: {
    opening: `Seeing “300 m” on a roll label still leaves three quantities to reconcile: usable film length, net film mass, and gross roll weight with the core and pack. They can support one another, but they are not substitutes. The practical job is to decide which quantity was sold and how it will be checked.`,
    heading: `Two common roll-quantity questions`,
    questions: [
      [`Is weighing the roll faster than unwinding it?`, `Yes, but weight is a screening method unless thickness, width, material density, core weight, and packaging deductions are controlled. A direct unwind remains useful when declared length is the contractual quantity.`],
      [`Should every roll be destructively unwound?`, `Usually not. Buyers can combine selected unwind tests with broader net-weight checks. Start from the exact format on the <a href="/products/commercial-cling-film-roll">commercial cling film range</a> and state which test decides a borderline result.`],
    ],
    keywords: `verify cling film roll length, cling film net weight calculation, cling film quantity inspection`,
    placement: 'middle',
  },
  41: {
    opening: `The frustrating compatibility failure is not a roll that is obviously too wide. It is a roll that fits the spindle, then rubs the box wall, walks sideways, or crushes its core after a few pulls. Core approval therefore needs the loaded roll and the actual dispenser, not an isolated inner-diameter number.`,
    heading: `What buyers usually discover during the fit test`,
    questions: [
      [`Why can two cores with the same inner diameter behave differently?`, `Wall construction, length, moisture, end shape, roll overhang, and loaded-roll weight all change how the core rotates and survives use.`],
      [`Is a drawing enough for approval?`, `A drawing narrows the risk, but a working trial catches rubbing, side play, and cutter-box interference. Match the equipment dimensions to the chosen format on YIYUAN's <a href="/products/commercial-cling-film-roll">commercial roll page</a> before approving the bulk core.`],
    ],
    keywords: `cling film core size, cling film dispenser compatibility, cling film core strength`,
    placement: 'late',
  },
  43: {
    opening: `Telescoping tells only half the story. The shift may have started during winding, under carton pressure, or after a pallet moved in transit. Before asking for a process change, record the unopened carton, roll position, core, edges, and what happens during unwinding; that sequence is far more useful than a single close-up of the defect.`,
    heading: `Questions that help separate winding from transit damage`,
    questions: [
      [`Does a firm roll mean the winding tension is correct?`, `No. Hand pressure is subjective and can miss tight bands, loose layers, or a core problem. Compare profile measurements, unwind behavior, and rolls from different carton positions.`],
      [`What evidence should reach the supplier first?`, `Send the lot and carton identity, profile views, unopened-pack photos, and a continuous unwind video. The ordered dimensions can be checked against the <a href="/products/commercial-cling-film-roll">commercial cling film specification</a>, but the cause still has to be established from the affected stock.`],
    ],
    keywords: `cling film winding tension, cling film telescoping defect, cling film edge damage`,
    placement: 'early',
  },
  45: {
    opening: `Kitchen users often describe two different failures with the same sentence: “the film is too sticky.” One may be blocking between layers on the roll; the other may be strong tack on the tray. A useful trial records release from the roll and hold on the intended surface as separate observations.`,
    heading: `The questions behind a “too sticky” complaint`,
    questions: [
      [`Can easy unwind and strong tray hold exist together?`, `Yes. They are different behaviors, influenced by formulation, winding, storage, pull setup, tray material, moisture, and overlap. Test both in the same controlled trial.`],
      [`What should be held constant between samples?`, `Use the same dispenser, pull direction and speed, tray, moisture condition, overlap, and observation time. Identify the roll format from the <a href="/products/commercial-cling-film-roll">current commercial range</a> so the comparison is tied to a specific product.`],
    ],
    keywords: `cling film unwind force, cling film blocking test, cling film tack consistency`,
    placement: 'middle',
  },
  47: {
    opening: `Clear rolls are easy to misidentify in a short RFQ. A request for “stretch cling film” can reach a food-wrap supplier or a pallet-film supplier, and both may return plausible-looking prices. The first sentence should say what the film will touch and what job it must do.`,
    heading: `Where buyers still get the terminology crossed`,
    questions: [
      [`Can pallet stretch film be accepted if it wraps a tray well?`, `No. Physical cling does not establish suitability for food contact. Product identity, intended use, and destination-market evidence must match the food-wrap application.`],
      [`Which details remove the ambiguity fastest?`, `Include a use photo, food or logistics application, roll dimensions, core, dispenser or wrapping machine, and document request. For food wrap, start with the formats shown on YIYUAN's <a href="/products/commercial-cling-film-roll">cling film product page</a>.`],
    ],
    keywords: `food cling film vs stretch film, food wrap RFQ, pallet film identification`,
    placement: 'late',
  },
  49: {
    opening: `Perforation saves a cutting motion only when the sheet length matches the work. In a kitchen wrapping both small bowls and full pans, the same perforation can improve speed at one station and increase waste at another. The decision belongs in a timed use trial, not in a price-list comparison.`,
    heading: `What food-service teams ask after the first trial`,
    questions: [
      [`Is perforated film always faster?`, `Not when users must join sheets, tear at the wrong perforation, or discard excess film. Time complete wrapping cycles across the actual container mix.`],
      [`How should the trial roll be specified?`, `Record sheet length, width, perforation release, material, thickness, core, and pack format. Compare those fields with the <a href="/products/commercial-cling-film-roll">commercial film options</a> before extrapolating the result to another roll.`],
    ],
    keywords: `perforated vs continuous cling film, perforated food wrap, foodservice cling film rolls`,
    placement: 'early',
  },
  51: {
    opening: `Cutter approval belongs to the loaded package, not to a loose accessory on a sample table. A blade that looks clean in a photo may flex the box, expose an edge, or become awkward after repeated pulls. Follow the user's full motion—open, pull, hold, cut, and store—with the final roll inside.`,
    heading: `Questions a product photo cannot answer`,
    questions: [
      [`Which cutter is safest?`, `There is no universal answer from material alone. Review exposed edges, user access, fixing strength, one-hand use, local requirements, and what happens when the box is damaged.`],
      [`Can the cutter be approved before the box artwork?`, `The mechanism can be screened early, but final approval needs the printed board, folds, opening, roll, and shipping pack. Use the <a href="/products/commercial-cling-film-roll">commercial roll specification</a> to keep roll weight and dimensions in the prototype.`],
    ],
    keywords: `cling film cutter types, slide cutter vs metal blade, cling film cutter box`,
    placement: 'middle',
  },
  53: {
    opening: `Cutter boxes usually fail after they leave the flat-sample stage. Humidity softens the board, the loaded roll twists the structure, and repeated pulling tests the glue and cutter alignment. A print proof can approve color; it cannot approve the box as a working dispenser.`,
    heading: `What to ask before approving the board`,
    questions: [
      [`Is board grammage enough to compare boxes?`, `No. Grain direction, folds, coating, glue area, opening, cutter fixing, and the loaded roll all affect performance.`],
      [`How long should a humidity trial run?`, `Use a condition and duration relevant to the destination and distribution route, then test the complete box immediately afterward. Keep the roll weight and diameter tied to the chosen <a href="/products/commercial-cling-film-roll">commercial cling film format</a>.`],
    ],
    keywords: `cling film box board strength, cutter box humidity test, cling film retail packaging`,
    placement: 'late',
  },
  55: {
    opening: `An outer carton can survive a drop and still deliver unusable retail boxes. Heavy film rolls concentrate load, cutters can move, and the lowest cartons on a pallet see a different risk from the top layer. Test the final pack, then open it and inspect what the customer will actually use.`,
    heading: `Questions hidden by a simple “pass” result`,
    questions: [
      [`Does a clean outer carton mean the product passed?`, `Not necessarily. Check crushed cores, shifted cutters, split retail-box seams, roll-edge damage, and label condition inside the carton.`],
      [`Can one generic drop height cover every order?`, `The method should reflect final gross weight, handling route, orientation, and buyer acceptance rules. Confirm the roll and case configuration against the <a href="/products/commercial-cling-film-roll">commercial roll range</a> before setting the test.`],
    ],
    keywords: `cling film carton drop test, cling film master carton, export carton compression test`,
    placement: 'early',
  },
  57: {
    opening: `Headline roll prices stop being comparable as soon as two offers use different cores, thicknesses, delivered lengths, or retail packs. The quickest fair comparison is to rebuild both quotations around one sellable reference roll and show which assumptions are measured, declared, or still unverified.`,
    heading: `Questions to answer before choosing the lowest number`,
    questions: [
      [`Why can the cheapest price per kilogram produce a costly roll?`, `A heavy core, short delivered length, inefficient carton, or higher handling loss can raise the cost per usable wrap even when resin cost looks low.`],
      [`What should the reference roll include?`, `Material, width, thickness, usable length or net film mass, core, cutter or refill format, carton quantity, tolerance, and trade term. Anchor the comparison to one format from the <a href="/products/commercial-cling-film-roll">commercial film range</a>.`],
    ],
    keywords: `cling film price per kg vs roll, compare cling film quotations, cling film cost per meter`,
    placement: 'middle',
  },
  59: {
    opening: `The supplier invoice is only the first line of a cling film cost model. Freight, carton cube, pallets, import charges, receiving labor, shortages, damage, and unsold formats decide what each usable roll costs at the warehouse. Keeping those inputs separate makes the model easier to update and harder to manipulate.`,
    heading: `Questions that make the worksheet commercially useful`,
    questions: [
      [`Should recoverable tax sit in landed cost?`, `Only if the business uses that convention. State the treatment explicitly so competing offers are compared on the same accounting basis.`],
      [`What is the best denominator?`, `Use a warehouse-ready, saleable roll with verified film quantity and final packing. The selected dimensions and pack can be cross-checked against YIYUAN's <a href="/products/commercial-cling-film-roll">commercial product scope</a>, while freight and import inputs remain buyer-specific.`],
    ],
    keywords: `cling film landed cost, cling film import cost worksheet, landed cost per roll`,
    placement: 'late',
  },
  61: {
    opening: `Jumbo-roll economics begin after the film becomes saleable finished rolls. Edge trim, splice handling, startup waste, lane layout, core changes, and rejected rewinds all sit between purchased kilograms and invoiced output. Review the slit plan before comparing jumbo-roll prices.`,
    heading: `Questions that expose hidden conversion loss`,
    questions: [
      [`Is the widest jumbo roll automatically the most efficient?`, `No. It may leave unusable trim or exceed stable machine settings. Lay out the actual finished widths, lanes, knife allowance, and edge trim.`],
      [`How should trial yield be reported?`, `Reconcile input mass with good finished rolls, approved trim, startup waste, splices, retains, and rejected material. Use YIYUAN's <a href="/products/commercial-cling-film-roll">roll and jumbo-roll scope</a> only to define the offered format; the converter's machine trial provides the yield evidence.`],
    ],
    keywords: `cling film jumbo roll slitting, cling film rewinding yield, jumbo roll conversion waste`,
    placement: 'early',
  },
  63: {
    opening: `Finished-roll fit depends on more than film width. A roll can meet that tolerance and still scrape inside its dispenser because the core is long, the web is off-center, or the outside diameter changes under pressure. Inspect these dimensions as one system and record how the soft roll was supported during measurement.`,
    heading: `Questions to settle on the dimensional drawing`,
    questions: [
      [`Should roll outside diameter be a hard acceptance limit?`, `Only with a defined support and measurement method. A soft roll can change shape when squeezed or left unsupported.`],
      [`How much web offset is acceptable?`, `Set it from dispenser and cutter-box clearance, not from appearance alone. Compare the intended width, core, and pack with the <a href="/products/commercial-cling-film-roll">commercial roll specification</a>, then record actual fit-test evidence.`],
      [`Which readings belong in the inspection report?`, `Record film width, core length, offset at both ends, outside diameter under the agreed support condition, tool resolution, roll identity, and individual results. A single pass mark makes later fit complaints almost impossible to reconstruct.`],
    ],
    keywords: `cling film slit width tolerance, cling film core alignment, finished roll dimensional inspection`,
    placement: 'middle',
  },
  65: {
    opening: `Pre-shipment inspection works only when the inspector can turn the purchase agreement into observable checks. “Random inspection” is not enough: the brief needs the lot definition, sampling rule, defect classes, tools, approved references, and the person who makes the release decision.`,
    heading: `Questions to put into the inspector's brief`,
    questions: [
      [`Does an AQL result release the shipment automatically?`, `No. ISO 2859-1 provides sampling schemes; it does not choose the buyer's defect classes or override the buyer's release authority.`],
      [`Which product record should the inspector receive?`, `Use the signed purchase specification and approved sample first. YIYUAN's <a href="/products/commercial-cling-film-roll">commercial roll page</a> can confirm supplier scope, while the public PE report remains evidence for only its identified submitted sample.`],
    ],
    keywords: `cling film pre shipment inspection, cling film AQL inspection, cling film inspection checklist`,
    placement: 'late',
  },
  67: {
    opening: `Receiving teams see a different product from pre-shipment inspectors: cartons have crossed a route, pallets may have shifted, and warehouse clocks are already running. The first check is therefore identity and condition under arrival evidence, followed by measurements and use tests that can be traced to a lot.`,
    heading: `Questions that matter in the first hours after arrival`,
    questions: [
      [`Should damaged cartons be opened before photographs are taken?`, `Preserve the seal, pallet position, marks, and wide views first. Then open selected cartons under a recorded process so transport evidence is not lost.`],
      [`Can incoming results be compared with any retained roll?`, `Use the approved or lot-matched reference named in the order. The <a href="/products/commercial-cling-film-roll">commercial film page</a> identifies supplier formats but does not replace shipment-specific records.`],
    ],
    keywords: `cling film incoming inspection, cling film receiving checklist, container arrival film damage`,
    placement: 'early',
  },
  69: {
    opening: `Heat damage at sea is rarely documented by one dramatic photograph. More often, a lower carton leans, a pallet gap grows, and several rolls arrive oval or shifted. Route, season, pallet pattern, carton strength, and loading evidence need to be reviewed together before assigning a cause.`,
    heading: `Questions to ask while the shipment evidence still exists`,
    questions: [
      [`Can a container temperature estimate prove why a roll deformed?`, `It can support the investigation, but packing pressure, pallet movement, winding, storage time, and roll position also need evidence.`],
      [`What should be fixed before the next shipment?`, `Start with the actual roll, carton, pallet, route, and failure position rather than a generic “heat-resistant” request. Confirm the ordered format on the <a href="/products/commercial-cling-film-roll">commercial roll page</a> and change only controls supported by the investigation.`],
    ],
    keywords: `cling film ocean freight damage, cling film heat deformation, film roll shipping protection`,
    placement: 'middle',
  },
  71: {
    opening: `Warehouse problems often look like factory problems by the time a customer opens the carton. Lost lot labels, hot upper racks, damp floors, mixed rotation rules, and crushed lower layers can erase the evidence needed for a fair complaint review. Basic stock discipline protects both film condition and traceability.`,
    heading: `Questions a warehouse procedure should answer`,
    questions: [
      [`Should cling film use FIFO or FEFO?`, `Use the rule supported by the product's stated shelf-life and storage information, then document it consistently. Do not invent a generic expiry period.`],
      [`What must stay visible on a split pallet?`, `Keep supplier lot, receipt date, SKU, quantity, and location connected to each physical group. Check the ordered pack against the <a href="/products/commercial-cling-film-roll">commercial roll format</a> without covering original traceability marks.`],
      [`What should happen after a heat or damp-storage excursion?`, `Hold the identified stock, record duration and location, inspect carton and roll condition, and follow the product-specific disposition process. Moving cartons to a better rack does not erase the exposure history.`],
      [`How often should stored cartons be checked?`, `Use a risk-based interval tied to storage conditions, stack load, stock age, and dispatch frequency. The check should retain dated observations and trigger action before visibly weakened cartons are picked for customers.`],
    ],
    keywords: `cling film warehouse storage, cling film FIFO FEFO, cling film carton storage`,
    placement: 'late',
  },
  73: {
    opening: `An odor complaint becomes harder to solve every time someone rewrites the observation as a diagnosis. Record what was noticed, preserve unopened rolls and the printed pack, and separate sensory comparison from any conclusion about chemical safety. The evidence should narrow the question before a laboratory is asked to answer it.`,
    heading: `Questions buyers ask once stock is on hold`,
    questions: [
      [`Can a sensory panel identify the chemical cause?`, `No. A controlled comparison can confirm a perceived difference, but substance identity and health significance require an appropriate technical investigation.`],
      [`Does YIYUAN's PE report clear another complaint lot?`, `No. The <a href="/downloads/yiyuan-cling-film-test-report-ccf-000071.pdf">public report</a> covers one identified submitted PE sample. Use the <a href="/products/commercial-cling-film-roll">commercial product record</a> to identify the ordered format, then investigate the complaint samples and their actual use conditions.`],
    ],
    keywords: `cling film odor complaint, food wrap taste complaint, cling film complaint investigation`,
    placement: 'early',
  },
  75: {
    opening: `Cloudiness does not always come from the film. Condensation, a wet tray, uneven stretch, fingerprints, cold-chain transitions, and display lighting can all change what the buyer sees. Recreate the finished pack under the same background, temperature, and observation time before blaming film haze.`,
    heading: `Questions that sharpen a cloudy-film complaint`,
    questions: [
      [`How can condensation be separated from film haze?`, `Record which surface looks cloudy, then compare dry and real-food packs through the same temperature route. Observe before and after wiping only where that action will not destroy evidence.`],
      [`Is a loose-sheet clarity test useful?`, `It is a screening view, not a finished-pack result. Select the actual format from the <a href="/products/commercial-cling-film-roll">commercial cling film range</a> and trial it on the intended tray, food, stretch, and display setup.`],
    ],
    keywords: `cling film cloudy haze, cling film condensation, food wrap clarity test`,
    placement: 'middle',
  },
  77: {
    opening: `When cling changes from one tray to another, the film may not have changed at all. Rim width, texture, oil, water, temperature, molded marks, film tension, and overlap determine how much clean contact is available. Treat the tray and film as one packaging system during approval.`,
    heading: `Questions to ask at the tray, not only at the roll`,
    questions: [
      [`Should tack be tested on a standard smooth plate?`, `That can compare samples, but it does not predict performance on a narrow, textured, wet, or oily production tray. Include the real rim in final approval.`],
      [`What evidence helps when release happens only at one corner?`, `Mark the first release point, rim geometry, contamination, wrapping direction, tension, and time. Tie the trial to the selected <a href="/products/commercial-cling-film-roll">commercial film format</a> so another thickness or material is not compared by mistake.`],
      [`Can the supplier set one universal tack requirement?`, `A laboratory control may help monitor film consistency, but commercial acceptance still needs the buyer's tray, food condition, wrapping method, and observation route. Record both the controlled film check and the pack trial instead of merging them.`],
    ],
    keywords: `cling film not sticking to tray, cling film tray adhesion, food wrap moisture test`,
    placement: 'late',
  },
  79: {
    opening: `“Adds three days of freshness” sounds precise, but the number is meaningless without a food, baseline pack, process, storage route, endpoint, and study owner. Film can be one variable in shelf-life work; it cannot establish a safe or marketable life by itself.`,
    heading: `Questions to challenge before a freshness claim is printed`,
    questions: [
      [`Can better appearance prove a longer safe life?`, `No. Color, texture, moisture, odor, microbial safety, and chemical safety are different endpoints and need suitable methods.`],
      [`What should be fixed in the trial brief?`, `Define the food, process, tray, exact film, wrapping, storage, control pack, sampling, endpoints, and wording. The <a href="/products/commercial-cling-film-roll">commercial film page</a> can identify supplier scope, but the finished-food study must support the claim.`],
    ],
    keywords: `cling film shelf life claims, food freshness claim validation, cling film shelf life testing`,
    placement: 'early',
  },
  81: {
    opening: `Questions about whether PVC cling film is “phthalate free” quickly lead to the formulation: which plasticizer is used, which market rules apply, what the test covered, and whether production can change. A yes-or-no supplier statement cannot carry that entire review.`,
    heading: `Questions that a generic compliance letter cannot settle`,
    questions: [
      [`Does FDA authorization mean a substance is suitable for every PVC film?`, `No. Regulatory basis, restrictions, food type, contact conditions, formulation, and finished-product evidence still have to match.`],
      [`Can the public PE report support a PVC order?`, `No. It identifies a submitted PE sample, not PVC. YIYUAN's <a href="/products/commercial-cling-film-roll">commercial roll page</a> lists PE or PVC as order-specific options; a PVC order needs its own formulation and market review.`],
    ],
    keywords: `PVC cling film phthalates, PVC food wrap plasticizer, PVC cling film compliance documents`,
    placement: 'middle',
  },
  83: {
    opening: `“Send FDA and EU certificates” is not a complete document request. The supplier first needs the film identity, material, food types, contact time and temperature, destination, and proposed claims. Only then can each U.S. regulatory basis or EU declaration be matched to the finished article.`,
    heading: `Questions to resolve before accepting a document folder`,
    questions: [
      [`Is a laboratory report an FDA approval certificate?`, `No. A report may support a composition or migration question, while U.S. regulatory status follows the applicable regulation, notification, prior sanction, exemption, or other basis.`],
      [`Can one EU declaration cover future formulation changes?`, `Only within its supported identity and change controls. Match site, SKU, formulation, thickness, use, and revision. The <a href="/products/commercial-cling-film-roll">commercial product page</a> describes supplier scope but does not replace a market-specific DoC review.`],
    ],
    keywords: `cling film food contact documents, FDA EU cling film compliance, food wrap declaration of compliance`,
    placement: 'late',
  },
  85: {
    opening: `Repeat-order risk hides behind an unchanged SKU name. Resin or additive sources, core, cutter, board, printing, carton, site, or test method can move while the commercial description stays the same. A useful agreement says which changes need notice, evidence, and reapproval before production.`,
    heading: `Questions to put into a change request`,
    questions: [
      [`Does “equivalent material” avoid reapproval?`, `No. If the approved record identifies a different input, source, or performance basis, equivalence is a claim that needs evidence and a documented decision.`],
      [`Should every change trigger a full retest?`, `Not automatically. Classify the effect on identity, food contact, function, appearance, packing, and customer use. Keep the controlled baseline tied to the actual <a href="/products/commercial-cling-film-roll">commercial roll format</a>.`],
      [`How much advance notice is enough?`, `Set a practical review window in the supply agreement and state what must accompany the notice. Notice without an updated formulation reference, affected lots, reason, risk review, and proposed evidence does not support an approval decision.`],
    ],
    keywords: `cling film change control, packaging material change request, cling film repeat order control`,
    placement: 'early',
  },
  87: {
    opening: `“Same as the approved sample” is not an inspection rule. A sample cannot explain which fields are fixed, which may vary, how numbers are measured, or how packaging revisions are controlled. A short approval agreement should turn the reference roll into decisions production and inspection teams can repeat.`,
    heading: `Questions that turn a sample into a usable agreement`,
    questions: [
      [`Should every visible difference have a numeric tolerance?`, `No. Some fields need an approved visual reference or functional test; others, such as SKU and artwork revision, may be fixed identity fields.`],
      [`Can the PE sample report define bulk acceptance?`, `No. Its results apply to its identified submitted sample. Use the <a href="/products/commercial-cling-film-roll">commercial roll scope</a>, approved physical sample, test method, sampling plan, and signed tolerances to control production.`],
      [`What happens when a result is close to the limit?`, `The agreement should say whether to repeat the same measurement, expand sampling, hold the lot, run a functional check, or request a deviation. Deciding the rule after seeing the number creates avoidable negotiation.`],
    ],
    keywords: `cling film sample bulk tolerance, cling film approval agreement, sample to production quality control`,
    placement: 'middle',
  },
  89: {
    opening: `The most useful complaint photograph is often the one taken before the roll is removed from its carton. It preserves the label, pallet position, packing condition, and scale that later close-ups lose. Collect identity and context first, then document the defect without forcing it into a preferred root cause.`,
    heading: `Questions to answer before the sample is shipped back`,
    questions: [
      [`How many photos are enough?`, `Count is less important than coverage: carton and roll identity, wide context, close defect, scale, use setup, and unaffected comparison. Video is better for unwind or intermittent failures.`],
      [`Should the buyer estimate the affected percentage immediately?`, `Report observed and checked quantities first. Do not extrapolate without a sampling basis. Match the complaint SKU to the <a href="/products/commercial-cling-film-roll">commercial product record</a> and retain representative sealed samples.`],
    ],
    keywords: `cling film quality complaint, cling film defect photos, packaging complaint evidence`,
    placement: 'late',
  },
  91: {
    opening: `The best opening assortment is not the one with the most widths and lengths. It is the smallest set that covers distinct customer jobs without filling the warehouse with near-duplicates. Channel, tray size, dispenser, roll-change frequency, carton quantity, and price position should earn every SKU its place.`,
    heading: `Questions distributors ask after the launch stock arrives`,
    questions: [
      [`When should a slow SKU be removed?`, `Review sample conversion, customer reorders, substitutions, stock age, margin, and whether sales reached the intended channel before treating slow movement as a product failure.`],
      [`Should two similar widths be launched together?`, `Only if they solve clearly different customer jobs or dispenser constraints. Compare candidate formats on the <a href="/products/commercial-cling-film-roll">commercial roll page</a>, then test demand with a focused opening range.`],
    ],
    keywords: `cling film distributor SKU planning, cling film width assortment, wholesale food wrap portfolio`,
    placement: 'early',
  },
  93: {
    opening: `Private-label delays usually come from an approval made in the wrong order, not from one long factory task. A changed roll diameter moves the box; a changed cutter moves the artwork; a late claim review holds the print proof. The timeline should show dependencies and decision owners, not one optimistic lead-time promise.`,
    heading: `Questions that keep the launch calendar honest`,
    questions: [
      [`Can artwork start before the roll is frozen?`, `Concept work can start, but final dielines, claims, cutter position, and carton math depend on the approved product and structure.`],
      [`What belongs in the first supplier brief?`, `Destination, channel, material, use, width, thickness, film quantity, core, cutter, retail pack, carton, quantity, documents, delivery term, and decision owners. Check available formats on the <a href="/products/commercial-cling-film-roll">commercial cling film page</a> before building the schedule.`],
    ],
    keywords: `private label cling film timeline, cling film packaging launch, OEM food wrap project plan`,
    placement: 'middle',
  },
  95: {
    opening: `Trial orders should end with a decision, not a collection of favorable comments. Quality, complaints, sell-through, stock age, margin, carton efficiency, channel fit, and supplier response need named evidence and a review date. Critical identity or document gaps remain gates; strong sales should not average them away.`,
    heading: `Questions that make a reorder score meaningful`,
    questions: [
      [`What score should trigger a reorder?`, `Set gates and weights before results are known. A business can choose its own threshold, but unresolved critical defects or required document gaps should remain separate from weighted commercial scores.`],
      [`Should the next order repeat the winning SKU mix exactly?`, `Not necessarily. Use customer reorders, margin, stock age, complaints, and handling evidence to retain, revise, expand, or remove formats. Compare any revised roll with the <a href="/products/commercial-cling-film-roll">commercial product scope</a> before issuing the next PO.`],
      [`How should a borderline trial be handled?`, `Choose a controlled outcome: close specific actions and reorder, run a smaller revised trial, or discontinue. Record the owner and deadline for each open issue so an optimistic meeting note does not become an uncontrolled repeat order.`],
    ],
    keywords: `cling film trial order scorecard, cling film reorder decision, wholesale film SKU evaluation`,
    placement: 'late',
  },
}

const metadata = contentMetadata37To96.filter((article) => edits[article.number])
if (metadata.length !== 30 || Object.keys(edits).length !== 30) {
  throw new Error(`Expected 30 retained articles, found metadata=${metadata.length}, edits=${Object.keys(edits).length}`)
}

const escapeHtml = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const stripTags = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const shorten = (value, max) => value.length <= max
  ? value
  : `${value.slice(0, max - 1).replace(/\s+\S*$/, '').replace(/[.,;:!?]+$/, '')}.`

const renderQuestions = ({ heading, questions }) => `
<h2>${escapeHtml(heading)}</h2>
${questions.map(([question, answer]) => `<p><strong>${escapeHtml(question)}</strong> ${answer}</p>`).join('\n')}
`

const replaceFirstParagraph = (html, opening, number) => {
  let count = 0
  const result = html.replace(/<p>([\s\S]*?)<\/p>/, () => {
    count += 1
    return `<p>${opening}</p>`
  })
  if (count !== 1) throw new Error(`Article ${number}: opening paragraph not found`)
  return result
}

const removeContactParagraphs = (html) => html.replace(
  /<p\b[^>]*>(?:(?!<\/p>)[\s\S])*?<a\b[^>]*href=["']\/contact[^"']*["'][^>]*>(?:(?!<\/p>)[\s\S])*?<\/p>\s*/gi,
  '',
)

const removeFinalSourceParagraph = (html, number) => {
  const matches = [...html.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/gi)]
  const match = matches.at(-1)
  if (!match || !/\/products\/commercial-cling-film-roll/.test(match[0])) {
    throw new Error(`Article ${number}: expected final supplier-source paragraph`)
  }
  return `${html.slice(0, match.index)}${html.slice(match.index + match[0].length)}`
}

const insertQuestions = (html, block, placement, number) => {
  if (placement === 'early') {
    const marker = html.indexOf('<h2>')
    if (marker < 0) throw new Error(`Article ${number}: first H2 not found`)
    return `${html.slice(0, marker)}${block}\n${html.slice(marker)}`
  }
  if (placement === 'middle') {
    const match = html.match(/<!--\s*Image plan[\s\S]*?-->/)
    if (!match || match.index === undefined) throw new Error(`Article ${number}: image-plan marker not found`)
    const end = match.index + match[0].length
    return `${html.slice(0, end)}\n${block}${html.slice(end)}`
  }
  return `${html.trim()}\n${block}`
}

const optimizeSource = (source, edit, number) => {
  const ctas = source.match(/<section class="yy-cta">/g) || []
  if (ctas.length !== 1) throw new Error(`Article ${number}: expected one yy-cta, found ${ctas.length}`)
  let html = source.replace(/\s*<section class="yy-cta">[\s\S]*?<\/section>\s*$/, '\n')
  html = html.replace(/\s*<div class="yy-faq">[\s\S]*?<\/details>\s*<\/div>\s*/gi, '\n')
  html = removeContactParagraphs(html)
  html = removeFinalSourceParagraph(html, number)
  html = replaceFirstParagraph(html, edit.opening, number)
  html = insertQuestions(html, renderQuestions(edit), edit.placement, number)
  if (/yy-cta|href=["']\/contact/.test(html)) throw new Error(`Article ${number}: CTA residue remains`)
  if (!/\/products\/commercial-cling-film-roll/.test(html)) throw new Error(`Article ${number}: product evidence link missing`)
  if (/<div class="yy-faq"|<details|<summary/.test(html)) throw new Error(`Article ${number}: formatted FAQ markup is not allowed`)
  return `${html.trim()}\n`
}

const refreshOptimizedSource = (source, edit, number) => {
  let html = replaceFirstParagraph(source, edit.opening, number)
  html = html.replace(/\s*<h2>Questions Buyers Usually Ask<\/h2>\s*/i, '\n')
  html = html.replace(
    /\s*<h2>Common Buyer Questions<\/h2>\s*<p>YIYUAN's[\s\S]*?<\/p>\s*/i,
    '\n',
  )
  return `${html.trim()}\n`
}

const figureHtml = ({ slug, index, alt }) => {
  const caption = shorten(alt.trim().replace(/\.$/, ''), 120)
  const normalized = caption.charAt(0).toUpperCase() + caption.slice(1)
  return `<figure class="yy-figure">
  <img src="/images/blog/${slug}-${index}.webp" alt="${escapeHtml(alt)}" width="1200" height="675" loading="lazy" decoding="async">
  <figcaption>${escapeHtml(normalized)}.</figcaption>
</figure>`
}

const replaceImagePlans = (sourceHtml, article) => sourceHtml.replace(
  /<!--\s*Image plan\s+(\d+)-(0[1-3]):[\s\S]*?Suggested alt:\s*"([^"]+)"\s*-->/g,
  (_match, number, index, alt) => {
    if (Number(number) !== article.number) throw new Error(`Article ${article.number}: image marker mismatch`)
    return figureHtml({ slug: article.slug, index, alt })
  },
)

const sanitizePostHtml = (html) => sanitizeHtml(html, {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    'img', 'h1', 'h2', 'h3', 'h4', 'figure', 'figcaption', 'span', 'section',
    'div', 'details', 'summary', 'iframe', 'video', 'source', 'table', 'thead',
    'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
    '*': ['class', 'style'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
    img: sanitizeHtml.simpleTransform('img', { loading: 'lazy', decoding: 'async' }, true),
  },
})

const prepared = metadata.map((article) => {
  const sourcePath = join(articleDir, `${article.number}.html`)
  if (!existsSync(sourcePath)) throw new Error(`Missing source ${sourcePath}`)
  const original = readFileSync(sourcePath, 'utf8')
  const source = refreshExisting
    ? refreshOptimizedSource(original, edits[article.number], article.number)
    : optimizeSource(original, edits[article.number], article.number)
  const contentHtml = sanitizePostHtml(replaceImagePlans(source, article))
  const excerpt = shorten(stripTags(edits[article.number].opening), 190)
  return { article, sourcePath, original, source, contentHtml, excerpt, seoKeywords: edits[article.number].keywords }
})

const db = new DatabaseSync(dbPath, { readOnly: !apply })
const placeholders = prepared.map(() => '?').join(',')
const slugs = prepared.map(({ article }) => article.slug)
const rows = db.prepare(`SELECT slug, status FROM posts WHERE slug IN (${placeholders})`).all(...slugs)
if (rows.length !== 30 || rows.some((row) => row.status !== 'draft')) {
  throw new Error(`Expected 30 draft rows, found ${JSON.stringify(rows)}`)
}

if (apply) {
  const timestamp = new Date().toISOString()
  prepared.forEach((item) => writeFileSync(item.sourcePath, item.source))
  db.exec('BEGIN IMMEDIATE')
  try {
    const updatePost = db.prepare(`
      UPDATE posts
      SET excerpt = ?, content_html = ?, seo_keywords = ?, updated_at = ?
      WHERE slug = ? AND status = 'draft'
    `)
    const updateSeo = db.prepare(`
      UPDATE seo_entries SET keywords = ?, updated_at = ? WHERE entry_key = ?
    `)
    for (const item of prepared) {
      const postResult = updatePost.run(
        item.excerpt,
        item.contentHtml,
        item.seoKeywords,
        timestamp,
        item.article.slug,
      )
      if (Number(postResult.changes) !== 1) throw new Error(`Post update failed: ${item.article.slug}`)
      updateSeo.run(item.seoKeywords, timestamp, `post:${item.article.slug}`)
    }
    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    prepared.forEach((item) => writeFileSync(item.sourcePath, item.original))
    throw error
  }
}

const wordCounts = prepared.map((item) => ({
  number: item.article.number,
  words: (stripTags(item.contentHtml).match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length,
}))

console.log(JSON.stringify({
  mode: apply ? (refreshExisting ? 'refresh-existing' : 'apply') : (refreshExisting ? 'refresh-existing-dry-run' : 'dry-run'),
  articles: prepared.length,
  earlyQuestions: prepared.filter((item) => edits[item.article.number].placement === 'early').length,
  middleQuestions: prepared.filter((item) => edits[item.article.number].placement === 'middle').length,
  lateQuestions: prepared.filter((item) => edits[item.article.number].placement === 'late').length,
  totalWords: wordCounts.reduce((sum, item) => sum + item.words, 0),
  under500: wordCounts.filter((item) => item.words < 500),
  minWords: Math.min(...wordCounts.map((item) => item.words)),
  maxWords: Math.max(...wordCounts.map((item) => item.words)),
}, null, 2))
