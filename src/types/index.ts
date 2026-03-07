export type UserRole = "admin" | "student" | "moderator";

export interface Exam {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  examSlug: string;
  examYear: string;
  currentCoaching?: string;
  targetYear?: string;
  preferredLang?: string;
  role: UserRole;
  createdAt: string;
}

export interface SessionState {
  userId: string;
  email: string;
  role: UserRole;
  examSlug?: string;
  preferredLang?: string;
}

export interface CommunityPost {
  id: string;
  examSlug: string;
  authorName: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  examSlug: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface ChatReaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

export interface ChatMessageReply {
  id: string;
  authorName: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  examSlug: string;
  authorName: string;
  senderId?: string;
  content: string;
  createdAt: string;
  replyTo?: ChatMessageReply;
  reactions?: ChatReaction[];
  isPinned?: boolean;
}

export interface ChatBlacklistEntry {
  userId: string;
  examSlug: string;
  until: string;
}

export type NotificationBody = string | Record<string, string>;
export type NotificationTitle = string | Record<string, string>;

export interface PreviousExamNotification {
  id: string;
  examSlug: string;
  title: NotificationTitle;
  body: NotificationBody;
  link?: string;
  documentUrl?: string;
  createdAt: string;
}
