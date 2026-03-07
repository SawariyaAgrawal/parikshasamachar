import { NextResponse } from "next/server";

export async function GET() {
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const hasBrevo = Boolean(process.env.BREVO_API_KEY);
  const required = hasSupabase && hasBrevo;
  return NextResponse.json({ required });
}
