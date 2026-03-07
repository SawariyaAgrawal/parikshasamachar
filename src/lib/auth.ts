import { SessionState } from "@/types";
import { getAdminConfig, findModeratorByCredentials } from "@/lib/storage";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@pariksha.local";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "Admin@12345";

export function validateAdminLogin(email: string, password: string) {
  const config = getAdminConfig();
  if (config) {
    return email.toLowerCase() === config.email.toLowerCase() && password === config.password;
  }
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;
}

export function validateModeratorLogin(email: string, password: string) {
  return findModeratorByCredentials(email, password) !== null;
}

export function isAdminSession(session: SessionState | null) {
  return Boolean(session?.role === "admin");
}

export function isModeratorSession(session: SessionState | null) {
  return Boolean(session?.role === "moderator");
}

/** Admin or moderator - has community mod powers */
export function hasCommunityModPowers(session: SessionState | null) {
  return isAdminSession(session) || isModeratorSession(session);
}
