import { Exam } from "@/types";

export const EXAMS: Exam[] = [
  {
    id: "1",
    name: "JEE",
    slug: "jee",
    description: "Physics, chemistry, mathematics for engineering aspirants."
  },
  {
    id: "2",
    name: "NEET",
    slug: "neet",
    description: "Biology-heavy preparation and exam alerts for medical aspirants."
  },
  {
    id: "3",
    name: "SAT (Undergraduate)",
    slug: "sat-ug",
    description: "Undergraduate admissions test preparation."
  },
  {
    id: "4",
    name: "SAT (Postgraduate)",
    slug: "sat-pg",
    description: "Postgraduate admissions test preparation."
  },
  {
    id: "5",
    name: "Engineering (SPPU)",
    slug: "engineering-sppu",
    description: "Savitribai Phule Pune University engineering exam updates and preparation."
  }
];

export const STORAGE_KEYS = {
  profiles: "ps_profiles",
  session: "ps_session",
  posts: "ps_posts",
  comments: "ps_comments",
  chat: "ps_chat_messages",
  chatBlacklist: "ps_chat_blacklist",
  notifications: "ps_notifications",
  adminConfig: "ps_admin_config",
  moderators: "ps_moderators"
};

export const ENGINEERING_YEARS = [
  { value: "FE", label: "First Year (FE)" },
  { value: "SE", label: "Second Year (SE)" },
  { value: "TE", label: "Third Year (TE)" },
  { value: "BE", label: "Final Year (BE)" }
] as const;

export const NOTIFICATION_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "mr", name: "Marathi" }
] as const;
