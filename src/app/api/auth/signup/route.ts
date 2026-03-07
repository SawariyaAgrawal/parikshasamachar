import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";
import { EXAMS } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      password,
      phone,
      city,
      examSlug,
      examYear,
      currentCoaching,
      preferredLang,
      otp
    } = body;

    if (!fullName || !email || !password || !phone || !city || !examSlug || !examYear) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, email, password, phone, city, examSlug, examYear" },
        { status: 400 }
      );
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      return NextResponse.json({ error: "Phone must be 10 digits" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    if (fullName.trim().length < 2) {
      return NextResponse.json({ error: "Full name must be at least 2 characters" }, { status: 400 });
    }
    if (city.trim().length < 2) {
      return NextResponse.json({ error: "City must be at least 2 characters" }, { status: 400 });
    }
    if (!/^[0-9]{4}$/.test(String(examYear).trim())) {
      return NextResponse.json({ error: "Exam year must be 4 digits" }, { status: 400 });
    }
    if (Number(examYear) < 2026) {
      return NextResponse.json({ error: "Exam year must be 2026 or later" }, { status: 400 });
    }
    if (!EXAMS.some((e) => e.slug === examSlug)) {
      return NextResponse.json({ error: "Invalid exam" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Server not configured for Supabase" }, { status: 503 });
    }

    if (process.env.BREVO_API_KEY) {
      if (!otp || !String(otp).trim()) {
        return NextResponse.json({ error: "Email verification OTP is required" }, { status: 400 });
      }
      const normalizedEmail = email.trim().toLowerCase();
      const { data: otpRow } = await supabase
        .from("otp_verifications")
        .select("id")
        .eq("email", normalizedEmail)
        .eq("otp", String(otp).trim())
        .gt("expires_at", new Date().toISOString())
        .limit(1)
        .maybeSingle();
      if (!otpRow) {
        return NextResponse.json({ error: "Invalid or expired OTP. Please request a new one." }, { status: 400 });
      }
      await supabase.from("otp_verifications").delete().eq("email", normalizedEmail);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password_hash: passwordHash,
        phone: phoneDigits,
        city: city.trim(),
        exam_slug: examSlug,
        exam_year: String(examYear).trim(),
        current_coaching: (currentCoaching || "").trim(),
        preferred_lang: preferredLang || "en",
        role: "student"
      })
      .select("id, full_name, email, phone, city, exam_slug, exam_year, current_coaching, preferred_lang, role, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }
      console.error("Signup error:", error);
      const msg = error.message?.includes("Invalid API key")
        ? "Server configuration error: invalid Supabase API key. Please contact admin."
        : "Signup failed. Please try again.";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const profile = {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      examSlug: data.exam_slug,
      examYear: data.exam_year,
      currentCoaching: data.current_coaching || "",
      preferredLang: data.preferred_lang || "en",
      role: data.role,
      createdAt: data.created_at
    };

    return NextResponse.json({
      session: {
        userId: data.id,
        email: data.email,
        role: "student",
        examSlug: data.exam_slug,
        preferredLang: data.preferred_lang || "en"
      },
      profile
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
