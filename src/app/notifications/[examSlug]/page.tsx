"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { ensureSeedData, getNotifications, getSession } from "@/lib/storage";
import { NOTIFICATION_LANGUAGES } from "@/lib/constants";
import type { NotificationBody } from "@/types";

function getBodyText(body: NotificationBody, lang: string): string {
  if (typeof body === "string") return body;
  return body[lang] ?? body.en ?? body.hi ?? body.mr ?? Object.values(body)[0] ?? "";
}

function getTitleText(
  title: string | Record<string, string>,
  lang: string
): string {
  if (typeof title === "string") return title;
  return (
    title[lang] ?? title.en ?? title.hi ?? title.mr ?? Object.values(title)[0] ?? ""
  );
}

export default function NotificationsPage() {
  const params = useParams<{ examSlug: string }>();
  const router = useRouter();
  const examSlug = params.examSlug;
  const [lang, setLang] = useState("en");

  useEffect(() => {
    ensureSeedData();
    const session = getSession();
    if (!session || session.role !== "student") {
      router.replace("/login");
      return;
    }
    if (session.preferredLang) {
      setLang(session.preferredLang);
    }
  }, [router]);

  const notifications = useMemo(
    () => getNotifications().filter((item) => item.examSlug === examSlug),
    [examSlug]
  );

  return (
    <main className="min-h-screen newspaper-bg">
      <TopNav />
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-6 md:grid-cols-[260px_1fr] md:px-6 md:py-8">
        <Sidebar examSlug={examSlug} />
        <section className="space-y-4 order-1 md:order-2">
          <article className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-[#1f275d] [font-family:'Playfair_Display',serif]">
                  Previous Examination Notifications
                </h1>
                <p className="mt-1 text-sm text-neutral-600">
                  Official updates, admit cards, results, and documents for your exam.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="lang-select" className="text-sm font-medium text-neutral-700">
                  View in:
                </label>
                <select
                  id="lang-select"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="input w-auto"
                >
                  {NOTIFICATION_LANGUAGES.map(({ code, name }) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </article>
          {notifications.map((notification) => (
            <article key={notification.id} className="card overflow-hidden p-5">
              <h2 className="text-lg font-semibold text-[#1f275d]">
                {getTitleText(notification.title, lang)}
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#1f233a]">
                {getBodyText(notification.body, lang)}
              </p>
              {(notification.link || notification.documentUrl) && (
                <div className="mt-4 flex flex-wrap gap-3 border-t border-neutral-200 pt-4">
                  {notification.link && (
                    <a
                      href={notification.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-[#1f275d] px-3 py-1.5 text-sm font-semibold !text-white hover:bg-[#1f275d]/90"
                    >
                      Official link
                    </a>
                  )}
                  {notification.documentUrl && (
                    <a
                      href={notification.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-[#1f275d]/60 px-3 py-1.5 text-sm font-semibold text-[#1f275d] hover:bg-[#1f275d]/10"
                    >
                      Document
                    </a>
                  )}
                </div>
              )}
              <p className="mt-3 text-xs text-neutral-500">
                Published: {new Date(notification.createdAt).toLocaleString()}
              </p>
            </article>
          ))}
          {notifications.length === 0 && (
            <article className="card p-8 text-center text-sm text-neutral-600">
              No notifications yet for this exam. Check back later.
            </article>
          )}
        </section>
      </section>
    </main>
  );
}
