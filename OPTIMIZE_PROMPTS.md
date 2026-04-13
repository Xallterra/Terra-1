# Makriva Optimization Prompt Template

Use this prompt template with Claude, ChatGPT, or other AI assistants to get specific optimization recommendations.

---

## BASIC OPTIMIZATION PROPOSAL

```
I have a Next.js 15 + React 19 real-time alerts dashboard called Makriva.

ARCHITECTURE:
- Fetches data from 6 XML feeds (Azure, AWS, GitHub, Slack, Microsoft blogs)
- Parses with fast-xml-parser
- Server-side rendering with 5-min ISR cache
- No database (in-memory only)
- Rule-based chatbot (no AI APIs)
- Custom incidents from JSON file
- ~500 lines of core logic

CURRENT PERFORMANCE:
- Feed fetch time: ~10 seconds (sequential)
- Page load: ~2 seconds (cached)
- Bundle size: ~150KB total

PROBLEM:
- Feed fetching is slow (sequential loop)
- No data persistence
- Can't scale beyond ~1000 alerts
- Limited search capabilities

GOAL:
Optimize for:
1. Faster feed ingestion (< 5 seconds)
2. Persistent data storage
3. Better search/filtering
4. Ability to handle 100k+ alerts

What specific optimizations would you recommend? Prioritize by ROI.

Full architecture available at: [PROJECT_ROOT]/ARCHITECTURE.md
```

---

## PERFORMANCE PROFILING PROMPT

```
I need to profile my Next.js app's performance bottlenecks.

KEY METRICS TO MEASURE:
- Feed fetching speed (currently 10s sequential)
- XML parsing time
- Page render time
- Memory usage
- Search query latency
- Chat response time

CURRENT APPROACH:
- 6 concurrent feed sources
- fast-xml-parser for parsing
- In-memory data (no DB)
- 5-min ISR cache

QUESTIONS:
1. What are the biggest performance bottlenecks (feed fetch, parsing, rendering)?
2. Should I parallelize feeds with Promise.all()?
3. What's the right caching strategy (Redis, in-memory, ISR)?
4. When should I add a database (5k alerts? 10k?)?
5. Is fast-xml-parser the bottleneck or network latency?

Recommend specific profiling tools and benchmarking approach.
```

---

## SCALABILITY ROADMAP PROMPT

```
I'm building a real-time alerts platform (Makriva) that needs to scale.

CURRENT STATE:
- Tech: Next.js 15, React 19, TypeScript
- Data: 6 feed sources, in-memory storage
- Features: Category search, outage dashboard, rule-based chatbot
- Users: Public SaaS (unknown scale)

GROWTH TARGETS:
- Phase 1 (Now): <1000 alerts/day → current solution ok
- Phase 2 (3m): 10k alerts/day → needs optimization
- Phase 3 (6m): 100k+ alerts/day → needs infrastructure
- Phase 4 (1y): 1M+ alerts/day → enterprise scale

FOR EACH PHASE:
1. What tech changes are needed?
2. Estimated cost?
3. What breaks first (memory, CPU, I/O)?
4. How to migrate without downtime?

CONSTRAINTS:
- Tight budget (bootstrapped)
- Small team (1-2 engineers)
- Need to stay on Node.js stack

Create a 12-month scaling roadmap with tech recommendations and cost estimates.
```

---

## DATABASE & PERSISTENCE PROMPT

```
My Next.js alerts app currently stores data in-memory. I need persistent storage.

REQUIREMENTS:
- Store alerting/incidents (AlertItem schema)
- Support 100k+ items
- Quick search by keyword, category, severity
- Historical data (30-day retention)
- API for querying
- Real-time updates (new alerts appear in <5s)

OPTIONS I'M CONSIDERING:
A) PostgreSQL + Prisma ORM
B) MongoDB + Mongoose
C) DynamoDB (AWS managed)
D) Just use Redis + periodic snapshot

CURRENT DATA PATTERN:
- AlertItem type: id, slug, title, category, severity, summary, impact, status, tags, published_at, source_url
- Read-heavy: 1000s of reads per alert
- Write-heavy: New feeds every 5 minutes
- Search patterns: keyword, category filter, severity range, date range

CONSTRAINTS:
- Need to start with <$100/month
- Single-region (US)
- Must integrate with existing Next.js server

Which DB and why? Schema design? Query patterns? Cost estimate?
```

---

## FEED OPTIMIZATION PROMPT

```
My app fetches from 6 XML feeds sequentially, taking ~10 seconds total.

CURRENT FEEDS:
1. Azure Status (RSS) - ~500 items
2. AWS Health (RSS) - ~1000 items
3. GitHub Status (RSS) - ~300 items
4. Slack Status (RSS) - ~200 items
5. Microsoft 365 Blog (RSS) - ~50 items/day
6. Microsoft Security Blog (RSS) - ~30 items/day

PARSING:
- Using fast-xml-parser
- Normalizes to AlertItem schema
- Filters low-quality content
- Deduplicates
- Merges with local JSON incidents

CURRENT CODE:
```typescript
for (const config of feedConfigs) {
  const response = await fetch(config.url);
  const xml = await response.text();
  allItems.push(...parseFeed(xml, config));
}
```

PROBLEMS:
1. Sequential (10s total) vs parallel (2s potential)
2. Large feeds block small feeds
3. No error isolation (1 failure = slow)
4. Network timeout issues on slow connections

OPTIMIZATION GOALS:
1. Reduce to <3 seconds
2. Never block on slow sources
3. Graceful failure
4. Streaming where possible

Recommend: Parallel strategy, error handling, streaming approach, timeout policy.
```

---

## SEARCH & FILTERING OPTIMIZATION PROMPT

```
My alerts dashboard has client-side search that filters through potentially 100k items.

CURRENT APPROACH:
- All alerts loaded into React state
- Client-side filter on every keystroke:
```typescript
filtered.filter(item => {
  const searchable = item.title + item.summary + item.tags;
  return searchable.toLowerCase().includes(query);
});
```

CONSTRAINTS:
- Want instant type-as-you-search response
- Mobile users (potentially 10k+ items to search)
- Must work offline (after initial load)
- Can't call server on every keystroke

SEARCH PATTERNS USERS NEED:
1. Full-text keyword search
2. Category filter (Vulnerability, Outage, Update)
3. Severity range (Critical, High, Medium)
4. Date range (last 24h, week, month)
5. Tag-based search
6. Combination (severity=High AND type=Vulnerability)

PERFORMANCE TARGETS:
- <100ms response for keystroke
- <50MB memory in browser
- Work on older phones

What indexing strategy? Library recommendations (e.g., Lunr.js, FlexSearch, MiniSearch)? Should I move search to server?
```

---

## CHATBOT AI UPGRADE PROMPT

```
I have a rule-based chatbot in my alerts app that works well but is limited.

CURRENT CHATBOT:
- Pattern matching on user input (regex)
- Returns pre-written responses
- Searches local alert data
- No AI/LLM integration
- Works offline, no APIs needed

LIMITATIONS:
1. Can't handle complex questions
2. No context memory across sessions
3. Can't summarize incident data smartly
4. Limited natural language understanding

I WANT TO ADD:
- Basic AI capabilities (Claude/GPT)
- But keep costs low (<$10/month at scale)
- Smart summarization of alert data
- Context awareness

OPTIONS:
A) Add Claude API (pay per token)
B) Use free tier (Hugging Face)
C) Run local LLM (Ollama)
D) Hybrid (rule-based + AI for complex queries)

CONSIDERATIONS:
- Users expect instant responses (<2s)
- Budget-conscious (bootstrapped startup)
- Don't want vendor lock-in
- Privacy matters (don't log queries)

Which approach to recommend? Cost analysis? Response time tradeoffs?
```

---

## INFRASTRUCTURE & DEPLOYMENT PROMPT

```
I'm deploying Makriva (Next.js alerts app) and need infrastructure guidance.

CURRENT SITUATION:
- Self-hosted on Node.js server
- Vercel deployment available but not used
- No CDN
- No monitoring/alerting
- Manual deployments

REQUIREMENTS:
- Handle 1000s of concurrent users
- 99.9% uptime target
- Global users (US, Europe, Asia)
- Budget: $100-500/month
- Minimal ops overhead (<5h/week)

CURRENT SETUP ISSUES:
- Cold feed fetches block every 5 minutes
- No horizontal scaling
- Single region limits
- No observability
- Manual Git pushes to deploy

OPTIONS I'M CONSIDERING:
A) Vercel + PostgreSQL on Neon
B) Railway app platform
C) AWS LightSail + RDS
D) DigitalOcean App Platform

DEPLOYMENT FREQUENCY: 5-10x per day (rapid iteration)

Which is best ROI? Cost breakdown? Time to setup? Ops overhead? Migration path from current setup?
```

---

## FEATURE EXPANSION PROMPT

```
My Makriva alerts dashboard is working well. I want to add more features but need prioritization.

CURRENT FEATURES:
- Real-time alerts dashboard
- Search & filter (keyword, category, severity)
- Outage tracking with timeline
- Rule-based chatbot
- Custom incident management
- 6 live feed sources

TOP FEATURE REQUESTS:
1. Email/Slack notifications (user subscriptions)
2. Alert history & trends (show 30-day patterns)
3. Integration with incident management tools (PagerDuty, OpsGenie)
4. Custom alert rules (IF severity=Critical AND source=AWS THEN notify)
5. Team collaboration (shared dashboards, on-call scheduling)
6. API for third-party integration
7. Webhook outgoing (send alerts to external systems)
8. Mobile app
9. Premium tier (advanced analytics)
10. AI-powered alert correlation

CONSTRAINTS:
- Small team (1-2 engineers)
- Limited budget (bootstrap)
- Need revenue fast (SaaS model)

Which 3 features deliver most value? Effort estimate? Revenue potential? Which to build first?
```

---

## COST OPTIMIZATION PROMPT

```
I'm running Makriva (Next.js alerts SaaS) and need to cut costs without sacrificing quality.

CURRENT COSTS:
- Hosting: $200/month
- Database: $50/month
- CDN: $20/month
- Email service: $30/month
- Monitoring: $25/month
- Domain/SSL: $15/month
TOTAL: $340/month

USER BASE: 500 monthly active users, <10 paid

CONSTRAINTS:
- Must maintain <2s page load
- Need real-time alerts (5-min max latency)
- 99.9% uptime
- GDPR compliant (store user data)

GOALS:
- Cut costs to <$100/month
- Maintain quality
- Don't sacrifice features
- Keep engineering velocity

Current cost breakdown seems high for scale. Where's waste?

Provide:
1. Cost audit (what's overpriced?)
2. Consolidation strategy (fewer services?)
3. Scaling cost model (how to make margins work?)
4. Open-source alternatives?
```

---

## USAGE INSTRUCTIONS

**For any optimization question:**

1. Choose the relevant template above
2. Customize with your specific numbers/constraints
3. Paste into Claude, ChatGPT, or your preferred AI
4. Add: "Refer to ARCHITECTURE.md for context" + paste file contents
5. Ask follow-ups for detailed implementation

**Example:**
```
I'm running Makriva (see ARCHITECTURE.md below).

[Paste relevant prompt template]

[Paste ARCHITECTURE.md contents]

What's your recommendation?
```

---

## QUICK-REFERENCE CHECKLIST

- [ ] Read ARCHITECTURE.md
- [ ] Profile current performance
- [ ] Identify #1 bottleneck
- [ ] Measure current baseline
- [ ] Test optimization
- [ ] Measure improvement
- [ ] Ship to production
- [ ] Monitor results

---

**Version**: 1.0  
**Last Updated**: April 12, 2026  
**For**: Makriva Real-Time Alerts Dashboard
