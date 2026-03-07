import type { EmailService } from "./types";
import { brevoEmailService } from "./brevo";

export type { EmailService };

export function getEmailService(): EmailService {
  return brevoEmailService;
}
