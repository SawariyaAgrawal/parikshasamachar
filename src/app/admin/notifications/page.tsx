"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import { EXAMS, NOTIFICATION_LANGUAGES } from "@/lib/constants";
import {
  deleteNotification,
  getNotifications,
  getProfiles,
  getSession,
  saveNotification
} from "@/lib/storage";
import { isAdminSession, isModeratorSession } from "@/lib/auth";
import { PreviousExamNotification } from "@/types";

const INITIAL_LANG: Record<string, string> = { en: "", hi: "", mr: "" };

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [examSlug, setExamSlug] = useState("");
  const [titleByLang, setTitleByLang] = useState<Record<string, string>>({ ...INITIAL_LANG });
  const [bodyByLang, setBodyByLang] = useState<Record<string, string>>({ ...INITIAL_LANG });
  const [activeLang, setActiveLang] = useState("en");
  const [link, setLink] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [notifications, setNotifications] = useState<PreviousExamNotification[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (isModeratorSession(session)) {
      router.replace("/admin/community");
      return;
    }
    if (!isAdminSession(session)) {
      router.replace("/login");
      return;
    }
    const timer = setTimeout(() => setNotifications(getNotifications()), 0);
    return () => clearTimeout(timer);
  }, [router]);

  const sortedByExam = useMemo(() => {
    const byExam = notifications.reduce<Record<string, PreviousExamNotification[]>>((acc, n) => {
      if (!acc[n.examSlug]) acc[n.examSlug] = [];
      acc[n.examSlug].push(n);
      return acc;
    }, {});
    return EXAMS.map((exam) => ({
      exam,
      items: (byExam[exam.slug] ?? []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    })).filter((g) => g.items.length > 0);
  }, [notifications]);

  const recipientCount = useMemo(() => {
    if (!examSlug) return 0;
    return getProfiles().filter((p) => p.role === "student" && p.examSlug === examSlug).length;
  }, [examSlug]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = Object.fromEntries(
      Object.entries(bodyByLang).filter(([, v]) => v.trim())
    );
    const title = Object.fromEntries(
      Object.entries(titleByLang).filter(([, v]) => v.trim())
    );
    if (Object.keys(body).length === 0) return;

    const notification: PreviousExamNotification = {
      id: crypto.randomUUID(),
      examSlug,
      title:
        Object.keys(title).length === 0
          ? ""
          : Object.keys(title).length === 1
            ? title[Object.keys(title)[0]!]
            : title,
      body: Object.keys(body).length === 1 ? body[Object.keys(body)[0]!] : body,
      link: link.trim() || undefined,
      documentUrl: documentUrl.trim() || undefined,
      createdAt: new Date().toISOString()
    };
    saveNotification(notification);
    setNotifications(getNotifications());
    setTitleByLang({ ...INITIAL_LANG });
    setBodyByLang({ ...INITIAL_LANG });
    setLink("");
    setDocumentUrl("");
    setShowForm(false);
    setSuccessMsg("Notification sent successfully.");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this notification?")) {
      deleteNotification(id);
      setNotifications(getNotifications());
    }
  };

  return (
    <main className="min-h-screen newspaper-bg">
      <TopNav />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <nav className="mb-4 flex items-center gap-2 text-sm text-neutral-600">
          <Link href="/admin" className="hover:text-[#1f275d]">
            Admin
          </Link>
          <span>/</span>
          <span className="font-medium text-[#1f275d]">Notifications</span>
        </nav>
        {successMsg && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
            {successMsg}
          </div>
        )}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Push Notifications</h1>
            <p className="text-sm text-neutral-600">
              Create and manage exam notifications. Only students with the selected exam will see
              them.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin"
              className="rounded-md border border-[#1f275d]/40 px-4 py-2 text-sm font-semibold text-[#1f275d]"
            >
              Back to Dashboard
            </Link>
            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              className="rounded-md bg-[#1f275d] px-4 py-2 text-sm font-semibold !text-white hover:!text-white"
            >
              {showForm ? "Cancel" : "Create notification"}
            </button>
          </div>
        </div>

        {showForm && (
          <article className="card mb-6 p-6">
            <h2 className="mb-4 text-lg font-semibold">New notification</h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold">Target exam</label>
                <select
                  className="input"
                  value={examSlug}
                  onChange={(e) => setExamSlug(e.target.value)}
                  required
                >
                  <option value="">Select exam</option>
                  {EXAMS.map((exam) => (
                    <option key={exam.slug} value={exam.slug}>
                      {exam.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-neutral-500">
                  Recipients: {recipientCount} student(s) preparing for this exam
                </p>
              </div>
              <div className="mb-2">
                <label className="mb-2 block text-sm font-semibold">Language</label>
                <div className="flex gap-2">
                  {NOTIFICATION_LANGUAGES.map(({ code, name }) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setActiveLang(code)}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                        activeLang === code
                          ? "bg-[#1f275d] text-white"
                          : "border border-[#1f275d]/40 text-[#1f275d]"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Switch tabs to add title and message in each language. Link and document are shared.
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Title</label>
                <input
                  className="input"
                  value={titleByLang[activeLang] ?? ""}
                  onChange={(e) =>
                    setTitleByLang((prev) => ({ ...prev, [activeLang]: e.target.value }))
                  }
                  placeholder={`Title in ${NOTIFICATION_LANGUAGES.find((l) => l.code === activeLang)?.name ?? activeLang}...`}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Message</label>
                <textarea
                  className="input min-h-24"
                  value={bodyByLang[activeLang] ?? ""}
                  onChange={(e) =>
                    setBodyByLang((prev) => ({ ...prev, [activeLang]: e.target.value }))
                  }
                  placeholder={`Message in ${NOTIFICATION_LANGUAGES.find((l) => l.code === activeLang)?.name ?? activeLang}...`}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Original link (optional)</label>
                <input
                  className="input"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">Document URL (optional)</label>
                <input
                  className="input"
                  type="url"
                  value={documentUrl}
                  onChange={(e) => setDocumentUrl(e.target.value)}
                  placeholder="https://... (PDF, form link, etc.)"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-[#1f275d] px-4 py-2 text-sm font-semibold !text-white hover:!text-white"
              >
                Push notification
              </button>
            </form>
          </article>
        )}

        <article className="card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">All notifications (by exam)</h2>
            <button
              type="button"
              onClick={() => setNotifications(getNotifications())}
              className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50"
            >
              Refresh
            </button>
          </div>
          {sortedByExam.length === 0 ? (
            <p className="text-sm text-neutral-600">No notifications sent yet.</p>
          ) : (
            <div className="space-y-6">
              {sortedByExam.map(({ exam, items }) => (
                <div key={exam.slug}>
                  <h3 className="mb-2 border-b border-neutral-200 pb-2 text-base font-semibold">
                    {exam.name}
                  </h3>
                  <div className="space-y-3">
                    {items.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-md border border-neutral-200 p-3 text-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold">
                              {typeof n.title === "string"
                                ? n.title
                                : (n.title.en ?? n.title.hi ?? n.title.mr ?? Object.values(n.title)[0] ?? "")}
                            </p>
                            <p className="mt-1 text-neutral-600">
                              {typeof n.body === "string"
                                ? n.body
                                : (n.body.en ?? n.body.hi ?? n.body.mr ?? Object.values(n.body)[0] ?? "")}
                            </p>
                            {(n.link || n.documentUrl) && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {n.link && (
                                  <a
                                    href={n.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#1f275d] underline"
                                  >
                                    Link
                                  </a>
                                )}
                                {n.documentUrl && (
                                  <a
                                    href={n.documentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#1f275d] underline"
                                  >
                                    Document
                                  </a>
                                )}
                              </div>
                            )}
                            <p className="mt-2 text-xs text-neutral-500">
                              {new Date(n.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDelete(n.id)}
                            className="shrink-0 rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
