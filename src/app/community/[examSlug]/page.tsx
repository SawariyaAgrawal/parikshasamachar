"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import CommunityChat from "@/components/community/CommunityChat";
import { TopNav } from "@/components/TopNav";
import { EXAMS } from "@/lib/constants";
import { ensureSeedData, getSession, getProfiles } from "@/lib/storage";

export default function CommunityPage() {
  const router = useRouter();
  const params = useParams<{ examSlug: string }>();
  const examSlug = params.examSlug;

  useEffect(() => {
    ensureSeedData();
    const session = getSession();
    if (!session || session.role !== "student") {
      router.replace("/login");
      return;
    }
    if (session.examSlug && session.examSlug !== examSlug) {
      router.replace(`/community/${session.examSlug}`);
    }
  }, [examSlug, router]);

  const exam = EXAMS.find((item) => item.slug === examSlug);

  const authorName = useMemo(() => {
    const session = getSession();
    if (!session?.userId) return "Student";
    const profile = getProfiles().find((p) => p.id === session.userId);
    return profile?.fullName?.trim() || session.email?.split("@")[0] || "Student";
  }, []);

  if (!exam) {
    return (
      <main>
        <TopNav />
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="card p-6">
            <h1 className="text-2xl font-semibold">Exam community not found</h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex h-[100dvh] h-screen max-h-[100dvh] flex-col overflow-hidden">
      <TopNav />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <CommunityChat
          examSlug={examSlug}
          examName={exam.name}
          authorName={authorName}
          currentUserId={getSession()?.userId}
          fullScreen
        />
      </div>
    </main>
  );
}
