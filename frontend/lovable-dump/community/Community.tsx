import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  Search,
  Pin,
  Reply,
  X,
  Users,
  MoreVertical,
  Smile,
  Paperclip,
  ChevronDown,
} from "lucide-react";
import {
  sampleMessages,
  communityMembers,
  currentUser,
  type ChatMessage,
} from "@/data/sampleChats";
import { cn } from "@/lib/utils";

// Generate consistent color from name
const getAvatarColor = (name: string) => {
  const colors = [
    "bg-[hsl(228,55%,23%)]",
    "bg-[hsl(42,50%,40%)]",
    "bg-[hsl(0,60%,45%)]",
    "bg-[hsl(160,40%,35%)]",
    "bg-[hsl(280,40%,40%)]",
    "bg-[hsl(200,50%,40%)]",
    "bg-[hsl(30,60%,45%)]",
    "bg-[hsl(330,40%,40%)]",
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
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

const formatDateSeparator = (date: Date) =>
  date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

const Community = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [showPinned, setShowPinned] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onlineCount = communityMembers.filter((m) => m.isOnline).length;
  const pinnedMessages = messages.filter((m) => m.isPinned);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: newMessage.trim(),
      timestamp: new Date(),
      replyTo: replyingTo
        ? { id: replyingTo.id, senderName: replyingTo.senderName, text: replyingTo.text }
        : undefined,
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    setReplyingTo(null);
    inputRef.current?.focus();
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        const existing = m.reactions?.find((r) => r.emoji === emoji);
        if (existing) {
          return {
            ...m,
            reactions: m.reactions!.map((r) =>
              r.emoji === emoji
                ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted }
                : r
            ).filter((r) => r.count > 0),
          };
        }
        return {
          ...m,
          reactions: [...(m.reactions || []), { emoji, count: 1, reacted: true }],
        };
      })
    );
  };

  const filteredMessages = searchQuery
    ? messages.filter(
        (m) =>
          m.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.senderName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const quickReactions = ["👍", "😂", "🔥", "❤️", "👏"];

  return (
    <div className="flex flex-col h-screen newspaper-bg">
      {/* Header */}
      <header className="border-b-2 border-primary/30 bg-card/80 backdrop-blur-sm px-4 py-3 flex items-center gap-3 relative z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback
                className="bg-primary text-primary-foreground font-bold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                TC
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-0">
            <h1
              className="text-base font-bold text-foreground truncate leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The Campus Chronicle
            </h1>
            <p className="text-xs text-muted-foreground truncate">
              {communityMembers.length + 1} members, {onlineCount} online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSearchOpen(!searchOpen);
              setSearchQuery("");
            }}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowPinned(!showPinned);
              setShowMembers(false);
            }}
          >
            <Pin className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowMembers(!showMembers);
              setShowPinned(false);
            }}
          >
            <Users className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Search Bar */}
      {searchOpen && (
        <div className="px-4 py-2 bg-card/60 border-b border-primary/10 flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-sm border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Pinned Messages Panel */}
      {showPinned && pinnedMessages.length > 0 && (
        <div className="border-b border-primary/10 bg-accent/10 px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <Pin className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider" style={{ fontFamily: "'Playfair Display', serif" }}>
              Pinned Messages
            </span>
          </div>
          {pinnedMessages.map((pm) => (
            <div key={pm.id} className="text-xs text-muted-foreground pl-5 py-1 border-l-2 border-accent/40 mb-1 last:mb-0">
              <span className="font-semibold text-foreground">{pm.senderName}:</span> {pm.text.slice(0, 80)}…
            </div>
          ))}
        </div>
      )}

      {/* Members Panel */}
      {showMembers && (
        <div className="border-b border-primary/10 bg-card/60 px-4 py-3 max-h-48 overflow-y-auto">
          <span
            className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Members
          </span>
          <div className="grid grid-cols-2 gap-2">
            {communityMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-2 py-1">
                <div className="relative">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className={cn("text-[10px] text-white font-bold", getAvatarColor(member.name))}>
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  {member.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{member.name}</p>
                  {member.role !== "member" && (
                    <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5">
                      {member.role}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="py-4 space-y-1">
          {/* Date separator */}
          <div className="flex items-center gap-3 py-3">
            <div className="flex-1 h-px bg-primary/10" />
            <span
              className="text-[10px] text-muted-foreground uppercase tracking-widest"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {formatDateSeparator(filteredMessages[0]?.timestamp || new Date())}
            </span>
            <div className="flex-1 h-px bg-primary/10" />
          </div>

          {filteredMessages.map((msg, index) => {
            const isOwnMessage = msg.senderId === currentUser.id;
            const showAvatar =
              index === 0 || filteredMessages[index - 1].senderId !== msg.senderId;
            const isLastInGroup =
              index === filteredMessages.length - 1 ||
              filteredMessages[index + 1].senderId !== msg.senderId;

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2 group",
                  isOwnMessage ? "flex-row-reverse" : "flex-row",
                  showAvatar ? "mt-3" : "mt-0.5"
                )}
              >
                {/* Avatar */}
                <div className="w-9 shrink-0">
                  {showAvatar && !isOwnMessage && (
                    <Avatar className="h-9 w-9">
                      <AvatarFallback
                        className={cn("text-xs text-white font-bold", getAvatarColor(msg.senderName))}
                      >
                        {getInitials(msg.senderName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={cn("max-w-[75%] min-w-[120px]", isOwnMessage && "items-end")}>
                  {showAvatar && (
                    <div className={cn("flex items-center gap-2 mb-0.5", isOwnMessage && "flex-row-reverse")}>
                      <span
                        className="text-xs font-bold"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          color: getAvatarColor(msg.senderName).includes("228") ? "hsl(228,55%,23%)" : "hsl(42,50%,40%)",
                        }}
                      >
                        {isOwnMessage ? "You" : msg.senderName}
                      </span>
                      {msg.isPinned && <Pin className="h-3 w-3 text-accent" />}
                    </div>
                  )}

                  <div
                    className={cn(
                      "relative px-3 py-2 text-sm leading-relaxed",
                      isOwnMessage
                        ? "bg-primary text-primary-foreground rounded-t-lg rounded-bl-lg rounded-br-sm"
                        : "bg-card border border-primary/10 text-foreground rounded-t-lg rounded-br-lg rounded-bl-sm",
                      !showAvatar && !isOwnMessage && "rounded-tl-lg",
                      !showAvatar && isOwnMessage && "rounded-tr-lg"
                    )}
                  >
                    {/* Reply preview */}
                    {msg.replyTo && (
                      <div
                        className={cn(
                          "mb-1.5 pl-2 py-1 border-l-2 text-xs rounded-sm",
                          isOwnMessage
                            ? "border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground/80"
                            : "border-accent bg-accent/5 text-muted-foreground"
                        )}
                      >
                        <span className="font-semibold block text-[11px]">{msg.replyTo.senderName}</span>
                        <span className="line-clamp-1">{msg.replyTo.text}</span>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                    <span
                      className={cn(
                        "text-[10px] float-right ml-2 mt-1",
                        isOwnMessage ? "text-primary-foreground/60" : "text-muted-foreground"
                      )}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>

                  {/* Reactions */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className={cn("flex flex-wrap gap-1 mt-1", isOwnMessage && "justify-end")}>
                      {msg.reactions.map((r) => (
                        <button
                          key={r.emoji}
                          onClick={() => handleReaction(msg.id, r.emoji)}
                          className={cn(
                            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] border transition-colors",
                            r.reacted
                              ? "bg-accent/20 border-accent/40 text-foreground"
                              : "bg-card border-primary/10 text-muted-foreground hover:bg-accent/10"
                          )}
                        >
                          {r.emoji} {r.count}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick action bar on hover */}
                  <div
                    className={cn(
                      "absolute -top-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-card border border-primary/10 rounded-md shadow-sm p-0.5 z-10",
                      isOwnMessage ? "left-0" : "right-0"
                    )}
                    style={{ position: "relative", top: 0 }}
                  >
                    <button
                      onClick={() => setReplyingTo(msg)}
                      className="p-1 rounded hover:bg-accent/20 text-muted-foreground hover:text-foreground transition-colors"
                      title="Reply"
                    >
                      <Reply className="h-3.5 w-3.5" />
                    </button>
                    {quickReactions.slice(0, 3).map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(msg.id, emoji)}
                        className="p-1 rounded hover:bg-accent/20 text-sm transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Reply Bar */}
      {replyingTo && (
        <div className="px-4 py-2 bg-card/60 border-t border-primary/10 flex items-center gap-2">
          <Reply className="h-4 w-4 text-accent shrink-0" />
          <div className="flex-1 min-w-0 border-l-2 border-accent pl-2">
            <p className="text-xs font-semibold text-accent">{replyingTo.senderName}</p>
            <p className="text-xs text-muted-foreground truncate">{replyingTo.text}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setReplyingTo(null)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t-2 border-primary/30 bg-card/80 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
            <Paperclip className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder="Write a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="pr-10 bg-background/50 border-primary/15"
            />
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full text-muted-foreground">
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="shrink-0 bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Community;
