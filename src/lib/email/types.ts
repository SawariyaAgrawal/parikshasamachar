export interface EmailService {
  sendOtp(to: string, otp: string): Promise<void>;
  sendNotification(to: string, subject: string, body: string): Promise<void>;
}
