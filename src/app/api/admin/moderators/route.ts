import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
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

    const { data: existing } = await supabase
      .from("moderators")
      .select("id")
      .ilike("email", email.trim())
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "A moderator with this email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("moderators")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password_hash: passwordHash
      })
      .select("id, name, email, created_at")
      .single();

    if (error) {
      console.error("Moderator insert error:", error);
      const msg = error.message?.includes("Invalid API key")
        ? "Invalid Supabase API key. Check SUPABASE_SERVICE_ROLE_KEY in .env.local"
        : "Failed to add moderator";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({
      moderator: { id: data.id, name: data.name, email: data.email, createdAt: data.created_at }
    });
  } catch (err) {
    console.error("Moderator create error:", err);
    return NextResponse.json({ error: "Failed to add moderator" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Moderator ID required" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
    }

    const { error } = await supabase.from("moderators").delete().eq("id", id);
    if (error) {
      console.error("Moderator delete error:", error);
      return NextResponse.json({ error: "Failed to remove moderator" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Moderator delete error:", err);
    return NextResponse.json({ error: "Failed to remove moderator" }, { status: 500 });
  }
}
