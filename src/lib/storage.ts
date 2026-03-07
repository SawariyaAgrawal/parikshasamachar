import {
  ChatBlacklistEntry,
  ChatMessage,
  CommunityPost,
  PostComment,
  PreviousExamNotification,
  Profile,
  SessionState
} from "@/types";
import { EXAMS, STORAGE_KEYS } from "@/lib/constants";

function canUseStorage() {
  return typeof window !== "undefined";
}

function readJSON<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function ensureSeedData() {
  const notifications = readJSON<PreviousExamNotification[]>(STORAGE_KEYS.notifications, []);
  if (notifications.length > 0) return;

  const seeded = EXAMS.map((exam, idx) => ({
    id: crypto.randomUUID(),
    examSlug: exam.slug,
    title: `${exam.name}: Previous Year Papers`,
    body: `Download previous exam notifications and papers for ${exam.name}.`,
    createdAt: new Date(Date.now() - idx * 86400000).toISOString()
  }));
  writeJSON(STORAGE_KEYS.notifications, seeded);
}

export function getNotificationsByExam(examSlug: string) {
  return getNotifications().filter((item) => item.examSlug === examSlug);
}

export function getProfiles() {
  return readJSON<Profile[]>(STORAGE_KEYS.profiles, []);
}

export function saveProfile(profile: Profile) {
  const profiles = getProfiles();
  profiles.push(profile);
  writeJSON(STORAGE_KEYS.profiles, profiles);
}

export function updateProfile(updatedProfile: Profile) {
  const profiles = getProfiles();
  const exists = profiles.some((p) => p.id === updatedProfile.id);
  const nextProfiles = exists
    ? profiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    : [...profiles, updatedProfile];
  writeJSON(STORAGE_KEYS.profiles, nextProfiles);
}

export function findProfileByCredentials(email: string, password: string) {
  return getProfiles().find(
    (profile) =>
      profile.email.toLowerCase() === email.toLowerCase() && profile.password === password
  );
}

export function setSession(session: SessionState) {
  writeJSON(STORAGE_KEYS.session, session);
}

export function getSession() {
  return readJSON<SessionState | null>(STORAGE_KEYS.session, null);
}

export function clearSession() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(STORAGE_KEYS.session);
}

export function getPosts() {
  return readJSON<CommunityPost[]>(STORAGE_KEYS.posts, []);
}

export function savePost(post: CommunityPost) {
  const posts = getPosts();
  posts.unshift(post);
  writeJSON(STORAGE_KEYS.posts, posts);
}

export function getComments() {
  return readJSON<PostComment[]>(STORAGE_KEYS.comments, []);
}

export function saveComment(comment: PostComment) {
  const comments = getComments();
  comments.push(comment);
  writeJSON(STORAGE_KEYS.comments, comments);
}

export function getChatMessages() {
  return readJSON<ChatMessage[]>(STORAGE_KEYS.chat, []);
}

export function saveChatMessage(message: ChatMessage) {
  const messages = getChatMessages();
  messages.push(message);
  writeJSON(STORAGE_KEYS.chat, messages);
}

export function updateChatMessage(updated: ChatMessage) {
  const messages = getChatMessages().map((m) =>
    m.id === updated.id ? updated : m
  );
  writeJSON(STORAGE_KEYS.chat, messages);
}

export function deleteChatMessage(id: string) {
  const messages = getChatMessages().filter((m) => m.id !== id);
  writeJSON(STORAGE_KEYS.chat, messages);
}

export function getChatBlacklist() {
  return readJSON<ChatBlacklistEntry[]>(STORAGE_KEYS.chatBlacklist, []);
}

export function addToChatBlacklist(entry: ChatBlacklistEntry) {
  const list = getChatBlacklist().filter(
    (e) => !(e.userId === entry.userId && e.examSlug === entry.examSlug)
  );
  list.push(entry);
  writeJSON(STORAGE_KEYS.chatBlacklist, list);
}

export function removeFromChatBlacklist(userId: string, examSlug: string) {
  const list = getChatBlacklist().filter(
    (e) => !(e.userId === userId && e.examSlug === examSlug)
  );
  writeJSON(STORAGE_KEYS.chatBlacklist, list);
}

export function isUserBlacklisted(userId: string, examSlug: string): boolean {
  const entry = getChatBlacklist().find(
    (e) => e.userId === userId && e.examSlug === examSlug
  );
  if (!entry) return false;
  return new Date(entry.until) > new Date();
}

export function getProfileIdByAuthorName(authorName: string, examSlug: string): string | null {
  const profiles = getProfiles().filter(
    (p) => p.role === "student" && p.examSlug === examSlug
  );
  const match = profiles.find(
    (p) =>
      p.fullName === authorName ||
      p.email.split("@")[0] === authorName
  );
  return match?.id ?? null;
}

export function getNotifications() {
  return readJSON<PreviousExamNotification[]>(STORAGE_KEYS.notifications, []);
}

export function saveNotification(notification: PreviousExamNotification) {
  const notifications = getNotifications();
  notifications.unshift(notification);
  writeJSON(STORAGE_KEYS.notifications, notifications);
}

export function deleteNotification(id: string) {
  const notifications = getNotifications().filter((item) => item.id !== id);
  writeJSON(STORAGE_KEYS.notifications, notifications);
}

export interface AdminConfig {
  name: string;
  email: string;
  password: string;
}

export function getAdminConfig(): AdminConfig | null {
  return readJSON<AdminConfig | null>(STORAGE_KEYS.adminConfig, null);
}

export function saveAdminConfig(config: AdminConfig) {
  writeJSON(STORAGE_KEYS.adminConfig, config);
}

export interface Moderator {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export function getModerators(): Moderator[] {
  return readJSON<Moderator[]>(STORAGE_KEYS.moderators, []);
}

export function saveModerator(mod: Moderator) {
  const list = getModerators();
  const idx = list.findIndex((m) => m.id === mod.id);
  if (idx >= 0) list[idx] = mod;
  else list.push(mod);
  writeJSON(STORAGE_KEYS.moderators, list);
}

export function deleteModerator(id: string) {
  writeJSON(
    STORAGE_KEYS.moderators,
    getModerators().filter((m) => m.id !== id)
  );
}

export function findModeratorByCredentials(email: string, password: string): Moderator | null {
  return getModerators().find(
    (m) => m.email.toLowerCase() === email.toLowerCase() && m.password === password
  ) ?? null;
}
