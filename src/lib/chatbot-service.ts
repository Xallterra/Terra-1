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
  alerts: /alert|vulnerability|update|outage/i,
  search: /search|find|show me|tell me about/i,
  category: /microsoft update|vulnerability|outage|security/i,
  severity: /critical|high|medium|low|severity/i,
  exit: /bye|goodbye|exit|quit/i,
};

function searchAlerts(query: string, category?: string, severity?: string): AlertItem[] {
  const q = query.toLowerCase();
  return alerts.filter((alert) => {
    const matchesQuery = !q || alert.title.toLowerCase().includes(q) || alert.summary.toLowerCase().includes(q);
    const matchesCategory = !category || alert.category.toLowerCase() === category.toLowerCase();
    const matchesSeverity = !severity || alert.severity?.toLowerCase() === severity.toLowerCase();
    return matchesQuery && matchesCategory && matchesSeverity;
  });
}

export function generateChatResponse(userMessage: string): string {
  const message = userMessage.toLowerCase().trim();

  // Greeting
  if (keywords.greeting.test(message)) {
    return "Hello! 👋 I'm the Makriva security assistant. I can help you find information about alerts, vulnerabilities, Microsoft updates, and outages. What would you like to know?";
  }

  // Help
  if (keywords.help.test(message)) {
    return `I can help you with:
• **Search alerts**: "Show me critical vulnerabilities" or "Find Microsoft updates"
• **Browse by category**: Ask about "Microsoft updates", "vulnerabilities", "outages", or "security advisories"
• **Get details**: Just ask about any specific alert
• **Filter by severity**: Ask for "critical", "high", "medium", or "low" severity items

What would you like to know?`;
  }

  // Extract category and severity from message
  const categoryMatch = message.match(/(microsoft update|vulnerability|outage|security advisory)/i);
  const severityMatch = message.match(/(critical|high|medium|low)/i);
  const category = categoryMatch?.[0];
  const severity = severityMatch?.[0];

  // Search for alerts
  if (keywords.search.test(message) || keywords.alerts.test(message)) {
    // Extract keywords from message for search
    const searchTerms = message
      .replace(/show me|find|tell me about|search for|alerts?|updates?|vulnerabilities?|outages?/gi, '')
      .trim();

    const results = searchAlerts(searchTerms, category, severity);

    if (results.length === 0) {
      return `I didn't find any alerts matching your criteria. Try searching for specific keywords or asking about a particular category like "Microsoft updates" or "vulnerabilities".`;
    }

    const summary = results.slice(0, 3).map((a) => `• **${a.title}** (${a.category} - ${a.severity || 'N/A'})`).join('\n');
    const moreText = results.length > 3 ? `\n\n...and ${results.length - 3} more results. Visit the Alerts page for the full list.` : '';

    return `I found ${results.length} alert(s):\n\n${summary}${moreText}\n\nClick "View full alert details" on any card to read more.`;
  }

  // Exit
  if (keywords.exit.test(message)) {
    return 'Goodbye! Have a secure day! 🔒';
  }

  // Default response
  return `I'm here to help with security alerts at Makriva. You can ask me about:
• Recent alerts and vulnerabilities
• Microsoft updates and changes
• Service outages
• Security advisories

What would you like to know?`;
}
