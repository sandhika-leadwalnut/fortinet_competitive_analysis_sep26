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

const MONTHS = ['2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10'];
const MONTH_LABELS = ['Dec-25','Jan-26','Feb-26','Mar-26','Apr-26','May-26','Jun-26','Jul-26','Aug-26','Sep-26','Oct-26'];
const MONTH_SHORT  = ['Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'];

const fmt = (key: string) => ({
  '2025-12':'Dec-25','2026-01':'Jan-26','2026-02':'Feb-26','2026-03':'Mar-26',
  '2026-04':'Apr-26','2026-05':'May-26','2026-06':'Jun-26','2026-07':'Jul-26','2026-08':'Aug-26','2026-09':'Sep-26','2026-10':'Oct-26',
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
  fortinet:   { page1: [38,39,39,41,40,39,36,40,37,36,36], page2: [5,3,1,1,2,2,6,4,4,3,4],   page3: [2,4,2,2,2,0,1,1,3,2,4],   pos1: [25,24,31,36,31,30,24,27,8,29,31] },
  cisco:      { page1: [27,28,28,25,27,26,21,25,24,27,26], page2: [7,6,7,2,4,5,9,3,5,2,4],   page3: [2,2,1,9,2,3,4,3,5,2,0],   pos1: [17,18,21,19,18,19,11,16,4,22,24] },
  paloalto:   { page1: [27,23,30,33,28,28,31,24,26,23,23], page2: [5,7,4,2,7,9,4,6,9,6,2],   page3: [7,5,3,7,3,2,3,5,3,8,9],   pos1: [18,17,22,25,21,19,20,12,2,15,18] },
  checkpoint: { page1: [12,12,15,15,18,10,17,17,14,19,14], page2: [15,13,4,8,7,12,10,13,16,10,7], page3: [8,7,11,6,4,3,3,3,7,1,6], pos1: [4,4,8,7,9,2,6,7,0,10,12] },
  hpe:        { page1: [5,4,5,4,1,3,4,5,2,5,5],         page2: [2,1,0,2,0,1,3,0,1,2,2],   page3: [1,2,1,1,4,3,2,2,3,2,3],   pos1: [5,3,4,4,1,1,4,5,0,4,3] },
};

// ─── Category data (Tabs 2–6) ──────────────────────────────────────────────────

type CategoryData = { page1: number[]; pos1: number[] };

const CATEGORY_DATA: Record<TabId, Record<string, CategoryData>> = {
  summary: {} as any,
  ngfw: {
    fortinet:   { page1: [7,6,7,7,7,6,7,7,6,6,7],   pos1: [5,4,6,7,7,5,7,5,2,3,7] },
    cisco:      { page1: [6,6,6,6,6,5,6,6,6,6,6],   pos1: [4,6,5,5,6,4,4,5,3,5,6] },
    paloalto:   { page1: [7,6,5,6,6,7,7,6,6,5,6],   pos1: [4,3,3,5,6,6,6,3,1,4,4] },
    checkpoint: { page1: [3,3,6,5,6,6,6,6,6,7,6],   pos1: [1,1,3,3,3,1,2,4,0,4,5] },
    hpe:        { page1: [1,1,1,1,0,0,1,1,0,1,0],   pos1: [1,1,1,1,0,0,1,1,0,1,0] },
  },
  network: {
    fortinet:   { page1: [4,4,4,4,4,4,4,3,3,4,4],   pos1: [1,3,4,4,4,4,3,1,0,3,3] },
    cisco:      { page1: [3,2,2,3,2,3,1,2,2,1,2],   pos1: [2,1,2,1,1,3,0,2,1,1,2] },
    paloalto:   { page1: [2,3,3,5,2,2,3,3,2,2,1],   pos1: [1,3,3,3,2,2,3,1,1,1,1] },
    checkpoint: { page1: [2,2,2,2,1,1,2,3,3,3,2],   pos1: [1,1,2,2,0,1,1,0,0,2,2] },
    hpe:        { page1: [1,0,1,0,0,0,0,0,0,0,1],   pos1: [1,0,0,0,0,0,0,0,0,0,0] },
  },
  ztna: {
    fortinet:   { page1: [3,3,2,3,3,3,3,4,3,3,3],   pos1: [2,2,1,2,1,3,3,2,1,3,3] },
    cisco:      { page1: [3,2,2,2,2,2,2,2,2,2,2],   pos1: [3,1,2,1,1,1,1,2,0,2,2] },
    paloalto:   { page1: [1,0,4,4,3,3,3,2,2,2,1],   pos1: [0,0,2,3,1,2,2,0,0,0,1] },
    checkpoint: { page1: [0,1,0,0,1,0,1,2,0,0,0],   pos1: [0,0,0,0,0,0,0,1,0,0,0] },
    hpe:        { page1: [0,0,0,0,0,0,0,0,0,0,0],   pos1: [0,0,0,0,0,0,0,0,0,0,0] },
  },
  cloud: {
    fortinet:   { page1: [1,1,2,1,1,3,2,3,2,2,1],   pos1: [1,1,2,1,1,2,2,3,0,2,1] },
    cisco:      { page1: [0,1,0,1,1,2,1,1,1,1,0],   pos1: [0,1,0,1,1,1,1,0,0,0,0] },
    paloalto:   { page1: [1,1,1,1,2,0,0,0,0,1,0],   pos1: [1,1,1,1,2,0,0,0,0,1,0] },
    checkpoint: { page1: [1,1,1,1,1,1,2,2,0,1,1],   pos1: [0,0,0,1,0,0,1,2,0,0,1] },
    hpe:        { page1: [0,0,0,0,0,0,0,0,0,0,0],   pos1: [0,0,0,0,0,0,0,0,0,0,0] },
  },
  sdwan: {
    fortinet:   { page1: [4,4,5,5,5,5,4,5,5,5,5],   pos1: [3,3,4,5,3,3,3,4,1,4,5] },
    cisco:      { page1: [3,4,3,4,4,5,5,3,4,5,3],   pos1: [1,1,1,4,3,5,4,1,0,4,3] },
    paloalto:   { page1: [5,4,4,5,5,4,4,5,4,5,4],   pos1: [3,2,3,4,5,3,3,4,0,4,3] },
    checkpoint: { page1: [1,0,1,2,2,1,2,2,1,1,1],   pos1: [0,0,1,0,2,0,1,2,0,1,1] },
    hpe:        { page1: [1,2,2,1,0,1,2,3,1,1,1],   pos1: [1,1,2,1,0,1,2,3,0,1,2] },
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
  { id:1,  cat:'Network Security',    kw:'network security',               msv:14800,   kd:59, fortinet:[5,3,1,1,1,1,1,11,15,1,1],      paloalto:[9,1,1,10,92,33,29,33,43,101,30],   checkpoint:[7,1,1,21,101,1,1,6,4,1,1],    cisco:[1,2,1,1,1,1,3,1,1,1,1],      hpe:[1,30,2,43,63,30,101,38,25,21,101]    },
  { id:2,  cat:'Network Security',    kw:'network security solutions',     msv:4400,    kd:35, fortinet:[1,1,1,1,1,1,3,1,3,6,1],         paloalto:[29,98,101,1,1,12,1,9,5,101,23],    checkpoint:[1,10,1,1,22,26,15,6,4,1,101],   cisco:[10,14,14,7,7,1,14,15,15,67,65],  hpe:[55,43,46,47,46,101,17,101,101,101,4] },
  { id:3,  cat:'Network Security',    kw:'data security',                  msv:9900,   kd:70, fortinet:[2,1,1,1,1,1,1,4,2,1,1],         paloalto:[12,12,27,1,17,20,84,12,26,25,25],  checkpoint:[27,43,71,101,101,101,101,38,27,101,46], cisco:[101,101,101,101,101,101,101,101,101,101,101], hpe:[101,101,50,101,101,101,101,101,101,101,101] },
  { id:4,  cat:'Network Security',    kw:'5g network security',            msv:12100,     kd:37, fortinet:[17,29,22,101,40,101,101,22,101,54,101], paloalto:[1,1,1,2,1,1,1,1,1,1,1],     checkpoint:[19,30,23,1,9,17,9,8,8,10,1],   cisco:[37,56,101,101,101,27,25,27,27,33,17], hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:5,  cat:'Network Security',    kw:'What is a data breach',          msv:110000,   kd:56, fortinet:[7,1,1,1,1,1,1,5,3,1,4],         paloalto:[29,1,1,1,15,1,1,8,14,8,101],      checkpoint:[38,31,30,58,23,42,101,101,101,101,101], cisco:[1,1,1,9,101,1,12,1,7,13,1],   hpe:[101,52,32,101,101,101,11,101,101,11,101] },
  { id:6,  cat:'Network Access',      kw:'What is Remote Access',          msv:320,    kd:45, fortinet:[1,1,1,1,2,1,1,1,1,1,1],         paloalto:[7,1,1,7,5,1,2,1,13,45,1],        checkpoint:[20,20,25,19,96,21,101,18,20,20,31], cisco:[15,11,9,22,16,101,101,101,101,101,101], hpe:[1,1,1,1,1,7,1,1,3,1,1]          },
  { id:7,  cat:'NGFW/Firewall',       kw:'firewall',                       msv:27100,  kd:79, fortinet:[4,1,1,1,1,1,1,1,1,1,1],         paloalto:[7,10,60,17,12,10,8,9,9,13,1],    checkpoint:[11,16,9,4,7,8,1,1,5,1,1],    cisco:[2,1,1,1,1,16,3,3,2,1,1],      hpe:[101,101,101,101,90,101,101,101,101,101,101] },
  { id:8,  cat:'NGFW/Firewall',       kw:'network firewall',               msv:4400,   kd:68, fortinet:[1,24,1,1,1,19,1,1,17,18,1],      paloalto:[1,1,3,1,1,1,1,1,7,9,8],         checkpoint:[20,33,1,26,19,9,11,13,19,10,17], cisco:[4,1,1,1,1,1,1,1,2,1,1],      hpe:[1,1,25,1,23,32,38,33,101,43,43]    },
  { id:9,  cat:'NGFW/Firewall',       kw:'what is a firewall',             msv:12100,   kd:73, fortinet:[1,1,1,1,1,1,1,1,2,3,1],         paloalto:[4,34,5,5,1,1,1,6,3,1,19],        checkpoint:[24,15,48,15,1,9,7,8,6,5,7],  cisco:[1,1,1,1,1,1,2,1,1,1,1],      hpe:[101,101,55,101,101,101,101,101,101,101,101] },
  { id:10, cat:'NGFW/Firewall',       kw:'firewall security',              msv:2900,   kd:49, fortinet:[1,1,6,1,1,1,1,1,4,5,1],         paloalto:[1,1,15,1,1,1,1,17,20,30,2],      checkpoint:[13,37,10,9,7,7,7,1,3,4,1],   cisco:[1,1,3,1,1,1,1,1,1,1,1],      hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:11, cat:'NGFW/Firewall',       kw:'ngfw',                           msv:5400,   kd:55, fortinet:[1,3,1,1,1,2,1,4,2,2,1],         paloalto:[1,2,1,1,1,1,1,2,1,1,1],         checkpoint:[1,6,1,1,1,51,7,1,5,1,1],    cisco:[1,1,1,4,1,6,1,1,3,1,1],      hpe:[46,31,101,30,36,36,24,24,23,1,25]  },
  { id:12, cat:'NGFW/Firewall',       kw:'next generation firewall',       msv:3600,   kd:54, fortinet:[6,6,1,1,1,1,1,5,3,1,1],         paloalto:[5,4,1,1,1,1,1,1,2,1,1],         checkpoint:[9,1,10,1,8,9,9,9,7,1,1],    cisco:[1,1,1,1,1,1,1,1,1,2,1],      hpe:[13,101,1,13,22,10,1,1,18,101,17]    },
  { id:13, cat:'NGFW/Firewall',       kw:'firewall as a service',          msv:1300,    kd:31, fortinet:[1,1,1,1,1,1,1,1,1,1,1],         paloalto:[1,1,1,1,1,1,1,1,2,1,1],         checkpoint:[7,6,1,1,1,1,1,1,7,1,1],    cisco:[74,78,98,42,74,101,23,101,101,101,101], hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:14, cat:'MPLS',                kw:'MPLS',                           msv:22200, kd:35, fortinet:[6,5,1,7,1,1,19,1,5,1,25],         paloalto:[12,37,101,23,27,5,4,7,8,15,12],   checkpoint:[39,36,39,101,29,42,101,30,101,101,101], cisco:[1,6,1,1,1,1,17,9,4,6,1],   hpe:[1,14,101,1,59,25,11,101,101,1,1]  },
  { id:15, cat:'SD WAN',              kw:'SD WAN',                         msv:6600,  kd:59, fortinet:[1,4,1,1,1,1,1,4,3,1,1],         paloalto:[1,6,3,1,1,1,1,1,2,5,1],         checkpoint:[18,11,101,8,1,18,13,9,15,101,13], cisco:[3,2,1,1,1,1,1,4,4,1,1],     hpe:[1,9,1,12,101,1,1,1,9,1,1]        },
  { id:16, cat:'SD WAN',              kw:'SDN vs SD WAN',                  msv:260,     kd:23, fortinet:[1,1,1,1,1,2,2,1,2,1,1],         paloalto:[1,1,1,1,1,1,1,1,3,1,4],         checkpoint:[21,18,44,101,18,101,101,12,12,15,26], cisco:[11,10,11,1,10,1,9,9,10,10,1], hpe:[36,87,64,101,74,101,101,101,101,101,37] },
  { id:17, cat:'SD WAN',              kw:'SD WAN Solutions',               msv:1300,    kd:39, fortinet:[14,16,6,1,1,9,11,1,7,1,1],       paloalto:[1,12,11,1,1,16,101,1,14,1,26],   checkpoint:[41,19,101,15,17,19,18,20,17,17,29], cisco:[6,8,9,1,1,1,1,1,9,1,1],    hpe:[20,21,93,32,21,20,1,1,101,101,2]   },
  { id:18, cat:'OT Security',         kw:'ot security',                    msv:3600,   kd:50, fortinet:[1,1,1,1,1,1,1,2,1,2,1],         paloalto:[1,1,1,1,7,6,8,8,8,4,1],         checkpoint:[29,101,32,44,28,43,21,27,25,101,26], cisco:[1,1,1,1,1,3,6,3,2,3,1],  hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:19, cat:'OT Security',         kw:'ot security solutions',          msv:480,    kd:36, fortinet:[1,1,1,1,1,1,1,1,2,1,1],         paloalto:[1,1,1,1,8,9,1,54,8,1,1],        checkpoint:[32,29,33,40,101,36,42,52,46,50,101], cisco:[10,1,7,6,1,1,1,1,4,1,1],  hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:20, cat:'OT Security',         kw:'iot security best practices',    msv:210,     kd:30, fortinet:[1,2,2,1,1,1,3,3,2,2,2],         paloalto:[9,7,6,1,9,1,1,23,5,15,21],        checkpoint:[101,101,101,101,101,101,101,101,101,101,101], cisco:[101,101,101,101,101,101,101,101,101,101,101], hpe:[101,101,101,101,101,101,101,101,101,34,101] },
  { id:21, cat:'SASE',                kw:'sase',                           msv:14800,  kd:69, fortinet:[1,1,1,1,2,1,1,1,1,1,1],         paloalto:[3,1,1,1,1,1,1,1,2,1,1],         checkpoint:[13,12,13,10,16,8,8,8,9,1,1],  cisco:[1,1,7,1,12,1,1,60,25,1,32],  hpe:[29,1,1,1,28,26,27,1,21,19,15]      },
  { id:22, cat:'SASE',                kw:'sase solutions',                 msv:1900,    kd:59, fortinet:[3,1,1,1,2,1,1,1,3,3,1],         paloalto:[2,3,1,4,1,8,5,5,5,1,1],         checkpoint:[10,12,1,11,1,15,1,14,15,13,20], cisco:[14,15,20,15,1,1,1,37,9,1,13],  hpe:[62,42,101,101,101,101,101,27,101,47,26] },
  { id:23, cat:'Malware',             kw:'malware',                        msv:40500,  kd:80, fortinet:[9,5,1,21,1,16,24,19,21,101,15],    paloalto:[23,1,19,14,101,19,6,23,19,17,22], checkpoint:[28,17,1,36,9,12,16,11,18,7,1], cisco:[5,1,101,22,7,1,11,1,4,1,1],  hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:24, cat:'Malware',             kw:'malware detection',              msv:2400,   kd:73, fortinet:[34,29,101,1,27,101,101,101,101,101,101], paloalto:[27,101,1,26,1,101,18,101,8,15,1], checkpoint:[47,101,101,101,58,101,49,45,101,101,101], cisco:[101,101,101,35,74,101,101,101,101,101,101], hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:25, cat:'Malware',             kw:'malware protection',             msv:1830000,   kd:62, fortinet:[1,1,1,1,1,1,6,1,8,1,1],         paloalto:[1,1,4,6,1,3,3,1,2,1,1],         checkpoint:[1,1,37,101,20,34,36,32,29,1,30], cisco:[8,1,1,1,6,18,101,13,101,53,101], hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:26, cat:'Ransomware',          kw:'ransomware protection',          msv:4400,    kd:53, fortinet:[12,10,1,1,7,6,6,1,10,1,1],      paloalto:[101,15,101,26,41,101,101,101,101,101,101], checkpoint:[17,45,101,48,51,48,49,36,24,52,50], cisco:[49,84,71,101,101,50,44,42,101,12,1], hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:27, cat:'Ransomware',          kw:'ransomware removal',             msv:1300,    kd:62, fortinet:[1,1,2,1,1,1,1,1,1,1,1],         paloalto:[29,29,101,39,17,101,101,101,101,101,101], checkpoint:[35,1,26,101,60,34,34,34,33,38,45], cisco:[101,101,101,101,101,101,101,101,101,101,101], hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:28, cat:'Ransomware',          kw:'ransomware',                     msv:22200,  kd:93, fortinet:[4,5,5,1,1,4,6,1,5,101,4],         paloalto:[84,101,37,1,51,1,1,35,37,27,36],  checkpoint:[10,9,1,7,1,12,101,19,10,101,12], cisco:[16,20,12,27,10,27,11,10,6,101,15], hpe:[101,101,101,101,101,37,38,43,62,7,24] },
  { id:29, cat:'Cloud Security',      kw:'cloud security',                 msv:12100,   kd:80, fortinet:[20,22,1,29,20,1,18,1,101,27,27],  paloalto:[40,1,25,22,1,25,22,21,101,28,101], checkpoint:[4,3,8,1,8,7,8,1,19,5,1],     cisco:[32,1,19,1,39,1,35,6,8,26,59],  hpe:[101,101,101,101,101,101,101,101,101,58,101] },
  { id:30, cat:'Cloud Security',      kw:'cloud security service providers', msv:50, kd:42, fortinet:[101,101,101,101,101,6,1,1,5,1,13], paloalto:[1,38,1,1,1,101,101,101,101,1,101], checkpoint:[101,101,101,101,101,13,1,1,12,13,101], cisco:[101,101,101,101,101,101,101,101,101,45,53], hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:31, cat:'Cloud Security',      kw:'email encryption',               msv:2900,   kd:45, fortinet:[1,1,1,1,1,1,1,1,2,1,1],         paloalto:[101,101,101,101,101,101,101,101,101,101,101], checkpoint:[36,46,30,19,36,36,101,31,43,37,101], cisco:[40,43,28,37,1,9,1,15,13,1,42], hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:32, cat:'Zero Trust / ZTNA',   kw:'zero trust security',            msv:5400,   kd:87, fortinet:[1,8,101,1,7,1,1,1,7,1,1],       paloalto:[31,29,1,1,19,17,1,16,20,15,34],   checkpoint:[14,10,16,16,8,16,9,9,17,19,16], cisco:[1,28,49,33,30,15,28,28,38,29,101], hpe:[74,101,101,101,101,101,101,101,101,101,87] },
  { id:33, cat:'Zero Trust / ZTNA',   kw:'zero trust network',             msv:2900,   kd:77, fortinet:[6,37,4,1,1,1,1,7,6,1,1],         paloalto:[13,12,8,1,10,1,12,9,7,7,8],     checkpoint:[28,25,25,46,40,54,44,1,77,47,14], cisco:[1,1,1,1,1,1,1,1,3,1,1],     hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:34, cat:'Zero Trust / ZTNA',   kw:'zero trust network access',      msv:4400,    kd:64, fortinet:[1,1,1,5,5,1,1,3,1,1,1],         paloalto:[4,99,1,7,7,1,1,6,7,9,1],        checkpoint:[19,18,23,17,101,66,101,101,25,29,101], cisco:[1,4,1,4,4,4,4,1,2,1,1],   hpe:[101,85,101,101,49,55,46,58,44,101,101] },
  { id:35, cat:'Zero Trust / ZTNA',   kw:'zero trust solutions',           msv:1900,    kd:52, fortinet:[38,1,25,101,42,32,101,1,101,33,31], paloalto:[21,65,8,1,1,10,10,12,11,96,21],  checkpoint:[33,32,75,101,101,101,101,101,101,101,101], cisco:[22,22,20,21,18,101,101,101,101,35,34], hpe:[101,101,101,101,65,101,101,101,101,101,37] },
  { id:36, cat:'5G Security',         kw:'5g security solutions',          msv:110,     kd:32, fortinet:[19,14,18,17,22,10,7,11,18,17,27],  paloalto:[1,1,1,1,1,1,2,1,2,1,1],         checkpoint:[22,24,23,5,6,16,11,18,22,1,1], cisco:[20,48,42,28,28,101,101,101,101,101,35], hpe:[93,79,101,101,101,101,101,101,101,101,101] },
  { id:37, cat:'Proxy Server',        kw:'Proxy Server',                   msv:49500,  kd:78, fortinet:[1,5,1,1,1,1,1,2,3,1,1],         paloalto:[1,14,25,1,19,8,8,10,6,1,10],     checkpoint:[101,43,101,101,68,41,26,21,23,101,101], cisco:[101,10,1,29,101,101,101,101,101,101,101], hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:38, cat:'DDoS',                kw:'DDOS',                           msv:33100,  kd:85, fortinet:[1,4,4,1,1,1,5,1,6,1,1],         paloalto:[82,26,39,27,31,11,16,43,20,27,34], checkpoint:[20,24,29,101,101,19,20,14,16,15,24], cisco:[22,101,14,13,101,27,25,101,22,101,101], hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:39, cat:'DDoS',                kw:'What is DDoS Attack',            msv:4400,   kd:70, fortinet:[1,1,1,1,12,8,11,1,9,1,1],       paloalto:[1,26,1,101,23,19,23,25,28,26,24], checkpoint:[19,19,28,25,1,11,14,15,16,101,101], cisco:[1,1,1,21,6,7,20,1,19,101,1],  hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:40, cat:'DLP',                 kw:'dlp',                            msv:9900,  kd:64, fortinet:[1,1,1,1,1,1,20,1,10,22,13],        paloalto:[1,53,1,1,25,7,6,3,4,7,67],       checkpoint:[27,27,19,30,32,87,17,12,13,12,35], cisco:[1,1,1,37,1,101,11,101,18,1,1], hpe:[101,101,79,101,101,101,101,101,101,101,101] },
  { id:41, cat:'DLP',                 kw:'Data Loss Prevention',           msv:9900,  kd:66, fortinet:[7,10,36,1,9,101,19,1,19,1,12],   paloalto:[27,27,1,27,1,25,1,21,7,21,1],    checkpoint:[15,15,27,24,15,77,17,101,20,19,101], cisco:[11,17,1,1,55,12,13,101,22,1,1], hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:42, cat:'Endpoint Protection', kw:'endpoint security',             msv:9900,   kd:54, fortinet:[1,1,1,1,2,2,2,2,1,1,1],         paloalto:[11,18,1,10,9,1,1,11,9,10,1],     checkpoint:[5,4,9,6,1,3,4,5,7,9,9],      cisco:[2,3,3,1,1,1,42,3,2,1,1],     hpe:[101,101,101,101,43,64,50,101,101,101,57] },
  { id:43, cat:'Endpoint Protection', kw:'Endpoint Management',           msv:2400,   kd:37, fortinet:[28,1,101,101,33,101,31,101,10,53,28], paloalto:[101,101,101,101,101,101,101,101,101,57,54], checkpoint:[64,101,101,101,86,75,101,65,64,75,62], cisco:[11,1,1,1,3,101,13,1,12,1,10], hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:44, cat:'Cybersecurity',       kw:'Email Security',                 msv:5400,   kd:56, fortinet:[1,3,1,3,1,55,5,6,3,1,1],         paloalto:[101,101,101,101,101,101,101,101,101,101,101], checkpoint:[1,48,56,1,1,64,8,12,8,1,1], cisco:[1,14,1,7,13,13,9,27,26,1,20],  hpe:[101,101,101,101,101,101,101,101,101,33,36] },
  { id:45, cat:'Cybersecurity',       kw:'what is cybersecurity',          msv:12100,  kd:76, fortinet:[8,1,101,10,8,1,7,13,23,11,8],    paloalto:[1,1,8,1,17,18,16,101,14,101,44],   checkpoint:[19,24,7,23,20,22,9,101,18,8,41], cisco:[1,1,1,1,1,5,3,1,3,4,1],     hpe:[84,101,98,41,76,101,101,101,45,30,35] },
  { id:46, cat:'Cybersecurity',       kw:'Information Security',           msv:5400,   kd:43, fortinet:[30,14,1,1,1,32,32,34,28,34,34],   paloalto:[101,101,101,101,101,101,101,101,101,101,101], checkpoint:[43,67,101,56,54,13,24,13,15,20,24], cisco:[1,9,1,21,101,1,4,1,5,1,1],  hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:47, cat:'Cybersecurity',       kw:'cyber attack',                   msv:18100,  kd:72, fortinet:[4,4,7,4,1,1,8,9,4,1,10],         paloalto:[16,20,14,29,101,20,101,20,28,25,29], checkpoint:[5,5,5,3,3,101,1,4,3,4,18],    cisco:[6,7,3,24,7,7,5,3,8,1,7],     hpe:[101,101,101,101,101,101,101,101,101,101,101] },
  { id:48, cat:'Security Operations', kw:'Secops',                         msv:2400,   kd:50, fortinet:[1,1,1,1,1,1,1,1,5,1,1],         paloalto:[1,1,1,1,1,1,1,1,4,1,1],         checkpoint:[17,16,14,18,39,57,43,43,41,101,101], cisco:[101,101,101,101,101,101,101,101,101,101,101], hpe:[101,101,101,101,101,101,101,101,101,101,101] },
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
  const L = MONTHS.length - 1;
  const ftLatest = ftVals[L]; const ftPeak = Math.max(...ftVals); const ftPeakIdx = ftVals.indexOf(ftPeak);
  const paLatest = SUMMARY_DATA.paloalto[metric][L];
  const csLatest = SUMMARY_DATA.cisco[metric][L];
  const cpLatest = SUMMARY_DATA.checkpoint[metric][L];
  const hpeLatest = SUMMARY_DATA.hpe[metric][L];

  const insights: Record<SummaryMetric, React.ReactNode> = {
    page1: <InsightsSection>
      <InsightCard icon={Trophy} type="success" title="Fortinet Dominates P1"
        content={`Fortinet holds the most Page 1 positions: peaked at ${ftPeak} KWs in ${fmt(MONTHS[ftPeakIdx])} and has held 36–41 since Dec. ${ftLatest} in Oct — ${Math.round((ftLatest / csLatest - 1) * 100)}% more than Cisco and ${Math.round((ftLatest / paLatest - 1) * 100)}% more than Palo Alto.`} />
      <InsightCard icon={TrendingUp} type="info" title="Cisco Edges Palo Alto"
        content={`Cisco (${csLatest}, −1 MoM) leads Palo Alto (${paLatest}, flat MoM) by ${csLatest - paLatest} Page 1 KWs in Oct 2026. Palo Alto peaked at 33 in Mar; Cisco stable 21–28.`} />
      <InsightCard icon={AlertTriangle} type="warning" title="Check Point Gives Back Sep Gain"
        content={`Check Point fell to ${cpLatest} Page 1 KWs in Oct (−5 MoM) after a record 19 in Sep, while HPE held at ${hpeLatest}. Check Point now trails Palo Alto by ${paLatest - cpLatest} — a pattern of spikes that don't hold (18 in Apr → 10 in May → 19 in Sep → 14 in Oct).`} />
    </InsightsSection>,
    page2: <InsightsSection>
      <InsightCard icon={AlertTriangle} type="warning" title="Check Point High P2"
        content={`Check Point has ${cpLatest} Page 2 KWs in Oct (down from 10 in Sep) — 4–16 range historically. High P2 count signals KWs close to Page 1 that could be upgraded.`} />
      <InsightCard icon={TrendingDown} type="info" title="Fortinet P2 Low"
        content={`Fortinet at ${ftLatest} Page 2 KWs (+1 MoM) — most KWs already on Page 1 (${SUMMARY_DATA.fortinet.page1[L]} P1 KWs). Reflects strong existing rankings.`} />
      <InsightCard icon={TrendingUp} type="success" title="Palo Alto P2 Cleared"
        content={`Palo Alto at ${paLatest} Page 2 KWs in Oct (down from 6 in Sep, 9 in Aug) — matching its Mar low, but its Page 3 count rose to ${SUMMARY_DATA.paloalto.page3[L]}, so KWs are sliding down rather than up.`} />
    </InsightsSection>,
    page3: <InsightsSection>
      <InsightCard icon={AlertTriangle} type="warning" title="P3 Burden Rises at Check Point"
        content={`Check Point jumped to ${cpLatest} Page 3 KWs in Oct (+5 MoM from 1 in Sep), approaching its 7–8 Dec–Jan level, while Palo Alto still carries the most (${paLatest}, +1 MoM). These are the weakest-ranked, furthest from Page 1 visibility.`} />
      <InsightCard icon={TrendingDown} type="warning" title="Fortinet P3 Creeping Up"
        content={`Fortinet at ${ftLatest} Page 3 KWs in Oct (+2 MoM) — matching its Jan high. Still small, but worth watching on page-3 drift.`} />
      <InsightCard icon={TrendingDown} type="info" title="HPE Apr–May Anomaly"
        content={`HPE Page 3 KWs spiked to 4 (Apr) and 3 (May) and sit at ${hpeLatest} in Oct — unusually high for a vendor with only 5 Page 1 KWs. Possible ranking volatility.`} />
    </InsightsSection>,
    pos1: <InsightsSection>
      <InsightCard icon={Trophy} type="success" title="Fortinet #1 Rank Leader"
        content={`Fortinet holds ${ftLatest} of 48 tracked KWs at position #1 in Oct 2026 (+2 MoM, recovering toward its Mar peak of ${Math.max(...ftVals.slice(0, L))}). Average ${(SUMMARY_DATA.fortinet.pos1.reduce((a,b)=>a+b,0)/MONTHS.length).toFixed(0)} position-1 KWs per month.`} />
      <InsightCard icon={TrendingUp} type="info" title="Palo Alto & Cisco Keep Climbing"
        content={`Palo Alto reached ${paLatest} position-1 KWs in Oct 2026 (from 15 in Sep and 2 in Aug) but remains below its Mar peak of 25. Cisco grew to ${csLatest} (from 22).`} />
      <InsightCard icon={AlertTriangle} type="error" title="Check Point Inconsistent"
        content={`Check Point position-1 KWs range from 0 (Aug) to 12 (Oct, new high), up from 10 in Sep. HPE slipped to ${hpeLatest} position-1 KWs (from 4).`} />
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
      { icon: Trophy, type:'success', title:'Fortinet Back on Top of P1', content:'Fortinet is back to 7 of 7 NGFW/Firewall Page 1 KWs in Oct 2026 (+1 MoM), ahead of Palo Alto, Cisco and Check Point at 6 each. Check Point slipped 1 from its Sep high of 7.' },
      { icon: TrendingUp, type:'success', title:'Palo Alto Recovers', content:'Palo Alto regained 1 Page 1 NGFW KW to 6 in Oct 2026 after hitting a Feb-matching low of 5 in Sep.' },
      { icon: AlertTriangle, type:'warning', title:'HPE Drops Out', content:'HPE fell to 0 NGFW Page 1 KWs in Oct (1 in Sep) — effectively absent from this keyword category.' },
    ],
    pos1: [
      { icon: Trophy, type:'success', title:'Fortinet Hits 7 at #1', content:'Fortinet jumped from 3 to 7 position-1 NGFW KWs in Oct 2026 — matching its Mar/Apr/Jun peak and now ahead of Cisco (6) after trailing in Sep.' },
      { icon: TrendingUp, type:'info', title:'Cisco & Check Point Strengthen', content:'Cisco rose to 6 position-1 KWs (from 5) and Check Point to 5 (from 4) in Oct 2026 — Check Point now holds its highest #1 count of the year.' },
      { icon: TrendingDown, type:'warning', title:'Palo Alto Flat at 4', content:'Palo Alto held at 4 position-1 KWs in Oct 2026 — still below its peak of 6 (Apr–Jun) as peers pulled ahead.' },
    ],
  },
  network: {
    page1: [
      { icon: Trophy, type:'success', title:'Fortinet Most Consistent', content:'Fortinet leads with 4 Network Security Page 1 KWs in Oct 2026 (flat MoM) — the most stable vendor, ranging 3–4 all year.' },
      { icon: TrendingDown, type:'warning', title:'Check Point & Palo Alto Slip', content:'Check Point eased to 2 (from 3) and Palo Alto to 1 (from 2, peak 5 in Mar) in Oct 2026. Cisco edged up to 2.' },
      { icon: TrendingUp, type:'info', title:'HPE Re-appears', content:'HPE has 1 Network Security Page 1 KW in Oct after 0 across Mar–Sep — first sign of life in this category.' },
    ],
    pos1: [
      { icon: Trophy, type:'success', title:'Fortinet Holds 3 at #1', content:'Fortinet held 3 position-1 Network Security KWs in Oct 2026 (flat MoM) — still below its peak of 4 (Feb–May) but 3× the Jul level.' },
      { icon: TrendingUp, type:'success', title:'Cisco Up to 2', content:'Cisco climbed to 2 position-1 KWs (from 1) in Oct 2026 — level with Check Point, ahead of Palo Alto (1).' },
      { icon: AlertTriangle, type:'warning', title:'Check Point Gap', content:'Check Point holds 2 position-1 KWs but only 2 Page 1 KWs overall in Oct — every Page 1 ranking is a #1, leaving no depth beneath.' },
    ],
  },
  ztna: {
    page1: [
      { icon: Trophy, type:'success', title:'Fortinet Leads Steady at 3', content:'Fortinet holds 3 Zero Trust / ZTNA Page 1 KWs in Oct 2026 (flat MoM; peak 4 in Jul); Cisco holds 2. Palo Alto slipped to 1 (from 2).' },
      { icon: TrendingDown, type:'warning', title:'Palo Alto Fades', content:'Palo Alto fell from 4 Page 1 ZTNA KWs (Feb–Mar) to 1 in Oct 2026 — the lowest since Jan.' },
      { icon: AlertTriangle, type:'warning', title:'HPE & Check Point Absent', content:'HPE (0 across all 11 months) and Check Point (0 in Oct) have no ZTNA Page 1 presence.' },
    ],
    pos1: [
      { icon: Trophy, type:'success', title:'Fortinet Leads Position-1', content:'Fortinet holds 3 ZTNA position-1 KWs in Oct 2026 (flat MoM), ahead of Cisco (2). Fortinet has now held 3 in 4 of the last 6 months.' },
      { icon: TrendingUp, type:'info', title:'Palo Alto Returns to #1', content:'Palo Alto regained 1 position-1 ZTNA KW in Oct 2026 after 0 in Jul–Sep — still well short of its Mar peak of 3.' },
      { icon: TrendingUp, type:'info', title:'Cisco Holds 2', content:'Cisco maintained 2 position-1 KWs for a second month (peak 3 in Dec) — flat but stable.' },
    ],
  },
  cloud: {
    page1: [
      { icon: TrendingDown, type:'warning', title:'Fortinet Eases in Cloud', content:'Fortinet Cloud Security Page 1 KWs fell to 1 in Oct 2026 (from 2) after peaking at 3 in May and Jul — only 1 of 3 tracked KWs on Page 1.' },
      { icon: TrendingDown, type:'warning', title:'Palo Alto & Cisco Drop Out', content:'Palo Alto returned to 0 (from 1) and Cisco to 0 (from 1) Cloud Page 1 KWs in Oct 2026, leaving Fortinet and Check Point (1 each) as the only vendors on Page 1.' },
      { icon: AlertTriangle, type:'warning', title:'HPE No Cloud Presence', content:'HPE has 0 Cloud Security Page 1 KWs across all 11 months. No content ranking for cloud security keywords.' },
    ],
    pos1: [
      { icon: TrendingDown, type:'warning', title:'Fortinet Position-1 Falls to 1', content:'Fortinet holds 1 Cloud Security position-1 KW in Oct 2026 (from 2 in Sep, peak 3 in Jul) — tied with Check Point.' },
      { icon: TrendingUp, type:'info', title:'Check Point Returns to #1', content:'Check Point has 1 position-1 KW in Oct 2026 after 0 in Aug–Sep — its 2 in Jul remain the high-water mark.' },
      { icon: TrendingDown, type:'warning', title:'Palo Alto & Cisco at Zero', content:'Palo Alto and Cisco both have 0 position-1 Cloud KWs in Oct 2026; Palo Alto peaked at 2 in Apr.' },
    ],
  },
  sdwan: {
    page1: [
      { icon: Trophy, type:'success', title:'Fortinet Holds the Max at 5', content:'Fortinet holds 5 SD-WAN/SASE Page 1 KWs in Oct 2026 — the category maximum for the fourth straight month. Palo Alto slipped to 4 (from 5) and Cisco to 3 (from 5).' },
      { icon: TrendingDown, type:'warning', title:'Cisco Loses 2 Page 1 KWs', content:'Cisco fell from 5 to 3 SD-WAN Page 1 KWs in Oct 2026 — level with its Jul low.' },
      { icon: AlertTriangle, type:'warning', title:'HPE & Check Point Flat at 1', content:'HPE and Check Point each hold 1 SD-WAN Page 1 KW in Oct — well below Fortinet, Palo Alto and Cisco.' },
    ],
    pos1: [
      { icon: Trophy, type:'success', title:'Fortinet Leads at 5', content:'Fortinet reached 5 position-1 SD-WAN KWs in Oct 2026 (+1 MoM) — equalling its Mar peak and now ahead of Palo Alto and Cisco (3 each).' },
      { icon: TrendingDown, type:'warning', title:'Palo Alto & Cisco Pull Back', content:'Palo Alto and Cisco each dropped from 4 to 3 position-1 SD-WAN KWs in Oct 2026 — Cisco was at 5 in May.' },
      { icon: TrendingUp, type:'info', title:'HPE Edges Up', content:'HPE has 2 position-1 SD-WAN KWs in Oct 2026 (from 1) — matching its Feb/Jun level, while Check Point stays at 1.' },
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

const MONTH_PILL_LABELS = ["Dec '25","Jan '26","Feb '26","Mar '26","Apr '26","May '26","Jun '26","Jul '26","Aug '26","Sep '26","Oct '26"];

function KeywordTableTab() {
  const [monthIdx,  setMonthIdx]  = useState<number>(MONTHS.length - 1);        // default latest month
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
        subtitle="Top 50 Keyword Ranking Tracking · Dec 2025 – Oct 2026"
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

      <SlideFooter source="Source: SEMrush · Top 50 Keywords Tracking · Dec 2025 – Oct 2026" />
    </SlideContainer>
  );
}
