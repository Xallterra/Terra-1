# Makriva Website Architecture & Optimization Guide

## Executive Summary
**Makriva** is a real-time IT security intelligence platform that aggregates alerts, vulnerabilities, outages, and Microsoft updates. It features a dark-themed SaaS dashboard with automated data fetching, categorization, and a rule-based chatbot for user interactions.

---

## 🏗️ ARCHITECTURE OVERVIEW

### Tech Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js | 15.3.6 |
| **Language** | TypeScript | 5.8.3 |
| **DOM Library** | React | 19.0.0 |
| **UI Components** | React (inline styles) | - |
| **Parser** | fast-xml-parser | 4.5.6 |
| **Icons** | lucide-react | 0.511.0 |
| **Rendering** | Server-side + Client-side | - |

### Deployment Model
- **Hosting**: Vercel (recommended) or self-hosted Node.js
- **Rendering**: Hybrid (RSC + Client Components)
- **Data Fetching**: Server-side (async components + `fetch`)
- **Revalidation**: ISR (Incremental Static Regeneration) at 300s (5 min)

---

## 📊 DATA FLOW ARCHITECTURE

### Data Sources (6 Live Feeds)
```
┌─────────────────────────────────────┐
│  Real-Time Feed Sources             │
├─────────────────────────────────────┤
│ 1. Azure Status Feed (RSS)          │
│ 2. AWS Health Dashboard (RSS)       │
│ 3. GitHub Status Page (RSS)         │
│ 4. Slack Status Page (RSS)          │
│ 5. Microsoft 365 Blog Feed (RSS)    │
│ 6. Microsoft Security Blog (RSS)    │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  XML Parser (fast-xml-parser)       │
│  - Handles RFC & Atom formats       │
│  - HTML entity decoding             │
│  - Tag stripping                    │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Normalization & Filtering          │
│  - Map to AlertItem schema          │
│  - Categorization                   │
│  - Quality filtering                │
│  - Status inference                 │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Custom Incident Merge              │
│  (public/data/incidents.json)       │
│  - Deduplication                    │
│  - 24h resolved cleanup             │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│  Output: AlertItem[] (sorted)       │
│  - Cached for 5 minutes (ISR)       │
│  - Used by all pages/components     │
└─────────────────────────────────────┘
```

### Key Function: `fetchAlerts()`
**Location**: `src/lib/alerts-data.ts`
```typescript
export async function fetchAlerts(): Promise<AlertItem[]> {
  1. Loop through 6 feedConfigs
  2. Fetch XML from each source
  3. Parse & normalize to AlertItem schema
  4. Load custom incidents from JSON
  5. Filter low-quality content
  6. Merge & deduplicate
  7. Sort by publish date
  8. Return sorted array
}
```

**Cache Strategy**: 5-minute revalidation (ISR on Vercel)

---

## 🗂️ PROJECT STRUCTURE

```
Terra-1/
├── src/
│   ├── app/                          # Route pages (RSC)
│   │   ├── layout.tsx               # Root layout + ChatWidget
│   │   ├── page.tsx                 # Home page
│   │   ├── globals.css              # Styles
│   │   ├── alerts/
│   │   │   ├── page.tsx             # Alerts list (dynamic)
│   │   │   └── [slug]/
│   │   │       ├── page.tsx         # Alert detail (dynamic)
│   │   │       └── not-found.tsx    # 404 handler
│   │   ├── vulnerabilities/
│   │   │   └── page.tsx             # Vuln list (severity-sorted)
│   │   ├── outages/
│   │   │   └── page.tsx             # Outage dashboard + timeline
│   │   ├── microsoft-updates/
│   │   │   └── page.tsx             # MS Updates list
│   │   ├── about/
│   │   ├── contact/
│   │   └── layout-client.tsx        # Client wrapper for ChatWidget
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx           # Nav bar
│   │   │   └── footer.tsx           # Footer
│   │   ├── alerts/
│   │   │   ├── alert-card.tsx       # Alert display card
│   │   │   ├── alert-filters.tsx    # Search/filter UI
│   │   │   ├── alerts-browser.tsx   # Grid + filters container
│   │   │   ├── severity-badge.tsx   # Color badge
│   │   │   └── status-badge.tsx     # Status indicator
│   │   ├── outages/
│   │   │   ├── outage-status-dashboard.tsx  # Stats + status bar chart
│   │   │   └── outage-timeline.tsx  # Incident timeline
│   │   ├── chatbot/
│   │   │   └── chat-widget.tsx      # Floating chat UI (Client)
│   │   ├── shared/
│   │   │   ├── page-hero.tsx        # Page header
│   │   │   └── empty-state.tsx      # No results
│   │   └── home/
│   │       ├── hero.tsx
│   │       ├── features.tsx
│   │       ├── why-makriva.tsx
│   │       ├── latest-alerts.tsx
│   │       └── subscribe-cta.tsx
│   │
│   ├── lib/
│   │   ├── alerts-data.ts           # Feed fetching + parsing
│   │   ├── chatbot-service.ts       # Chat logic (pattern matching)
│   │   ├── outage-stats.ts          # Outage calculations
│   │   └── downdetector-integration.ts  # Custom incident loading
│   │
│   └── types/
│       └── alert.ts                 # AlertItem schema + types
│
├── public/
│   └── data/
│       └── incidents.json           # Editable incident database
│
├── package.json                     # Dependencies + scripts
├── tsconfig.json                    # TS config
├── next.config.ts                   # Next.js config
├── .gitignore                       # Git ignore
├── README.md                        # Setup guide
├── INCIDENTS.md                     # Incident management guide
└── ARCHITECTURE.md                  # This file
```

---

## 📝 CORE DATA MODELS

### AlertItem (Main Schema)
```typescript
type AlertItem = {
  id: string;                    // Unique ID
  slug: string;                  // URL-friendly identifier
  title: string;                 // Incident title
  category: AlertCategory;       // Vulnerability | Microsoft Update | Outage | Security Advisory | Tech Alert
  subcategory: string;           // Service/source name
  severity?: Severity;           // Critical | High | Medium | Low (optional)
  summary: string;               // 260-char description
  impact: string;                // Business impact detail
  recommended_action: string;    // User guidance
  source_name: string;           // Source attribution
  source_url: string;            // Link to full details
  published_at: string;          // ISO 8601 date
  status?: OutageStatus;         // Investigating | Identified | Monitoring | Resolved (outages only)
  tags: string[];                // Searchable tags
};
```

### Categories
```
- Vulnerability        → CVE & security exposures
- Security Advisory    → Threat intelligence
- Microsoft Update     → Patches & releases
- Outage              → Service disruptions
- Tech Alert          → General alerts
```

### Status States (Outages)
```
Investigating → Identified → Monitoring → Resolved
```

---

## 🔄 COMPONENT ARCHITECTURE

### Page Hierarchy
```
RootLayout (layout.tsx)
├── Header (nav)
├── Main Content
│   ├── AlertsPage
│   │   ├── PageHero
│   │   └── AlertsBrowser (client)
│   │       ├── AlertFilters (search)
│   │       └── AlertCard[] (grid)
│   │
│   ├── VulnerabilitiesPage
│   │   ├── PageHero
│   │   └── AlertCard[] (severity-sorted)
│   │
│   ├── OutagesPage
│   │   ├── PageHero
│   │   ├── OutageStatusDashboard
│   │   ├── OutageTimeline
│   │   └── AlertCard[] (status-sorted)
│   │
│   ├── MicrosoftUpdatesPage
│   │   ├── PageHero
│   │   └── AlertCard[] (filtered by category)
│   │
│   ├── AlertDetailPage ([slug])
│   │   └── Full alert + all metadata
│   │
│   └── HomePage
│       ├── Hero section
│       ├── Features
│       ├── Latest alerts preview
│       ├── Call-to-action
│       └── Footer
│
├── ChatWidget (floating, client-side)
└── Footer
```

### Rendering Strategy
| Page | Type | Data Source | Revalidation |
|------|------|-------------|--------------|
| Home | RSC | Static | None |
| Alerts List | RSC | Async fetch | 5 min (ISR) |
| Alert Detail | RSC | Async fetch | 5 min (ISR) |
| Vulnerabilities | RSC | Async fetch | 5 min (ISR) |
| Outages | RSC | Async fetch + custom | 5 min (ISR) |
| Microsoft Updates | RSC | Async fetch | 5 min (ISR) |
| Chat Widget | Client | Local state | - |

---

## 🤖 CHATBOT ARCHITECTURE

### Type: Rule-Based Pattern Matching (No APIs)

**Location**: `src/lib/chatbot-service.ts` + `src/components/chatbot/chat-widget.tsx`

### Features
- ✅ Conversation history (in-memory, per session)
- ✅ Alert search & filtering by category/severity
- ✅ Category-specific explanations
- ✅ Floating widget (bottom-right)
- ✅ Markdown support in responses

### Response Patterns
```typescript
1. Greeting detection       → Welcome + category overview
2. Help request           → Command guide + examples
3. Alert search           → Search by keyword/category/severity
4. Category inquiry       → Category-specific details
5. Exit command           → Goodbye message
6. Default fallback       → Generic help prompt
```

### Search Algorithm
```typescript
searchAlerts(query, category?, severity?) {
  Filter by:
  1. Keyword match in title/summary/tags
  2. Category (if specified)
  3. Severity (if specified)
  Return top 3 + count
}
```

---

## 🎨 UI/UX ARCHITECTURE

### Color Scheme (Dark Theme)
```
Background:  #0f1419 (very dark blue-gray)
Cards:       #1e293b (dark slate)
Text:        #e8f0ff (off-white)
Accent:      #4f46e5 (indigo) / #7fc0ff (light blue)

Category Badges:
- Vulnerability:    Orange-red (#4c1d12)
- Outage:          Red (#7f1d1d)
- Microsoft Update: Blue (#1e3a8a)
- Default:         Dark blue (#142444)

Status Colors:
- Investigating: #fbbf24 (Amber)
- Identified:    #f97316 (Orange)
- Monitoring:    #3b82f6 (Blue)
- Resolved:      #10b981 (Green)
```

### Responsive Design
- **Desktop**: Multi-column grid (auto-fit, min 260px)
- **Tablet**: 2-3 columns
- **Mobile**: 1 column (full-width stacked)

---

## 📊 PAGE FEATURES & DATA FLOWS

### Alerts Page (`/alerts`)
```
↓ Fetch all alerts (6 sources + custom)
↓ Display with AlbertsBrowser
  ├─ Search by keyword
  ├─ Filter by category (Vulnerability, Outage, Update...)
  ├─ Sort by date (newest first)
  └─ Display grid of AlertCard
```

### Vulnerabilities Page (`/vulnerabilities`)
```
↓ Fetch alerts, filter category = "Vulnerability" | "Security Advisory"
↓ Sort by severity (Critical→High→Medium→Low)
↓ Display cards in severity order
```

### Outages Page (`/outages`)
```
↓ Fetch alerts, filter category = "Outage"
↓ Display:
  1. Status Dashboard (stats by status)
  2. Timeline (incident history + affected services)
  3. All incidents grid
↓ Sort by status urgency (Investigating→Identified→Monitoring→Resolved)
```

### Microsoft Updates Page (`/microsoft-updates`)
```
↓ Fetch alerts, filter category = "Microsoft Update"
↓ Display latest updates in grid
```

### Alert Detail Page (`/alerts/[slug]`)
```
↓ Extract slug from URL
↓ Search in dynamic alerts + static fallback
↓ Display full alert card with:
  ├─ Title, category, severity, status
  ├─ Summary & detailed impact
  ├─ Recommended actions
  ├─ Publication date
  ├─ Source link
  └─ Tags
Or show 404 if not found
```

---

## 🔧 CUSTOMIZATION & EXTENSIBILITY

### Adding Custom Incidents (No Code)
**File**: `public/data/incidents.json`
```json
{
  "incidents": [
    {
      "id": "unique-id",
      "slug": "url-slug",
      "title": "...",
      "category": "Outage",
      ...
    }
  ]
}
```
Changes appear on next page reload (no deploy needed!).

### Adding New Feed Sources
**File**: `src/lib/alerts-data.ts`

Modify `feedConfigs` array:
```typescript
const feedConfigs = [
  {
    url: 'https://example.com/feed.xml',
    category: 'Outage',          // Category to normalize to
    subcategory: 'Service Name', // Display name
    sourceName: 'Example Source' // Attribution
  },
  // ... add more
];
```

Parser automatically:
1. Fetches & parses XML
2. Normalizes to AlertItem schema
3. Adds to feed pipeline

### Adding New Pages
1. Create `src/app/newpage/page.tsx`
2. Import `fetchAlerts()` if needed
3. Filter/sort alerts in component
4. Display using existing components (AlertCard, etc.)

---

## ⚡ PERFORMANCE CHARACTERISTICS

### Load Time Optimization
- **ISR Caching**: 5-min revalidation keeps response fast
- **Lazy Loading**: Chat widget loads on demand (client-side)
- **Inline Styles**: No CSS parsing overhead
- **Minimal Deps**: Only 5 npm packages (small bundle)

### Potential Bottlenecks
1. **Feed Fetching** (5 feeds × ~2s each = ~10s) → Can parallelize
2. **XML Parsing** (large feeds) → Consider streaming parser
3. **No Database** → Static memory (fine for <10k items)
4. **Client-side search** → Browser handles filtering

### Bundle Size
- Core: ~100KB (Next.js + React)
- Dependencies: ~50KB (fast-xml-parser + lucide)
- **Total**: ~150KB (gzipped ~50KB)

---

## 🔐 SECURITY CONSIDERATIONS

### Current State
- ✅ No external APIs (no API key exposure)
- ✅ Static data source URLs (hardcoded)
- ✅ Content sanitization (HTML tag stripping)
- ✅ URL validation (slug normalization)
- ⚠️ No authentication (public site)
- ⚠️ No rate limiting (could add 429 handling)

### Recommendations
1. Add rate limiting on feed fetches
2. Implement caching headers
3. Sanitize user input in chatbot
4. Add CSRF protection if auth added

---

## 📈 SCALABILITY ROADMAP

### Current Limitations
1. **Data**: All in-memory (no persistence)
2. **Concurrency**: Single API route per feed
3. **History**: No historical data (only current)
4. **Notifications**: No user alerts/subscriptions

### To Scale to 100k+ Alerts
1. **Add PostgreSQL** with Prisma ORM
2. **Background jobs** (Node Cron or Bull) for feed ingestion
3. **API layer** (`/api/alerts`) for data access
4. **Message queue** (Bull/RabbitMQ) for notifications
5. **Caching** (Redis) for hot data
6. **CDN** for static assets (Vercel Edge)

### Recommended Architecture (Next Phase)
```
Next.js Frontend
    ↓
PostgreSQL (persistent data)
    ↓
Redis (cache layer)
    ↓
Node.js Background Worker (feed ingestion)
    ↓
6 Feed Sources + Custom Incidents
```

---

## 🚀 DEPLOYMENT OPTIONS

### Option 1: Vercel (Recommended)
- ✅ Zero-config Next.js deployment
- ✅ Automatic ISR
- ✅ Built-in edge caching
- ✅ Free tier available

**Command**:
```bash
git push origin main
# Auto-deploys to Vercel
```

### Option 2: Self-Hosted (Node.js)
- Build: `npm run build`
- Run: `npm run start`
- Port: 3000 (configurable)
- Requires: Node 18+

---

## 📋 OPTIMIZATION OPPORTUNITIES

### High Priority
1. **Add database** → Persist & query faster
2. **Parallelize feeds** → Promise.all() instead of loop
3. **Implement caching** → Redis for processed alerts
4. **Add pagination** → Prevent loading 10k items at once

### Medium Priority
5. **Stream XML parsing** → Reduce memory for large feeds
6. **Add full-text search** → Elasticsearch or PG text search
7. **Image optimization** → Use Next.js Image component
8. **Analytics** → Track user behavior

### Low Priority
9. **Dark mode toggle** → Already dark, add light mode
10. **Export to CSV/JSON** → Bulk data download
11. **Webhook integrations** → Send alerts to Slack/Teams
12. **Multi-language** → I18n support

---

## 🛠️ DEVELOPMENT SCRIPTS

```bash
npm run dev      # Start dev server (localhost:3001 if :3000 taken)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint check
npm run clean    # Remove .next build cache
```

---

## 📚 KEY FILES TO UNDERSTAND

| File | Purpose | Lines |
|------|---------|-------|
| `src/lib/alerts-data.ts` | Feed fetching & normalization | ~320 |
| `src/components/alerts/alert-card.tsx` | Alert display component | ~40 |
| `src/app/alerts/page.tsx` | Alerts listing page | ~20 |
| `src/lib/chatbot-service.ts` | Chat logic | ~120 |
| `src/components/chatbot/chat-widget.tsx` | Chat UI | ~180 |
| `src/types/alert.ts` | Data schema | ~20 |
| `public/data/incidents.json` | Custom incident database | Variable |

---

## 🎯 NEXT STEPS FOR OPTIMIZATION

1. **Review**: Understand data flow (alerts-data.ts → components)
2. **Identify Bottlenecks**: Profile feed fetching time
3. **Prioritize**: Fix slowest sources first
4. **Test**: Measure improvements with performance tools
5. **Deploy**: Push to production

---

**Generated**: April 12, 2026  
**Version**: 1.0  
**Last Updated**: Post-Downdetector Integration
