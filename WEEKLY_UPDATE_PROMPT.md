# Fortinet SEO Dashboard — Weekly Data Update Prompt

> **How to use:** Copy everything below the horizontal rule and paste it into a new Claude Code session, attach the updated CSV files, then send.

---

---

## CONTEXT

You are updating a **47-slide React/TypeScript SEO Competitive Analysis presentation** located at `/workspaces/default/code/`. The app is built with React 18, TypeScript, Vite, and Tailwind CSS v4.

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
| `WebsiteExperience_2026-*.docx` (any dated version) | Web Experience slide (Slide 23) — competitor site observations + screenshots |
| `Category_Raw_Data_*.csv` (or category section of All.csv) | Per-category keyword/traffic/AIO chart data (Slides 19–27) |
| `WW_Organic_Traffic_*.csv` (or WW section of All.csv) | WW organic traffic by vendor (Slide 16) |
| `WebsitePerformance_*.csv` or pasted scores | Desktop + Mobile PageSpeed/Lighthouse scores (Slide 28) |
| `Cyberglossary_*.csv` (keywords, backlinks sections) | Cyberglossary organic data + backlinks (Slides 30–32) |
| `Profound_*.csv` or pasted Profound export | AI Visibility %, Share of Voice %, Citation Rate % (Slide 34) |
| `AIO_Performance_*.csv` or pasted AIO export | AIO score % by category (Slide 35) + AIO Keywords & Traffic (Slide 36) |
| `FeaturedSnippets_*.csv` or pasted snippet counts | Featured Snippets per vendor (Slide 37) |
| `BacklinksBySource_*.csv` or pasted source table | Fortinet backlinks by tool source (Slide 39) |

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

## FILE 6 — `WebsiteExperience_2026-*.docx` (Web Experience slide — Slide 23)

**Target file:** `src/app/components/presentation/slide-competitive-findings.tsx`  
**Target constant:** `const findings: Finding[]`  
**Screenshot images:** `src/imports/sum_tab_1.png` through `sum_tab_4.png`

This Word document contains **website experience observations** from competitor sites. It has four sections, each becoming one tab in Slide 23. The document includes:
- Descriptive text (title + bullet descriptions per tab)
- Reference URLs to competitor examples
- Embedded screenshots of competitor pages (4 images in the docx)

### Slide 23 tab structure

| Tab # | `sum_tab_*.png` | Typical competitor | Topic |
|---|---|---|---|
| 1 | `sum_tab_1.png` | Check Point | Proprietary research report / brand asset |
| 2 | `sum_tab_2.png` | Wiz | Threat intelligence hub |
| 3 | `sum_tab_3.png` | Wiz | Interactive tool (e.g. PQC Tester) |
| 4 | `sum_tab_4.png` | Wiz | AI-search-ready content format |

> Tab order and topics may change month to month — always re-read the docx sections and match them to the correct tab slot by content, not position.

### Step 1 — Extract docx images

The docx is a zip file. Extract images programmatically:

```python
import zipfile, os
os.makedirs('src/imports/docx_tmp', exist_ok=True)
with zipfile.ZipFile('src/imports/WebsiteExperience_2026-X.docx') as z:
    for name in z.namelist():
        if name.startswith('word/media/'):
            fname = name.split('/')[-1]
            with z.open(name) as f:
                with open(f'src/imports/docx_tmp/{fname}', 'wb') as out:
                    out.write(f.read())
```

Then **read each extracted image** using the Read tool to see what it shows. Match each image to its tab based on content (report cover, tool UI, hub page, article layout, etc.).

### Step 2 — Update screenshot files

Copy images to the correct `sum_tab_N.png` path:

```bash
cp src/imports/docx_tmp/imageX.png src/imports/sum_tab_1.png
cp src/imports/docx_tmp/imageY.png src/imports/sum_tab_2.png
# etc.
```

### Step 3 — Update the `findings` array

Extract the text from the docx (same python zip approach, reading `word/document.xml`), strip XML tags, and update the `findings` array in `slide-competitive-findings.tsx`:

```ts
const findings: Finding[] = [
  {
    icon: Brain,           // or Network, Zap, Target — pick the most fitting lucide icon
    color: '#F97316',      // keep existing color scheme per tab slot
    bgColor: '#FFF7ED',
    title: '...',          // section heading from docx
    description: [
      '...',               // one string per bullet/paragraph
      '...',
    ],
    competitor: '...',     // brand name: 'Check Point', 'Wiz', 'Palo Alto', etc.
    url: 'https://...',    // reference URL from docx
    urlDisplay: '...',     // short display form (domain + path, no https://)
    screenshot: imgZeroTrust,  // keep existing import alias for the tab slot
  },
  // ... repeat for tabs 2–4
];
```

### Color scheme per tab (keep consistent)

| Tab # | `color` | `bgColor` | Icon suggestion |
|---|---|---|---|
| 1 | `#F97316` | `#FFF7ED` | `Brain` |
| 2 | `#8B5CF6` | `#F5F3FF` | `Network` |
| 3 | `#0EA5E9` | `#F0F9FF` | `Zap` |
| 4 | `#F59E0B` | `#FEF3C7` | `Target` |

> Only change icon/color if the topic meaningfully shifts (e.g. a new category replaces an old one).

### Import aliases (do not change these names)

```ts
import imgZeroTrust            from '../../../imports/sum_tab_1.png';
import imgZeroTrustInfographic from '../../../imports/sum_tab_2.png';
import imgZeroTrustService     from '../../../imports/sum_tab_3.png';
import imgStrategicCTA         from '../../../imports/sum_tab_4.png';
```

The import aliases are referenced throughout the JSX — do not rename them. Only the file they point to changes (handled by replacing `sum_tab_N.png` on disk in Step 2).

### What to update vs. what to leave alone

| Element | Update? |
|---|---|
| `title` string | Yes — use docx section heading |
| `description[]` strings | Yes — use docx bullet/paragraph text |
| `competitor` string | Yes — brand shown in docx |
| `url` / `urlDisplay` | Yes — reference URL from docx |
| `screenshot` import alias | No — alias stays, only the .png file on disk changes |
| `icon` / `color` / `bgColor` | Only if topic category fundamentally changes |
| Component JSX / layout | No — do not restructure the slide |

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

---

## FILE 11 — Cyberglossary Backlinks & Referring Domains (Slide 32)

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
19. `slide-competitive-findings.tsx` + `src/imports/sum_tab_1–4.png` — update Web Experience slide from docx (if docx provided)

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

---

*End of update prompt. Paste this with your CSV attachments to begin the update.*
