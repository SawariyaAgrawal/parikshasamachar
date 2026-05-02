"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { EXAMS, ENGINEERING_YEARS, NOTIFICATION_LANGUAGES } from "@/lib/constants";
import { getProfiles, getSession, setSession, updateProfile } from "@/lib/storage";
import { Profile } from "@/types";

type ProfileTab = "overview" | "edit";

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSessionState] = useState<ReturnType<typeof getSession>>(null);
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState<ProfileTab>("overview");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [examSlug, setExamSlug] = useState("");
  const [examYear, setExamYear] = useState("");
  const [engineeringYear, setEngineeringYear] = useState("");
  const [currentCoaching, setCurrentCoaching] = useState("");
  const [preferredLang, setPreferredLang] = useState("en");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const s = getSession();
    setSessionState(s);
    if (!s) {
      router.replace("/login");
      setHydrated(true);
      return;
    }
    if (s.role === "student") {
      const found = getProfiles().find((item) => item.id === s.userId) ?? null;
      setProfile(found);
      setExamSlug(found?.examSlug ?? "");
      setExamYear(found?.examYear ?? "");
      setEngineeringYear(found?.engineeringYear ?? "");
      setCurrentCoaching(found?.currentCoaching ?? "");
      setPreferredLang(found?.preferredLang ?? "en");
    }
    setHydrated(true);
  }, [router]);

  const examName = useMemo(
    () => EXAMS.find((exam) => exam.slug === profile?.examSlug)?.name ?? profile?.examSlug ?? "-",
    [profile?.examSlug]
  );
  const statusMessage =
    message ||
    (session?.role === "admin"
      ? "Admin account has no editable student profile."
      : session?.role === "student" && !profile
        ? "Profile not found."
        : "");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile || !session || !examSlug) return;

    const updated: Profile = {
      ...profile,
      fullName: profile.fullName,
      phone: profile.phone,
      city: profile.city,
      examSlug,
      examYear: examYear.trim(),
      engineeringYear: examSlug === "engineering-sppu" ? engineeringYear : "",
      currentCoaching: currentCoaching.trim(),
      preferredLang
    };
    updateProfile(updated);
    setProfile(updated);
    setSession({
      ...session,
      examSlug: updated.examSlug,
      preferredLang: updated.preferredLang
    });
    setMessage("Profile updated successfully. Database record synced.");
    setTab("overview");
  };

  if (!hydrated) {
    return (
      <main className="min-h-screen newspaper-bg">
        <TopNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen newspaper-bg">
      <TopNav />
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-6 md:grid-cols-[260px_1fr] md:px-6 md:py-8">
        <aside className="card h-fit p-4 order-2 md:order-1">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-600">Profile</h3>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setTab("overview")}
              className={`rounded-md px-3 py-2 text-left text-sm ${
                tab === "overview"
                  ? "bg-[#1f275d] !text-white"
                  : "border border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setTab("edit")}
              className={`rounded-md px-3 py-2 text-left text-sm ${
                tab === "edit"
                  ? "bg-[#1f275d] !text-white"
                  : "border border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              Edit Profile
            </button>
          </div>
          {profile?.examSlug && (
            <>
              <h3 className="mt-4 mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-600">
                Quick actions
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/community/${profile.examSlug}`}
                  className="rounded-md border border-[#1f275d]/40 px-3 py-2 text-left text-sm text-[#1f275d] hover:bg-[#1f275d]/10"
                >
                  Return to Community
                </Link>
                <Link
                  href={`/notifications/${profile.examSlug}`}
                  className="rounded-md border border-[#1f275d]/40 px-3 py-2 text-left text-sm text-[#1f275d] hover:bg-[#1f275d]/10"
                >
                  Previous Notifications
                </Link>
              </div>
            </>
          )}
        </aside>

        <section className="space-y-4 order-1 md:order-2">
          <article className="card p-4">
            <h1 className="text-2xl font-semibold">My Profile</h1>
            {statusMessage && <p className="mt-2 text-sm text-[#1f275d]">{statusMessage}</p>}
          </article>

          {tab === "overview" ? (
            <article className="card p-4">
              {profile ? (
                <div className="grid gap-2 text-sm text-[#1f233a]">
                  <p>
                    <strong>Name:</strong> {profile.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {profile.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {profile.phone}
                  </p>
                  <p>
                    <strong>City:</strong> {profile.city}
                  </p>
                  <p>
                    <strong>Exam:</strong> {examName}
                  </p>
                  <p>
                    <strong>Exam Year:</strong> {profile.examYear}
                  </p>
                  {profile.examSlug === "engineering-sppu" && profile.engineeringYear && (
                    <p>
                      <strong>Engineering Year:</strong>{" "}
                      {ENGINEERING_YEARS.find((y) => y.value === profile.engineeringYear)?.label ?? profile.engineeringYear}
                    </p>
                  )}
                  <p>
                    <strong>Preferred Language:</strong>{" "}
                    {NOTIFICATION_LANGUAGES.find((l) => l.code === profile.preferredLang)?.name ?? "English"}
                  </p>
                  <p>
                    <strong>Current Coaching:</strong> {profile.currentCoaching || "-"}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-neutral-600">No profile data available.</p>
              )}
            </article>
          ) : (
            <article className="card p-4">
              {profile ? (
                <form onSubmit={onSubmit} className="grid gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Full name (cannot be changed)
                    </label>
                    <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-600">
                      {profile.fullName}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Mobile number (cannot be changed)
                    </label>
                    <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-600">
                      {profile.phone}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      City (cannot be changed)
                    </label>
                    <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-600">
                      {profile.city}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      Exam
                    </label>
                    <select
                      className="input"
                      value={examSlug}
                      onChange={(event) => {
                        setExamSlug(event.target.value);
                        if (event.target.value !== "engineering-sppu") {
                          setEngineeringYear("");
                        }
                      }}
                      required
                    >
                      <option value="">Select exam</option>
                    {EXAMS.map((exam) => (
                      <option key={exam.slug} value={exam.slug}>
                        {exam.name}
                      </option>
                    ))}
                    </select>
                  </div>
                  {examSlug === "engineering-sppu" && (
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                        Current year of engineering
                      </label>
                      <select
                        className="input"
                        value={engineeringYear}
                        onChange={(event) => setEngineeringYear(event.target.value)}
                        required
                      >
                        <option value="">Select year</option>
                        {ENGINEERING_YEARS.map((y) => (
                          <option key={y.value} value={y.value}>
                            {y.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      Exam year
                    </label>
                    <input
                      className="input"
                      value={examYear}
                      onChange={(event) => setExamYear(event.target.value)}
                      placeholder="e.g. 2025"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      Preferred language
                    </label>
                    <select
                      className="input"
                      value={preferredLang}
                      onChange={(event) => setPreferredLang(event.target.value)}
                    >
                      {NOTIFICATION_LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      Current coaching (optional)
                    </label>
                    <input
                      className="input"
                      value={currentCoaching}
                      onChange={(event) => setCurrentCoaching(event.target.value)}
                      placeholder="Current coaching"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-md bg-[#1f275d] px-4 py-2 text-sm font-semibold text-white hover:text-white"
                  >
                    Save changes
                  </button>
                </form>
              ) : (
                <p className="text-sm text-neutral-600">No profile data available.</p>
              )}
            </article>
          )}
        </section>
      </section>
    </main>
  );
}
