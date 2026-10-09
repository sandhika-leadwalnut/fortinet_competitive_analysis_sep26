// SEO Competitive Analysis Sample Data
// Timeframe: Jul 2025 → Sep 2026 (traffic/keyword series; MONTHS/MONTH_LABELS below stop at Jun 2026)

export const MONTHS = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
export const MONTH_LABELS = ['Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026'];
// Extended months for keyword slide 4 (includes Jul 2026)
export const KEYWORD_MONTHS = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
// Extended months for US traffic slide 6 (includes Jul 2026)
export const TRAFFIC_MONTHS = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];

export const COMPETITORS = [
  { id: 'fortinet',     name: 'Fortinet',      color: '#EF4444' },
  { id: 'cisco',        name: 'Cisco',         color: '#FF7AB6' },
  { id: 'hpe',          name: 'HPE',           color: '#7ED957' },
  { id: 'paloalto',     name: 'Palo Alto',     color: '#FFB14A' },
  { id: 'checkpoint',   name: 'Check Point',   color: '#6C9AFF' },
  { id: 'crowdstrike',  name: 'Crowdstrike',   color: '#1F2937' },
  { id: 'catonetworks', name: 'Cato Networks', color: '#8B5CF6' },
  { id: 'sentinelone',  name: 'SentinelOne',   color: '#EC4899' },
  { id: 'wiz',          name: 'Wiz',           color: '#06B6D4' },
];

// Organic Traffic (in thousands) — 15 months: Jul 2025 → Sep 2026
export const ORGANIC_TRAFFIC = {
  fortinet:     [890185,  987459,  848534,  861429,  1014918, 1216565, 1238062, 1220873, 1581344, 1533871, 1424874, 1415770, 1450018, 1268894, 1195450],
  cisco:        [1851119, 1926033, 1796711, 1597868, 2013042, 2062966, 1793605, 1824021, 2209106, 2033472, 2063625, 1856197, 2114103, 1903908, 1957904],
  hpe:          [365056,  413677,  371077,  347469,  363898,  418122,  357392,  325543,  346671,  321834,  342455,  336678,  329321,  345163,  381217],
  paloalto:     [295767,  412493,  546710,  824929,  588517,  573648,  549652,  635255,  480797,  621794,  771634,  818095,  840947,  743422,  718146],
  checkpoint:   [179617,  193486,  242600,  316209,  173380,  148047,  136099,  123392,  140642,  130482,  155720,  211711,  255634,  235421,  225866],
  crowdstrike:  [351558,  1027015, 292017,  277997,  494958,  326721,  304393,  445930,  292824,  289604,  248355,  289835,  287061,  296663,  277050],
  catonetworks: [16993,   20452,   19024,   19607,   18712,   18833,   19371,   20085,   23361,   21839,   30696,   21327,   22105,   23202,   19948],
  sentinelone:  [147647,  156874,  161404,  193143,  314785,  176178,  205344,  278278,  218340,  280406,  286588,  242700,  262140,  272936,  237414],
  wiz:          [123301,  133788,  158697,  208969,  256702,  275225,  135028,  144920,  291935,  129293,  114941,  67023,   62023,   71538,   65208],
};

// Branded Traffic (in thousands) — 15 months: Jul 2025 → Sep 2026
export const BRANDED_TRAFFIC = {
  fortinet:     [158453, 121457, 161221, 161949, 114686, 93676,  118854, 92786,  102787, 110439, 75518,  89194,  102951,  98974,  108786],
  cisco:        [973689, 986129, 977411, 859653, 897817, 808683, 733584, 729608, 724587, 723916, 588133, 569852, 708225, 658752, 389623],
  hpe:          [132150, 134445, 139896, 141420, 133187, 140489, 119012, 98965,  101228, 102665, 97257,  102013, 104724, 120807, 101404],
  paloalto:     [70688,  129110, 231805, 164161, 112407, 153738, 124221, 130863, 116353, 162288, 111115, 102262, 143802, 128612, 129984],
  checkpoint:   [51550,  59787,  51674,  50277,  53228,  51816,  48179,  29737,  36708,  23095,  24292,  17784,  18917,  19540,  21683],
  crowdstrike:  [180701, 785666, 87605,  86457,  105426, 65344,  52356,  101672, 61493,  75297,  49919,  47823,  64876,  73572,  73418],
  catonetworks: [6831,   7383,   7686,   7804,   7466,   6629,   7361,   7371,   7078,   8998,   7398,   7507,   11384,  11114,  6304],
  sentinelone:  [60978,  60240,  60204,  56784,  57291,  55320,  60371,  60386,  33406,  62250,  38403,  59219,  61341,  42851,  41073],
  wiz:          [91243,  89638,  76175,  75229,  71877,  71559,  74265,  74199,  72400,  76283,  71953,  20509,  20468,  29974,  21193],
};

// Non-Branded Traffic (in thousands) — 15 months: Jul 2025 → Sep 2026
export const NON_BRANDED_TRAFFIC = {
  fortinet:     [731732, 866002, 687313, 699480,  900232,  1122889, 1119208, 1128087, 1478557, 1423432, 1349356, 1326576, 1347067, 1169920, 1086664],
  cisco:        [877430, 939904, 819300, 738215,  1115225, 1254283, 1060021, 1094413, 1484519, 1309556, 1475492, 1286345, 1405878, 1245156, 1568281],
  hpe:          [232906, 279232, 231181, 206049,  230711,  277633,  238380,  226578,  245443,  219169,  245198,  234665,  224597,  224356,  279813],
  paloalto:     [225079, 283383, 314905, 660768,  476110,  419910,  425431,  504392,  364444,  459506,  660519,  715833,  697145,  614810,  588162],
  checkpoint:   [128067, 133699, 190926, 265932,  120152,  96231,   87920,   93655,   103934,  107387,  131428,  193927,  236717,  215881,  204183],
  crowdstrike:  [170857, 241349, 204412, 191540,  389532,  261377,  252037,  344258,  231331,  214307,  198436,  242012,  222185,  223091,  203632],
  catonetworks: [10162,  13069,  11338,  11803,   11246,   12204,   12010,   12714,   16283,   12841,   23298,   13820,   10721,   12088,   13644],
  sentinelone:  [86669,  96634,  101200, 136359,  257494,  120858,  144973,  217892,  184934,  218156,  248185,  183481,  200799,  230085,  196341],
  wiz:          [32058,  44150,  82522,  133740,  184825,  203667,  60763,   70721,   219535,  53010,   42988,   46514,   41555,   41564,   44015],
};

// Organic Keywords Overall (in thousands) — 15 months: Jul 2025 → Sep 2026
export const ORGANIC_KEYWORDS = {
  fortinet:     [309000,  284000,  297000,  296000,  296000,  300000,  337000,  362000,  327000,  318000,  310000,  215000,  198000,  198000,  211000],
  cisco:        [833000,  743000,  760000,  744000,  724000,  724000,  734000,  860000,  848000,  780000,  722000,  561000,  511000,  493000,  574000],
  hpe:          [200000,  189000,  200000,  197000,  202000,  225000,  231000,  262000,  263000,  267000,  246000,  171000,  160000,  153000,  206000],
  paloalto:     [169000,  160000,  165000,  163000,  166000,  183000,  189000,  224000,  224000,  243000,  238000,  159000,  145000,  145000,  195000],
  checkpoint:   [117000,  105000,  110000,  108000,  106000,  108000,  124000,  139000,  126000,  115000,  108000,   83000,   75000,   72000,   86000],
  crowdstrike:  [104000,   99000,  106000,  103000,   96000,   93000,   90000,  126000,  137000,  143000,  130000,   85000,   77000,   76000,   89000],
  catonetworks: [ 14951,   13416,   13552,   12993,   12261,   12712,   16067,   17902,   16409,   14716,   14327,   12198,   10599,   10000,   10000],
  sentinelone:  [ 83123,   73369,   78807,   79425,   79013,   79037,   89337,   98450,   98650,  102380,  100355,   86894,   87158,   86000,   91000],
  wiz:          [ 41381,   39164,   41328,   40769,   39565,   44617,   54105,   57028,   51452,   40564,   35137,   28406,   26656,   26000,   28000],
};

// Keywords Ranking on Page 1 (in thousands) — 15 months: Jul 2025 → Sep 2026
export const PAGE_ONE_KEYWORDS = {
  fortinet:     [39400, 40200, 42300, 42200, 41300, 41600, 45100, 47000, 48900, 48500, 46500, 43400, 44100, 44700, 45900],
  cisco:        [87400, 87200, 90900, 89900, 86000, 83500, 89300, 93000, 98600, 98400, 94000, 84300, 82600, 82600, 91400],
  hpe:          [23300, 24300, 25400, 25200, 24800, 24800, 26000, 26100, 26900, 27400, 26800, 25000, 25200, 24800, 27300],
  paloalto:     [19400, 19400, 20200, 20000, 19500, 20300, 23800, 25600, 27500, 28200, 28000, 27200, 28400, 28300, 31300],
  checkpoint:   [ 9300,  8900,  9200,  9100,  8600,  7700,  8200,  8500,  8600,  9000,  9700,  9500,  9500,  9000,  9400],
  crowdstrike:  [15900, 16400, 17500, 17200, 16000, 15000, 14800, 17000, 17800, 18100, 17100, 15400, 15400, 15100, 15200],
  catonetworks: [ 1300,  1200,  1200,  1200,  1200,  1300,  1700,  1700,  1600,  1600,  1500,  1400,  1400,  1300,  1300],
  sentinelone:  [ 9800,  9200, 10000, 10000, 10000, 10500, 12700, 14100, 16000, 18100, 19200, 18700, 18700, 18400, 19400],
  wiz:          [ 4900,  5000,  5400,  5400,  5300,  5800,  7100,  7900,  8000,  6700,  5700,  5100,  4900,  4900,  5100],
};

// Mock Domain Authority & Referring Domains
export const DOMAIN_AUTHORITY = {
  fortinet:     [85, 85, 85, 86, 86, 87, 87, 87, 87],
  cisco:        [92, 92, 92, 92, 93, 93, 93, 93, 93],
  hpe:          [88, 88, 88, 88, 89, 89, 89, 89, 89],
  paloalto:     [82, 82, 82, 83, 83, 84, 84, 84, 85],
  checkpoint:   [79, 79, 79, 79, 80, 80, 81, 81, 81],
  crowdstrike:  [86, 86, 86, 87, 87, 88, 88, 88, 88],
  catonetworks: [72, 72, 72, 73, 73, 74, 74, 74, 74],
  sentinelone:  [78, 78, 78, 79, 80, 80, 81, 81, 81],
  wiz:          [76, 76, 77, 77, 78, 78, 79, 79, 80],
};

export const REFERRING_DOMAINS = {
  fortinet:     [43800, 44500, 45000, 46200, 47100, 48300, 49200, 50100, 51200],
  cisco:        [126000, 127200, 128000, 129500, 131000, 132800, 134200, 135600, 137000],
  hpe:          [96500,  97200,  98000,  99100, 100200, 101500, 102800, 104100, 105500],
  paloalto:     [36800,  37400,  38000,  39200,  40100,  41000,  42100,  43200,  44300],
  checkpoint:   [31200,  31600,  32000,  32800,  33600,  34200,  35000,  35800,  36500],
  crowdstrike:  [50000,  51000,  52000,  54100,  56300,  58200,  60100,  62000,  63500],
  catonetworks: [ 8100,   8300,   8500,   8700,   8900,   9100,   9300,   9500,   9700],
  sentinelone:  [26500,  27200,  28000,  29200,  30500,  31800,  33100,  34400,  35500],
  wiz:          [18000,  18500,  19200,  20500,  22000,  23500,  20000,  20800,  24500],
};

// Mock Top 20 Keywords
export const TOP_KEYWORDS = [
  { keyword: 'cybersecurity solutions', position: 2, trafficShare: 12.5, aiPresence: 'High', competitor: 'cisco' },
  { keyword: 'network firewall', position: 1, trafficShare: 18.3, aiPresence: 'Medium', competitor: 'fortinet' },
  { keyword: 'endpoint security', position: 3, trafficShare: 9.7, aiPresence: 'High', competitor: 'crowdstrike' },
  { keyword: 'cloud security platform', position: 4, trafficShare: 15.2, aiPresence: 'Medium', competitor: 'paloalto' },
  { keyword: 'enterprise networking', position: 1, trafficShare: 22.1, aiPresence: 'Low', competitor: 'cisco' },
  { keyword: 'threat intelligence', position: 5, trafficShare: 8.4, aiPresence: 'High', competitor: 'crowdstrike' },
  { keyword: 'zero trust security', position: 2, trafficShare: 11.9, aiPresence: 'High', competitor: 'paloalto' },
  { keyword: 'vpn gateway', position: 3, trafficShare: 10.2, aiPresence: 'Low', competitor: 'checkpoint' },
  { keyword: 'edge computing', position: 6, trafficShare: 7.8, aiPresence: 'Medium', competitor: 'hpe' },
  { keyword: 'network monitoring', position: 2, trafficShare: 13.6, aiPresence: 'Medium', competitor: 'cisco' },
  { keyword: 'malware protection', position: 4, trafficShare: 9.1, aiPresence: 'High', competitor: 'fortinet' },
  { keyword: 'siem solutions', position: 7, trafficShare: 6.3, aiPresence: 'Medium', competitor: 'crowdstrike' },
  { keyword: 'firewall software', position: 1, trafficShare: 16.7, aiPresence: 'Low', competitor: 'fortinet' },
  { keyword: 'hybrid cloud security', position: 5, trafficShare: 8.9, aiPresence: 'High', competitor: 'hpe' },
  { keyword: 'intrusion prevention', position: 3, trafficShare: 10.8, aiPresence: 'Medium', competitor: 'checkpoint' },
  { keyword: 'data center solutions', position: 4, trafficShare: 9.5, aiPresence: 'Low', competitor: 'hpe' },
  { keyword: 'next-gen firewall', position: 2, trafficShare: 14.2, aiPresence: 'Medium', competitor: 'paloalto' },
  { keyword: 'threat detection', position: 6, trafficShare: 7.1, aiPresence: 'High', competitor: 'crowdstrike' },
  { keyword: 'security analytics', position: 8, trafficShare: 5.9, aiPresence: 'High', competitor: 'cisco' },
  { keyword: 'network security', position: 1, trafficShare: 19.4, aiPresence: 'Medium', competitor: 'fortinet' },
];

// Quick Wins & Content Gap Insights
export const QUICK_WINS = [
  {
    title: 'Cisco: Non-Branded Surge Investigation',
    description: 'Cisco non-branded traffic jumped +26% MoM in Sep 2026 (1.25M → 1.57M) while branded fell −41% (659K → 390K). Investigate content strategy, possible cannibalization, or data anomalies.',
    priority: 'high',
    impact: 'High',
  },
  {
    title: 'HPE: Consistent Performance',
    description: 'HPE maintains steady organic traffic (~320K–420K range since Jul 2025; 381K in Sep 2026). Opportunity to amplify winning content and expand keyword coverage.',
    priority: 'medium',
    impact: 'Medium',
  },
  {
    title: 'Crowdstrike: Volatile Traffic Pattern',
    description: 'Crowdstrike shows inconsistent traffic (one-off 1.03M spike in Aug 2025, otherwise ~250K–500K; 277K in Sep 2026). Analyze seasonal trends and content freshness for stabilization.',
    priority: 'medium',
    impact: 'Medium',
  },
];

// LLM/AI Visibility Mock Data
export const AI_METRICS = {
  aiReadinessScore: 73,
  aiTriggeringQueries: 284,
  llmCitations: 156,
  topAIKeywords: ['cybersecurity solutions', 'zero trust security', 'threat intelligence', 'endpoint security'],
};

// Anomalies & Callouts
export const ANOMALIES = [
  { type: 'warning', message: 'Cisco: non-branded +26% MoM in Sep 2026 (1.25M → 1.57M); branded −41% (659K → 390K)', competitor: 'cisco' },
  { type: 'alert', message: 'Cisco Non-Branded: 1.57M in Sep 2026 — confirm data source', competitor: 'cisco' },
  { type: 'info', message: 'Data note: null = no data reported for month', competitor: null },
  { type: 'warning', message: 'Crowdstrike: one-off Aug 2025 spike (1.03M organic) — confirm data source', competitor: null },
];