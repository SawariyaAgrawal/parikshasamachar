"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import CommunityChat from "@/components/community/CommunityChat";
import { EXAMS } from "@/lib/constants";
import { getAdminConfig, getModerators, getSession } from "@/lib/storage";
import { isAdminSession, isModeratorSession } from "@/lib/auth";

export default function AdminCommunityPage() {
  const router = useRouter();
  const [examSlug, setExamSlug] = useState("");

  useEffect(() => {
    const session = getSession();
    if (!session || (!isAdminSession(session) && !isModeratorSession(session))) {
      router.replace("/login");
      return;
    }
  }, [router]);

  const exam = useMemo(() => EXAMS.find((e) => e.slug === examSlug), [examSlug]);

  const displayName = useMemo(() => {
    const session = getSession();
    if (!session) return "Admin";
    if (isModeratorSession(session)) {
      const mods = getModerators();
      const mod = mods.find((m) => m.id === session.userId);
      return mod?.name ?? session.email?.split("@")[0] ?? "Moderator";
    }
    const config = getAdminConfig();
    if (config && config.email?.toLowerCase() === session.email?.toLowerCase()) {
      return (config.name?.trim() || session.email?.split("@")[0]) ?? "Admin";
    }
    return session.email?.split("@")[0] ?? "Admin";
  }, []);

  return (
    <main className="min-h-screen newspaper-bg">
      <TopNav />
      <section className="mx-auto max-w-5xl px-6 py-8">
        <nav className="mb-4 flex items-center gap-2 text-sm text-neutral-600">
          {isAdminSession(getSession()) ? (
            <>
              <Link href="/admin" className="hover:text-[#1f275d]">
                Admin
              </Link>
              <span>/</span>
            </>
          ) : null}
          <span className="font-medium text-[#1f275d]">Community</span>
        </nav>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1f275d]">View Community</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Select an exam community to view and participate.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="exam-select" className="text-sm font-medium text-neutral-700">
              Community:
            </label>
            <select
              id="exam-select"
              value={examSlug}
              onChange={(e) => setExamSlug(e.target.value)}
              className="input w-full max-w-[220px]"
            >
              <option value="">Select community</option>
              {EXAMS.map((exam) => (
                <option key={exam.slug} value={exam.slug}>
                  {exam.name}
                </option>
              ))}
            </select>
            {isAdminSession(getSession()) && (
              <Link
                href="/admin"
                className="rounded-md border border-[#1f275d]/40 px-4 py-2 text-sm font-semibold text-[#1f275d]"
              >
                Back to Dashboard
              </Link>
            )}
          </div>
        </div>

        {exam && (
          <CommunityChat
            examSlug={exam.slug}
            examName={exam.name}
            authorName={`${displayName} (Admin)`}
            currentUserId={getSession()?.userId ?? "admin"}
            isAdmin
            backHref={isAdminSession(getSession()) ? "/admin" : undefined}
          />
        )}
      </section>
    </main>
  );
}
