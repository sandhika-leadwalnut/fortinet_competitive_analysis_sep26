# Contextual Insights Layout Implementation Guide

## Overview
This document explains the new contextual insights layout pattern applied to slides 4, 5, and 10, which can be replicated to the remaining 7 slides.

---

## What Was Changed

### ✅ New Component: ContextualInsightCard
**Location:** `/src/app/components/presentation/design-system.tsx`

A new reusable component for displaying insights beside or below charts:

```tsx
<ContextualInsightCard
  icon={TrendingUp}
  sentiment="positive"  // 'positive' | 'neutral' | 'negative'
  headline="Short Punchy Title"
  body={["Line 1", "Line 2"]}  // or single string
/>
```

**Sentiment Colors:**
- **Positive** (green): Growth, wins, leadership → `bg-green-50`, `border-green-200`
- **Neutral** (blue): Informational, comparison → `bg-blue-50`, `border-blue-200`
- **Negative** (orange): Decline, warnings, gaps → `bg-orange-50`, `border-orange-200`

**Typography:**
- Headline: 16px semi-bold
- Body: 13px regular, line-height 1.4

---

## Layout Patterns

### Pattern A: Side-by-Side (Chart 68% + Insight 32%)
**Used for:** Large charts that need contextual insight to the right

```tsx
<div className="flex gap-6">
  <div className="flex-[68]">
    <ChartContainer title="Chart Title" height={280}>
      {/* Chart content */}
    </ChartContainer>
  </div>
  
  <div className="flex-[32] flex items-center">
    <ContextualInsightCard
      icon={TrendingUp}
      sentiment="positive"
      headline="Key Finding"
      body="Insight text here"
    />
  </div>
</div>
```

### Pattern B: Stacked (Chart Above + Insight Below)
**Used for:** Smaller charts in grid layouts (2 columns)

```tsx
<div className="flex flex-col gap-4">
  <ChartContainer title="Chart Title" height={180}>
    {/* Chart content */}
  </ChartContainer>
  
  <ContextualInsightCard
    icon={Target}
    sentiment="positive"
    headline="Key Finding"
    body="Insight text here"
  />
</div>
```

### Pattern C: Executive Summary Note
**Replaces:** Global "Key Insights" sidebar

```tsx
<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
  <p className="text-sm font-medium text-blue-900">
    <span className="font-semibold">Executive Summary:</span> 
    High-level takeaway in 1-2 sentences max.
  </p>
</div>
```

---

## Example Implementations

### ✅ Slide 4 (Keyword Performance) - COMPLETED
**File:** `slide-opportunities-contextual.tsx`
- **Layout:** 2 charts stacked vertically
- **Pattern:** Pattern A (side-by-side) for both charts
- **Key Changes:**
  - Removed: Right sidebar with 4 InsightCards
  - Added: 2 ContextualInsightCards (1 per chart, positioned right)
  - Added: Executive Summary note at bottom

### ✅ Slide 5 (NGFW/Firewall) - COMPLETED
**File:** `slide-ngfw-contextual.tsx`
- **Layout:** 2 small charts (top row) + 1 large chart (bottom)
- **Pattern:** Pattern B (stacked) for top 2 charts, Pattern A for bottom chart
- **Key Changes:**
  - Removed: Right sidebar with 3 InsightCards
  - Added: 3 ContextualInsightCards (1 per chart)
  - Added: Executive Summary note

### ✅ Slide 10 (LLM Metrics) - COMPLETED
**File:** `slide-profund-metrics-contextual.tsx`
- **Layout:** 3 charts stacked vertically
- **Pattern:** Pattern A (side-by-side) for all 3 charts
- **Key Changes:**
  - Removed: Right sidebar with 2 InsightCards
  - Removed: Inline insights below each chart
  - Added: 3 ContextualInsightCards (1 per chart, positioned right)
  - Added: Executive Summary note

---

## Step-by-Step Implementation for Remaining Slides

### 📋 Slide 3 (Branded vs Non-Branded Traffic Analysis)
**Current file:** `slide-traffic-split.tsx`
**New file:** `slide-traffic-split-contextual.tsx`

**Current State:**
- 2 line charts (Branded, Non-Branded) stacked vertically
- Right sidebar with 3 InsightCards
- No inline insights currently

**Changes Needed:**
1. Apply **Pattern A** to both charts
2. Create insights:
   - **Branded Traffic:** Focus on Fortinet's -38.4% decline but strong positioning (negative sentiment)
   - **Non-Branded Traffic:** Highlight Fortinet's +18.3% growth (positive sentiment)
3. Replace sidebar with Executive Summary note
4. Keep competitor filter at bottom

---

### 📋 Slide 6 (SD-WAN Category)
**Current file:** `slide-dashboard.tsx`
**New file:** `slide-dashboard-contextual.tsx`

**Structure to follow:** Similar to Slide 5 (NGFW)
- If it has multiple small charts → Use **Pattern B** (stacked)
- If it has 1 large chart → Use **Pattern A** (side-by-side)

---

### 📋 Slide 7 (OT Security)
**Current file:** `slide-ot-security.tsx`
**New file:** `slide-ot-security-contextual.tsx`

**Structure to follow:** Similar to Slide 5 (NGFW)

---

### 📋 Slide 8 (SASE Category)
**Current file:** `slide-sdwan-metrics.tsx`
**New file:** `slide-sdwan-metrics-contextual.tsx`

**Structure to follow:** Similar to Slide 5 (NGFW)

---

### 📋 Slide 9 (Zero Trust Security)
**Current file:** `slide-zero-trust.tsx`
**New file:** `slide-zero-trust-contextual.tsx`

**Current State:**
- 2 small bar charts (Total Keywords, Page 1 KWs)
- 1 large line chart (Cumulative Traffic)
- Right sidebar with 2 InsightCards
- Already has inline insights below each chart

**Changes Needed:**
1. Apply **Pattern B** to 2 small charts (stacked)
2. Apply **Pattern A** to large chart (side-by-side)
3. Move inline insights into ContextualInsightCards with proper sentiment colors
4. Remove right sidebar, add Executive Summary

---

### 📋 Slide 11 (AI Overview)
**Current file:** `slide-ai-overview.tsx`
**New file:** `slide-ai-overview-contextual.tsx`

**Current State:**
- 2 charts (Keywords bar chart, Traffic line chart)
- Has inline insights below each chart
- Right sidebar with 2 InsightCards

**Changes Needed:**
1. Apply **Pattern A** to both charts
2. Convert inline insights to ContextualInsightCards
3. Remove right sidebar, add Executive Summary

---

### 📋 Slide 13 (Competition Backlinks)
**Current file:** `slide-backlinks.tsx`
**New file:** `slide-backlinks-contextual.tsx`

**Structure:** TBD (need to examine current layout)
- Likely has 1-2 charts
- Apply appropriate pattern based on chart size

---

## Sentiment Assignment Guidelines

### Positive Sentiment (Green)
- Growth metrics (keyword increases, traffic gains)
- Leadership positions (#1, highest, dominant)
- Competitive advantages
- Strategic wins

### Neutral Sentiment (Blue)
- Informational comparisons
- Market observations
- Industry trends
- Stable performance

### Negative Sentiment (Orange)
- Declining metrics
- Competitive gaps
- Areas requiring attention
- Warning signals
- Volatility concerns

---

## Icon Selection Guide

**Growth/Performance:**
- `TrendingUp` - Positive growth
- `TrendingDown` - Decline
- `BarChart3` - Data/metrics
- `Target` - Achievement, goals

**Leadership/Quality:**
- `Award` - #1 position, leadership
- `Shield` - Security, protection
- `Sparkles` - Excellence, standout

**Alerts/Actions:**
- `AlertCircle` - Warning, attention needed
- `Zap` - Anomaly, spike
- `Users` - Market, audience

---

## Implementation Checklist

For each slide conversion:

- [ ] Create new file: `slide-[name]-contextual.tsx`
- [ ] Import `ContextualInsightCard` from design-system
- [ ] Identify all charts and their current insights
- [ ] Assign sentiment to each insight (positive/neutral/negative)
- [ ] Choose appropriate pattern (A or B) based on chart size
- [ ] Write concise, Fortinet-focused insight copy
- [ ] Remove old inline insight divs (the ones with border-t)
- [ ] Remove or convert right sidebar InsightsSection
- [ ] Add Executive Summary note at bottom
- [ ] Test layout at different screen sizes
- [ ] Verify edit functionality still works

---

## Testing & Validation

After implementing each slide:

1. **Visual Check:**
   - Insights cards align properly with charts
   - Sentiment colors appropriate
   - Typography consistent (16px headline, 13px body)
   - Proper spacing (24px gap)

2. **Functionality Check:**
   - Edit mode still works
   - Competitor filter toggles correctly
   - Charts render properly
   - Data integrity preserved

3. **Content Check:**
   - Insights are Fortinet-focused
   - Data matches exactly
   - No typos or formatting issues

---

## File Naming Convention

- **Original files:** Keep unchanged
- **New contextual versions:** Add `-contextual` suffix

Example:
- Original: `slide-opportunities.tsx`
- New: `slide-opportunities-contextual.tsx`

---

## Summary of Key Benefits

✅ **Improved Context:** Insights directly beside relevant charts
✅ **Visual Clarity:** Sentiment colors guide interpretation
✅ **Cleaner Layout:** No separate sidebar cluttering the view
✅ **Better Scanning:** Easier to read top-to-bottom
✅ **Consistent Pattern:** Same layout rules across all slides
✅ **Maintainability:** Reusable component, easy updates

---

## Next Steps

1. Review the 3 completed example slides
2. Choose next slide to implement (recommend Slide 9 - Zero Trust)
3. Follow the step-by-step pattern
4. Test thoroughly
5. Repeat for remaining slides

---

**Questions or Issues?**
Refer to the completed examples in:
- `/src/app/components/presentation/slide-opportunities-contextual.tsx`
- `/src/app/components/presentation/slide-ngfw-contextual.tsx`
- `/src/app/components/presentation/slide-profund-metrics-contextual.tsx`
