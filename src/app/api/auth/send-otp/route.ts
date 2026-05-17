import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { getEmailService } from "@/lib/email";

const OTP_EXPIRY_MINUTES = 15;
const RATE_LIMIT_SECONDS = 30;
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
      .gte("created_at", new Date(Date.now() - RATE_LIMIT_SECONDS * 1000).toISOString())
      .limit(1);

    if (recent && recent.length > 0) {
      return NextResponse.json(
        { error: `Please wait ${RATE_LIMIT_SECONDS} seconds before requesting another OTP` },
        { status: 429 }
      );
    }

    await supabase.from("otp_verifications").delete().eq("email", normalizedEmail);

    const otp = isDev ? DEV_OTP : generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const { error: insertError } = await supabase.from("otp_verifications").insert({
      email: normalizedEmail,
      otp,
      expires_at: expiresAt.toISOString()
    });

    if (insertError) {
      console.error("OTP insert error:", insertError);
      return NextResponse.json({ error: "Failed to store OTP. Please try again." }, { status: 500 });
    }

    if (!isDev) {
      try {
        const emailService = getEmailService();
        await emailService.sendOtp(normalizedEmail, otp);
      } catch (emailErr) {
        console.error("OTP email send failed:", emailErr);
        await supabase.from("otp_verifications").delete().eq("email", normalizedEmail);
        return NextResponse.json(
          { error: "Could not send verification email. Please try again or contact support." },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      devMode: isDev,
      ...(isDev ? { devOtp: otp } : {})
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
