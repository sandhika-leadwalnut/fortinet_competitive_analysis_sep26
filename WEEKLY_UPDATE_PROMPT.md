# Fortinet SEO Dashboard — Weekly Data Update Prompt

> **How to use:** Copy everything below the horizontal rule and paste it into a new Claude Code session, attach the updated CSV files, then send.

---

---

## CONTEXT

You are updating a **49-slide React/TypeScript SEO Competitive Analysis presentation** located at `/workspaces/default/code/`. The app is built with React 18, TypeScript, Vite, and Tailwind CSS v4.

**Golden rules:**
- Arrays are **chronological, oldest → newest**. New months are always **appended to the end** — never inserted in the middle.
- CSV dash `"-"` or blank cell → TypeScript `null`. A number → integer position rank.
- Only update cells that have **actually changed**. Do not overwrite correct existing values.
- After all edits, output a **Change Summary** (see format at the bottom of this prompt).
- If any CSV section cannot be confidently matched to a constant, list it under **"Could Not Update"** in the summary.

---

## ATTACHED CSV FILES

You will receive one or more of the following CSVs. Match by filename:

| Filename pattern | Purpose |
|---|---|
| `Fortinet_Competition_Raw_Data_-_All.csv` | Organic traffic, keywords, organic pages for all vendors |
| `Competitions__URLs_-_2026_-_Summary.csv` | Competitor content-hub page counts by month |
| `Fortinet_Content_Tracker_-_2026_-__International_Pages__Organic_Traffic_.csv` | International traffic by country |
| `Top_5_KWs_in_Focus_Categories__-_Tofu_Mofu_Bofu__Aug_.csv` (or similar month) | Priority keyword rankings per slide category |
| `Fortinet Keywords - Untapped KWs` (any name) | Untapped keyword opportunities |
| `Website*Experience*2026*.docx` / `Website*Experinece*2026*.docx` | Web Experience slide (Slide 46) — competitor observations, URLs and embedded screenshots |
| `Category_Raw_Data_*.csv` (or category section of All.csv) | Per-category keyword/traffic/AIO chart data (Slides 19–27) |
| `WW_Organic_Traffic_*.csv` (or WW section of All.csv) | WW organic traffic by vendor (Slide 16) |
| `WebsitePerformance_*.csv` or pasted scores | Desktop + Mobile PageSpeed/Lighthouse scores (Slide 28) |
| `Cyberglossary_*.csv` (keywords, backlinks sections) | Cyberglossary organic data + backlinks (Slides 30–32) |
| `Fortinet_Content_Tracker_-_2026_-_Cyberglossary_competitor_analysis*.csv` | Cyberglossary global rank + DA → `slide-cyberglossary-ranking.tsx`; organic keywords/traffic/value/pages → `slide-cyberglossary-keywords.tsx`; backlinks/referring domains → `slide-cyberglossary-backlinks.tsx` |
| `Profound_*.csv` or pasted Profound export | AI Visibility %, Share of Voice %, Citation Rate % (Slide 34) |
| `AIO_Performance_*.csv` or pasted AIO export | AIO score % by category (Slide 35) + AIO Keywords & Traffic (Slide 36) |
| `FeaturedSnippets_*.csv` or pasted snippet counts | Featured Snippets per vendor (Slide 37) |
| `BacklinksBySource_*.csv` or pasted source table | Fortinet backlinks by tool source (Slide 39) |
| `Fortinet_Competetiors_by_category_-_Jul___Aug_2026_-_Competition_Metrics_-_Jul_to_Oct2026*.csv` | Refreshed-basis category metrics (NGFW, SD-WAN, OT, SASE, Zero Trust, Cloud, Network Security, SecOps) — **FILE 17** |
| `Fortinet_Content_Tracker_-_2026_-_Top_50_KW_2026*.csv` | Top 50 keyword ranking tracker (Top 50 KW slide) — **FILE 18** |
| `Fortinet_Content_Tracker_-_2026_-_Performance_Tracker_Traffic__-_Articles*.csv` | Articles pages GA + GSC (Articles slide) — **FILE 19** |
| `Fortinet_Content_Tracker_-_2026_-_Performance_Tracker_Organic__-_Product_Pages*.csv` | Product pages GA + GSC (Product Pages slide) — **FILE 20** |
| `Fortinet_Content_Tracker_-_2026_-_Performance_Tracker_Organic__-_CyberGlossary*.csv` | CyberGlossary organic GA + GSC (CG traffic slide, tabs *Organic traffic* & *Click – GSC*) — **FILE 21** |
| `Fortinet_Content_Tracker_-_2026_-_Performance_Tracker_Bing_Clicks__-_CyberGlossary*.csv` | CyberGlossary Bing clicks (CG traffic slide, tab *Click – Bing*) — **FILE 22** |
| `Fortinet_Content_Tracker_-_2026_-_Performance_Tracker_Direct__-_CyberGlossary*.csv` | CyberGlossary direct traffic + URL-level gain/loss (CG traffic slide, tabs *Direct traffic* & *Direct traffic – Gain & Loss*) — **FILE 23** |
| `Fortinet_Content_Tracker_-_2026_-_International_Pages__Direct_Traffic_*.csv` | International CG pages — **direct** traffic by country (International slide, tab *Direct traffic*) — **FILE 24** |
| `Fortinet_Content_Tracker_-_2026_-__International_Pages__Organic_Traffic_*.csv` | International CG pages — **organic** traffic by country (International slide, tab *Organic traffic*) — see FILE 3 + FILE 24 |

> **Duplicate uploads:** Google Sheets exports often arrive as `name.csv`, `name-1.csv`, `name-2.csv`, `name-3.csv`. Run `md5sum` — if hashes match they are the same file; use the highest-numbered/most recent one and do not process twice. Always confirm the **last month column header** (e.g. `2026 Oct`) before editing.

---

## FILE 1 — `Fortinet_Competition_Raw_Data_-_All.csv`

This CSV has multiple named sections. Read it fully first, then update each section below.

### Section A — "Organic Pages"

**Target file:** `src/app/components/presentation/slide-organic-pages-overview.tsx`  
**Target constant:** `const DATA: Record<string, number[]>`  
**Target constant:** `const MONTHS = [...]` (in the same file)  
**Vendor key mapping:**

| CSV column | TypeScript key |
|---|---|
| Fortinet | `fortinet` |
| Cisco | `cisco` |
| HPE / hpe | `hpe` |
| Palo Alto / PaloAlto | `paloalto` |
| Check Point / Checkpoint | `checkpoint` |
| CrowdStrike / Crowdstrike | `crowdstrike` |
| Cato / Cato Networks | `catonetworks` |
| SentinelOne | `sentinelone` |
| Wiz | `wiz` |

**Update rules:**
1. Read the month headers from the CSV (e.g., Dec 2025, Jan 2026 … latest month).
2. Compare against `const MONTHS` in the file. If new months exist in the CSV that are not in `MONTHS`, **append** them to the `MONTHS` array using `'YYYY-MM'` format.
3. For each vendor, append new data values to its array in `DATA` (one value per new month).
4. Existing values: only correct if a value differs from the CSV **and** you are confident it is wrong.

**Month format mapping:** `Dec 2025` → `'2025-12'` · `Jan 2026` → `'2026-01'` · etc.

---

### Section B — "Country: US / Overall Traffic" + Branded + Non-Branded

**Target file:** `src/app/data/seo-data.ts`  
**Target constants:**
- `export const TRAFFIC_MONTHS` — month array
- `export const ORGANIC_TRAFFIC` — overall US traffic
- `export const BRANDED_TRAFFIC` — US branded traffic
- `export const NON_BRANDED_TRAFFIC` — US non-branded traffic

This file also exports `KEYWORD_MONTHS`. If the CSV includes months beyond the current last entry in `TRAFFIC_MONTHS`, append to **both** `TRAFFIC_MONTHS` and `KEYWORD_MONTHS`.

**Vendor key mapping:** same as Section A above.

**Update rules:**
1. Read month headers from the CSV's US section.
2. Append new months to `TRAFFIC_MONTHS` (and `KEYWORD_MONTHS` if needed).
3. Append corresponding traffic values to each vendor's array in `ORGANIC_TRAFFIC`, `BRANDED_TRAFFIC`, and `NON_BRANDED_TRAFFIC`.
4. Values are raw integers (not thousands). Keep them as-is from the CSV.

---

### Section C — "Location: WW / Overall Traffic" + Branded + Non-Branded

**Target file:** `src/app/components/presentation/slide-traffic-overview-tabs-ww.tsx`  
**Target constants:**
- `const ORGANIC_TRAFFIC_WW: Record<string, (number | null)[]>`
- `const BRANDED_TRAFFIC_WW: Record<string, (number | null)[]>`
- `const NON_BRANDED_TRAFFIC_WW: Record<string, (number | null)[]>`

This file imports `TRAFFIC_MONTHS as MONTHS` from `seo-data.ts` — so **do not** add a local MONTHS array here. The months are controlled by Section B above.

**Update rules:** Append new values to each vendor array in the same order as `TRAFFIC_MONTHS`.

---

### Section D — "5TH Slide / Total Organic Keywords / Page 1 Keywords"

**Target file:** `src/app/components/presentation/slide-organic-performance.tsx`  
**Target constants:**
- `const MONTHS_8` (primary month array — 8 or 9 data points)
- `const SEARCH_DATA: Record<TrafficMetric, Record<string, number[]>>` — contains sub-keys `google` and `bing` for each vendor

If the CSV has a "Total Organic Keywords" section, check whether it maps to `ORGANIC_KEYWORDS` in `src/app/data/seo-data.ts` (also consumed by slide 8). Update both if present.

**Also update in `seo-data.ts`:**
- `export const ORGANIC_KEYWORDS`
- `export const PAGE_ONE_KEYWORDS`

---

## FILE 2 — `Competitions__URLs_-_2026_-_Summary.csv`

**Target file:** `src/app/components/presentation/slide-cyberglossary-ranking.tsx`  
**Target constant:** `const RANK_DATA: Record<string, number[]>`  
**Target constant:** `const MONTHS = [...]` (local, format `'YYYY-MM'`)

**Vendor key mapping:**

| CSV row label | TypeScript key |
|---|---|
| Fortinet | `fortinet` |
| PAN | `paloalto` |
| Checkpoint | `checkpoint` |
| Crowdstrike | `crowdstrike` |
| Cisco | `cisco` |
| Sentinelone | `sentinelone` |

**Update rules:**
1. The data table starts at the row with headers: `Month, Dec 2025, Jan 2026, …`
2. Read all month columns and vendor rows.
3. If new months appear beyond the current `MONTHS` array end, append them.
4. Append the corresponding page count values to each vendor's `RANK_DATA` array.
5. Blank cells in this CSV mean data not available — map to `null`.

> **Note:** The `DA` constant in this file (`const DA: Record<string, number>`) contains Domain Authority scores — these are **not** in the CSV and should not be changed.

---

## FILE 3 — `Fortinet_Content_Tracker_-_2026_-__International_Pages__Organic_Traffic_.csv`

**Target file:** `src/app/components/presentation/slide-international-pages-traffic.tsx`  
**Target constants:**
- `const MONTHS = [...]` (local, format `'YYYY-MM'`)
- `const ORGANIC_COUNTRIES` — array of `{ id, name, color, data: number[] }`
- `const DIRECT_COUNTRIES` — array of `{ id, name, color, data: number[] }`

**Country row mapping (ORGANIC_COUNTRIES):**

| CSV row label | `id` in constant |
|---|---|
| Total | `total` (index 0) |
| LAT / Latin America | `lat` (index 1) |
| BR / Brazil | `br` (index 2) |
| JP / Japan | `jp` (index 3) |
| KR / Korea | `kr` (index 4) |
| TW / Taiwan | `tw` (index 5) |
| DE / Germany | `de` (index 6) |
| FR / France | `fr` (index 7) |
| CN / China | `cn` (index 8) |
| IT / Italy | `it` (index 9) |

> The order in the constant may differ — match by `id` field, not array position.

**Update rules:**
1. The CSV summary section (top rows) contains one row per country. Read month columns.
2. If new months appear, append to local `MONTHS` array and to each country's `data` array.
3. The bottom ~3,000 rows are individual URLs — **do not** use these for the constants above (they feed a different table, not currently in a TypeScript constant).
4. The `ORGANIC_BR_GL_DATA` and `DIRECT_GL_DATA` tables are **gain/loss tables** showing `{ country, jun, jul, change }` — these must be updated manually with the latest two months' delta. Update the `jun` field to the **previous** month value and `jul` field to the **current** (newest) month value, and recalculate `change = jul - jun`.

---

## FILE 4 — `Top_5_KWs_in_Focus_Categories__-_Tofu_Mofu_Bofu__Aug_.csv` (or current month)

**These are full replacements** — replace the entire `KEYWORD_GAP_DATA` constant in each slide file. Do not merge; do not preserve old rows unless they appear in the new CSV.

### Slide → File → Category mapping

| Slide # | File | CSV Category / Tab name |
|---|---|---|
| 19 | `slide-firewall.tsx` | Firewall / NGFW |
| 20 | `slide-sdwan-metrics.tsx` | SD-WAN |
| 21 | `slide-ot-security.tsx` | OT Security |
| 22 | `slide-dashboard.tsx` | SASE |
| 23 | `slide-zero-trust.tsx` | Zero Trust |
| 24 | `slide-cloud-security.tsx` | Cloud Security / CNAPP |
| 26 | `slide-ai-cybersecurity.tsx` | AI Cybersecurity |
| 27 | `slide-quantum-security.tsx` | Quantum Security |

> Slide 25 (`slide-ransomware.tsx`) has **no** `KEYWORD_GAP_DATA` — skip it.

### CSV column → TypeScript field mapping

| CSV column | TypeScript field |
|---|---|
| Keyword | `keyword` |
| SV (Search Volume) | `sv` |
| KD (Keyword Difficulty) | `kd` |
| Fortinet | `fortinet` |
| Cisco | `cisco` |
| Paloaltonetworks / Palo Alto | `paloalto` |
| Checkpoint / Check Point | `checkpoint` |
| Crowdstrike | `crowdstrike` |

### Data conversion rules
- CSV cell is `"-"` or blank → `null`
- CSV cell is a number (e.g., `4`) → integer `4`
- SV and KD are always integers — round if decimal

### TOFU / MOFU / BOFU classification
Each keyword in the CSV is tagged TOFU, MOFU, or BOFU. Map to the matching sub-array in `KEYWORD_GAP_DATA`:
```ts
const KEYWORD_GAP_DATA = {
  tofu: [ /* TOFU rows */ ],
  mofu: [ /* MOFU rows */ ],
  bofu: [ /* BOFU rows */ ],
};
```

### TypeScript row shape
```ts
{ keyword: string, sv: number, kd: number, fortinet: number | null, cisco: number | null, paloalto: number | null, checkpoint: number | null, crowdstrike: number | null }
```

### Tab label
Each of these slide files has a tab button labeled `'Priority Keywords'`. **Do not rename it** — it was already updated and must stay as-is.

---

## FILE 5 — Untapped Keywords (any filename containing "Untapped")

**Target file:** `src/app/components/presentation/slide-opportunities.tsx` (Slide 11)  
**Target constant:** Look for a constant named `UNTAPPED_KEYWORDS`, `OPPORTUNITY_DATA`, or similar near the top of the file. Read the file first to find the exact name.

**Update rules:**
1. Read the slide file to identify the constant structure.
2. Replace all rows with the new CSV data.
3. Field mapping will depend on the CSV columns — map intuitively (keyword, SV, KD, difficulty, opportunity score, etc.).
4. If the constant structure does not match the CSV shape, **do not guess** — list this under "Could Not Update" in the summary.

---

## FILE 6 — Website Experience DOCX (Slide 46)

**Accepted filename patterns:** `WebsiteExperience_2026-*.docx`, `WebsiteExperinece_2026*.docx`, `Website_Experinece_2026.docx` (the source files use multiple spellings).  
**Target file:** `src/app/components/presentation/slide-competitive-findings.tsx`  
**Target constant:** `const findings: Finding[]`  
**Asset targets:** `src/imports/sum_tab_1.png` onward; a document can contain more screenshots than tabs, so use `screenshot2`…`screenshot5` and create/import `sum_tab_5.png`, `sum_tab_6.png`, etc. as needed.  
**Slide metadata:** `slideNumber={46}`, subtitle/footer must state the source month.

The DOCX is the source of truth for four tab sections. Update only tab copy, competitor names, URLs and screenshot assets—do not restructure the slide.

### Extraction procedure

1. Treat the DOCX as a zip. Extract `word/document.xml`, `word/_rels/document.xml.rels`, and all `word/media/*` files to `/tmp` (not a repository sidecar folder).
2. Parse paragraphs in document order. Resolve `w:hyperlink r:id` and `a:blip r:embed` through `document.xml.rels`; do not guess URLs or screenshot order from filenames.
3. Open every extracted image with the Read tool and match it to its section by visible page content.
4. Copy the selected files to `src/imports/sum_tab_N.png`; import each asset as an ES module. Use `ImageWithFallback`, not literal `/src/imports/...` paths.
5. Keep exactly four findings/tabs. When a section has multiple screenshots, attach them to the same finding with `screenshot2`, `screenshot3`, etc.

### Oct-26 document mapping — `Website_Experinece_2026.docx`

| Tab | Finding title / competitor | URLs from DOCX | Screenshot mapping |
|---|---|---|---|
| 1 | `Competitor Vulnerability Databases` · SentinelOne & Wiz | `sentinelone.com/vulnerability-database/`, `wiz.io/vulnerability-database` | `image6.png` → `sum_tab_1.png` (SentinelOne); `image2.png` → `sum_tab_5.png` (Wiz, `screenshot2`) |
| 2 | `Wiz Expands Its Cloud Security Content Ecosystem` · Wiz | `cloudvulndb.org`, `wiz.io/crying-out-cloud` | `image4.png` → `sum_tab_2.png` (Cyber Model Arena); `image5.png` → `sum_tab_6.png` (podcast, `screenshot2`) |
| 3 | `Healthcare Solutions: Keyword Expansion Opportunity` · SentinelOne | `sentinelone.com/platform/healthcare/`, `fortinet.com/solutions/industries/healthcare` | `image1.png` → `sum_tab_3.png` |
| 4 | `Cybersecurity AI: Dedicated Research Labs` · CrowdStrike | Cyber Superintelligence Lab main + `/research/` URLs | `image3.png` → `sum_tab_4.png` |

The Oct DOCX also mentions Cyber Model Arena in the narrative even though no direct arena URL is supplied; show the screenshot and use only the URLs that exist in the document.

### `findings` field rules

- `title`: use the DOCX section heading, cleaned only for grammar.
- `description[]`: preserve the observation and add one concise Fortinet SEO/AEO implication. Do not invent competitor claims.
- Multiple reference URLs: use the primary URL in `url`/`urlDisplay`; represent additional URLs as linked description objects `{ text, link, linkDisplay }`.
- `competitor`: include every competitor represented by the tab (`SentinelOne & Wiz` for tab 1).
- Keep each slot’s existing color tokens; icons may change to match the new topic.
- `screenshot`: keep the established four aliases (`imgZeroTrust`, `imgZeroTrustInfographic`, `imgZeroTrustService`, `imgStrategicCTA`). Add descriptive aliases for screenshots 5+.
- Set `SlideContainer` to slide 46 and update subtitle/footer to `Oct 2026` for this run.

### Validation

- Four findings exactly.
- Every DOCX section appears once; all supplied hyperlinks are represented.
- All embedded images are reviewed, and every image used by the slide exists and imports successfully.
- Run an esbuild/TypeScript syntax check on `slide-competitive-findings.tsx`.
- Do not carry forward the previous month’s Check Point report, Wiz threat hub, PQC tester or AI-summary tabs unless they are present in the new DOCX.

---

## FILE 7 — Category Chart Data (Slides 19–27)

Each category slide (NGFW/Firewall, SD-WAN, OT Security, SASE, Zero Trust, Cloud Security, Ransomware, AI Cybersecurity, Quantum Security) has **four** monthly data constants that track competitor performance within that category. These are separate from the priority keywords tab (FILE 4).

### Slide → File mapping

| Slide # | File |
|---|---|
| 19 | `slide-ngfw.tsx` |
| 20 | `slide-sdwan-metrics.tsx` |
| 21 | `slide-ot-security.tsx` |
| 22 | `slide-dashboard.tsx` |
| 23 | `slide-zero-trust.tsx` |
| 24 | `slide-cloud-security.tsx` |
| 25 | `slide-ransomware.tsx` |
| 26 | `slide-ai-cybersecurity.tsx` |
| 27 | `slide-quantum-security.tsx` |

### Target constants in each file

| Constant | Description |
|---|---|
| `TOTAL_KEYWORDS_ABS` | Total organic keywords for this category |
| `PAGE_ONE_KW_ABS` | Page-1 keywords for this category |
| `CUMULATIVE_TRAFFIC_ABS` | Cumulative organic traffic for this category |
| `AIO_DATA_ABS` | AI Overview keyword count for this category |

All four constants share the **same** `MONTHS` array in the file (format `'YYYY-MM'`).

### Vendor key mapping (per-category slides)

| CSV / data column | TypeScript key |
|---|---|
| Fortinet | `fortinet` |
| Cisco | `cisco` |
| HPE / hpe | `hpe` |
| Palo Alto / PaloAlto | `paloalto` |
| Check Point / Checkpoint | `checkpoint` |
| CrowdStrike / Crowdstrike | `crowdstrike` |
| Cato / Cato Networks | `catonetworks` ← note: underscore-free, not `cato` |
| SentinelOne | `sentinelone` |
| Wiz | `wiz` |

> Some vendors have `null` leading entries because their category data started later. Preserve those nulls — only append to the end of each array.

### Update rules

1. Read the file. Count entries in the existing `MONTHS` array and confirm it matches each vendor's array length.
2. Identify new months in the source data that are not yet in `MONTHS`.
3. Append new `'YYYY-MM'` entries to `MONTHS`.
4. Append new values to every vendor array in all four constants for each new month. Use `null` if a vendor has no data for that category/month.
5. After appending, **update the hardcoded `latestIndex`** constant inside the component function:
   - Find `const latestIndex = N; // [Month Year]` near the ranking/bar-chart logic.
   - Update `N` to `MONTHS.length - 1` (new last index) and update the comment.
6. Update the slide `subtitle` prop and `SlideFooter source` string to reflect the new date range.

---

## FILE 8 — WW Organic Traffic (Slide 16)

**Target file:** `src/app/components/presentation/slide-organic-traffic-performance.tsx`  
**Target constant:** `const DATA: Record<string, number[]>`  
**Target constant:** `const MONTHS = [...]` (local, format `'YYYY-MM'`)

This slide tracks **worldwide** organic traffic (not US-only) for 9 vendors.

### Vendor key mapping

| Data column | TypeScript key |
|---|---|
| Fortinet | `fortinet` |
| Cisco | `cisco` |
| HPE | `hpe` |
| Palo Alto | `paloalto` |
| Check Point | `checkpoint` |
| CrowdStrike | `crowdstrike` |
| Cato / Cato Networks | `cato` ← note: different from category slides |
| SentinelOne | `sentinelone` |
| Wiz | `wiz` |

### Update rules

1. Append new `'YYYY-MM'` entries to local `MONTHS`.
2. Append new monthly values to each vendor in `DATA`. Values are raw integers (e.g. `3000000`).
3. Update the `formatMonth` map to include the new month key.
4. In the component function, find the lines that index into the arrays for insight calculations:
   ```ts
   const ftLatest  = DATA.fortinet[N];
   const ciscoLatest = DATA.cisco[N];
   // etc.
   ```
   Update all `[N]` to the new last index (`MONTHS.length - 1`).
5. Update `subtitle` prop: `"Organic Traffic · Dec 2025 – [Old Month]"` → new end month.
6. Update `SlideFooter source` string.
7. Update any hardcoded month names in insight card `content` strings (e.g. `"in Aug"` → `"in Sep 2026"`).

---

## FILE 9 — Website Performance (Slide 28)

**Target file:** `src/app/components/presentation/slide-website-performance.tsx`  
**Target constants:**
- `const DESKTOP: Record<string, MetricData>` — desktop scores
- `const MOBILE: Record<string, MetricData>` — mobile scores
- `const MONTHS = [...]` (local, format `'YYYY-MM'`)

Each vendor's `MetricData` has three sub-arrays:

| Sub-key | Description | Unit |
|---|---|---|
| `performance` | Performance score | 0–100 integer |
| `accessibility` | Accessibility score | 0–100 integer |
| `speed` | Speed Index / LCP | seconds (float, 1 decimal) |

### Vendor key mapping (6 vendors only)

| Data column | TypeScript key |
|---|---|
| Fortinet | `fortinet` |
| Cisco | `cisco` |
| HPE | `hpe` |
| Palo Alto | `paloalto` |
| Check Point | `checkpoint` |
| CrowdStrike | `crowdstrike` |

> Cato, SentinelOne, and Wiz are **not** tracked in this slide.

### Update rules

1. Append new `'YYYY-MM'` to local `MONTHS`.
2. Append one new value to each of the three sub-arrays (`performance`, `accessibility`, `speed`) for both `DESKTOP` and `MOBILE` for every vendor.
3. Update the `formatMonth` map.
4. Update `subtitle` prop and `SlideFooter source` string.
5. Update hardcoded month names in insight card `content` strings.

---

## FILE 10 — Cyberglossary Keywords, Traffic, Value & Pages (Slide 30)

**Source file:** `Fortinet_Content_Tracker_-_2026_-_Cyberglossary_competitor_analysis*.csv`  
**Target file:** `src/app/components/presentation/slide-cyberglossary-keywords.tsx`  
**Target constant:** `const DATA: Record<string, VendorMetrics>`  
**Target constant:** `const MONTHS = [...]` (local, format `'YYYY-MM'`)

Each vendor entry has type `VendorMetrics = { keywords: number[]; traffic: number[]; value: number[]; pages: number[] }`.

### Vendor key mapping (6 vendors)

| Data column | TypeScript key |
|---|---|
| Fortinet | `fortinet` |
| Cisco | `cisco` |
| HPE | `hpe` |
| Palo Alto | `paloalto` |
| Check Point | `checkpoint` |
| CrowdStrike | `crowdstrike` |

### Update rules

1. Append new `'YYYY-MM'` to local `MONTHS`.
2. For each vendor, append new values to all four sub-arrays (`keywords`, `traffic`, `value`, `pages`).
3. Update the `formatMonth` map.
4. Update `subtitle` prop and `SlideFooter source` string.
5. Update hardcoded month references in all four `renderInsights()` branches (keywords, traffic, value, pages). These often say `"in [Month]"` — update to the new latest month.
6. Update any hardcoded numeric values in insight text (e.g. `"dropped from 60 to 41"`) to match the new latest data point.

**CSV row → metric mapping:**

| CSV row label | `VendorMetrics` field |
|---|---|
| `Organic Keywords (k)` | `keywords` |
| `Organic Traffic (k)` | `traffic` |
| `Traffic Value ($k)` | `value` |
| `# of pages` | `pages` |

The CSV is arranged as horizontal vendor blocks: Fortinet, CISCO, HPE, Palo Alto, Checkpoint, Force Point, CrowdStrike. The slide tracks six vendors only, so **ignore the Force Point block**. Within each vendor block, use the month columns beginning at `2025 Dec` and ending at the newest month; ignore `Avg of Jul- Dec 2025` and `Trendline`. Strip thousands separators and store the displayed integer as-is because the source rows are already labeled in thousands where applicable.

---

## FILE 11 — Cyberglossary Backlinks & Referring Domains (Slide 32)

**Source file:** `Fortinet_Content_Tracker_-_2026_-_Cyberglossary_competitor_analysis*.csv`  
**Target file:** `src/app/components/presentation/slide-cyberglossary-backlinks.tsx`  
**Target constant:** `const DATA: Record<string, VendorMetrics>`  
**Target constant:** `const MONTHS = [...]` (local, format `'YYYY-MM'`)

Each vendor entry has type `VendorMetrics = { backlinks: number[]; domains: number[] }`.

Backlink values are stored as thousands (K) in raw form — store the integer value as-is from the source (e.g. `142` means 142K backlinks if source says "142").

> **Note:** This is cyberglossary-subdomain backlinks data, not the full-site WW backlinks from slide 39. They come from different Ahrefs exports.

### Vendor key mapping (6 vendors — same as FILE 10)

Same as FILE 10 above: `fortinet`, `cisco`, `hpe`, `paloalto`, `checkpoint`, `crowdstrike`.

### Update rules

1. Append new `'YYYY-MM'` to local `MONTHS`.
2. Append new values to `backlinks` and `domains` arrays for each vendor.
3. Update `formatMonth` map, `subtitle`, `SlideFooter source`, and insight card text.

**CSV row → metric mapping:**

| CSV location / row label | `VendorMetrics` field |
|---|---|
| Main vendor-block table → `Backlinks(k)` | `backlinks` |
| Main vendor-block table → `Referring Domains` | `domains` |
| Lower standalone `Backlinks` table | validation copy of `backlinks`; do not append twice |

Use the same six tracked vendors and month-column rules as FILE 10. Ignore Force Point. The lower standalone backlinks table duplicates the backlinks row from the main table and is provided only as a cross-check. Backlinks are already expressed in thousands; store the integer shown in the CSV (for example, `98` means 98K). Referring domains are raw counts; strip commas (for example, `"15,356"` → `15356`).

---

### FILE 11A — Cyberglossary Global Rank & Domain Authority

**Source file:** `Fortinet_Content_Tracker_-_2026_-_Cyberglossary_competitor_analysis*.csv`  
**Target file:** `src/app/components/presentation/slide-cyberglossary-ranking.tsx`  
**Target constants:** `MONTHS`, `RANK_DATA`, `DA`

| CSV row label | Target |
|---|---|
| `Ahrefs Rank` | Append the newest month to each tracked vendor in `RANK_DATA` |
| `Domain Authority` | Replace each tracked vendor's scalar value in `DA` with the newest month |

Use Fortinet, CISCO, HPE, Palo Alto, Checkpoint and CrowdStrike; ignore Force Point. For `Ahrefs Rank`, lower is better. Strip thousands separators before writing. Extend `MONTHS` and `formatMonth`, replace hardcoded latest array indices with `MONTHS.length - 1`, and update insight copy, subtitle and footer to the newest month. Unlike the `Competitions__URLs_-_Summary.csv` described in FILE 2, this competitor-analysis CSV **does include Domain Authority**, so `DA` must be refreshed from its latest-month cells.

---

## FILE 12 — Profound LLM Metrics (Slide 34)

**Target file:** `src/app/components/presentation/slide-profund-metrics.tsx`  
**Target constants:**
- `const VISIBILITY_DATA_INITIAL` — AI Visibility % per vendor per month
- `const SHARE_OF_VOICE_DATA_INITIAL` — Share of Voice % per vendor per month
- `const CITATION_DATA_INITIAL` — Citation Rate % per vendor per month
- `const MONTHS = [...]` — **display-format** strings like `'Nov-25'`, `'Dec-25'` (NOT `'YYYY-MM'`)
- `const MONTH_KEYS = [...]` — `'YYYY-MM'` format keys (parallel array)

> **Critical:** This file uses TWO parallel month arrays. `MONTHS` holds display labels (e.g. `'Sep-26'`); `MONTH_KEYS` holds ISO keys (e.g. `'2026-09'`). **Both must be updated together.**

### Vendor key mapping (8 vendors)

| Data column | TypeScript key |
|---|---|
| Fortinet | `fortinet` |
| Palo Alto | `paloalto` |
| Cisco | `cisco` |
| CrowdStrike | `crowdstrike` |
| Check Point | `checkpoint` |
| Cato / Cato Networks | `catonetworks` |
| SentinelOne | `sentinelone` |
| HPE | `hpe` |

### Update rules

1. Append the new display label (e.g. `'Oct-26'`) to `MONTHS`.
2. Append the new ISO key (e.g. `'2026-10'`) to `MONTH_KEYS`.
3. Append new float values (one decimal place) to each vendor's array in all three constants.
4. Update `const latestIndex = N;` inside `SlideProfundMetrics` to `MONTHS.length - 1`.
5. Update the time-range offset constants inside the function:
   ```ts
   if (range === '3m') return MONTHS.length - 3;
   if (range === '6m') return MONTHS.length - 6;
   ```
   These are currently hardcoded integers — update them to the correct new offsets.
6. Update `subtitle` prop and `SlideFooter source` string.

---

## FILE 13 — Category AIO Performance (Slide 35)

**Target file:** `src/app/components/presentation/slide-category-performance.tsx`  
**Target constant:** `const categories = [...]` — array of category objects, each with a `data` sub-array of monthly objects.

This slide shows AIO score **percentages** (0–100 float) per category, sourced from Profound.

### Data shape per category entry

```ts
{ period: 'YYYY-MM', fortinet: number, top: number, [optionalCompetitor]: number | undefined }
```

- `period` uses `'YYYY-MM'` format.
- `top` is the highest score among all vendors for that month (set equal to whoever leads).
- The optional third competitor field differs per category (see below).

### Category → optional competitor field mapping

| Category id | Optional competitor key |
|---|---|
| `sase` | `paloAlto` |
| `otSecurity` | `paloAlto` (from May 2026 onward) |
| `ztna` | `paloAlto` |
| `cloudSecurity` | *(none — fortinet and top only)* |
| `secOps` | *(none — fortinet and top only)* |
| `firewall` | `cisco`, `paloalto` (note lowercase `p`) |
| `quantumSecurity` | `paloAlto` |
| `aiCybersecurity` | `crowdstrike` |

### Update rules

1. For each category object in the `categories` array, append a new object to its `data` array:
   ```ts
   { period: 'YYYY-MM', fortinet: X.X, top: Y.Y, [competitor]: Z.Z }
   ```
2. `top` = the maximum score among all vendors for that month.
3. If a competitor value is not provided for a category this month, omit the key entirely (do not set to `undefined`).
4. Update the `fortinetInsight.content` and `competitionInsight.content` strings in each category to reflect the latest month's values and delta vs. prior month.
5. Update `subtitle` prop and `SlideFooter source` string.

---

## FILE 14 — AIO Keywords & Traffic (Slide 36)

**Target file:** `src/app/components/presentation/slide-ai-overview.tsx`  
**Target constants:**
- `const AIO_KEYWORDS_DATA_INITIAL: Record<string, number[]>`
- `const AIO_TRAFFIC_DATA_INITIAL: Record<string, number[]>`
- `const MONTH_KEYS = [...]` — `'YYYY-MM'` format
- `const MONTHS_LABELS = [...]` — display strings like `'Jul 2025'`, `'Sep 2026'`

> **Critical:** This file has TWO parallel month arrays. Both must be updated together, and their lengths must match each vendor array length.

### Vendor key mapping (9 vendors)

| Data column | TypeScript key |
|---|---|
| Fortinet | `fortinet` |
| Cisco | `cisco` |
| HPE | `hpe` |
| Palo Alto | `paloalto` |
| Check Point | `checkpoint` |
| CrowdStrike | `crowdstrike` |
| Cato / Cato Networks | `cato` ← note: `cato`, not `catonetworks` |
| SentinelOne | `sentinelone` |
| Wiz | `wiz` |

### Update rules

1. Append new `'YYYY-MM'` key to `MONTH_KEYS`.
2. Append new display label (e.g. `'Sep 2026'`) to `MONTHS_LABELS`.
3. Append new integer values to each vendor's array in `AIO_KEYWORDS_DATA_INITIAL`.
4. Append new integer values to each vendor's array in `AIO_TRAFFIC_DATA_INITIAL`.
5. Update `const latestIndex = N;` inside the component to `MONTH_KEYS.length - 1`.
6. Update `subtitle` prop and `SlideFooter source` string.
7. Update insight card text with new month name and latest values.

---

## FILE 15 — Featured Snippets (Slide 37)

**Target file:** `src/app/components/presentation/slide-featured-snippets.tsx`  
**Target constant:** `const SNIPPET_DATA: Record<string, (number | null)[]>`  
**Target constant:** `const MONTH_KEYS = [...]` (local, format `'YYYY-MM'`)

### Vendor key mapping (9 vendors)

| Data column | TypeScript key |
|---|---|
| Fortinet | `fortinet` |
| Cisco | `cisco` |
| HPE | `hpe` |
| Palo Alto | `paloalto` |
| SentinelOne | `sentinelone` |
| CrowdStrike | `crowdstrike` |
| Check Point | `checkpoint` |
| Cato / Cato Networks | `cato` |
| Wiz | `wiz` |

Also check the `H2_AVG` constant — this holds Jul–Dec 2025 averages and does **not** change month to month. Leave it as-is.

### Update rules

1. Append new `'YYYY-MM'` to `MONTH_KEYS`.
2. Append new integer (or `null`) to each vendor's array in `SNIPPET_DATA`.
3. Update `formatMonth` map.
4. Update `const latestIdx = N;` inside the component to `MONTH_KEYS.length - 1`.
5. Update `subtitle` prop, `SlideFooter source`, and insight card text.

---

## FILE 16 — Fortinet Backlinks by Source (Slide 39)

**Target file:** `src/app/components/presentation/slide-fortinet-backlinks-by-source.tsx`  
**Target constant:** `const SOURCES = [...]` — array of source objects, each with a `data` array.  
**Target constant:** `const MONTHS = [...]` (local, format `'YYYY-MM'`)

This slide tracks **Fortinet-only** backlink counts as reported by five different tools.

### Source → array index mapping

| Source name | `id` in constant | Notes |
|---|---|---|
| Ahrefs | `ahrefs` | index 0 |
| GSC | `gsc` | index 1 |
| SEMRush | `semrush` | index 2 |
| Majestic | `majestic` | index 3 — starts Apr 2026; earlier months are `null` |
| Bing | `bing` | index 4 |

### Update rules

1. Append new `'YYYY-MM'` to local `MONTHS`.
2. Append new value to each source's `data` array. Use `null` if Majestic data is not available.
3. Values are raw integers (e.g. `6600000` for 6.6M).
4. Update `formatMonth` map.
5. Inside the component function, find the index references for insight calculations:
   ```ts
   const ahLatest  = ahData[N];
   const gscLatest = gscData[N];
   const semLatest = semData[N];
   ```
   Update `N` to `MONTHS.length - 1`.
6. Update `subtitle` prop and `SlideFooter source` string.
7. Update insight card text: replace hardcoded month names (e.g. `"in Aug"`) with new latest month.

---

## FILE 17 — `Fortinet_Competetiors_by_category_-_Jul___Aug_2026_-_Competition_Metrics_-_Jul_to_Oct2026*.csv`

**Purpose:** refreshed-basis (Jul-26 methodology) competitor metrics per category. Feeds the four chart constants in FILE 7 for the categories below, plus the two 3-month slides (Network Security, SecOps).

### CSV layout
Stacked blocks. Each block = one *vendor-name row* (e.g. `Fortinet · Check Point · cisco · IBM · Orca Security`) then a header row `<Category>, 2026 Jul, 2026 Aug, 2026 Sep, 2026 Oct, Trend`, then 7 metric rows. Each vendor occupies 6 columns (4 months + Trend + spacer). Parse by walking the vendor-name row, **never by fixed column index**.

| CSV metric row | TypeScript constant (chart tab) |
|---|---|
| `Total  Keywords` (two spaces) | `TOTAL_KEYWORDS_*` (Total Keywords) |
| `Organic Traffic` | `CUMULATIVE_TRAFFIC_*` (Cumulative Traffic) |
| `KWs Ranking on Page 1` | `PAGE_ONE_KEYWORDS_*` / `PAGE_ONE_KW_ABS` (Page 1 Keywords) |
| `KWs Ranking on AIO` | `AIO_DATA_*` (AIO) |
| `SV`, `KWs Ranking on Top 3  position`, `Average Ranking Position` | **not used** |

### CSV block → slide file
| CSV block title | Slide file | Slide # | Constants |
|---|---|---|---|
| `NGFW/Firewall` | `slide-ngfw.tsx` | 19 | `TOTAL_KEYWORDS_ABS`, `PAGE_ONE_KW_ABS`, `CUMULATIVE_TRAFFIC_ABS`, `AIO_DATA_ABS` |
| `SD WAN` | `slide-sdwan-metrics.tsx` | 20 | `*_DATA_INITIAL` (4 constants) |
| `OT Security` | `slide-ot-security.tsx` | 21 | `*_DATA_INITIAL` |
| `SASE` | `slide-dashboard.tsx` | 22 | `*_DATA_INITIAL` |
| `Zero Trust (OR) ZTNA` | `slide-zero-trust.tsx` | 23 | `*_DATA_INITIAL` |
| `Cloud Security` | `slide-cloud-security.tsx` | 24 | `*_DATA_INITIAL` (only IBM + Orca come from this file — see source rule) |
| `Network Security` | `slide-network-security.tsx` | — | `TOTAL_KEYWORDS_DATA`, `TRAFFIC_DATA`, `PAGE_ONE_DATA`, `AIO_DATA` (+ `MONTHS`, `latestIdx`) |
| `SECOPS` | `slide-secops.tsx` | — | `TOTAL_KEYWORDS_DATA`, `TRAFFIC_DATA`, `PAGE_ONE_DATA`, `AIO_DATA` (+ `MONTHS`) |

### CSV vendor label → TypeScript key
`Fortinet→fortinet` · `cisco→cisco` · `Check Point→checkpoint` · `Palo Alto→paloalto` · `HPE→hpe` · `Cato Networks→catonetworks` · `Force Point→forcepoint` · `Zscaler→zscaler` · `Dragos→dragos` · `IBM→ibm` · `Akamai→akamai` · `Orca Security→orca` · `Imperva→imperva` · `Crowd Strike→crowdstrike` · `Redcanary→redcanary` · `Secopsolution→secopsolution` · `Splunk→splunk`.

### ⚠️ SOURCE RULE — which file feeds which vendor (data-basis conflict)
Ahrefs changed the keyword basis in **Jul-26** (e.g. NGFW Fortinet 900 → 1,522). The deck holds a *mixed-basis* series by design. **Do not restate Jul–Sep.** Instead, for every vendor/constant:

1. Compare the deck's last three values (Jul/Aug/Sep-26) with this file's Jul/Aug/Sep columns for that vendor.
2. **Match → this file is that vendor's source: append its Oct value.**
3. **No match / vendor absent from this file → the vendor is sourced from `Fortinet_Competition_Raw_Data_-_Category*.csv` (FILE 7).** Append that file's `2026 Oct` value for the same vendor/category (row labels there: `Total  Keywords`, `Cumulative traffic*`, `No. of KWs Ranking on Page 1`, `AIO`; category labels carry a `(> SV 50)` suffix, vendor `Cato Network`, `Checkpoint`, `Crowdstrike`, `Sentinelone`).
4. Missing/`Nil`/blank Oct → `null`, never `0`.

Resulting split (Oct-26 run): *this file* → NGFW (Fortinet, Cisco, Palo Alto, Check Point, Zscaler), SD-WAN (Fortinet, Cisco, HPE, Palo Alto, Cato), OT (Fortinet, Dragos, IBM), SASE (Fortinet, HPE, Palo Alto, Check Point, Cato, Zscaler), Zero Trust (Fortinet, Palo Alto, Akamai), Cloud (IBM, Orca). *Category raw file* → everything else, and all of Ransomware / AI Cybersecurity / Quantum Security (slides 25–27 have no row in this file).

### Data-quality gates (apply BEFORE writing)
- **Duplicate-column check:** if two vendors have identical Oct values across all 7 rows, one is a paste error. Oct-26: NGFW `Force Point` Oct = Fortinet Oct (1296 / 247690 / 16564 / 880 / 1270 / 899 / 3) → write `null` for Forcepoint Oct.
- **Uniform-collapse check:** if *every* vendor in a block drops >70 % MoM, treat it as a probable partial or methodology-shifted export. Oct-26: SECOPS Fortinet 255→66, Palo Alto 634→102, Splunk 442→65. Per stakeholder direction, **append the supplied Oct values to `slide-secops.tsx`**, but add explicit “validate before presenting” language to the insight cards and Notes summary.
- **Step-change check:** flag any vendor/metric with |MoM| > 35 % (and prior value ≥ 10) in the Notes section. Oct-26 flags: OT (Fortinet/IBM/Dragos all −37 % to −49 %), SASE (Palo Alto +184 %, Fortinet +57 %), AI Cybersecurity (Cisco/Palo Alto/HPE back to pre-Jul-26 levels). Still append the value (it is what the source says) but add a “validate before presenting” clause to the insight text.
- **Restatement check:** if a Sep value already in the deck differs from this file’s Sep column (Oct-26: OT Fortinet traffic Sep 4,935 vs CSV 2,820), restate the deck cell to the CSV value and list it in the summary.

### Per-slide mechanics (same as FILE 7 steps 3–6)
Append `'2026-10'` to `MONTHS`; bump `latestIndex` (`MONTHS.length - 1`); subtitle → `(… – Oct 2026)`; update the comment `// … to Oct 2026 (N months)` and the “Edit … Metrics Data (…)” heading; rewrite the 8 data-driven insight cards (Fortinet + Competition × 4 tabs) so every number/month name is the Oct figure — include Oct MoM %. Do **not** touch the two keyword-gap (Priority Keywords) cards — they come from FILE 4.

---

## FILE 18 — `Fortinet_Content_Tracker_-_2026_-_Top_50_KW_2026*.csv`

**Target file:** `src/app/components/presentation/slide-top50kw-summary.tsx` (Top 50 Keyword Tracking slide, 7 tabs)
**Source:** SEMrush, 5 vendors × Dec-25 … latest month (11 values for Oct-26). Position `101` = not ranking in top 100 (keep as `101`, **not** `null`).

| CSV region | Target constant | Fields |
|---|---|---|
| Top block (rows 3–8, label col F: `# of keywords on page 1 / 2 / 3 / position 1`) | `SUMMARY_DATA[vendor]` | `page1`, `page2`, `page3`, `pos1` — tab *Keyword Summary* |
| Category blocks `NGFW/Firewall`, `Network Security`, `Zero Trust / ZTNA`, `Cloud Security`, `SD WAN & SASE` (labels `# of keywords on page 1`, `# of keywords on position 1`) | `CATEGORY_DATA.ngfw / network / ztna / cloud / sdwan [vendor]` | `page1`, `pos1` |
| Row table starting `Sl.No, Category, Keyword, MSV, KD, …` (48 rows) | `KEYWORDS: KWRow[]` — match by `id` = Sl.No | `msv`, `kd`, and the five arrays `fortinet`, `paloalto`, `checkpoint`, `cisco`, `hpe` |

Vendor column groups (left→right, 13 cols each): Fortinet → Palo Alto → Check Point → Cisco → HPE. Each group = 11 month values then `Trendline` then spacer.

**Update rules**
1. **Append** the Oct value to every array (never insert). Verify first that the CSV’s Dec–Sep values equal the deck’s existing arrays (Oct-26 run: 0 differences) — if they differ, restate and list.
2. `msv` / `kd` **are refreshed every month** in this sheet — overwrite from CSV. Keep the deck’s `cat` label spelling (`OT Security`, `DLP`…) even if the CSV casing differs, because the category dropdown groups on it.
3. Update `MONTHS`, `MONTH_LABELS`, `MONTH_SHORT`, `fmt` map, `MONTH_PILL_LABELS`.
4. Replace every hardcoded `[9]` index with `[L]` where `const L = MONTHS.length - 1` (summary tab), and default `monthIdx` to `MONTHS.length - 1`. Use `MONTHS.length` (not `10`) in “average per month” maths.
5. Rewrite `insights` (summary tab, 4 metrics × 3 cards) and `CATEGORY_INSIGHTS` (5 categories × 2 metrics × 3 cards). Every “peak”, “low”, “since” claim must be checked against the full 11-month array — do not copy old claims forward.
6. Subtitle + footer → `Dec 2025 – Oct 2026`.
7. Flag in Notes: suspicious MSV outliers (Oct-26: `malware protection` 1,830,000; `What is a data breach` 110,000; `5g network security` 12,100) — written as supplied.

---

## FILE 19 — `…Performance_Tracker_Traffic__-_Articles*.csv`

**Target file:** `src/app/components/presentation/slide-articles-pages-traffic.tsx`
**Target constants:** `MONTHS` (Dec-25 start), `formatMonth` map, `GA_DATA`, `GSC_DATA` (each `{ total, branded, nonBranded }`).

| CSV row (top block, label cols C/D) | Constant |
|---|---|
| `Source - GA` → `Branded Traffic` | `GA_DATA.branded` |
| `Non Branded Traffic` | `GA_DATA.nonBranded` |
| `Total Traffic` (first one, under GA) | `GA_DATA.total` |
| `Source - GSC` → `Branded Traffic` | `GSC_DATA.branded` |
| `Non Branded Traffic` | `GSC_DATA.nonBranded` |
| `Total Traffic` (second one, under GSC) | `GSC_DATA.total` |

Values have thousands separators (`"1,035"`) — strip commas. Month columns are `2025 Dec … 2026 Oct` immediately right of `Avg of Jul- Dec 2025` (ignore the `Over all Traffic …` columns further right and the per-URL rows below row ~12).
Append one value per array, add `'2026-10'`/`'Oct-26'`, change “Sep 2026” in insight strings to “Oct 2026”, and update subtitle/footer. Hardcoded facts in insight text (e.g. “May peak of 809”, “from 1,334”) are historical — keep unless the peak changes.

---

## FILE 20 — `…Performance_Tracker_Organic__-_Product_Pages*.csv`

**Target file:** `src/app/components/presentation/slide-product-pages-traffic.tsx`
**Target constants:** `MONTHS` (Jul-25 start, 15→16 entries), `formatMonth`, `GA_DATA`, `GSC_DATA`.

| CSV row | Constant |
|---|---|
| `Source - GA` → `Branded Traffic` | `GA_DATA.branded` |
| `Non Branded Traffic` | `GA_DATA.nonBranded` |
| `Total Traffic` | `GA_DATA.total` |
| `Source - GSC` → `Branded Clicks` | `GSC_DATA.branded` |
| `Non Branded Clicks` | `GSC_DATA.nonBranded` |
| `Total Clicks` | `GSC_DATA.total` |

The CSV only has Dec-25 → Oct-26 columns; the deck’s Jul–Nov 2025 values are historical — **append only the new month**. Insight code references `GSC_DATA.total[13]`/`branded[13]` as “previous month” — after appending, change those to `[14]` (= Sep) so “from X in Sep” stays correct.

---

## FILE 21 — `…Performance_Tracker_Organic__-_CyberGlossary*.csv`

**Target file:** `src/app/components/presentation/slide-cyberglossary-traffic.tsx` (shared by FILES 21–23; `MONTHS` Jul-25 start)

| CSV row (label col H) | Constant | Slide tab |
|---|---|---|
| `Source - GA` block: `Branded Traffic` / `Non Branded Traffic` / `Total Organic Traffic` | `GA_DATA.branded / nonBranded / total` | Organic traffic |
| `Source - GSC` block: `Branded Traffic` / `Non Branded Traffic` / `Total Traffic` | `GSC_DATA.branded / nonBranded / total` | Click – GSC |

Append Oct to both objects; add `'2026-10'` to `MONTHS` and `formatMonth`; swap “Sep 2026” → “Oct 2026” in insight strings; GSC insights use `length - 2` for “previous month”, so reword “in Aug” → “in Sep”.

---

## FILE 22 — `…Performance_Tracker_Bing_Clicks__-_CyberGlossary*.csv`

**Target constant:** `BING_DATA` (`slide-cyberglossary-traffic.tsx`). Columns here start at `2025 Jul` (matches `MONTHS`).

| CSV row (label col G) | Field |
|---|---|
| `Branded` | `branded` |
| `Non Branded` | `nonBranded` |
| `Over All CG Pages Clicks` | `total` — **use this row, not `Total  Clicks`** (the deck’s Sep value 4,772 = Over-All row; `Total Clicks` differs by a few clicks) |

Quality gate: branded + non-branded must equal `Over All`. Oct-26: 4,188 + 130 = 4,318 ✔. Flag when Branded % > 95 % (Oct-26 = 97 % → non-branded 130 vs ~1,050 normal looks incomplete; append as supplied but note it).

---

## FILE 23 — `…Performance_Tracker_Direct__-_CyberGlossary*.csv`

**Target constants (same slide):** `DIRECT_DATA` and `DIRECT_GL_DATA`.

1. `DIRECT_DATA.total` ← row `Total Direct Traffic` (columns `2025 Dec … 2026 Oct`; Jul–Nov 2025 are historical). The CSV has **no branded/non-branded split** → append `null` to `nonBranded` and `branded`.
2. `DIRECT_GL_DATA` (tab *Direct traffic – Gain & Loss*) = **top 10 URLs by absolute gain, previous month → latest month**, built from the URL-level rows (header row starts `Sno, Web page, Page Type…`; URL in col E, keyword = `Target Keyword` col H; use the last two month columns). Fields: `{ url, keyword, prev, curr, change, pct }` (`prev`/`curr` replace the old `jun`/`jul`). Check `Σ prev` and `Σ curr` over **all** URL rows equals the `Total Direct Traffic` of those two months (Oct-26: 18,470 / 17,990 ✔).
3. Update the tab header (“Sep 2026 → Oct 2026”), both column headers, and the footer string (`Sep–Oct 2026`).
4. Hardcoded numbers in the *Direct* insight cards (e.g. `18470`, `17260`) are literals — replace with the new latest/previous values.

---

## FILE 24 — International pages (Direct + Organic)

**Target file:** `src/app/components/presentation/slide-international-pages-traffic.tsx`
**Constants:** `MONTHS`, `formatMonth`, `ORGANIC_COUNTRIES`, `DIRECT_COUNTRIES` (each `{ id, name, color, data[] }`).

| CSV file | Rows used | Constant |
|---|---|---|
| `…International_Pages__Direct_Traffic_*.csv` | summary rows `BR, CN, DE, FR, IT, JP, KR, LAT, TW, Total` (cols D = country, month columns `2025 Dec … 2026 Oct`) | `DIRECT_COUNTRIES` (match by `id`, lowercase) |
| `…International_Pages__Organic_Traffic_*.csv` (the version whose header ends `2026 Oct`) | same row labels | `ORGANIC_COUNTRIES` |

Append **one** Oct value per country; leave the 3,000+ URL rows alone. Integrity check: sum of the 8 non-CN countries must equal `Total` (Oct-26 direct 10,234 ✔, organic 55,486 ✔).
Insight cards use hardcoded indices (`data[14]`, `data[12]`, `data[13]`, `data[11]`) — after appending, “latest” = index 15; keep Jun = 11, Jul = 12, Aug = 13, Sep = 14, and add Sep as the “previous” reference in the MoM sentence.

---

## DEFAULT FILE-TO-SLIDE ROUTING CHEAT-SHEET (Oct-26 batch)

| CSV | → slide file |
|---|---|
| Competitors_by_category (Jul→Oct) | `slide-ngfw`, `slide-sdwan-metrics`, `slide-ot-security`, `slide-dashboard` (SASE), `slide-zero-trust`, `slide-cloud-security` (IBM/Orca), `slide-network-security`, `slide-secops` |
| Competition_Raw_Data_-_Category | `slide-cloud-security`, `slide-ransomware`, `slide-ai-cybersecurity`, `slide-quantum-security` + legacy vendors on slides 19–23 |
| Top_50_KW_2026 | `slide-top50kw-summary` |
| Performance_Tracker_Traffic_-_Articles | `slide-articles-pages-traffic` |
| Performance_Tracker_Organic_-_Product_Pages | `slide-product-pages-traffic` |
| Performance_Tracker_Organic_-_CyberGlossary | `slide-cyberglossary-traffic` (GA + GSC tabs) |
| Performance_Tracker_Bing_Clicks_-_CyberGlossary | `slide-cyberglossary-traffic` (Bing tab) |
| Performance_Tracker_Direct_-_CyberGlossary | `slide-cyberglossary-traffic` (Direct + Gain/Loss tabs) |
| International_Pages (Direct / Organic) | `slide-international-pages-traffic` |
| Cyberglossary_competitor_analysis | `slide-cyberglossary-ranking` (Ahrefs Rank + DA) + `slide-cyberglossary-keywords` (organic keywords, traffic, value, pages) + `slide-cyberglossary-backlinks` (backlinks, referring domains) |


---

## FILE 25–32 — EXACT CSV LOCATIONS FOR THE REMAINING FILES (Oct-26 run)

These files were already described by FILES 1–16, but the *row/column locations* and target slides below were verified against the real exports. Use them instead of guessing.

### 25 — `Fortinet_Competition_Raw_Data_-_All*.csv` (FILE 1, 2 data blocks per section)
Months run `2025 Jul … 2026 Oct` (16 columns). Values carry suffixes (`4.6M`, `862k`, `3.69 M`, `1,234`) → convert to integers (`k`×1e3, `M`×1e6). Vendor labels have trailing spaces (`Fortinet `, `Check Point `).

| Block (row label) | Month columns | Target |
|---|---|---|
| `Pages` / `Organic Pages` rows (incl. **Force Point**) | C–R | `slide-organic-pages-overview.tsx` `DATA` (deck starts Dec-25 → append only Oct; `cato`=Cato Networks, `forcepoint` present) |
| `Country: US` → `Overall Traffic` | C–R | `seo-data.ts` `ORGANIC_TRAFFIC` |
| same rows, `Branded Traffic` block | U–AJ | `BRANDED_TRAFFIC` |
| same rows, `Non Branded Traffic` block | AM–BB | `NON_BRANDED_TRAFFIC` |
| `Location : WW` → `3rd Slide` rows (Overall / Branded / Non-Branded, same column layout) | C–R / U–AJ / AM–BB | `slide-traffic-overview-tabs-ww.tsx` `ORGANIC/BRANDED/NON_BRANDED_TRAFFIC_WW` |
| `5TH Slide` → `Total Organic Keywords` | C–R | `seo-data.ts` `ORGANIC_KEYWORDS` (consumed by `slide-opportunities.tsx`) |
| `Page 1 Keywords` | U–AJ | `PAGE_ONE_KEYWORDS` |

Also bump `TRAFFIC_MONTHS` and `KEYWORD_MONTHS` (seo-data.ts) with `'2026-10'`, and rewrite insight strings in `slide-traffic-overview-tabs.tsx`, `slide-traffic-overview-tabs-ww.tsx`, `slide-opportunities.tsx` (`latestIndex` 14 → 15, subtitle). Verify Jul–Sep in the CSV equal the deck before appending (Oct-26: all matched).
Check: Branded + Non-branded = Overall (Oct-26 Fortinet US 60,474 + 914,912 = 975,386 ✔). Flag a >40 % one-month swing in Fortinet branded (Oct-26: 108,786 → 60,474).

### 26 — `Fortinet_Content_Tracker_-_2026_-_Competiton_Organic.csv` (FILE 8)
Contains **two** WW blocks: `Source - Semrush` (rows ~31–39) and `Source - Ahref` (rows ~60–68, label `Overall Organic …`). `slide-organic-traffic-performance.tsx` is sourced from the **Ahrefs** block (Dec-25 = col D … Oct-26 = col N). Append only Oct; `Wiz.io` row = `wiz`, `Cato Networks` = `cato`. The `US Organic Pages` block (rows ~14–22) equals the Pages block in FILE 25. Replace hardcoded `[9]` indices with `[MONTHS.length - 1]`/`L`. The `Backlinks` table at the bottom is Apr-26 only — ignore.

### 27 — `Fortinet_Competition_Raw_Data_-_Backlink*.csv` → `slide-backlinks.tsx` (not FILE 16)
Two stacked tables, `Referring Domains` (rows 5–13) and `Backlinks` (rows 15–23), 16 month columns `2025 Jul … 2026 Oct`, 9 vendors (`Cato Networks`→`cato`, `Checkpoint`→`checkpoint`). Append Oct to `REFERRING_DOMAINS_DATA_INITIAL` and `BACKLINKS_DATA_INITIAL` (`MONTH_KEYS` + `latestIndex`), integers as-is. Oct-26 note: every vendor’s referring domains jump +4 % … +41 % in one month → likely a SEMrush index refresh; mention it in the insight.

### 28 — `Fortinet_Competition_Raw_Data_-_LLM_Metrics*.csv` (FILES 12, 13, 14)
One sheet, five regions:
| Region | Location | Target |
|---|---|---|
| `Visibility %` / `Share of Voice %` / `Citation %` (Profound) | rows 4–11 / 17–24 / 29–36, cols B–M = `2025 Nov … 2026 Oct` (12) | `slide-profund-metrics.tsx` — append one value (1 decimal, strip `%`); extend `MONTHS`, `MONTH_KEYS`, `MONTH_LABELS_LONG`, `formatMonth`; **3M/6M offsets must be `MONTHS.length - 3 / - 6`**, `latestIndex = MONTHS.length - 1` |
| `AIO Keywords` / `AIO Traffic` (SEMrush) | right-hand block, vendor names in col O, months P–AE = `2025 Jul … 2026 Oct` (16); rows 5–13 / 17–25; thousands separators | `slide-ai-overview.tsx` `AIO_KEYWORDS_DATA_INITIAL`, `AIO_TRAFFIC_DATA_INITIAL` (+`MONTH_KEYS`, `MONTHS_LABELS`, `formatMonth`, `latestIndex`) |
| Category AIO score blocks (`Secure Access Service Edge`, `OT Security`, `ZTNA`, `Cloud Security`, `SecOps`, `Firewall`, `Quantum Security`, `AI Cybersecurity`), cols P–AA = `Nov … Oct` | each block = `Top performer` row + `Fortinet` row | `slide-category-performance.tsx` |

**Category block decoding rule** (non-obvious): `Top performer` = `"XX (score%)"`, XX ∈ FT / PA / CS / CO. If XX = FT, the next row holds the best *competitor* as `"PA (score%)"` and Fortinet = top; otherwise the next row is Fortinet’s plain score and `top` = the leader’s score. Append `{ period:'2026-10', fortinet, top, <competitorKey> }` (SASE/OT/ZTNA/Quantum `paloAlto`; Firewall `paloalto` + `cisco: undefined`; AI `crowdstrike`; Cloud & SecOps none). Also refresh the “Top Performers” legend text and the “Snapshot” header. Beware typos in the sheet (`FT (96..7%)`) — parse with a numeric regex.
Sanity flag: Cloud Security leader 44.8 unchanged Aug–Oct → confirm export refreshed.

### 29 — `Fortinet_Content_Tracker_-_2026_-_Featured_Snippets_and_AI_Overview.csv` (FILE 15)
Only the first table matters: `Website Featured Snippets`, header `Dec 2025 … 2026 Oct` in cols E–O (11), vendor rows 14–22 (`catonetworks`→`cato`). The three lower tables (`AI Keywords`, `AI Traffic`, `Traffic to KW`) duplicate FILE 28 — do not use. Append Oct to `SNIPPET_DATA`; replace hardcoded `latestIdx = 9` by `MONTH_KEYS.length - 1`.
⚠ Oct-26: Fortinet 13 → 0, category total 30 → 1. Append as supplied (0 = genuine zero) but state in an insight card that the Aug→Oct slide is uniform and should be validated in SEMrush; guard divisions by `rankings[1].value`.

### 30 — `Fortinet_Content_Tracker_-_2026_-_Competiton_Page_Speed_Monitoring.csv` (FILE 9)
Blocks `Desktop` (rows 10–12) and `Mobile` (rows 15–17): rows = `Performance`, `Accessibility`, `Speed Index`; each vendor occupies 14 columns, 11 month values (`2025 Dec … 2026 Oct`) after an `Avg of Aug-…` column: Fortinet C–M, Cisco Q–AA, HPE AE–AO, Paloaltonetworks AS–BC, Checkpoint BG–BQ, Crowdstrike BU–CE. Append Oct to `DESKTOP`/`MOBILE`, `MONTHS`, `formatMonth`, subtitle/footer, and **re-read every static claim in `renderInsights()`** (e.g. “at or below 25 every month”, “Sep is the slowest”) — Oct-26 broke two of them.

### 31 — `Fortinet_Content_Tracker_-_2026_-_Bing__Google_and_Yahoo__Organic__Traffic.csv`
| CSV block (col A label) | Target in `slide-organic-performance.tsx` |
|---|---|
| `Organic` → `Google/Bing/Yahoo – Sessions` / `– Users` (rows 8–13, `2025 Dec … 2026 Oct` in C–M) | `SEARCH_DATA.sessions / users` |
| `US Clicks`, `US Impressions` (GSC, Bing, ratio) | `METRICS_DATA['us-clicks' / 'us-impressions']` |
| `WW Clicks`, `WW Impressions` | `METRICS_DATA['ww-clicks' / 'ww-impressions']` |
| `llm traffic` → `Chatgpt / Perplexity / Gemini / Claude – Sessions` | `AI_ENGINES[*].data` |
| `No.of Backlinks` table (GSC, SEMRush, Ahrefs, Bing, Majestic) | `slide-fortinet-backlinks-by-source.tsx` `SOURCES` (FILE 16) |
Append Oct to `MONTHS_8` (+`formatMonth`). The **AIO Metrics tab** (`AIO_COUNTRIES`, `MONTHS_7`) is fed by `…International_AIO_Traffic*.csv`, which has no Oct column yet — leave it at Sep and say so. Use `L = MONTHS_8.length - 1` instead of `[9]` in the insights. Oct-26 flags: GSC impressions −41 % US / −39 % WW while clicks rose (SERP-reporting change, not demand).

### 32 — `Competitions__URLs_-_sep_2026_-_PAN_-_Cyberpedia_URLs*.csv` / `…_Summary*.csv`
Oct column exists in the PAN URL list (`03 Oct 2026`, 804 URLs in the column) but the deck’s PAN total (809 / Sep 804) is **not reproducible** from raw URL counts (Sep column = 790). Without an Oct *Summary* row there is no trustworthy page count → **do not change** `slide-competitive-intel.tsx` / `slide-key-takeaways.tsx`; list under *Could Not Update* until the Summary tab for Oct is provided. `slide-cyberglossary-ranking.tsx` (global rank) needs the Ahrefs rank export, which is not in this batch.


---

## MONTH FORMAT REFERENCE

| Display label | TypeScript key |
|---|---|
| Dec 2025 | `'2025-12'` |
| Jan 2026 | `'2026-01'` |
| Feb 2026 | `'2026-02'` |
| Mar 2026 | `'2026-03'` |
| Apr 2026 | `'2026-04'` |
| May 2026 | `'2026-05'` |
| Jun 2026 | `'2026-06'` |
| Jul 2026 | `'2026-07'` |
| Aug 2026 | `'2026-08'` |
| Sep 2026 | `'2026-09'` |
| Oct 2026 | `'2026-10'` |
| Nov 2026 | `'2026-11'` |
| Dec 2026 | `'2026-12'` |

Continue the pattern for future months: `'YYYY-MM'`.

---

## EXECUTION ORDER

Process updates in this order to avoid dependency issues:

1. `src/app/data/seo-data.ts` — update `TRAFFIC_MONTHS`, `KEYWORD_MONTHS`, `ORGANIC_TRAFFIC`, `BRANDED_TRAFFIC`, `NON_BRANDED_TRAFFIC`, `ORGANIC_KEYWORDS`, `PAGE_ONE_KEYWORDS`
2. `slide-organic-pages-overview.tsx` — update local `MONTHS` + `DATA`
3. `slide-traffic-overview-tabs-ww.tsx` — update `ORGANIC_TRAFFIC_WW`, `BRANDED_TRAFFIC_WW`, `NON_BRANDED_TRAFFIC_WW`
4. `slide-organic-performance.tsx` — update `MONTHS_8`, `SEARCH_DATA`
5. `slide-organic-traffic-performance.tsx` — update local `MONTHS`, `DATA`, index references, subtitle, footer (FILE 8)
6. `slide-cyberglossary-ranking.tsx` — update local `MONTHS` + `RANK_DATA`
7. `slide-cyberglossary-keywords.tsx` — update local `MONTHS`, `DATA` (FILE 10)
8. `slide-cyberglossary-backlinks.tsx` — update local `MONTHS`, `DATA` (FILE 11)
9. `slide-international-pages-traffic.tsx` — update local `MONTHS`, `ORGANIC_COUNTRIES`, `DIRECT_COUNTRIES`, `ORGANIC_BR_GL_DATA`, `DIRECT_GL_DATA`
10. `slide-website-performance.tsx` — update local `MONTHS`, `DESKTOP`, `MOBILE` (FILE 9)
11. `slide-profund-metrics.tsx` — update `MONTHS`, `MONTH_KEYS`, all three data constants, `latestIndex`, time-range offsets (FILE 12)
12. `slide-category-performance.tsx` — append new data objects to each category's `data` array (FILE 13)
13. `slide-ai-overview.tsx` — update `MONTH_KEYS`, `MONTHS_LABELS`, `AIO_KEYWORDS_DATA_INITIAL`, `AIO_TRAFFIC_DATA_INITIAL`, `latestIndex` (FILE 14)
14. `slide-featured-snippets.tsx` — update `MONTH_KEYS`, `SNIPPET_DATA`, `latestIdx` (FILE 15)
15. `slide-fortinet-backlinks-by-source.tsx` — update local `MONTHS`, all five source `data` arrays, index references (FILE 16)
16. All 8 category-chart slides (19–27) — update `MONTHS`, four data constants, `latestIndex` in each (FILE 7)
17. All 8 keyword-gap slides (19–24, 26, 27) — replace `KEYWORD_GAP_DATA` (FILE 4)
18. `slide-opportunities.tsx` — update untapped keyword constant (if file provided)
19. `slide-competitive-findings.tsx` + all extracted `src/imports/sum_tab_*.png` assets — update slide 46 Web Experience from DOCX (if provided)
20. `slide-articles-pages-traffic.tsx`, `slide-product-pages-traffic.tsx` — FILES 19–20
21. `slide-cyberglossary-traffic.tsx` — FILES 21–23 (GA, GSC, Bing, Direct, Direct Gain/Loss)
22. `slide-international-pages-traffic.tsx` — FILE 24 (Direct + Organic)
23. `slide-top50kw-summary.tsx` — FILE 18
24. `slide-network-security.tsx` (and `slide-secops.tsx` once a complete export exists) — FILE 17

---

## BEFORE MAKING ANY EDITS

For each file you are about to edit:
1. **Read the file** using the Read tool.
2. Identify the exact constant name and current array length.
3. Determine which months are already present (count array entries vs. MONTHS array).
4. Only then apply edits.

Do not edit blindly. If a constant does not exist or does not match what this prompt describes, stop and list the discrepancy in the summary instead of guessing.

---

## CHANGE SUMMARY FORMAT

After all edits are complete, output a summary in exactly this format:

```
## Weekly Update Change Summary — [Date]

### Files Updated
| File | Constant | Change |
|---|---|---|
| src/app/data/seo-data.ts | ORGANIC_TRAFFIC | Added Sep 2026 column for all 9 vendors |
| slide-organic-pages-overview.tsx | DATA + MONTHS | Appended Sep 2026 |
| slide-cyberglossary-ranking.tsx | RANK_DATA + MONTHS | Appended Aug 2026 + Sep 2026 |
| slide-dashboard.tsx | KEYWORD_GAP_DATA | Full replacement — SASE TOFU/MOFU/BOFU rows |
| ... | ... | ... |

### Cell-Level Changes (keyword gap slides only)
List only rows where a value changed from the previous data:
- slide-dashboard.tsx → MOFU → "sase platform" → crowdstrike: 3 → null
- slide-cloud-security.tsx → BOFU → "cnapp solutions" → fortinet: null → 1
- ...

### Could Not Update
List anything that was skipped and why:
- Untapped Keywords: slide-opportunities.tsx constant structure did not match CSV columns (CSV has 6 columns, constant expects 4). Manual review needed.
- ...

### Notes
- Any anomalies or data quality issues found in the CSVs.
- Any months that appear in the CSV but already existed in the constants (no change needed).
```

---

## QUICK SANITY CHECKS

After edits, verify:
- [ ] All MONTHS arrays in separate files are aligned (same length as their data arrays)
- [ ] `seo-data.ts` TRAFFIC_MONTHS length matches each vendor array length in ORGANIC_TRAFFIC, BRANDED_TRAFFIC, NON_BRANDED_TRAFFIC
- [ ] `slide-profund-metrics.tsx` — `MONTHS` and `MONTH_KEYS` have equal length; all 3 data constants have equal-length vendor arrays
- [ ] `slide-ai-overview.tsx` — `MONTH_KEYS` and `MONTHS_LABELS` have equal length; both data constants have equal-length vendor arrays
- [ ] `slide-featured-snippets.tsx` — `MONTH_KEYS` length matches each vendor array in `SNIPPET_DATA`
- [ ] `slide-organic-traffic-performance.tsx` — local `MONTHS` length matches each vendor array in `DATA`; all index references updated
- [ ] `slide-website-performance.tsx` — local `MONTHS` length matches each vendor's three sub-arrays in `DESKTOP` and `MOBILE`
- [ ] Category slides (19–27) — local `MONTHS` length matches each vendor array in all four data constants; `latestIndex` = `MONTHS.length - 1`
- [ ] `slide-cyberglossary-keywords.tsx` and `slide-cyberglossary-backlinks.tsx` — local `MONTHS` length matches vendor arrays
- [ ] `slide-fortinet-backlinks-by-source.tsx` — local `MONTHS` length matches each source's `data` array; Majestic may have leading `null` entries — these count toward length
- [ ] No TypeScript syntax errors (unclosed brackets, trailing commas in wrong places)
- [ ] `KEYWORD_GAP_DATA` in each slide has `tofu`, `mofu`, and `bofu` sub-arrays — none missing
- [ ] No `undefined` values — every cell is either a number or `null`
- [ ] Subtitle props and SlideFooter source strings updated in every edited file to reflect the new date range
- [ ] Hardcoded month names in insight card `content` strings updated (search for old month name, e.g. "Aug 2026")
- [ ] `slide-top50kw-summary.tsx` — every array in `SUMMARY_DATA`, `CATEGORY_DATA`, `KEYWORDS` has `MONTHS.length` entries; no hardcoded `[9]`/`/10` left
- [ ] `slide-cyberglossary-traffic.tsx` — `GA_DATA`, `GSC_DATA`, `BING_DATA`, `DIRECT_DATA` arrays all have `MONTHS.length` entries; `DIRECT_GL_DATA` uses `prev`/`curr`
- [ ] `slide-international-pages-traffic.tsx` — every country array has `MONTHS.length` entries; Σ countries = Total
- [ ] Category slides — no duplicated-vendor columns (Forcepoint rule); SecOps partial-looking Oct values are appended with an explicit validation warning; `grep -rn "Sep 2026"` in the 9 category files returns nothing outside Priority-Keyword text
- [ ] `grep -rn "2026-09'" src/app` — every remaining hit is a legitimate historical month, not a stale “latest” reference

---

*End of update prompt. Paste this with your CSV attachments to begin the update.*
