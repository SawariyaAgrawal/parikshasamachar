import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data: existing } = await supabase
      .from("admin_config")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("admin_config")
        .update({ email: email.trim().toLowerCase(), password_hash: passwordHash })
        .eq("id", existing.id);
      if (error) {
        console.error("Admin config update error:", error);
        const msg = error.message?.includes("Invalid API key")
          ? "Invalid Supabase API key. Check SUPABASE_SERVICE_ROLE_KEY in .env.local"
          : "Failed to update admin config";
        return NextResponse.json({ error: msg }, { status: 500 });
      }
    } else {
      const { error } = await supabase
        .from("admin_config")
        .insert({ email: email.trim().toLowerCase(), password_hash: passwordHash });
      if (error) {
        console.error("Admin config insert error:", error);
        const msg = error.message?.includes("Invalid API key")
          ? "Invalid Supabase API key. Check SUPABASE_SERVICE_ROLE_KEY in .env.local"
          : "Failed to save admin config";
        return NextResponse.json({ error: msg }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin config error:", err);
    return NextResponse.json({ error: "Failed to update admin config" }, { status: 500 });
  }
}
