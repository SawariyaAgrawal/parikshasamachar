"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import {
  deleteModerator,
  getAdminConfig,
  getModerators,
  saveAdminConfig,
  saveModerator
} from "@/lib/storage";
import type { Moderator } from "@/lib/storage";
import { isAdminSession, isModeratorSession } from "@/lib/auth";
import { getSession } from "@/lib/storage";
import { Trash2 } from "lucide-react";

const DEFAULT_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "admin@pariksha.local";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [modName, setModName] = useState("");
  const [modEmail, setModEmail] = useState("");
  const [modPassword, setModPassword] = useState("");

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
    const timer = setTimeout(() => {
      const config = getAdminConfig();
      if (config) {
        setName(config.name);
        setEmail(config.email);
        setPassword(config.password);
      } else {
        setEmail(DEFAULT_EMAIL);
      }
      setModerators(getModerators());
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage("All fields are required.");
      return;
    }

    const useSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    if (useSupabase) {
      try {
        const res = await fetch("/api/admin/config", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password.trim()
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage(data.error ?? "Failed to update admin config.");
          return;
        }
      } catch {
        setMessage("Failed to update admin config. Please try again.");
        return;
      }
    }

    saveAdminConfig({ name: name.trim(), email: email.trim(), password: password.trim() });
    setMessage("Admin settings saved. Use the new login id and password to sign in.");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleAddModerator = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modName.trim() || !modEmail.trim() || !modPassword.trim()) {
      setMessage("Moderator name, email, and password are required.");
      return;
    }
    if (modPassword.length < 6) {
      setMessage("Moderator password must be at least 6 characters.");
      return;
    }

    const useSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    if (useSupabase) {
      try {
        const res = await fetch("/api/admin/moderators", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: modName.trim(),
            email: modEmail.trim(),
            password: modPassword
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage(data.error ?? "Failed to add moderator.");
          return;
        }
        const mod: Moderator = {
          id: data.moderator.id,
          name: data.moderator.name,
          email: data.moderator.email,
          password: modPassword,
          createdAt: data.moderator.createdAt
        };
        saveModerator(mod);
      } catch {
        setMessage("Failed to add moderator. Please try again.");
        return;
      }
    } else {
      const existing = getModerators();
      if (existing.some((m) => m.email.toLowerCase() === modEmail.trim().toLowerCase())) {
        setMessage("A moderator with this email already exists.");
        return;
      }
      const mod: Moderator = {
        id: crypto.randomUUID(),
        name: modName.trim(),
        email: modEmail.trim().toLowerCase(),
        password: modPassword,
        createdAt: new Date().toISOString()
      };
      saveModerator(mod);
    }

    setModerators(getModerators());
    setModName("");
    setModEmail("");
    setModPassword("");
    setMessage("Community moderator added. They can now login with their email and password.");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleDeleteModerator = async (id: string) => {
    if (!confirm("Remove this moderator? They will no longer be able to access the community.")) return;

    const useSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    if (useSupabase) {
      try {
        await fetch("/api/admin/moderators", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });
      } catch {
        // continue with local delete
      }
    }

    deleteModerator(id);
    setModerators(getModerators());
  };

  return (
    <main className="min-h-screen newspaper-bg">
      <TopNav />
      <section className="mx-auto max-w-xl px-6 py-8">
        <nav className="mb-4 flex items-center gap-2 text-sm text-neutral-600">
          <Link href="/admin" className="hover:text-[#1f275d]">
            Admin
          </Link>
          <span>/</span>
          <span className="font-medium text-[#1f275d]">Settings</span>
        </nav>
        <div className="card p-6">
          <h1 className="text-2xl font-semibold text-[#1f275d]">Edit Admin Account</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Update name, login ID, and password.
          </p>
          {message && (
            <p className={`mt-3 rounded-md px-3 py-2 text-sm ${
              message.toLowerCase().includes("fail") || message.toLowerCase().includes("invalid") || message.toLowerCase().includes("required") || message.toLowerCase().includes("error") || message.toLowerCase().includes("already exists")
                ? "bg-red-50 text-red-800"
                : "bg-green-50 text-green-800"
            }`}>
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">Name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin name"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Login ID</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
              />
              <p className="mt-1 text-xs text-neutral-500">Minimum 6 characters</p>
            </div>
            <button
              type="submit"
              className="rounded-md bg-[#1f275d] px-4 py-2 text-sm font-semibold text-white"
            >
              Save changes
            </button>
          </form>
        </div>
        <hr className="my-8 border-[#1f275d]/20" />

        <div className="card p-6">
          <h2 className="text-xl font-semibold text-[#1f275d]">Community Moderators</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Moderators can manage community chat (pin, delete, restrict users) but cannot push notifications or access admin data.
          </p>
          <form onSubmit={handleAddModerator} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <input
              className="input"
              value={modName}
              onChange={(e) => setModName(e.target.value)}
              placeholder="Name"
              required
            />
            <input
              className="input"
              type="email"
              value={modEmail}
              onChange={(e) => setModEmail(e.target.value)}
              placeholder="Login ID (email)"
              required
            />
            <input
              className="input"
              type="password"
              value={modPassword}
              onChange={(e) => setModPassword(e.target.value)}
              placeholder="Password (min 6)"
              required
              minLength={6}
            />
            <button
              type="submit"
              className="rounded-md bg-[#1f275d] px-4 py-2 text-sm font-semibold text-white"
            >
              Add moderator
            </button>
          </form>
          <ul className="mt-4 space-y-2">
            {moderators.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
              >
                <span>
                  <strong>{m.name}</strong> — {m.email}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteModerator(m.id)}
                  className="rounded p-1 text-red-600 hover:bg-red-50"
                  title="Remove moderator"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
            {moderators.length === 0 && (
              <li className="py-4 text-center text-sm text-neutral-500">No moderators yet. Add one above.</li>
            )}
          </ul>
        </div>

        <Link
          href="/admin"
          className="mt-4 inline-block text-sm font-medium text-[#1f275d] hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </section>
    </main>
  );
}
