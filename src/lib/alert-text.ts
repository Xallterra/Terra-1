import { AlertItem } from '@/types/alert';

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&(amp|lt|gt|quot|apos);/gi, (_, entity) => {
      switch (entity.toLowerCase()) {
        case 'amp':
          return '&';
        case 'lt':
          return '<';
        case 'gt':
          return '>';
        case 'quot':
          return '"';
        case 'apos':
          return "'";
        default:
          return '';
      }
    })
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function stripHtmlTags(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '; ')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, ' ');
}

export function formatAlertText(text: string): string {
  let cleaned = text.trim();

  for (let i = 0; i < 2; i += 1) {
    cleaned = decodeHtmlEntities(cleaned);
  }

  return stripHtmlTags(cleaned)
    .replace(/\r/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([([{])\s+/g, '$1')
    .replace(/\s+([)\]}])/g, '$1')
    .replace(/\s+-\s+/g, ' - ')
    .trim();
}

export function summarizeAlertText(text: string, maxLength = 260): string {
  const trimmed = formatAlertText(text);
  if (trimmed.length <= maxLength) return trimmed;
  const shortened = trimmed.slice(0, maxLength).trim();
  return `${shortened.replace(/[,;\s]+$/u, '')}...`;
}

export function getAlertSearchableText(alert: AlertItem): string {
  return [alert.title, alert.summary, alert.subcategory, alert.category, alert.source_name, ...alert.tags].join(' ').toLowerCase();
}
