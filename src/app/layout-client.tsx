'use client';

import { ChatWidget } from '@/components/chatbot/chat-widget';

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
