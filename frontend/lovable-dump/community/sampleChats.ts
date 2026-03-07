export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: Date;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  reactions?: { emoji: string; count: number; reacted: boolean }[];
  isPinned?: boolean;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  role?: "admin" | "moderator" | "member";
}

export const currentUser: ChatUser = {
  id: "user-self",
  name: "You",
  isOnline: true,
  role: "member",
};

export const communityMembers: ChatUser[] = [
  { id: "u1", name: "Arjun Mehta", isOnline: true, role: "admin" },
  { id: "u2", name: "Priya Sharma", isOnline: true, role: "moderator" },
  { id: "u3", name: "Rahul Verma", isOnline: false, role: "member" },
  { id: "u4", name: "Sneha Iyer", isOnline: true, role: "member" },
  { id: "u5", name: "Kabir Desai", isOnline: false, role: "member" },
  { id: "u6", name: "Ananya Gupta", isOnline: true, role: "member" },
  { id: "u7", name: "Vikram Joshi", isOnline: false, role: "member" },
  { id: "u8", name: "Meera Nair", isOnline: true, role: "member" },
];

export const sampleMessages: ChatMessage[] = [
  {
    id: "m1",
    senderId: "u1",
    senderName: "Arjun Mehta",
    text: "Good morning everyone! Just a reminder — the submission deadline for the editorial column is this Friday at 5 PM. No extensions this time.",
    timestamp: new Date("2026-02-28T09:15:00"),
    isPinned: true,
    reactions: [
      { emoji: "👍", count: 5, reacted: false },
      { emoji: "📝", count: 2, reacted: true },
    ],
  },
  {
    id: "m2",
    senderId: "u2",
    senderName: "Priya Sharma",
    text: "Thanks for the heads-up, Arjun. I've already drafted my piece on the new campus library wing. Should I share it here for review?",
    timestamp: new Date("2026-02-28T09:18:00"),
  },
  {
    id: "m3",
    senderId: "u4",
    senderName: "Sneha Iyer",
    text: "Yes please! I'd love to read it. I'm still stuck on my article about the student council elections. Anyone have quotes from last week's debate?",
    timestamp: new Date("2026-02-28T09:22:00"),
    replyTo: {
      id: "m2",
      senderName: "Priya Sharma",
      text: "Should I share it here for review?",
    },
  },
  {
    id: "m4",
    senderId: "u3",
    senderName: "Rahul Verma",
    text: "I recorded the whole debate! Let me upload the transcript to our shared drive. Give me an hour.",
    timestamp: new Date("2026-02-28T09:25:00"),
    reactions: [{ emoji: "🙏", count: 3, reacted: false }],
  },
  {
    id: "m5",
    senderId: "u6",
    senderName: "Ananya Gupta",
    text: "Has anyone finalized the crossword puzzle for the entertainment section? I can help with clues if needed.",
    timestamp: new Date("2026-02-28T09:30:00"),
  },
  {
    id: "m6",
    senderId: "u5",
    senderName: "Kabir Desai",
    text: "I'm on it! Almost done. Just need 3 more clues for the \"Campus Life\" theme. Any suggestions?",
    timestamp: new Date("2026-02-28T09:33:00"),
    replyTo: {
      id: "m5",
      senderName: "Ananya Gupta",
      text: "Has anyone finalized the crossword puzzle?",
    },
  },
  {
    id: "m7",
    senderId: "u8",
    senderName: "Meera Nair",
    text: "How about: \"The place where sleep goes to die\" — 7 letters. Answer: LIBRARY 😄",
    timestamp: new Date("2026-02-28T09:35:00"),
    reactions: [
      { emoji: "😂", count: 6, reacted: true },
      { emoji: "💀", count: 2, reacted: false },
    ],
  },
  {
    id: "m8",
    senderId: "u7",
    senderName: "Vikram Joshi",
    text: "Haha brilliant! Also, quick question — are we doing a photo feature this edition? I took some great shots at the cultural fest.",
    timestamp: new Date("2026-02-28T09:40:00"),
  },
  {
    id: "m9",
    senderId: "u1",
    senderName: "Arjun Mehta",
    text: "Absolutely! Send them over. We have a full-page spread reserved for the cultural fest coverage. The more photos the better.",
    timestamp: new Date("2026-02-28T09:42:00"),
    replyTo: {
      id: "m8",
      senderName: "Vikram Joshi",
      text: "Are we doing a photo feature this edition?",
    },
  },
  {
    id: "m10",
    senderId: "u4",
    senderName: "Sneha Iyer",
    text: "By the way, Prof. Chatterjee said she'd write a guest column for us! She wants to talk about the history of student journalism on campus.",
    timestamp: new Date("2026-02-28T09:50:00"),
    reactions: [
      { emoji: "🔥", count: 4, reacted: false },
      { emoji: "👏", count: 3, reacted: true },
    ],
  },
  {
    id: "m11",
    senderId: "u2",
    senderName: "Priya Sharma",
    text: "That's amazing! Let's put that on the front page. Arjun, can we bump the sports recap to page 2?",
    timestamp: new Date("2026-02-28T09:53:00"),
  },
  {
    id: "m12",
    senderId: "u1",
    senderName: "Arjun Mehta",
    text: "Done. I'll update the layout tonight. Everyone, please have your final drafts in by Thursday so we have time for proofreading. Let's make this the best edition yet! 🗞️",
    timestamp: new Date("2026-02-28T10:00:00"),
    reactions: [
      { emoji: "🗞️", count: 7, reacted: true },
      { emoji: "💪", count: 4, reacted: false },
    ],
  },
];
