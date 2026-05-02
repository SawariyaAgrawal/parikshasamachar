import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";

const FALLBACK_ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@pariksha.local";
const FALLBACK_ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "Admin@12345";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Server not configured for Supabase" }, { status: 503 });
    }

    // Check admin (Supabase first, then env fallback)
    const { data: adminRow } = await supabase
      .from("admin_config")
      .select("email, password_hash")
      .limit(1)
      .maybeSingle();

    if (adminRow && adminRow.email?.toLowerCase() === email.toLowerCase()) {
      const valid = await bcrypt.compare(password, adminRow.password_hash);
      if (valid) {
        return NextResponse.json({
          session: { userId: "admin", email: adminRow.email, role: "admin" }
        });
      }
    }

    // Env fallback for admin
    if (
      email.toLowerCase() === FALLBACK_ADMIN_EMAIL.toLowerCase() &&
      password === FALLBACK_ADMIN_PASSWORD
    ) {
      return NextResponse.json({
        session: { userId: "admin", email, role: "admin" }
      });
    }

    // Check moderator
    const { data: mod } = await supabase
      .from("moderators")
      .select("id, email, password_hash")
      .ilike("email", email)
      .maybeSingle();

    if (mod && (await bcrypt.compare(password, mod.password_hash))) {
      return NextResponse.json({
        session: { userId: mod.id, email: mod.email, role: "moderator" }
      });
    }

    // Check student
    const { data: profileRow } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, city, exam_slug, exam_year, engineering_year, current_coaching, preferred_lang, role, created_at, password_hash")
      .ilike("email", email)
      .maybeSingle();

    if (profileRow && (await bcrypt.compare(password, profileRow.password_hash))) {
      const profile = {
        id: profileRow.id,
        fullName: profileRow.full_name,
        email: profileRow.email,
        phone: profileRow.phone,
        city: profileRow.city,
        examSlug: profileRow.exam_slug,
        examYear: profileRow.exam_year,
        engineeringYear: profileRow.engineering_year || "",
        currentCoaching: profileRow.current_coaching || "",
        preferredLang: profileRow.preferred_lang || "en",
        role: profileRow.role,
        createdAt: profileRow.created_at
      };
      return NextResponse.json({
        session: {
          userId: profileRow.id,
          email: profileRow.email,
          role: "student",
          examSlug: profileRow.exam_slug,
          preferredLang: profileRow.preferred_lang || "en"
        },
        profile
      });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
