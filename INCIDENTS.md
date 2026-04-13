# Managing Custom Incidents

## Automatic Updates

Your Makriva platform now automatically loads custom incidents from `public/data/incidents.json`. No code changes needed!

## How to Add/Update Incidents

### Method 1: Direct File Edit (Simplest)

1. Open `public/data/incidents.json`
2. Add or modify incidents in the `incidents` array
3. Save the file
4. Incidents appear automatically on the next page refresh (no deploy needed!)

### Incident Format

```json
{
  "id": "unique-identifier",
  "slug": "url-friendly-slug",
  "title": "Incident Title",
  "category": "Outage",
  "subcategory": "Service Name",
  "severity": "Critical|High|Medium|Low",
  "summary": "Brief description (2-3 sentences)",
  "impact": "What services are affected",
  "recommended_action": "What users should do",
  "source_name": "Source of incident",
  "source_url": "Link to more info",
  "published_at": "2026-04-12T14:00:00Z",
  "status": "Investigating|Identified|Monitoring|Resolved",
  "tags": ["tag1", "tag2"]
}
```

### Example

```json
{
  "id": "dd-stripe-001",
  "slug": "stripe-payment-processing-incident",
  "title": "Stripe Payment Processing Degradation",
  "category": "Outage",
  "subcategory": "Stripe",
  "severity": "High",
  "summary": "Stripe experiencing elevated latency on payment processing. Some transactions failing with timeout errors. ETA 30 minutes.",
  "impact": "e-commerce platforms unable to process payments, checkout flows experiencing 30-60 second delays",
  "recommended_action": "Monitor Stripe status page. Enable retry logic in payment handlers. Consider manual processing for critical transactions.",
  "source_name": "Community Reports",
  "source_url": "https://downdetector.com/status/stripe/",
  "published_at": "2026-04-12T14:32:00Z",
  "status": "Monitoring",
  "tags": ["Stripe", "Payments", "Fintech"]
}
```

## Automatic Cleanup

- ✅ **Active incidents** (Investigating, Identified, Monitoring) → Stay indefinitely
- ✅ **Recent resolved** (last 24 hours) → Kept for reference
- ✅ **Old resolved** (older than 24h) → Automatically removed
- ✅ **Low-quality entries** → Filtered out automatically

## Feed Quality Filtering

The system automatically filters out:
- Empty or missing titles
- Extremely short summaries
- Generic placeholders ("Test", "Demo", "Untitled")
- Truncated or incomplete content

## Real-Time Updates

Changes are live immediately - no build/deploy required!

1. Edit `public/data/incidents.json`
2. Save file
3. Reload page → Updates appear

## Combining with Real Feeds

Your incidents merge with real-time status feeds from:
- Azure
- AWS
- GitHub
- Slack
- Microsoft 365 Blog
- Microsoft Security Blog

Duplicates are automatically removed based on title + source.

## Tips

- Use ISO 8601 dates: `2026-04-12T14:32:00Z`
- Keep summaries under 260 characters
- Use consistent severity levels
- Add relevant tags for filtering
- Update the `last_updated` timestamp when making changes

For questions, check the code in `src/lib/downdetector-integration.ts`
