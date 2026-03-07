import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Verification not configured" }, { status: 503 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otpTrimmed = otp.trim();

    const { data, error } = await supabase
      .from("otp_verifications")
      .select("id")
      .eq("email", normalizedEmail)
      .eq("otp", otpTrimmed)
      .gt("expires_at", new Date().toISOString())
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    await supabase.from("otp_verifications").delete().eq("email", normalizedEmail);

    return NextResponse.json({ verified: true });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
