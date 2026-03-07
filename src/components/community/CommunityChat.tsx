"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Send,
  X,
  Pin,
  Reply,
  MoreVertical,
  Paperclip,
  Trash2,
  UserX,
} from "lucide-react";
import {
  getChatMessages,
  saveChatMessage,
  updateChatMessage,
  deleteChatMessage,
  addToChatBlacklist,
  isUserBlacklisted,
  getProfileIdByAuthorName,
  getModerators,
} from "@/lib/storage";
import { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

const getAvatarColor = (name: string) => {
  const colors = [
    "bg-[#1f275d]",
    "bg-[#c5a54b]",
    "bg-[#b85c5c]",
    "bg-[#5c8ab8]",
    "bg-[#6b5b4a]",
    "bg-[#4a5d6b]",
    "bg-[#5b4a6b]",
    "bg-[#a86b4a]",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const formatDateSeparator = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

interface CommunityChatProps {
  examSlug: string;
  examName: string;
  authorName: string;
  isAdmin?: boolean;
  currentUserId?: string;
  backHref?: string;
  fullScreen?: boolean;
}

const quickReactions = ["👍", "😂", "🔥", "❤️", "👏"];

export default function CommunityChat({
  examSlug,
  examName,
  authorName,
  isAdmin = false,
  currentUserId,
  backHref,
  fullScreen = false,
}: CommunityChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [restrictTarget, setRestrictTarget] = useState<ChatMessage | null>(null);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUserId && !isAdmin) {
      const timer = setTimeout(
        () => setIsBlacklisted(isUserBlacklisted(currentUserId, examSlug)),
        0
      );
      return () => clearTimeout(timer);
    }
  }, [currentUserId, examSlug, isAdmin]);

  const syncMessages = useCallback(() => {
    setMessages(getChatMessages().filter((m) => m.examSlug === examSlug));
  }, [examSlug]);

  useEffect(() => {
    const timer = setTimeout(() => syncMessages(), 0);
    const interval = setInterval(syncMessages, 1200);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [syncMessages]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e?: FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || isBlacklisted) return;
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      examSlug,
      authorName,
      senderId: currentUserId,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            authorName: replyingTo.authorName,
            content: replyingTo.content.slice(0, 100),
          }
        : undefined,
    };
    saveChatMessage(msg);
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    setReplyingTo(null);
    inputRef.current?.focus();
  };

  const handleReaction = (messageId: string, emoji: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;

    const reactions = msg.reactions ?? [];
    const existing = reactions.find((r) => r.emoji === emoji);

    let nextReactions: ChatMessage["reactions"];
    if (existing) {
      nextReactions = reactions
        .map((r) =>
          r.emoji === emoji
            ? {
                ...r,
                count: r.reacted ? r.count - 1 : r.count + 1,
                reacted: !r.reacted,
              }
            : r
        )
        .filter((r) => r.count > 0);
    } else {
      nextReactions = [...reactions, { emoji, count: 1, reacted: true }];
    }

    const updated = { ...msg, reactions: nextReactions };
    updateChatMessage(updated);
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? updated : m))
    );
  };

  const togglePin = (msg: ChatMessage) => {
    const updated = { ...msg, isPinned: !msg.isPinned };
    updateChatMessage(updated);
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? updated : m))
    );
  };

  const handleDelete = (msg: ChatMessage) => {
    if (!isAdmin || !confirm("Delete this message?")) return;
    deleteChatMessage(msg.id);
    setMessages((prev) => prev.filter((m) => m.id !== msg.id));
  };

  const handleRestrict = (msg: ChatMessage, duration: "1d" | "3d" | "1w" | "permanent") => {
    const userId =
      msg.senderId ?? getProfileIdByAuthorName(msg.authorName.replace(/\s*\(Admin\)$/, ""), examSlug);
    const moderatorIds = new Set(getModerators().map((m) => m.id));
    if (!userId || userId === "admin" || moderatorIds.has(userId)) return;
    const now = new Date();
    let until: string;
    if (duration === "1d") until = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    else if (duration === "3d") until = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
    else if (duration === "1w") until = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    else until = new Date(now.getTime() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString();
    addToChatBlacklist({ userId, examSlug, until });
    setRestrictTarget(null);
  };

  const { pinnedFirst, unpinned } = useMemo(() => {
    const list = searchQuery
      ? messages.filter(
          (m) =>
            m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.authorName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [...messages];
    const pinned = list.filter((m) => m.isPinned).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const rest = list.filter((m) => !m.isPinned).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return { pinnedFirst: pinned, unpinned: rest };
  }, [messages, searchQuery]);

  const filteredMessages = [...pinnedFirst, ...unpinned];

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden newspaper-bg",
        fullScreen ? "flex-1" : "rounded-xl border border-[#1f275d]/15"
      )}
    >
      {/* Header - fixed, does not scroll */}
      <header className="flex shrink-0 items-center gap-2 sm:gap-3 border-b-2 border-[#1f275d]/20 bg-white/95 px-3 sm:px-4 py-2.5 sm:py-3 backdrop-blur-sm">
        {backHref && (
          <Link href={backHref} className="shrink-0">
            <Button variant="ghost" size="icon" type="button">
              <span className="sr-only">Back</span>
              <span className="text-lg">←</span>
            </Button>
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <h1
            className="truncate text-base font-bold leading-tight text-[#1f275d]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {examName} Community
          </h1>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => {
              setSearchOpen(!searchOpen);
              setSearchQuery("");
            }}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" type="button">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Search Bar */}
      {searchOpen && (
        <div className="flex shrink-0 items-center gap-2 border-b border-[#1f275d]/10 bg-white/80 px-4 py-2">
          <Search className="h-4 w-4 shrink-0 text-neutral-500" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 border-none bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            type="button"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Messages Area - only this scrolls */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4",
          !fullScreen && "min-h-[320px] max-h-[480px]"
        )}
      >
        <div className="flex min-h-full flex-col py-4">
          {filteredMessages.length === 0 ? (
            <div className="py-8 text-center text-sm text-neutral-500">
              No messages yet. Start the conversation.
            </div>
          ) : (
            <>
              {pinnedFirst.length > 0 && (
                <div className="mb-3 flex items-center gap-2 border-b border-[#c5a54b]/30 pb-2">
                  <Pin className="h-3.5 w-3.5 text-[#c5a54b]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#c5a54b]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Pinned by Admin
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 py-3">
                <div className="h-px flex-1 bg-[#1f275d]/10" />
                <span
                  className="text-[10px] uppercase tracking-widest text-neutral-500"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {formatDateSeparator(
                    filteredMessages[0]?.createdAt ?? new Date().toISOString()
                  )}
                </span>
                <div className="h-px flex-1 bg-[#1f275d]/10" />
              </div>

              <div className="space-y-1">
                {filteredMessages.map((msg, index) => {
                  const isOwnMessage = msg.authorName === authorName;
                  const showAvatar =
                    index === 0 ||
                    filteredMessages[index - 1].authorName !== msg.authorName;

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "group flex gap-2",
                        isOwnMessage ? "flex-row-reverse" : "flex-row",
                        showAvatar ? "mt-3" : "mt-0.5"
                      )}
                    >
                      <div className="w-9 shrink-0">
                        {showAvatar && !isOwnMessage && (
                          <Avatar className="h-9 w-9">
                            <AvatarFallback
                              className={cn(
                                "text-xs font-bold text-white",
                                getAvatarColor(msg.authorName)
                              )}
                            >
                              {getInitials(msg.authorName)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      <div
                        className={cn(
                          "relative max-w-[85%] sm:max-w-[75%] min-w-[80px] sm:min-w-[120px]",
                          isOwnMessage && "flex flex-col items-end"
                        )}
                      >
                        {showAvatar && (
                          <div
                            className={cn(
                              "mb-0.5 flex items-center gap-2",
                              isOwnMessage && "flex-row-reverse"
                            )}
                          >
                            <span
                              className="text-xs font-bold text-[#1f275d]"
                              style={{
                                fontFamily: "'Playfair Display', serif",
                              }}
                            >
                              {isOwnMessage ? "You" : msg.authorName}
                            </span>
                            {msg.isPinned && (
                              <Pin className="h-3 w-3 text-[#c5a54b]" />
                            )}
                          </div>
                        )}

                        <div
                          className={cn(
                            "relative rounded-t-lg px-3 py-2 text-sm leading-relaxed",
                            isOwnMessage
                              ? "rounded-bl-lg rounded-br-sm bg-[#1f275d] text-white"
                              : "rounded-br-lg rounded-bl-sm border border-[#1f275d]/10 bg-white text-[#1f233a]",
                            !showAvatar && !isOwnMessage && "rounded-tl-lg",
                            !showAvatar && isOwnMessage && "rounded-tr-lg"
                          )}
                        >
                          {msg.replyTo && (
                            <div
                              className={cn(
                                "mb-1.5 rounded-sm border-l-2 py-1 pl-2 text-xs",
                                isOwnMessage
                                  ? "border-white/40 bg-white/10 text-white/80"
                                  : "border-[#c5a54b]/40 bg-[#c5a54b]/5 text-neutral-600"
                              )}
                            >
                              <span
                                className={cn(
                                  "block font-semibold text-[11px]",
                                  isOwnMessage ? "text-white/90" : "text-[#1f275d]"
                                )}
                              >
                                {msg.replyTo.authorName}
                              </span>
                              <span className="line-clamp-1">
                                {msg.replyTo.content}
                              </span>
                            </div>
                          )}

                          <p className="whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                          <span
                            className={cn(
                              "float-right ml-2 mt-1 text-[10px]",
                              isOwnMessage ? "text-white/70" : "text-neutral-500"
                            )}
                          >
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>

                        {msg.reactions && msg.reactions.length > 0 && (
                          <div
                            className={cn(
                              "mt-1 flex flex-wrap gap-1",
                              isOwnMessage && "justify-end"
                            )}
                          >
                            {msg.reactions.map((r) => (
                              <button
                                key={r.emoji}
                                type="button"
                                onClick={() => handleReaction(msg.id, r.emoji)}
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] transition-colors",
                                  r.reacted
                                    ? "border-[#c5a54b]/40 bg-[#c5a54b]/20 text-[#1f233a]"
                                    : "border-[#1f275d]/10 bg-white text-neutral-600 hover:bg-[#c5a54b]/10"
                                )}
                              >
                                {r.emoji} {r.count}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Hover action bar */}
                        <div
                          className={cn(
                            "absolute z-10 flex items-center gap-0.5 rounded-md border border-[#1f275d]/10 bg-white p-0.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100",
                            isOwnMessage ? "left-0 -top-3" : "right-0 -top-3"
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => setReplyingTo(msg)}
                            className="rounded p-1 text-neutral-500 transition-colors hover:bg-[#c5a54b]/20 hover:text-[#1f275d]"
                            title="Reply"
                          >
                            <Reply className="h-3.5 w-3.5" />
                          </button>
                          {quickReactions.slice(0, 3).map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleReaction(msg.id, emoji)}
                              className="rounded p-1 text-sm transition-colors hover:bg-[#c5a54b]/20"
                            >
                              {emoji}
                            </button>
                          ))}
                          {isAdmin && (
                            <>
                              <button
                                type="button"
                                onClick={() => togglePin(msg)}
                                className="rounded p-1 text-neutral-500 transition-colors hover:bg-[#c5a54b]/20 hover:text-[#c5a54b]"
                                title={msg.isPinned ? "Unpin" : "Pin"}
                              >
                                <Pin className="h-3.5 w-3.5" />
                              </button>
                              {!isOwnMessage && (
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRestrictTarget(restrictTarget?.id === msg.id ? null : msg)
                                    }
                                    className="rounded p-1 text-neutral-500 transition-colors hover:bg-red-100 hover:text-red-600"
                                    title="Restrict user"
                                  >
                                    <UserX className="h-3.5 w-3.5" />
                                  </button>
                                  {restrictTarget?.id === msg.id && (
                                    <div className="absolute left-0 top-full z-20 mt-1 w-36 rounded-md border border-[#1f275d]/10 bg-white py-1 shadow-lg">
                                      {(["1d", "3d", "1w", "permanent"] as const).map((d) => (
                                        <button
                                          key={d}
                                          type="button"
                                          onClick={() => handleRestrict(msg, d)}
                                          className="w-full px-3 py-1.5 text-left text-xs hover:bg-[#1f275d]/5"
                                        >
                                          {d === "1d" && "1 day"}
                                          {d === "3d" && "3 days"}
                                          {d === "1w" && "1 week"}
                                          {d === "permanent" && "Permanent"}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDelete(msg)}
                                className="rounded p-1 text-neutral-500 transition-colors hover:bg-red-100 hover:text-red-600"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reply Bar */}
      {replyingTo && (
        <div className="flex shrink-0 items-center gap-2 border-t border-[#1f275d]/10 bg-white/80 px-4 py-2">
          <Reply className="h-4 w-4 shrink-0 text-[#c5a54b]" />
          <div className="min-w-0 flex-1 border-l-2 border-[#c5a54b] pl-2">
            <p className="text-xs font-semibold text-[#c5a54b]">
              {replyingTo.authorName}
            </p>
            <p className="truncate text-xs text-neutral-600">
              {replyingTo.content}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            type="button"
            onClick={() => setReplyingTo(null)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Blacklisted notice */}
      {isBlacklisted && (
        <div className="shrink-0 border-t border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-800">
          You are temporarily restricted from sending messages in this community.
        </div>
      )}

      {/* Message Input */}
      <form
        onSubmit={handleSend}
        className={cn(
          "flex shrink-0 items-center gap-2 border-t-2 border-[#1f275d]/20 bg-white/95 px-3 sm:px-4 py-2.5 sm:py-3 backdrop-blur-sm",
          isBlacklisted && "pointer-events-none opacity-60"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="shrink-0 text-neutral-500"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <Input
            ref={inputRef}
            placeholder="Write a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            className="border-[#1f275d]/15 bg-white/50"
          />
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={!newMessage.trim()}
          className="shrink-0 bg-[#1f275d] hover:bg-[#1f275d]/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
