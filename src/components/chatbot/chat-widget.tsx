'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, MessageSquare, Send, X } from 'lucide-react';
import { generateChatResponse, type ChatMessage } from '@/lib/chatbot-service';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Hello. I can help find shared fixes, alerts, vulnerabilities, and update notes.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const nextInput = input.trim();
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: nextInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generateChatResponse(nextInput),
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="chat-widget">
      {isOpen && (
        <section className="chat-widget__panel" aria-label="Makriva assistant">
          <header className="chat-widget__header">
            <span>
              <Bot size={17} aria-hidden="true" />
              Admin assistant
            </span>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close assistant">
              <X size={17} />
            </button>
          </header>

          <div className="chat-widget__messages">
            {messages.map((message) => (
              <div className={`chat-widget__message ${message.role === 'user' ? 'is-user' : ''}`} key={message.id}>
                {message.content}
              </div>
            ))}
            {isLoading && <div className="chat-widget__message">Checking shared knowledge...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="chat-widget__form"
            onSubmit={(event) => {
              event.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about a fix or alert..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send message">
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      <button className="chat-widget__toggle" type="button" onClick={() => setIsOpen((value) => !value)} aria-label="Open assistant">
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </button>
    </div>
  );
}
