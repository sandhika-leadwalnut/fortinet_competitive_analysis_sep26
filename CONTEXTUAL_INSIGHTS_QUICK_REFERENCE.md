# Contextual Insights - Quick Reference Card

## 🎯 3-Second Overview
Move insights from sidebar → beside each chart. Color code by sentiment. Add executive summary.

---

## 🧩 Component Usage

```tsx
import { ContextualInsightCard } from './design-system';

<ContextualInsightCard
  icon={TrendingUp}
  sentiment="positive"  // green | blue | orange
  headline="Short Title (4-6 words)"
  body="Supporting detail 1-2 lines"
/>
```

---

## 📐 Layout Patterns

### Pattern A: Large Charts (Side-by-Side)
```tsx
<div className="flex gap-6">
  <div className="flex-[68]">
    <ChartContainer height={280}>{chart}</ChartContainer>
  </div>
  <div className="flex-[32] flex items-center">
    <ContextualInsightCard {...} />
  </div>
</div>
```

### Pattern B: Small Charts (Stacked)
```tsx
<div className="flex flex-col gap-4">
  <ChartContainer height={180}>{chart}</ChartContainer>
  <ContextualInsightCard {...} />
</div>
```

### Pattern C: Executive Summary
```tsx
<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
  <p className="text-sm font-medium text-blue-900">
    <span className="font-semibold">Executive Summary:</span> [text]
  </p>
</div>
```

---

## 🎨 Sentiment Guide

| Sentiment | Color | Use For |
|-----------|-------|---------|
| `positive` | 🟢 Green | Growth, wins, leadership |
| `neutral` | 🔵 Blue | Info, comparisons, trends |
| `negative` | 🟠 Orange | Decline, gaps, warnings |

---

## 🔧 Conversion Checklist

- [ ] Create new file: `slide-[name]-contextual.tsx`
- [ ] Import `ContextualInsightCard`
- [ ] Replace grid layout with flex
- [ ] Add insight cards (1 per chart)
- [ ] Remove old sidebar `InsightsSection`
- [ ] Remove inline insight divs
- [ ] Add executive summary
- [ ] Test edit mode
- [ ] Check colors match sentiment

---

## 📊 Example Files

✅ **Slide 4:** `slide-opportunities-contextual.tsx`
✅ **Slide 5:** `slide-ngfw-contextual.tsx`
✅ **Slide 10:** `slide-profund-metrics-contextual.tsx`

---

## 💡 Icon Quick Pick

| Icon | Use |
|------|-----|
| `TrendingUp` | Growth, positive trend |
| `TrendingDown` | Decline |
| `Award` | #1, leadership |
| `Target` | Goals, achievement |
| `BarChart3` | Metrics, data |
| `Sparkles` | Excellence, AI |
| `Shield` | Security |
| `Zap` | Spike, anomaly |
| `AlertCircle` | Warning |

---

## 🚫 What to Remove

1. Right sidebar div (`col-span-4`)
2. `<InsightsSection>` component
3. Inline insight divs (with `border-t`)
4. Generic "Key Insights" title

---

## ✅ What to Keep

1. All chart code
2. All edit functionality
3. Competitor filters
4. Slide header/footer
5. State management

---

## 📏 Key Measurements

- Chart width: `flex-[68]` (68%)
- Insight width: `flex-[32]` (32%)
- Gap: `gap-6` (24px)
- Card padding: `p-4` (16px)
- Headline: `text-base` (16px)
- Body: `text-[13px]` (13px)

---

## ⚡ Common Mistakes

❌ Don't use `col-span-8` and `col-span-4`
✅ Use `flex-[68]` and `flex-[32]`

❌ Don't mix inline and card insights
✅ One card per chart, insights removed from other places

❌ Don't forget executive summary
✅ Always add at bottom of slide

❌ Don't use generic insights
✅ Write Fortinet-specific insights

---

## 🎯 One-Minute Setup

1. Copy example slide that matches your layout
2. Update chart data/labels
3. Write 1-2 line insight for each chart
4. Assign sentiment color
5. Add executive summary
6. Test → Done!

---

## 📞 Help

- **Visual examples:** `CONTEXTUAL_INSIGHTS_BEFORE_AFTER.md`
- **Step by step:** `CONTEXTUAL_INSIGHTS_IMPLEMENTATION_GUIDE.md`
- **Overview:** `CONTEXTUAL_INSIGHTS_DELIVERY_SUMMARY.md`

---

**Print this card and keep beside you while converting slides!**
