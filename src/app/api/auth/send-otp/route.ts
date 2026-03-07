import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { getEmailService } from "@/lib/email";

const OTP_EXPIRY_MINUTES = 10;
const RATE_LIMIT_MINUTES = 1;
const DEV_OTP = "123456";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Email verification not configured" }, { status: 503 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isDev = process.env.NODE_ENV === "development" && !process.env.BREVO_API_KEY;

    const { data: recent } = await supabase
      .from("otp_verifications")
      .select("created_at")
      .eq("email", normalizedEmail)
      .gte("created_at", new Date(Date.now() - RATE_LIMIT_MINUTES * 60 * 1000).toISOString())
      .limit(1);

    if (recent && recent.length > 0) {
      return NextResponse.json(
        { error: "Please wait before requesting another OTP" },
        { status: 429 }
      );
    }

    const otp = isDev ? DEV_OTP : generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await supabase.from("otp_verifications").insert({
      email: normalizedEmail,
      otp,
      expires_at: expiresAt.toISOString()
    });

    if (!isDev) {
      const emailService = getEmailService();
      await emailService.sendOtp(normalizedEmail, otp);
    }

    return NextResponse.json({ success: true, devMode: isDev });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
