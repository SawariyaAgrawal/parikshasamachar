"use client";

import { FormEvent, useEffect, useState } from "react";
import { getChatMessages, saveChatMessage } from "@/lib/storage";
import { ChatMessage } from "@/types";

interface ChatPanelProps {
  examSlug: string;
  authorName: string;
}

export default function ChatPanel({ examSlug, authorName }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const sync = () => {
      setMessages(getChatMessages().filter((message) => message.examSlug === examSlug));
    };

    sync();
    window.addEventListener("storage", sync);
    const interval = window.setInterval(sync, 1200);

    return () => {
      window.removeEventListener("storage", sync);
      window.clearInterval(interval);
    };
  }, [examSlug]);

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      examSlug,
      authorName,
      content: text.trim(),
      createdAt: new Date().toISOString()
    };
    saveChatMessage(message);
    setMessages((prev) => [...prev, message]);
    setText("");
  };

  return (
    <section className="card p-4">
      <h2 className="mb-3 text-lg font-semibold">Community Chat</h2>
      <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border border-neutral-200 p-2">
        {messages.length === 0 && (
          <p className="text-sm text-neutral-500">Start a live discussion with your community.</p>
        )}
        {messages.map((message) => (
          <div key={message.id} className="rounded-md border border-neutral-200 px-3 py-2">
            <p className="text-sm">{message.content}</p>
            <p className="text-xs text-neutral-500">
              {message.authorName} · {new Date(message.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="mt-3 flex gap-2">
        <input
          className="input"
          placeholder="Type message"
          value={text}
          onChange={(event) => setText(event.target.value)}
          required
        />
        <button type="submit" className="rounded-md bg-[#1f275d] px-4 py-2 text-sm font-semibold !text-white hover:!text-white">
          Send
        </button>
      </form>
    </section>
  );
}
