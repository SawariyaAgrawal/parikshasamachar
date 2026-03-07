import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const info: Record<string, unknown> = {
    hasUrl: Boolean(url),
    urlPrefix: url ? url.slice(0, 30) + "..." : "NOT SET",
    hasKey: Boolean(key),
    keyLength: key?.length ?? 0,
    keyPrefix: key ? key.slice(0, 20) + "..." : "NOT SET"
  };

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ...info, dbStatus: "no client" });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .limit(1)
    .maybeSingle();

  info.dbStatus = error ? `error: ${error.message}` : "connected";
  return NextResponse.json(info);
}
