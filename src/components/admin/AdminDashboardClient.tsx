"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { buildCSV, getExamPercentages } from "@/lib/analytics";
import { getProfiles, getNotifications, getSession } from "@/lib/storage";
import { isAdminSession } from "@/lib/auth";

const COLORS = ["#0f172a", "#374151", "#6b7280", "#9ca3af", "#d1d5db"];

export default function AdminDashboardClient() {
  const router = useRouter();
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const profiles = useMemo(() => getProfiles(), []);
  const chartData = useMemo(() => getExamPercentages(profiles), [profiles]);
  const activeChartData = useMemo(
    () => chartData.filter((item) => item.students > 0),
    [chartData]
  );

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role === "moderator") {
      router.replace("/admin/community");
    } else if (!isAdminSession(session)) {
      router.replace("/login");
    }
  }, [router]);

  const downloadCSV = () => {
    const csv = buildCSV(profiles);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "students_export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <TopNav />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-neutral-600">
              Exam preparation distribution and export-ready student data.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/settings"
              className="rounded-md border border-[#1f275d]/60 bg-white px-4 py-2 text-sm font-semibold text-[#1f275d] hover:bg-[#1f275d]/10"
            >
              Edit Admin
            </Link>
            <Link
              href="/admin/community"
              className="rounded-md border border-[#1f275d]/60 bg-white px-4 py-2 text-sm font-semibold text-[#1f275d] hover:bg-[#1f275d]/10"
            >
              Community
            </Link>
            <Link
              href="/admin/notifications"
              className="rounded-md border border-[#1f275d]/60 bg-white px-4 py-2 text-sm font-semibold text-[#1f275d] hover:bg-[#1f275d]/10"
            >
              Push notifications
            </Link>
            <button
              onClick={downloadCSV}
              className="rounded-md bg-[#1f275d] px-4 py-2 text-sm font-semibold !text-white hover:!text-white"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
          <article className="card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Students by Exam (%)</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setChartType("pie")}
                  className={`rounded-md px-3 py-1 text-xs ${
                    chartType === "pie"
                      ? "bg-[#1f275d] text-white"
                      : "border border-[#1f275d]/40 text-[#1f275d]"
                  }`}
                >
                  Pie
                </button>
                <button
                  type="button"
                  onClick={() => setChartType("bar")}
                  className={`rounded-md px-3 py-1 text-xs ${
                    chartType === "bar"
                      ? "bg-[#1f275d] text-white"
                      : "border border-[#1f275d]/40 text-[#1f275d]"
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>
            <div className="h-72 w-full">
              {chartType === "pie" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activeChartData.length > 0 ? activeChartData : chartData}
                      dataKey="percentage"
                      nameKey="examName"
                      innerRadius={55}
                      outerRadius={100}
                      paddingAngle={2}
                      labelLine={false}
                    >
                      {(activeChartData.length > 0 ? activeChartData : chartData).map((item, index) => (
                        <Cell key={item.examSlug} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="examSlug" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="percentage" fill="#1f275d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </article>

          <article className="card p-4">
            <h2 className="mb-3 text-lg font-semibold">Summary</h2>
            <p className="text-sm text-neutral-700">Total registered users: {profiles.length}</p>
            <p className="text-sm text-neutral-700">
              Student accounts: {profiles.filter((profile) => profile.role === "student").length}
            </p>
            <p className="mt-2 text-sm text-neutral-700">
              Notifications sent: {getNotifications().length}
            </p>
          </article>
        </div>

        <article className="card mt-4 overflow-x-auto p-4">
          <h2 className="mb-3 text-lg font-semibold">User Data Table</h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-300 text-left">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Phone</th>
                <th className="py-2">City</th>
                <th className="py-2">Exam</th>
                <th className="py-2">Exam Year</th>
                <th className="py-2">Current Coaching</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id} className="border-b border-neutral-200">
                  <td className="py-2">{profile.fullName}</td>
                  <td className="py-2">{profile.email}</td>
                  <td className="py-2">{profile.phone}</td>
                  <td className="py-2">{profile.city}</td>
                  <td className="py-2">{profile.examSlug}</td>
                  <td className="py-2">{profile.examYear ?? profile.targetYear ?? "-"}</td>
                  <td className="py-2">{profile.currentCoaching || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </main>
  );
}
