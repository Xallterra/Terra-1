'use client';

import { SessionProvider } from 'next-auth/react';
import { ChatWidget } from '@/components/chatbot/chat-widget';

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ChatWidget />
    </SessionProvider>
  );
}
