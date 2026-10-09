# Slide Standardization Guide

## Completed Slides (5/18)
✅ slide-cover.tsx - Clean, professional cover design
✅ slide-executive.tsx - Standardized insights with design system
✅ slide-traffic-trends.tsx - Clean line chart with filtering
✅ slide-branded.tsx - Grid of mini charts with edit functionality
✅ slide-opportunities.tsx - Dual charts with standardized insights

## Remaining Slides (13/18)

### Design System Applied
All completed slides now use:
- SlideContainer with consistent padding and max-width
- SlideHeader with title and subtitle
- ChartContainer for all charts with standardized margins
- InsightCard and InsightsSection for key takeaways
- CompetitorFilter for toggleable legends
- EditButton for consistent edit/save/cancel UI
- CustomChartTooltip for consistent tooltip styling
- SlideFooter for source attribution
- Standardized TEXT_STYLES (slideTitle, sectionLabel, metricValue)
- CHART_CONFIG for consistent chart styling
- 12-column grid system with gap-6
- Clean white backgrounds, gray borders, no glassmorphism

### Pattern to Follow for Remaining Slides

#### For Chart-Heavy Slides (NGFW, Dashboard, OT Security, SD-WAN, Zero Trust, etc.):
```tsx
<SlideContainer slideNumber={X}>
  <SlideHeader title="..." subtitle="..." />
  
  <div className="flex-1 grid grid-cols-12 gap-6">
    {/* Charts - 8 columns */}
    <div className="col-span-8 flex flex-col gap-6">
      <ChartContainer title="..." actions={<EditButton ... />} height={280}>
        {/* Chart or editable inputs */}
      </ChartContainer>
    </div>

    {/* Insights - 4 columns */}
    <div className="col-span-4">
      <InsightsSection>
        <InsightCard icon={Icon} type="warning/success/info" content="..." />
      </InsightsSection>
    </div>
  </div>

  <SlideFooter />
</SlideContainer>
```

#### For Dashboard/Summary Slides:
```tsx
<SlideContainer slideNumber={X}>
  <SlideHeader title="..." subtitle="..." />
  
  {/* Metric Cards Grid */}
  <div className="grid grid-cols-4 gap-6 mb-6">
    <MetricCard label="..." value="..." change="..." />
  </div>

  {/* Charts */}
  <div className="flex-1 grid grid-cols-2 gap-6">
    <ChartContainer title="...">...</ChartContainer>
    <ChartContainer title="...">...</ChartContainer>
  </div>

  <SlideFooter />
</SlideContainer>
```

### Checklist for Each Slide
- [ ] Remove glassmorphism backgrounds (from-blue-50/50 via-purple-50/50 to-white)
- [ ] Replace with clean white backgrounds
- [ ] Use SlideContainer wrapper
- [ ] Apply SlideHeader with consistent title styling  
- [ ] Use TEXT_STYLES constants for all text
- [ ] Wrap charts in ChartContainer
- [ ] Apply CHART_CONFIG to all charts
- [ ] Use InsightCard for all insights (no custom gradient boxes)
- [ ] Apply CompetitorFilter for legends
- [ ] Use EditButton component for edit functionality
- [ ] Add SlideFooter at bottom
- [ ] Use 12-column grid with gap-6
- [ ] Ensure consistent spacing (mb-6, gap-6, p-6)
- [ ] Use border-gray-200 for all borders
- [ ] Remove custom colors, use design system colors

### Typography Standards
1. **Slide Titles**: text-[32px] font-bold text-gray-900
2. **Section Labels**: text-[14px] font-medium text-gray-600 uppercase tracking-wide
3. **Metric Values**: text-[28px] font-bold text-gray-900

### Color Palette
- Primary: #EF4444 (Fortinet Red)
- Borders: #E5E7EB (gray-200)
- Text: #111827 (gray-900), #4B5563 (gray-600), #9CA3AF (gray-400)
- Backgrounds: #FFFFFF (white), #F9FAFB (gray-50)
- Success: #10B981, Warning: #F59E0B, Error: #EF4444, Info: #3B82F6

### Next Steps
1. Update slide-ngfw.tsx
2. Update slide-dashboard.tsx  
3. Update slide-ot-security.tsx (already manually edited by user, verify consistency)
4. Update remaining 10 slides following the same pattern
