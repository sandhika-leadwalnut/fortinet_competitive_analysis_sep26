import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Trophy, AlertTriangle, ChevronDown } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  SlideContainer, SlideHeader, SlideFooter, ChartContainer,
  InsightCard, InsightsSection, CompetitorFilter, CHART_CONFIG,
  TimeRange, getTimeRangeOffset, TimeRangeFilter,
} from './design-system';

// ─── Types ─────────────────────────────────────────────────────────────────────

type SummaryMetric = 'page1' | 'page2' | 'page3' | 'pos1';
type CategoryMetric = 'page1' | 'pos1';
type TabId = 'summary' | 'ngfw' | 'network' | 'ztna' | 'cloud' | 'sdwan' | 'top50';

// ─── Constants ─────────────────────────────────────────────────────────────────

const VENDORS = [
  { id: 'fortinet',   name: 'Fortinet',    color: '#EF4444' },
  { id: 'cisco',      name: 'Cisco',       color: '#FF7AB6' },
  { id: 'paloalto',   name: 'Palo Alto',   color: '#FFB14A' },
  { id: 'checkpoint', name: 'Check Point', color: '#6C9AFF' },
  { id: 'hpe',        name: 'HPE',         color: '#7ED957' },
];

const MONTHS = ['2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09'];
const MONTH_LABELS = ['Dec-25','Jan-26','Feb-26','Mar-26','Apr-26','May-26','Jun-26','Jul-26','Aug-26','Sep-26'];
const MONTH_SHORT  = ['Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'];

const fmt = (key: string) => ({
  '2025-12':'Dec-25','2026-01':'Jan-26','2026-02':'Feb-26','2026-03':'Mar-26',
  '2026-04':'Apr-26','2026-05':'May-26','2026-06':'Jun-26','2026-07':'Jul-26','2026-08':'Aug-26','2026-09':'Sep-26',
}[key] ?? key);

const fmtMSV = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${Math.round(v / 1_000)}K`;
  return `${v}`;
};

const TABS: { id: TabId; label: string }[] = [
  { id: 'summary', label: 'Keyword Summary'     },
  { id: 'ngfw',    label: 'NGFW / Firewall'     },
  { id: 'network', label: 'Network Security'    },
  { id: 'ztna',    label: 'Zero Trust / ZTNA'   },
  { id: 'cloud',   label: 'Cloud Security'      },
  { id: 'sdwan',   label: 'SD WAN & SASE'       },
  { id: 'top50',   label: 'Top 50 Keywords'     },
];

// ─── Summary data (Tab 1) ──────────────────────────────────────────────────────

type SummaryData = { page1: number[]; page2: number[]; page3: number[]; pos1: number[] };

const SUMMARY_DATA: Record<string, SummaryData> = {
  fortinet:   { page1: [38,39,39,41,40,39,36,40,37,36], page2: [5,3,1,1,2,2,6,4,4,3],   page3: [2,4,2,2,2,0,1,1,3,2],   pos1: [25,24,31,36,31,30,24,27,8,29] },
  cisco:      { page1: [27,28,28,25,27,26,21,25,24,27], page2: [7,6,7,2,4,5,9,3,5,2],   page3: [2,2,1,9,2,3,4,3,5,2],   pos1: [17,18,21,19,18,19,11,16,4,22] },
  paloalto:   { page1: [27,23,30,33,28,28,31,24,26,23], page2: [5,7,4,2,7,9,4,6,9,6],   page3: [7,5,3,7,3,2,3,5,3,8],   pos1: [18,17,22,25,21,19,20,12,2,15] },
  checkpoint: { page1: [12,12,15,15,18,10,17,17,14,19], page2: [15,13,4,8,7,12,10,13,16,10], page3: [8,7,11,6,4,3,3,3,7,1], pos1: [4,4,8,7,9,2,6,7,0,10] },
  hpe:        { page1: [5,4,5,4,1,3,4,5,2,5],         page2: [2,1,0,2,0,1,3,0,1,2],   page3: [1,2,1,1,4,3,2,2,3,2],   pos1: [5,3,4,4,1,1,4,5,0,4] },
};

// ─── Category data (Tabs 2–6) ──────────────────────────────────────────────────

type CategoryData = { page1: number[]; pos1: number[] };

const CATEGORY_DATA: Record<TabId, Record<string, CategoryData>> = {
  summary: {} as any,
  ngfw: {
    fortinet:   { page1: [7,6,7,7,7,6,7,7,6,6],   pos1: [5,4,6,7,7,5,7,5,2,3] },
    cisco:      { page1: [6,6,6,6,6,5,6,6,6,6],   pos1: [4,6,5,5,6,4,4,5,3,5] },
    paloalto:   { page1: [7,6,5,6,6,7,7,6,6,5],   pos1: [4,3,3,5,6,6,6,3,1,4] },
    checkpoint: { page1: [3,3,6,5,6,6,6,6,6,7],   pos1: [1,1,3,3,3,1,2,4,0,4] },
    hpe:        { page1: [1,1,1,1,0,0,1,1,0,1],   pos1: [1,1,1,1,0,0,1,1,0,1] },
  },
  network: {
    fortinet:   { page1: [4,4,4,4,4,4,4,3,3,4],   pos1: [1,3,4,4,4,4,3,1,0,3] },
    cisco:      { page1: [3,2,2,3,2,3,1,2,2,1],   pos1: [2,1,2,1,1,3,0,2,1,1] },
    paloalto:   { page1: [2,3,3,5,2,2,3,3,2,2],   pos1: [1,3,3,3,2,2,3,1,1,1] },
    checkpoint: { page1: [2,2,2,2,1,1,2,3,3,3],   pos1: [1,1,2,2,0,1,1,0,0,2] },
    hpe:        { page1: [1,0,1,0,0,0,0,0,0,0],   pos1: [1,0,0,0,0,0,0,0,0,0] },
  },
  ztna: {
    fortinet:   { page1: [3,3,2,3,3,3,3,4,3,3],   pos1: [2,2,1,2,1,3,3,2,1,3] },
    cisco:      { page1: [3,2,2,2,2,2,2,2,2,2],   pos1: [3,1,2,1,1,1,1,2,0,2] },
    paloalto:   { page1: [1,0,4,4,3,3,3,2,2,2],   pos1: [0,0,2,3,1,2,2,0,0,0] },
    checkpoint: { page1: [0,1,0,0,1,0,1,2,0,0],   pos1: [0,0,0,0,0,0,0,1,0,0] },
    hpe:        { page1: [0,0,0,0,0,0,0,0,0,0],   pos1: [0,0,0,0,0,0,0,0,0,0] },
  },
  cloud: {
    fortinet:   { page1: [1,1,2,1,1,3,2,3,2,2],   pos1: [1,1,2,1,1,2,2,3,0,2] },
    cisco:      { page1: [0,1,0,1,1,2,1,1,1,1],   pos1: [0,1,0,1,1,1,1,0,0,0] },
    paloalto:   { page1: [1,1,1,1,2,0,0,0,0,1],   pos1: [1,1,1,1,2,0,0,0,0,1] },
    checkpoint: { page1: [1,1,1,1,1,1,2,2,0,1],   pos1: [0,0,0,1,0,0,1,2,0,0] },
    hpe:        { page1: [0,0,0,0,0,0,0,0,0,0],   pos1: [0,0,0,0,0,0,0,0,0,0] },
  },
  sdwan: {
    fortinet:   { page1: [4,4,5,5,5,5,4,5,5,5],   pos1: [3,3,4,5,3,3,3,4,1,4] },
    cisco:      { page1: [3,4,3,4,4,5,5,3,4,5],   pos1: [1,1,1,4,3,5,4,1,0,4] },
    paloalto:   { page1: [5,4,4,5,5,4,4,5,4,5],   pos1: [3,2,3,4,5,3,3,4,0,4] },
    checkpoint: { page1: [1,0,1,2,2,1,2,2,1,1],   pos1: [0,0,1,0,2,0,1,2,0,1] },
    hpe:        { page1: [1,2,2,1,0,1,2,3,1,1],   pos1: [1,1,2,1,0,1,2,3,0,1] },
  },
  top50: {} as any,
};

// ─── Keyword position data (Tab 7) ─────────────────────────────────────────────

type KWRow = {
  id:         number;
  cat:        string;
  kw:         string;
  msv:        number;
  kd:         number;
  fortinet:   number[];
  paloalto:   number[];
  checkpoint: number[];
  cisco:      number[];
  hpe:        number[];
};

const KEYWORDS: KWRow[] = [
  { id:1,  cat:'Network Security',    kw:'network security',               msv:9900,   kd:74, fortinet:[5,3,1,1,1,1,1,11,15,1],      paloalto:[9,1,1,10,92,33,29,33,43,101],   checkpoint:[7,1,1,21,101,1,1,6,4,1],    cisco:[1,2,1,1,1,1,3,1,1,1],      hpe:[1,30,2,43,63,30,101,38,25,21]    },
  { id:2,  cat:'Network Security',    kw:'network security solutions',     msv:720,    kd:31, fortinet:[1,1,1,1,1,1,3,1,3,6],         paloalto:[29,98,101,1,1,12,1,9,5,101],    checkpoint:[1,10,1,1,22,26,15,6,4,1],   cisco:[10,14,14,7,7,1,14,15,15,67],  hpe:[55,43,46,47,46,101,17,101,101,101] },
  { id:3,  cat:'Network Security',    kw:'data security',                  msv:4400,   kd:69, fortinet:[2,1,1,1,1,1,1,4,2,1],         paloalto:[12,12,27,1,17,20,84,12,26,25],  checkpoint:[27,43,71,101,101,101,101,38,27,101], cisco:[101,101,101,101,101,101,101,101,101,101], hpe:[101,101,50,101,101,101,101,101,101,101] },
  { id:4,  cat:'Network Security',    kw:'5g network security',            msv:70,     kd:32, fortinet:[17,29,22,101,40,101,101,22,101,54], paloalto:[1,1,1,2,1,1,1,1,1,1],     checkpoint:[19,30,23,1,9,17,9,8,8,10],   cisco:[37,56,101,101,101,27,25,27,27,33], hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:5,  cat:'Network Security',    kw:'What is a data breach',          msv:3600,   kd:68, fortinet:[7,1,1,1,1,1,1,5,3,1],         paloalto:[29,1,1,1,15,1,1,8,14,8],      checkpoint:[38,31,30,58,23,42,101,101,101,101], cisco:[1,1,1,9,101,1,12,1,7,13],   hpe:[101,52,32,101,101,101,11,101,101,11] },
  { id:6,  cat:'Network Access',      kw:'What is Remote Access',          msv:260,    kd:34, fortinet:[1,1,1,1,2,1,1,1,1,1],         paloalto:[7,1,1,7,5,1,2,1,13,45],        checkpoint:[20,20,25,19,96,21,101,18,20,20], cisco:[15,11,9,22,16,101,101,101,101,101], hpe:[1,1,1,1,1,7,1,1,3,1]          },
  { id:7,  cat:'NGFW/Firewall',       kw:'firewall',                       msv:33100,  kd:77, fortinet:[4,1,1,1,1,1,1,1,1,1],         paloalto:[7,10,60,17,12,10,8,9,9,13],    checkpoint:[11,16,9,4,7,8,1,1,5,1],    cisco:[2,1,1,1,1,16,3,3,2,1],      hpe:[101,101,101,101,90,101,101,101,101,101] },
  { id:8,  cat:'NGFW/Firewall',       kw:'network firewall',               msv:4400,   kd:54, fortinet:[1,24,1,1,1,19,1,1,17,18],      paloalto:[1,1,3,1,1,1,1,1,7,9],         checkpoint:[20,33,1,26,19,9,11,13,19,10], cisco:[4,1,1,1,1,1,1,1,2,1],      hpe:[1,1,25,1,23,32,38,33,101,43]    },
  { id:9,  cat:'NGFW/Firewall',       kw:'what is a firewall',             msv:6600,   kd:65, fortinet:[1,1,1,1,1,1,1,1,2,3],         paloalto:[4,34,5,5,1,1,1,6,3,1],        checkpoint:[24,15,48,15,1,9,7,8,6,5],  cisco:[1,1,1,1,1,1,2,1,1,1],      hpe:[101,101,55,101,101,101,101,101,101,101] },
  { id:10, cat:'NGFW/Firewall',       kw:'firewall security',              msv:3600,   kd:64, fortinet:[1,1,6,1,1,1,1,1,4,5],         paloalto:[1,1,15,1,1,1,1,17,20,30],      checkpoint:[13,37,10,9,7,7,7,1,3,4],   cisco:[1,1,3,1,1,1,1,1,1,1],      hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:11, cat:'NGFW/Firewall',       kw:'ngfw',                           msv:4400,   kd:76, fortinet:[1,3,1,1,1,2,1,4,2,2],         paloalto:[1,2,1,1,1,1,1,2,1,1],         checkpoint:[1,6,1,1,1,51,7,1,5,1],    cisco:[1,1,1,4,1,6,1,1,3,1],      hpe:[46,31,101,30,36,36,24,24,23,1]  },
  { id:12, cat:'NGFW/Firewall',       kw:'next generation firewall',       msv:4400,   kd:75, fortinet:[6,6,1,1,1,1,1,5,3,1],         paloalto:[5,4,1,1,1,1,1,1,2,1],         checkpoint:[9,1,10,1,8,9,9,9,7,1],    cisco:[1,1,1,1,1,1,1,1,1,2],      hpe:[13,101,1,13,22,10,1,1,18,101]    },
  { id:13, cat:'NGFW/Firewall',       kw:'firewall as a service',          msv:390,    kd:45, fortinet:[1,1,1,1,1,1,1,1,1,1],         paloalto:[1,1,1,1,1,1,1,1,2,1],         checkpoint:[7,6,1,1,1,1,1,1,7,1],    cisco:[74,78,98,42,74,101,23,101,101,101], hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:14, cat:'MPLS',                kw:'MPLS',                           msv:368000, kd:71, fortinet:[6,5,1,7,1,1,19,1,5,1],         paloalto:[12,37,101,23,27,5,4,7,8,15],   checkpoint:[39,36,39,101,29,42,101,30,101,101], cisco:[1,6,1,1,1,1,17,9,4,6],   hpe:[1,14,101,1,59,25,11,101,101,1]  },
  { id:15, cat:'SD WAN',              kw:'SD WAN',                         msv:14800,  kd:69, fortinet:[1,4,1,1,1,1,1,4,3,1],         paloalto:[1,6,3,1,1,1,1,1,2,5],         checkpoint:[18,11,101,8,1,18,13,9,15,101], cisco:[3,2,1,1,1,1,1,4,4,1],     hpe:[1,9,1,12,101,1,1,1,9,1]        },
  { id:16, cat:'SD WAN',              kw:'SDN vs SD WAN',                  msv:70,     kd:30, fortinet:[1,1,1,1,1,2,2,1,2,1],         paloalto:[1,1,1,1,1,1,1,1,3,1],         checkpoint:[21,18,44,101,18,101,101,12,12,15], cisco:[11,10,11,1,10,1,9,9,10,10], hpe:[36,87,64,101,74,101,101,101,101,101] },
  { id:17, cat:'SD WAN',              kw:'SD WAN Solutions',               msv:390,    kd:50, fortinet:[14,16,6,1,1,9,11,1,7,1],       paloalto:[1,12,11,1,1,16,101,1,14,1],   checkpoint:[41,19,101,15,17,19,18,20,17,17], cisco:[6,8,9,1,1,1,1,1,9,1],    hpe:[20,21,93,32,21,20,1,1,101,101]   },
  { id:18, cat:'OT Security',         kw:'ot security',                    msv:1300,   kd:34, fortinet:[1,1,1,1,1,1,1,2,1,2],         paloalto:[1,1,1,1,7,6,8,8,8,4],         checkpoint:[29,101,32,44,28,43,21,27,25,101], cisco:[1,1,1,1,1,3,6,3,2,3],  hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:19, cat:'OT Security',         kw:'ot security solutions',          msv:110,    kd:53, fortinet:[1,1,1,1,1,1,1,1,2,1],         paloalto:[1,1,1,1,8,9,1,54,8,1],        checkpoint:[32,29,33,40,101,36,42,52,46,50], cisco:[10,1,7,6,1,1,1,1,4,1],  hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:20, cat:'OT Security',         kw:'iot security best practices',    msv:50,     kd:35, fortinet:[1,2,2,1,1,1,3,3,2,2],         paloalto:[9,7,6,1,9,1,1,23,5,15],        checkpoint:[101,101,101,101,101,101,101,101,101,101], cisco:[101,101,101,101,101,101,101,101,101,101], hpe:[101,101,101,101,101,101,101,101,101,34] },
  { id:21, cat:'SASE',                kw:'sase',                           msv:14800,  kd:77, fortinet:[1,1,1,1,2,1,1,1,1,1],         paloalto:[3,1,1,1,1,1,1,1,2,1],         checkpoint:[13,12,13,10,16,8,8,8,9,1],  cisco:[1,1,7,1,12,1,1,60,25,1],  hpe:[29,1,1,1,28,26,27,1,21,19]      },
  { id:22, cat:'SASE',                kw:'sase solutions',                 msv:720,    kd:67, fortinet:[3,1,1,1,2,1,1,1,3,3],         paloalto:[2,3,1,4,1,8,5,5,5,1],         checkpoint:[10,12,1,11,1,15,1,14,15,13], cisco:[14,15,20,15,1,1,1,37,9,1],  hpe:[62,42,101,101,101,101,101,27,101,47] },
  { id:23, cat:'Malware',             kw:'malware',                        msv:40500,  kd:88, fortinet:[9,5,1,21,1,16,24,19,21,101],    paloalto:[23,1,19,14,101,19,6,23,19,17], checkpoint:[28,17,1,36,9,12,16,11,18,7], cisco:[5,1,101,22,7,1,11,1,4,1],  hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:24, cat:'Malware',             kw:'malware detection',              msv:1300,   kd:37, fortinet:[34,29,101,1,27,101,101,101,101,101], paloalto:[27,101,1,26,1,101,18,101,8,15], checkpoint:[47,101,101,101,58,101,49,45,101,101], cisco:[101,101,101,35,74,101,101,101,101,101], hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:25, cat:'Malware',             kw:'malware protection',             msv:1600,   kd:84, fortinet:[1,1,1,1,1,1,6,1,8,1],         paloalto:[1,1,4,6,1,3,3,1,2,1],         checkpoint:[1,1,37,101,20,34,36,32,29,1], cisco:[8,1,1,1,6,18,101,13,101,53], hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:26, cat:'Ransomware',          kw:'ransomware protection',          msv:720,    kd:71, fortinet:[12,10,1,1,7,6,6,1,10,1],      paloalto:[101,15,101,26,41,101,101,101,101,101], checkpoint:[17,45,101,48,51,48,49,36,24,52], cisco:[49,84,71,101,101,50,44,42,101,12], hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:27, cat:'Ransomware',          kw:'ransomware removal',             msv:260,    kd:45, fortinet:[1,1,2,1,1,1,1,1,1,1],         paloalto:[29,29,101,39,17,101,101,101,101,101], checkpoint:[35,1,26,101,60,34,34,34,33,38], cisco:[101,101,101,101,101,101,101,101,101,101], hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:28, cat:'Ransomware',          kw:'ransomware',                     msv:33100,  kd:91, fortinet:[4,5,5,1,1,4,6,1,5,101],         paloalto:[84,101,37,1,51,1,1,35,37,27],  checkpoint:[10,9,1,7,1,12,101,19,10,101], cisco:[16,20,12,27,10,27,11,10,6,101], hpe:[101,101,101,101,101,37,38,43,62,7] },
  { id:29, cat:'Cloud Security',      kw:'cloud security',                 msv:5400,   kd:74, fortinet:[20,22,1,29,20,1,18,1,101,27],  paloalto:[40,1,25,22,1,25,22,21,101,28], checkpoint:[4,3,8,1,8,7,8,1,19,5],     cisco:[32,1,19,1,39,1,35,6,8,26],  hpe:[101,101,101,101,101,101,101,101,101,58] },
  { id:30, cat:'Cloud Security',      kw:'cloud security service providers', msv:3600, kd:47, fortinet:[101,101,101,101,101,6,1,1,5,1], paloalto:[1,38,1,1,1,101,101,101,101,1], checkpoint:[101,101,101,101,101,13,1,1,12,13], cisco:[101,101,101,101,101,101,101,101,101,45], hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:31, cat:'Cloud Security',      kw:'email encryption',               msv:1300,   kd:53, fortinet:[1,1,1,1,1,1,1,1,2,1],         paloalto:[101,101,101,101,101,101,101,101,101,101], checkpoint:[36,46,30,19,36,36,101,31,43,37], cisco:[40,43,28,37,1,9,1,15,13,1], hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:32, cat:'Zero Trust / ZTNA',   kw:'zero trust security',            msv:2900,   kd:83, fortinet:[1,8,101,1,7,1,1,1,7,1],       paloalto:[31,29,1,1,19,17,1,16,20,15],   checkpoint:[14,10,16,16,8,16,9,9,17,19], cisco:[1,28,49,33,30,15,28,28,38,29], hpe:[74,101,101,101,101,101,101,101,101,101] },
  { id:33, cat:'Zero Trust / ZTNA',   kw:'zero trust network',             msv:1000,   kd:79, fortinet:[6,37,4,1,1,1,1,7,6,1],         paloalto:[13,12,8,1,10,1,12,9,7,7],     checkpoint:[28,25,25,46,40,54,44,1,77,47], cisco:[1,1,1,1,1,1,1,1,3,1],     hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:34, cat:'Zero Trust / ZTNA',   kw:'zero trust network access',      msv:880,    kd:74, fortinet:[1,1,1,5,5,1,1,3,1,1],         paloalto:[4,99,1,7,7,1,1,6,7,9],        checkpoint:[19,18,23,17,101,66,101,101,25,29], cisco:[1,4,1,4,4,4,4,1,2,1],   hpe:[101,85,101,101,49,55,46,58,44,101] },
  { id:35, cat:'Zero Trust / ZTNA',   kw:'zero trust solutions',           msv:480,    kd:36, fortinet:[38,1,25,101,42,32,101,1,101,33], paloalto:[21,65,8,1,1,10,10,12,11,96],  checkpoint:[33,32,75,101,101,101,101,101,101,101], cisco:[22,22,20,21,18,101,101,101,101,35], hpe:[101,101,101,101,65,101,101,101,101,101] },
  { id:36, cat:'5G Security',         kw:'5g security solutions',          msv:50,     kd:35, fortinet:[19,14,18,17,22,10,7,11,18,17],  paloalto:[1,1,1,1,1,1,2,1,2,1],         checkpoint:[22,24,23,5,6,16,11,18,22,1], cisco:[20,48,42,28,28,101,101,101,101,101], hpe:[93,79,101,101,101,101,101,101,101,101] },
  { id:37, cat:'Proxy Server',        kw:'Proxy Server',                   msv:33100,  kd:79, fortinet:[1,5,1,1,1,1,1,2,3,1],         paloalto:[1,14,25,1,19,8,8,10,6,1],     checkpoint:[101,43,101,101,68,41,26,21,23,101], cisco:[101,10,1,29,101,101,101,101,101,101], hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:38, cat:'DDoS',                kw:'DDOS',                           msv:40500,  kd:81, fortinet:[1,4,4,1,1,1,5,1,6,1],         paloalto:[82,26,39,27,31,11,16,43,20,27], checkpoint:[20,24,29,101,101,19,20,14,16,15], cisco:[22,101,14,13,101,27,25,101,22,101], hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:39, cat:'DDoS',                kw:'What is DDoS Attack',            msv:3600,   kd:79, fortinet:[1,1,1,1,12,8,11,1,9,1],       paloalto:[1,26,1,101,23,19,23,25,28,26], checkpoint:[19,19,28,25,1,11,14,15,16,101], cisco:[1,1,1,21,6,7,20,1,19,101],  hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:40, cat:'DLP',                 kw:'dlp',                            msv:14800,  kd:77, fortinet:[1,1,1,1,1,1,20,1,10,22],        paloalto:[1,53,1,1,25,7,6,3,4,7],       checkpoint:[27,27,19,30,32,87,17,12,13,12], cisco:[1,1,1,37,1,101,11,101,18,1], hpe:[101,101,79,101,101,101,101,101,101,101] },
  { id:41, cat:'DLP',                 kw:'Data Loss Prevention',           msv:14800,  kd:69, fortinet:[7,10,36,1,9,101,19,1,19,1],   paloalto:[27,27,1,27,1,25,1,21,7,21],    checkpoint:[15,15,27,24,15,77,17,101,20,19], cisco:[11,17,1,1,55,12,13,101,22,1], hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:42, cat:'Endpoint Protection', kw:'endpoint security',             msv:2900,   kd:74, fortinet:[1,1,1,1,2,2,2,2,1,1],         paloalto:[11,18,1,10,9,1,1,11,9,10],     checkpoint:[5,4,9,6,1,3,4,5,7,9],      cisco:[2,3,3,1,1,1,42,3,2,1],     hpe:[101,101,101,101,43,64,50,101,101,101] },
  { id:43, cat:'Endpoint Protection', kw:'Endpoint Management',           msv:1000,   kd:50, fortinet:[28,1,101,101,33,101,31,101,10,53], paloalto:[101,101,101,101,101,101,101,101,101,57], checkpoint:[64,101,101,101,86,75,101,65,64,75], cisco:[11,1,1,1,3,101,13,1,12,1], hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:44, cat:'Cybersecurity',       kw:'Email Security',                 msv:1900,   kd:58, fortinet:[1,3,1,3,1,55,5,6,3,1],         paloalto:[101,101,101,101,101,101,101,101,101,101], checkpoint:[1,48,56,1,1,64,8,12,8,1], cisco:[1,14,1,7,13,13,9,27,26,1],  hpe:[101,101,101,101,101,101,101,101,101,33] },
  { id:45, cat:'Cybersecurity',       kw:'what is cybersecurity',          msv:22200,  kd:71, fortinet:[8,1,101,10,8,1,7,13,23,11],    paloalto:[1,1,8,1,17,18,16,101,14,101],   checkpoint:[19,24,7,23,20,22,9,101,18,8], cisco:[1,1,1,1,1,5,3,1,3,4],     hpe:[84,101,98,41,76,101,101,101,45,30] },
  { id:46, cat:'Cybersecurity',       kw:'Information Security',           msv:9900,   kd:74, fortinet:[30,14,1,1,1,32,32,34,28,34],   paloalto:[101,101,101,101,101,101,101,101,101,101], checkpoint:[43,67,101,56,54,13,24,13,15,20], cisco:[1,9,1,21,101,1,4,1,5,1],  hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:47, cat:'Cybersecurity',       kw:'cyber attack',                   msv:60500,  kd:80, fortinet:[4,4,7,4,1,1,8,9,4,1],         paloalto:[16,20,14,29,101,20,101,20,28,25], checkpoint:[5,5,5,3,3,101,1,4,3,4],    cisco:[6,7,3,24,7,7,5,3,8,1],     hpe:[101,101,101,101,101,101,101,101,101,101] },
  { id:48, cat:'Security Operations', kw:'Secops',                         msv:1600,   kd:38, fortinet:[1,1,1,1,1,1,1,1,5,1],         paloalto:[1,1,1,1,1,1,1,1,4,1],         checkpoint:[17,16,14,18,39,57,43,43,41,101], cisco:[101,101,101,101,101,101,101,101,101,101], hpe:[101,101,101,101,101,101,101,101,101,101] },
];

const KW_CATEGORIES = ['All Categories', ...Array.from(new Set(KEYWORDS.map(k => k.cat)))];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function posStyle(pos: number): string {
  if (pos === 1)         return 'bg-emerald-500 text-white font-bold';
  if (pos <= 3)          return 'bg-emerald-300 text-emerald-900 font-semibold';
  if (pos <= 10)         return 'bg-blue-200 text-blue-900';
  if (pos <= 20)         return 'bg-orange-200 text-orange-900';
  if (pos <= 50)         return 'bg-red-100 text-red-700';
  if (pos <= 100)        return 'bg-gray-200 text-gray-500';
  return 'text-gray-300'; // 101 = not ranking
}

function posLabel(pos: number): string {
  return pos >= 101 ? '–' : `${pos}`;
}

function deltaLabel(dec: number, jul: number): React.ReactNode {
  if (dec >= 101 && jul < 101) return <span className="text-[9px] font-bold text-blue-600">New</span>;
  if (dec < 101 && jul >= 101) return <span className="text-[9px] font-bold text-red-500">Lost</span>;
  if (dec >= 101 && jul >= 101) return <span className="text-[9px] text-gray-300">–</span>;
  const diff = dec - jul; // positive = improved (lower number)
  if (diff === 0) return <span className="text-[9px] text-gray-400">–</span>;
  if (diff > 0)   return <span className="text-[9px] font-bold text-emerald-600">↑{diff}</span>;
  return <span className="text-[9px] font-bold text-red-500">↓{Math.abs(diff)}</span>;
}

// ─── Sparkline ─────────────────────────────────────────────────────────────────

function Sparkline({ positions, color }: { positions: number[]; color: string }) {
  const w = 56, h = 18;
  const n = positions.length;
  const step = w / (n - 1);
  // position 1 = top (y=0), position 101 = bottom (y=h). Invert for SVG.
  const toY = (pos: number) => ((Math.min(pos, 101) - 1) / 100) * h;
  const pts = positions.map((pos, i) => `${(i * step).toFixed(1)},${toY(pos).toFixed(1)}`).join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible flex-shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Sub-filter component ──────────────────────────────────────────────────────

function SubFilter<T extends string>({ options, value, onChange }: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {options.map(opt => (
        <button key={opt.id} onClick={() => onChange(opt.id)}
          className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-all border ${
            value === opt.id
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
          }`}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Tooltip ───────────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const sorted = [...payload].filter((e: any) => e.value != null && e.value > 0).sort((a: any, b: any) => b.value - a.value);
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg min-w-[175px]">
      <p className="text-xs font-semibold text-gray-900 mb-2">{fmt(label)}</p>
      {sorted.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 text-xs mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600">{entry.name}</span>
          </div>
          <span className="font-bold text-gray-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Summary tab ───────────────────────────────────────────────────────────────

function SummaryTabContent({ visible, onToggle }: { visible: Set<string>; onToggle: (id: string) => void }) {
  const [metric, setMetric] = useState<SummaryMetric>('page1');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const SUMMARY_METRIC_OPTS: { id: SummaryMetric; label: string }[] = [
    { id: 'page1', label: '# of KWs on Page 1'     },
    { id: 'page2', label: '# of KWs on Page 2'     },
    { id: 'page3', label: '# of KWs on Page 3'     },
    { id: 'pos1',  label: '# of KWs at Position 1' },
  ];

  const tro = getTimeRangeOffset(timeRange, MONTHS.length);

  const chartData = MONTHS.slice(tro).map((month, i) => {
    const dp: any = { month };
    VENDORS.forEach(v => { if (visible.has(v.id)) dp[v.id] = SUMMARY_DATA[v.id][metric][i + tro]; });
    return dp;
  });

  const ftVals = SUMMARY_DATA.fortinet[metric];
  const ftLatest = ftVals[9]; const ftPeak = Math.max(...ftVals); const ftPeakIdx = ftVals.indexOf(ftPeak);
  const paLatest = SUMMARY_DATA.paloalto[metric][9];
  const csLatest = SUMMARY_DATA.cisco[metric][9];
  const cpLatest = SUMMARY_DATA.checkpoint[metric][9];
  const hpeLatest = SUMMARY_DATA.hpe[metric][9];

  const insights: Record<SummaryMetric, React.ReactNode> = {
    page1: <InsightsSection>
      <InsightCard icon={Trophy} type="success" title="Fortinet Dominates P1"
        content={`Fortinet holds the most Page 1 positions: peaked at ${ftPeak} KWs in ${fmt(MONTHS[ftPeakIdx])}, maintains 36–41 range. ${ftLatest} in Sep — ${Math.round((ftLatest / csLatest - 1) * 100)}% more than Cisco and ${Math.round((ftLatest / paLatest - 1) * 100)}% more than Palo Alto.`} />
      <InsightCard icon={TrendingUp} type="info" title="Cisco Edges Palo Alto"
        content={`Cisco (${csLatest}, +3 MoM) leads Palo Alto (${paLatest}, −3 MoM) by ${csLatest - paLatest} Page 1 KWs in Sep 2026. Palo Alto peaked at 33 in Mar; Cisco stable 21–28.`} />
      <InsightCard icon={AlertTriangle} type="warning" title="Check Point Rising, HPE Lags"
        content={`Check Point at ${cpLatest} (record high, +5 MoM) and HPE at ${hpeLatest} (+3 MoM) Page 1 KWs in Sep. Check Point now trails Palo Alto by ${paLatest - cpLatest}, but its prior peak of 18 (Apr) fell to 10 in May — sustaining is the test. HPE remains far behind.`} />
    </InsightsSection>,
    page2: <InsightsSection>
      <InsightCard icon={AlertTriangle} type="warning" title="Check Point High P2"
        content={`Check Point has ${cpLatest} Page 2 KWs in Sep (down from 16 in Aug) — 4–16 range historically. High P2 count signals KWs close to Page 1 that could be upgraded.`} />
      <InsightCard icon={TrendingDown} type="info" title="Fortinet P2 Low"
        content={`Fortinet at ${ftLatest} Page 2 KWs — most KWs already on Page 1 (${SUMMARY_DATA.fortinet.page1[9]} P1 KWs). Reflects strong existing rankings.`} />
      <InsightCard icon={TrendingUp} type="success" title="Palo Alto P2 Opportunity"
        content={`Palo Alto at ${paLatest} Page 2 KWs in Sep (down from 9 in Aug) — ${paLatest} KWs within 1 page of the top 10. Targeted content updates could push these to Page 1.`} />
    </InsightsSection>,
    page3: <InsightsSection>
      <InsightCard icon={AlertTriangle} type="warning" title="P3 Burden Shifts to Palo Alto"
        content={`Check Point had 3–11 Page 3 KWs through Aug but fell to ${cpLatest} in Sep (−6 MoM), while Palo Alto now carries the most (${paLatest}, +5 MoM). These are weakest-ranked, furthest from Page 1 visibility.`} />
      <InsightCard icon={Trophy} type="success" title="Fortinet Minimal P3"
        content={`Fortinet at ${ftLatest} Page 3 KWs in Sep — essentially no KWs stranded on page 3. Most tracked KWs are on Page 1 or 2.`} />
      <InsightCard icon={TrendingDown} type="info" title="HPE Apr–May Anomaly"
        content={`HPE Page 3 KWs spiked to 4 (Apr) and 3 (May) — unusually high for a vendor with only 5 Page 1 KWs. Possible ranking volatility.`} />
    </InsightsSection>,
    pos1: <InsightsSection>
      <InsightCard icon={Trophy} type="success" title="Fortinet #1 Rank Leader"
        content={`Fortinet holds ${ftLatest} of 50 KWs at position #1 in Sep 2026 (rebounding from 8 in Aug). Peak was ${ftPeak} in ${fmt(MONTHS[ftPeakIdx])}. Average ${(SUMMARY_DATA.fortinet.pos1.reduce((a,b)=>a+b,0)/10).toFixed(0)} position-1 KWs per month.`} />
      <InsightCard icon={TrendingUp} type="info" title="Palo Alto Rebounds"
        content={`Palo Alto recovered to ${paLatest} position-1 KWs in Sep 2026 from 2 in Aug, but remains below its Mar peak of 25 (−40%). Cisco also rebounded to ${csLatest} (from 4 in Aug).`} />
      <InsightCard icon={AlertTriangle} type="error" title="Check Point Inconsistent"
        content={`Check Point position-1 KWs range wildly: 0 (Aug) to 10 (Sep, new high). HPE at ${hpeLatest} position-1 KWs, level with Check Point's Dec–Jan readings.`} />
    </InsightsSection>,
  };

  return (
    <div className="flex-1 flex flex-col gap-3 min-h-0">
      <SubFilter options={SUMMARY_METRIC_OPTS} value={metric} onChange={setMetric} />
      <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        <div className="col-span-8 flex flex-col">
          <ChartContainer title="" height={340}>
            <div className="h-full flex flex-col">
              <div className="pb-3 border-b border-gray-200 mb-3">
                <CompetitorFilter competitors={VENDORS} visibleCompetitors={visible} onToggle={onToggle} />
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={CHART_CONFIG.margin}>
                    <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                    <XAxis dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={fmt} />
                    <YAxis {...CHART_CONFIG.yAxis} domain={[0, 50]} ticks={[0,10,20,30,40,50]} />
                    <Tooltip content={<CustomTooltip />} />
                    {VENDORS.filter(v => visible.has(v.id)).map(v => (
                      <Line key={v.id} type="monotone" dataKey={v.id} name={v.name} stroke={v.color}
                        strokeWidth={v.id === 'fortinet' ? 2.5 : 2}
                        dot={{ fill: v.color, r: 4, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }} connectNulls />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartContainer>
        </div>
        <div className="col-span-4 flex flex-col gap-3 min-h-0 overflow-y-auto">
          {insights[metric]}
        </div>
      </div>
    </div>
  );
}

// ─── Category tab ──────────────────────────────────────────────────────────────

const CATEGORY_INSIGHTS: Record<TabId, Record<CategoryMetric, { icon: any; type: any; title: string; content: string }[]>> = {
  summary: { page1: [], pos1: [] },
  ngfw: {
    page1: [
      { icon: Trophy,        type:'success', title:'Check Point Edges Ahead',      content:'Check Point leads with 7 NGFW/Firewall Page 1 KWs in Sep 2026 (+1 MoM), ahead of Fortinet and Cisco at 6 each. Palo Alto slipped to 5 (−1 MoM), matching its Feb low.' },
      { icon: TrendingUp,    type:'success', title:'Check Point Recovering',       content:'Check Point grew from 3 (Dec) to 7 Page 1 KWs by Sep 2026 — more than doubling its rankings and now covering all 7 tracked NGFW KWs.' },
      { icon: AlertTriangle, type:'warning', title:'HPE Minimal Presence',         content:'HPE holds only 0–1 Page 1 NGFW KWs (1 in Sep) — effectively absent from this keyword category.' },
    ],
    pos1: [
      { icon: TrendingDown,  type:'warning', title:'Fortinet Below Peak at #1',    content:'Fortinet peaked at 7 position-1 NGFW KWs (Mar, Apr, Jun) but fell to 2 in Aug and recovered only to 3 in Sep 2026 — now behind Cisco (5).' },
      { icon: TrendingUp,    type:'info',    title:'Check Point Improving',        content:'Check Point grew from 1 position-1 KW (Dec–Jan) to 4 in Sep 2026 (0 in Aug) — the largest absolute growth since Dec in this metric.' },
      { icon: TrendingUp,    type:'info',    title:'Palo Alto Sep Recovery',       content:'Palo Alto rebounded to 4 position-1 KWs in Sep 2026 from 1 in Aug, still below its peak of 6 (Apr–Jun). Cisco recovered from 3 to 5.' },
    ],
  },
  network: {
    page1: [
      { icon: Trophy,        type:'success', title:'Fortinet Most Consistent',     content:'Fortinet leads with 3–4 Network Security Page 1 KWs — the most stable vendor. Dipped to 3 in Jul–Aug, back to 4 in Sep 2026.' },
      { icon: TrendingUp,    type:'info',    title:'Check Point Pulls Ahead',      content:'Check Point holds 3 Network Security Page 1 KWs for a third month (Jul–Sep), ahead of Palo Alto (2, peak 5 in Mar) and Cisco (1, peak 3).' },
      { icon: AlertTriangle, type:'warning', title:'HPE Absent',                   content:'HPE has 0 Network Security Page 1 KWs in Sep. Effectively invisible in this category after single KWs in Dec and Feb.' },
    ],
    pos1: [
      { icon: TrendingUp,    type:'warning', title:'Fortinet Position-1 Volatile', content:'Fortinet recovered to 3 position-1 Network Security KWs in Sep 2026 after 0 in Aug and 1 in Jul — still below its peak of 4 (Feb–May).' },
      { icon: TrendingUp,    type:'success', title:'Cisco Peaks at 3',             content:'Cisco reached 3 position-1 Network Security KWs in May — tied with Palo Alto as best month for each vendor. Cisco at 1 in Sep.' },
      { icon: AlertTriangle, type:'warning', title:'Check Point Gap',              content:'Check Point has 0 position-1 KWs in 3 of 10 months (Apr, Jul, Aug) but recovered to 2 in Sep, with 3 Page 1 KWs in each of the last 3 months.' },
    ],
  },
  ztna: {
    page1: [
      { icon: Trophy,        type:'success', title:'Fortinet Leads, Cisco & PA Level', content:'Fortinet leads with 3 Zero Trust / ZTNA Page 1 KWs in Sep 2026 (peak 4 in Jul); Cisco and Palo Alto hold 2 each. Cisco has been flat at 2 since Jan.' },
      { icon: TrendingUp,    type:'info',    title:'Palo Alto Feb–Mar Spike',      content:'Palo Alto jumped to 4 Page 1 ZTNA KWs in Feb–Mar before declining to 2 by Jul–Sep. Content changes likely drove the temporary spike.' },
      { icon: AlertTriangle, type:'warning', title:'HPE Zero Presence',            content:'HPE has 0 ZTNA Page 1 KWs across all 10 months — complete absence in Zero Trust / ZTNA keyword space.' },
    ],
    pos1: [
      { icon: Trophy,        type:'success', title:'Fortinet Leads Position-1',    content:'Fortinet holds 3 ZTNA position-1 KWs in Sep 2026 (+2 MoM), ahead of Cisco (2, up from 0 in Aug). Cisco peaked at 3 in Dec.' },
      { icon: TrendingUp,    type:'info',    title:'Fortinet Growing to #1',       content:"Fortinet position-1 ZTNA KWs reached 3 in May–Jun and again in Sep 2026 (1 in Aug) — matching Cisco's Dec peak and suggesting improved content authority." },
      { icon: TrendingDown,  type:'warning', title:'Palo Alto Volatile',           content:'Palo Alto position-1 KWs sit at 0 in Dec, Jan, and Jul–Sep despite having up to 3 position-1 KWs in Mar.' },
    ],
  },
  cloud: {
    page1: [
      { icon: TrendingUp,    type:'success', title:'Fortinet Growing in Cloud',    content:'Fortinet Cloud Security Page 1 KWs grew from 1 (Dec) to 2 in Sep 2026 (flat MoM) — sustained uptrend after peaking at 3 in May and Jul.' },
      { icon: TrendingUp,    type:'info',    title:'Palo Alto Re-enters Cloud P1', content:'Palo Alto dropped from 2 Page 1 Cloud KWs (Apr) to 0 in May–Aug, then returned to 1 in Sep 2026 — a first sign of recovery in Cloud Security Page 1.' },
      { icon: AlertTriangle, type:'warning', title:'HPE No Cloud Presence',        content:'HPE has 0 Cloud Security Page 1 KWs across all 10 months. No content ranking for cloud security keywords.' },
    ],
    pos1: [
      { icon: Trophy,        type:'success', title:'Fortinet Leads Position-1',    content:'Fortinet leads Cloud Security position-1 KWs in Sep 2026 with 2 (+2 MoM), ahead of Palo Alto (1) — the only vendors with top positions this month.' },
      { icon: TrendingDown,  type:'warning', title:'Check Point Gains Not Sustained', content:"Check Point's 2 position-1 KWs in Jul were not sustained — 0 in both Aug and Sep 2026, after months of 0–1." },
      { icon: TrendingUp,    type:'info',    title:'Palo Alto Partial Recovery',   content:'Palo Alto had 1–2 position-1 KWs Dec–Apr before dropping to 0 in May–Aug; back to 1 in Sep. Cisco remains at 0 for a third straight month (Jul–Sep).' },
    ],
  },
  sdwan: {
    page1: [
      { icon: Trophy,        type:'success', title:'Fortinet, PA & Cisco Tied at 5', content:'Fortinet, Palo Alto and Cisco all hold 5 SD-WAN/SASE Page 1 KWs in Sep 2026 — the category maximum. Palo Alto and Cisco each gained 1 MoM; Fortinet flat.' },
      { icon: TrendingDown,  type:'warning', title:'HPE Gains Reversed',           content:'HPE peaked at 3 SD-WAN Page 1 KWs in Jul 2026 and has slipped to 1 in Aug–Sep — back to its Dec level, level with Check Point.' },
      { icon: AlertTriangle, type:'warning', title:'Check Point Inconsistent',     content:'Check Point SD-WAN Page 1 KWs range 0–2 (1 in Sep) — well below Fortinet, Palo Alto and Cisco.' },
    ],
    pos1: [
      { icon: Trophy,        type:'success', title:'Cisco Peaks at 5 in May',      content:"Cisco reached 5 position-1 SD-WAN KWs in May 2026 — matching Fortinet's Mar and Palo Alto's Apr highs. Cisco rebounded to 4 in Sep from 0 in Aug." },
      { icon: TrendingUp,    type:'info',    title:'Big Three Level at 4',         content:'Fortinet, Palo Alto and Cisco each hold 4 position-1 SD-WAN KWs in Sep 2026, all recovering from an Aug trough (1, 0 and 0).' },
      { icon: TrendingDown,  type:'warning', title:'Check Point Gaps Out',         content:'Check Point has 0 position-1 SD-WAN KWs in 5 of 10 months (1 in Sep) — requires dedicated content investment.' },
    ],
  },
  top50: { page1: [], pos1: [] },
};

function CategoryTabContent({
  tabId, visible, onToggle,
}: { tabId: Exclude<TabId,'summary'|'top50'>; visible: Set<string>; onToggle: (id: string) => void; }) {
  const [metric, setMetric] = useState<CategoryMetric>('page1');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const catData = CATEGORY_DATA[tabId];
  const tro = getTimeRangeOffset(timeRange, MONTHS.length);
  const chartData = MONTHS.slice(tro).map((month, i) => {
    const dp: any = { month };
    VENDORS.forEach(v => { if (visible.has(v.id)) dp[v.id] = catData[v.id][metric][i + tro]; });
    return dp;
  });
  const maxVal = Math.max(...VENDORS.flatMap(v => catData[v.id][metric]));
  const yMax = Math.max(maxVal + 1, 5);
  const yTicks = Array.from({ length: yMax + 1 }, (_, i) => i).filter((_, i) => yMax <= 8 || i % 2 === 0);
  const insightList = CATEGORY_INSIGHTS[tabId][metric];
  const CATEGORY_METRIC_OPTS: { id: CategoryMetric; label: string }[] = [
    { id: 'page1', label: '# of KWs on Page 1'     },
    { id: 'pos1',  label: '# of KWs at Position 1' },
  ];

  return (
    <div className="flex-1 flex flex-col gap-3 min-h-0">
      <SubFilter options={CATEGORY_METRIC_OPTS} value={metric} onChange={setMetric} />
      <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        <div className="col-span-8 flex flex-col">
          <ChartContainer title="" height={340}>
            <div className="h-full flex flex-col">
              <div className="pb-3 border-b border-gray-200 mb-3">
                <CompetitorFilter competitors={VENDORS} visibleCompetitors={visible} onToggle={onToggle} />
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={CHART_CONFIG.margin}>
                    <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                    <XAxis dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={fmt} />
                    <YAxis {...CHART_CONFIG.yAxis} domain={[0, yMax]} ticks={yTicks} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    {VENDORS.filter(v => visible.has(v.id)).map(v => (
                      <Line key={v.id} type="monotone" dataKey={v.id} name={v.name} stroke={v.color}
                        strokeWidth={v.id==='fortinet' ? 2.5 : 2}
                        dot={{ fill: v.color, r: 4, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }} connectNulls />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartContainer>
        </div>
        <div className="col-span-4 flex flex-col gap-3 min-h-0 overflow-y-auto">
          <InsightsSection>
            {insightList.map((ins, i) => <InsightCard key={i} icon={ins.icon} type={ins.type} title={ins.title} content={ins.content} />)}
          </InsightsSection>
        </div>
      </div>
    </div>
  );
}

// ─── Keyword position table tab (Tab 7) ────────────────────────────────────────

const MONTH_PILL_LABELS = ["Dec '25","Jan '26","Feb '26","Mar '26","Apr '26","May '26","Jun '26","Jul '26","Aug '26","Sep '26"];

function KeywordTableTab() {
  const [monthIdx,  setMonthIdx]  = useState<number>(9);        // default Sep '26
  const [viewMode,  setViewMode]  = useState<'heatmap'|'table'>('heatmap');
  const [category,  setCategory]  = useState<string>('All Categories');

  const rows = useMemo(() =>
    KEYWORDS.filter(k => category === 'All Categories' || k.cat === category),
    [category]
  );

  const getVendorPos = (row: KWRow, vendorId: string): number =>
    (row[vendorId as keyof KWRow] as number[])[monthIdx];


  return (
    <div className="flex-1 flex flex-col gap-2 min-h-0">

      {/* ── Reference-style control bar ──────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">

        {/* Month pill selector (matches reference image) */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-gray-500">Month:</span>
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
            {MONTH_PILL_LABELS.map((label, i) => (
              <button key={i} onClick={() => setMonthIdx(i)}
                className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all ${
                  monthIdx === i
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Heatmap / Table toggle (matches reference image) */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            {(['heatmap', 'table'] as const).map(v => (
              <button key={v} onClick={() => setViewMode(v)}
                className={`px-3 py-1 text-[10px] font-semibold rounded-md capitalize transition-all ${
                  viewMode === v ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {v === 'heatmap' ? 'Heatmap' : 'Table'}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="relative">
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="appearance-none text-[10px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg pl-2.5 pr-6 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-300 cursor-pointer">
              {KW_CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}{c !== 'All Categories' ? ` (${KEYWORDS.filter(k => k.cat === c).length})` : ` (${KEYWORDS.length})`}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Color legend ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-[9px]">
        <span className="font-bold text-gray-500 mr-0.5">Position:</span>
        {[
          { label:'#1',      cls:'bg-emerald-500 text-white' },
          { label:'#2–3',    cls:'bg-emerald-300 text-emerald-900' },
          { label:'#4–10',   cls:'bg-blue-200 text-blue-900' },
          { label:'#11–20',  cls:'bg-orange-200 text-orange-900' },
          { label:'#21–50',  cls:'bg-red-100 text-red-700' },
          { label:'#51–100', cls:'bg-gray-200 text-gray-500' },
          { label:'NR',      cls:'text-gray-400 border border-gray-200 bg-white' },
        ].map(l => (
          <span key={l.label} className={`px-1.5 py-0.5 rounded font-semibold ${l.cls}`}>{l.label}</span>
        ))}
        <span className="text-gray-400 italic ml-1">NR = Not Ranking</span>
        <span className="ml-auto text-[9px] text-gray-500 font-semibold">
          Showing: <span className="text-gray-800">{MONTH_PILL_LABELS[monthIdx]}</span> · {rows.length} keywords · All 5 competitors
        </span>
      </div>

      {/* ── Competitor comparison table ──────────────────────────────────── */}
      <div className="flex-1 min-h-0 rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-y-auto h-full">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-50 border-b-2 border-gray-200">
              {/* Vendor group header */}
              <tr className="border-b border-gray-200">
                <th colSpan={5} className="px-3 py-1.5 text-left" />
                {VENDORS.map(v => (
                  <th key={v.id} colSpan={1} className="px-1 py-1.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: v.color }} />
                      <span className="text-[10px] font-bold" style={{ color: v.color }}>{v.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
              {/* Column labels */}
              <tr>
                <th className="text-left pl-3 pr-1 py-1.5 text-[9px] font-bold text-gray-400 uppercase w-5">#</th>
                <th className="text-left px-2 py-1.5 text-[9px] font-bold text-gray-400 uppercase min-w-[130px]">Keyword</th>
                <th className="text-left px-2 py-1.5 text-[9px] font-bold text-gray-400 uppercase w-24">Category</th>
                <th className="text-right px-2 py-1.5 text-[9px] font-bold text-gray-400 uppercase w-10">MSV</th>
                <th className="text-right px-2 py-1.5 text-[9px] font-bold text-gray-400 uppercase w-8">KD</th>
                {VENDORS.map(v => (
                  <th key={v.id} className="text-center px-1 py-1.5 w-[72px]">
                    <span className="text-[9px] font-semibold text-gray-500">
                      {MONTH_PILL_LABELS[monthIdx]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={row.id}
                  className={`border-b border-gray-100 hover:bg-slate-50 transition-colors ${ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                  {/* Meta columns */}
                  <td className="pl-3 pr-1 py-2 text-[9px] text-gray-400 font-medium">{row.id}</td>
                  <td className="px-2 py-2 font-semibold text-gray-800 max-w-[140px]">
                    <span className="block truncate text-[11px]" title={row.kw}>{row.kw}</span>
                  </td>
                  <td className="px-2 py-2">
                    <span className="text-[9px] text-gray-400 font-medium truncate block">{row.cat}</span>
                  </td>
                  <td className="px-2 py-2 text-right text-[10px] text-gray-600 font-medium tabular-nums">{fmtMSV(row.msv)}</td>
                  <td className="px-2 py-2 text-right text-[10px] tabular-nums">
                    <span className={`font-bold ${row.kd >= 70 ? 'text-red-500' : row.kd >= 40 ? 'text-orange-400' : 'text-emerald-500'}`}>{row.kd}</span>
                  </td>
                  {/* One column per vendor */}
                  {VENDORS.map(v => {
                    const pos = getVendorPos(row, v.id);
                    return (
                      <td key={v.id} className="px-1 py-2 text-center">
                        {viewMode === 'heatmap' ? (
                          <span className={`inline-flex items-center justify-center w-8 h-5 rounded text-[10px] font-bold tabular-nums ${posStyle(pos)}`}>
                            {posLabel(pos)}
                          </span>
                        ) : (
                          <span className={`text-[11px] font-bold tabular-nums ${
                            pos === 1  ? 'text-emerald-600' :
                            pos <= 3   ? 'text-emerald-500' :
                            pos <= 10  ? 'text-blue-600'    :
                            pos <= 20  ? 'text-orange-500'  :
                            pos <= 50  ? 'text-red-400'     :
                            pos <= 100 ? 'text-gray-400'    :
                            'text-gray-200'
                          }`}>{posLabel(pos)}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Footer: per-vendor summary for selected month ────────────────── */}
      <div className="flex items-center gap-4 flex-shrink-0 flex-wrap">
        {VENDORS.map(v => {
          const p1  = rows.filter(r => getVendorPos(r, v.id) === 1).length;
          const p10 = rows.filter(r => { const p = getVendorPos(r, v.id); return p >= 1 && p <= 10; }).length;
          const nr  = rows.filter(r => getVendorPos(r, v.id) >= 101).length;
          return (
            <div key={v.id} className="flex items-center gap-1.5 text-[10px]">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: v.color }} />
              <span className="font-semibold" style={{ color: v.color }}>{v.name.split(' ')[0]}:</span>
              <span className="text-emerald-600 font-bold">{p1}</span><span className="text-gray-400"> #1</span>
              <span className="text-blue-600 font-bold">{p10}</span><span className="text-gray-400"> T10</span>
              <span className="text-gray-400 font-bold">{nr}</span><span className="text-gray-400"> NR</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function SlideTop50KWSummary({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [tab, setTab] = useState<TabId>('summary');
  const [visible, setVisible] = useState<Set<string>>(new Set(VENDORS.map(v => v.id)));

  const toggle = (id: string) => {
    setVisible(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  return (
    <SlideContainer slideNumber={11} onNavigateHome={onNavigateHome} source="SEMrush">
      <SlideHeader
        title="Top 50 KW Summary"
        subtitle="Top 50 Keyword Ranking Tracking · Dec 2025 – Sep 2026"
      />

      <div className="flex-1 flex flex-col gap-0 min-h-0">
        {/* ── Tabs ──────────────────────────────────────────────────────────── */}
        <div className="flex items-end gap-0.5 flex-wrap">
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-3.5 py-2 text-[11px] font-semibold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-white text-red-600 z-10'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
                style={{
                  borderRadius: '10px 10px 0 0',
                  marginBottom: active ? '-2px' : '0px',
                  boxShadow: active ? '0 -2px 8px rgba(0,0,0,0.08), 0 2px 0 0 white' : 'none',
                }}>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab content ────────────────────────────────────────────────── */}
        <div className="flex-1 bg-white border-t-2 border-gray-100 pt-3 flex flex-col min-h-0">
          {tab === 'summary' && <SummaryTabContent visible={visible} onToggle={toggle} />}
          {tab === 'top50'   && <KeywordTableTab />}
          {tab !== 'summary' && tab !== 'top50' && (
            <CategoryTabContent
              key={tab}
              tabId={tab as Exclude<TabId,'summary'|'top50'>}
              visible={visible}
              onToggle={toggle}
            />
          )}
        </div>
      </div>

      <SlideFooter source="Source: SEMrush · Top 50 Keywords Tracking · Dec 2025 – Sep 2026" />
    </SlideContainer>
  );
}
