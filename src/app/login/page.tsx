"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { validateAdminLogin, validateModeratorLogin } from "@/lib/auth";
import {
  findModeratorByCredentials,
  findProfileByCredentials,
  setSession,
  updateProfile
} from "@/lib/storage";
import type { Profile } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const useSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

    if (useSupabase) {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Invalid credentials. Please signup first or retry.");
          return;
        }
        setSession(data.session);
        if (data.profile) {
          const p: Profile = {
            id: data.profile.id,
            fullName: data.profile.fullName,
            email: data.profile.email,
            password: "",
            phone: data.profile.phone,
            city: data.profile.city,
            examSlug: data.profile.examSlug,
            examYear: data.profile.examYear,
            currentCoaching: data.profile.currentCoaching || "",
            preferredLang: data.profile.preferredLang || "en",
            role: "student",
            createdAt: data.profile.createdAt
          };
          updateProfile(p);
        }
        if (data.session.role === "admin") router.push("/admin");
        else if (data.session.role === "moderator") router.push("/admin/community");
        else router.push(`/notifications/${data.session.examSlug}`);
      } catch {
        setError("Login failed. Please try again.");
      }
      return;
    }

    if (validateAdminLogin(email, password)) {
      setSession({ userId: "admin", email, role: "admin" });
      router.push("/admin");
      return;
    }

    const moderator = findModeratorByCredentials(email, password);
    if (moderator) {
      setSession({ userId: moderator.id, email: moderator.email, role: "moderator" });
      router.push("/admin/community");
      return;
    }

    const profile = findProfileByCredentials(email, password);
    if (!profile) {
      setError("Invalid credentials. Please signup first or retry.");
      return;
    }

    setSession({
      userId: profile.id,
      email: profile.email,
      role: "student",
      examSlug: profile.examSlug,
      preferredLang: profile.preferredLang || "en"
    });
    router.push(`/notifications/${profile.examSlug}`);
  };

  return (
    <main className="min-h-screen newspaper-bg">
      <TopNav />
      <section className="mx-auto max-w-xl px-4 py-6 sm:py-8 md:px-8 md:py-10">
        <div className="rounded-sm border border-[#1f275d]/20 bg-[#f0ede6] p-4 sm:p-6 md:p-8">
          <h1 className="mb-1 text-2xl sm:text-4xl font-bold text-[#1f275d] [font-family:'Playfair_Display',serif]">
            Login
          </h1>
          <p className="mb-6 text-sm text-[#c5a54b]">
            Admin and moderator credentials go to community. Students go to notifications first.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              className="input"
              placeholder="Email (mandatory)"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <input
              className="input"
              placeholder="Password (mandatory)"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button type="submit" className="w-full rounded-md bg-[#1f275d] px-4 py-2 text-sm text-white">
              Continue
            </button>
          </form>
          <p className="mt-4 text-sm text-[#66666d]">
            New student?{" "}
            <Link href="/signup" className="font-semibold text-[#1f275d] underline">
              Create account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
