import { AlertItem } from '@/types/alert';
import { alerts } from './alerts-data';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const keywords = {
  greeting: /hello|hi|hey|greetings/i,
  help: /help|what can you do|commands|features/i,
  alerts: /alert|vulnerability|update|outage|security/i,
  search: /search|find|show me|tell me about/i,
  category: /microsoft update|vulnerability|outage|security|cve/i,
  severity: /critical|high|medium|low|severity/i,
  exit: /bye|goodbye|exit|quit/i,
};

function searchAlerts(query: string, category?: string, severity?: string): AlertItem[] {
  const q = query.toLowerCase();
  return alerts.filter((alert) => {
    const matchesQuery = !q || alert.title.toLowerCase().includes(q) || alert.summary.toLowerCase().includes(q) || alert.category.toLowerCase().includes(q);
    const matchesCategory = !category || alert.category.toLowerCase() === category.toLowerCase();
    const matchesSeverity = !severity || alert.severity?.toLowerCase() === severity.toLowerCase();
    return matchesQuery && matchesCategory && matchesSeverity;
  });
}

function getCategoryDescription(category: string): string {
  switch (category.toLowerCase()) {
    case 'vulnerability':
      return '🔓 **Vulnerabilities** — CVE and security exposures prioritized by severity. Review assessed risk and mitigation guidance.';
    case 'security advisory':
      return '⚠️ **Security Advisories** — Strategic guidance on emerging threats and attack patterns. Important for defensive planning.';
    case 'outage':
      return '🔴 **Outages** — Service disruptions and availability issues. Track status from investigating through resolution.';
    case 'microsoft update':
      return '🪟 **Microsoft Updates** — Windows, Azure, Microsoft 365, and Defender intelligence. Plan patches and deployments.';
    default:
      return `📋 **${category}** alerts available.`;
  }
}

export function generateChatResponse(userMessage: string): string {
  const message = userMessage.toLowerCase().trim();

  // Greeting
  if (keywords.greeting.test(message)) {
    return "Hello! 👋 I'm the Makriva security assistant. I help you find and understand:\n• 🔓 Vulnerabilities (CVEs and exposures)\n• ⚠️ Security Advisories (threat intelligence)\n• 🔴 Outages (service disruptions)\n• 🪟 Microsoft Updates (patches and releases)\n\nWhat would you like to know?";
  }

  // Help
  if (keywords.help.test(message)) {
    return `I can help you with:

**Browse by Type:**
• "Show me vulnerabilities"
• "Find outages"
• "List Microsoft updates"
• "Search security advisories"

**Filter by Severity:**
• "Critical alerts" or "High severity items"

**Search:**
• "Find updates about Windows"
• "Search for vulnerability CVE-2024"

**Get Details:**
• Click "View full alert details" on any result

What would you like to know?`;
  }

  // Extract category and severity from message
  const categoryMatch = message.match(/(vulnerability|security advisory|outage|microsoft update)/i);
  const severityMatch = message.match(/(critical|high|medium|low)/i);
  const category = categoryMatch?.[0];
  const severity = severityMatch?.[0];

  // Search for alerts
  if (keywords.search.test(message) || keywords.alerts.test(message)) {
    // Extract keywords from message for search
    const searchTerms = message
      .replace(/show me|find|tell me about|search for|alerts?|updates?|vulnerabilities?|outages?|advisories?/gi, '')
      .trim();

    const results = searchAlerts(searchTerms, category, severity);

    if (results.length === 0) {
      const categoryHint = category ? ` in ${category}s` : '';
      return `I didn't find any alerts${categoryHint} matching "${searchTerms || 'your criteria'}". Try:\n• Browsing a specific category (vulnerabilities, outages, Microsoft updates)\n• Searching for different keywords\n• Asking "What categories do you have?"`;
    }

    const summary = results.slice(0, 3).map((a) => `• **${a.title}**\n  ${getCategoryDescription(a.category).split(' — ')[0]} ${a.severity ? `(${a.severity})` : ''}`).join('\n');
    const moreText = results.length > 3 ? `\n\n...and **${results.length - 3}** more. Visit the dedicated page for the full list.` : '';

    return `Found **${results.length}** result(s):\n\n${summary}${moreText}`;
  }

  // Category-specific help
  if (message.includes('vulnerability') && !keywords.search.test(message)) {
    const vulnResults = searchAlerts('', 'Vulnerability', undefined);
    return `${getCategoryDescription('Vulnerability')}\n\n**Currently tracking:** ${vulnResults.length} vulnerabilities\n\nVisit the **Vulnerabilities** page to see the full list sorted by severity.`;
  }

  if (message.includes('outage') && !keywords.search.test(message)) {
    const outageResults = searchAlerts('', 'Outage', undefined);
    return `${getCategoryDescription('Outage')}\n\n**Currently tracking:** ${outageResults.length} outages\n\nVisit the **Outages** page for active incidents and status updates.`;
  }

  if (message.includes('microsoft') && !keywords.search.test(message)) {
    const updateResults = searchAlerts('', 'Microsoft Update', undefined);
    return `${getCategoryDescription('Microsoft Update')}\n\n**Currently tracking:** ${updateResults.length} updates\n\nVisit the **Microsoft Updates** page for the latest patches and releases.`;
  }

  // Exit
  if (keywords.exit.test(message)) {
    return 'Goodbye! Stay secure! 🔒';
  }

  // Default response
  return `I can help you understand security alerts. Choose what you'd like to explore:\n\n${getCategoryDescription('Vulnerability')}\n\n${getCategoryDescription('Outage')}\n\n${getCategoryDescription('Microsoft Update')}\n\nOr just ask me anything!`;
}
