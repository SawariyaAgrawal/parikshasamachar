import { BrevoClient } from "@getbrevo/brevo";
import type { EmailService } from "./types";

const API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL ?? "noreply@parikshasamachar.com";
const FROM_NAME = process.env.BREVO_FROM_NAME ?? "Pariksha Samachar";

function getClient(): BrevoClient {
  if (!API_KEY) throw new Error("BREVO_API_KEY is not set");
  return new BrevoClient({ apiKey: API_KEY });
}

export const brevoEmailService: EmailService = {
  async sendOtp(to: string, otp: string) {
    const client = getClient();
    await client.transactionalEmails.sendTransacEmail({
      sender: { email: FROM_EMAIL, name: FROM_NAME },
      to: [{ email: to }],
      subject: "Your OTP for Pariksha Samachar",
      htmlContent: `
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>It expires in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });
  },

  async sendNotification(to: string, subject: string, body: string) {
    const client = getClient();
    await client.transactionalEmails.sendTransacEmail({
      sender: { email: FROM_EMAIL, name: FROM_NAME },
      to: [{ email: to }],
      subject,
      htmlContent: body
    });
  }
};
