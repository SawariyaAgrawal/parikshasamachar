"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoBadge } from "@/components/LogoBadge";
import { clearSession, getModerators, getProfiles, getSession } from "@/lib/storage";
import { Profile, SessionState } from "@/types";
import { Menu, X } from "lucide-react";

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const syncSession = () => {
      const currentSession = getSession();
      setSession(currentSession);
      if (currentSession?.role === "student") {
        const currentProfile = getProfiles().find((item) => item.id === currentSession.userId) ?? null;
        setProfile(currentProfile);
      } else {
        setProfile(null);
      }
      setHydrated(true);
    };

    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("focus", syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("focus", syncSession);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const initials = useMemo(() => {
    if (session?.role === "moderator") {
      const mods = getModerators();
      const mod = mods.find((m) => m.id === session.userId);
      return (mod?.name ?? session?.email ?? "M").trim().charAt(0).toUpperCase();
    }
    const source = profile?.fullName || session?.email || "U";
    return source.trim().charAt(0).toUpperCase();
  }, [profile?.fullName, session?.email, session?.role, session?.userId]);

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setProfile(null);
    setMobileOpen(false);
    router.push("/login");
  };

  const navLinks = (
    <>
      {hydrated && session ? (
        <>
          {session.role === "moderator" && (
            <Link
              href="/admin/community"
              className={`rounded-md px-2 py-1.5 text-sm font-medium ${
                pathname?.startsWith("/admin/community") ? "bg-[#1f275d]/10 text-[#1f275d]" : "text-[#1f275d] hover:bg-[#1f275d]/5"
              }`}
            >
              Community
            </Link>
          )}
          {session.role === "student" && session.examSlug && (
            <>
              <Link
                href={`/community/${session.examSlug}`}
                className={`rounded-md px-2 py-1.5 text-sm font-medium ${
                  pathname?.startsWith("/community") ? "bg-[#1f275d]/10 text-[#1f275d]" : "text-[#1f275d] hover:bg-[#1f275d]/5"
                }`}
              >
                Community
              </Link>
              <Link
                href={`/notifications/${session.examSlug}`}
                className={`rounded-md px-2 py-1.5 text-sm font-medium ${
                  pathname?.startsWith("/notifications") ? "bg-[#1f275d]/10 text-[#1f275d]" : "text-[#1f275d] hover:bg-[#1f275d]/5"
                }`}
              >
                Notifications
              </Link>
            </>
          )}
          {session.role !== "admin" && (
            <button
              type="button"
              onClick={() => router.push(session.role === "moderator" ? "/admin/community" : "/profile")}
              className="flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#1f275d]/40 bg-white font-semibold text-[#1f275d] md:min-h-0 md:min-w-0"
              aria-label={session.role === "moderator" ? "Go to community" : "Go to profile page"}
            >
              {initials}
            </button>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-[#1f275d] px-3 py-2 font-semibold !text-white hover:!text-white min-h-[44px] md:min-h-0"
          >
            Logout
          </button>
        </>
      ) : (
        hydrated && (
          <>
            {pathname !== "/login" && (
              <Link
                href="/login"
                className="rounded-md border border-[#1f275d] px-3 py-2 font-semibold text-[#1f275d] min-h-[44px] inline-flex items-center justify-center md:min-h-0"
              >
                Login
              </Link>
            )}
            {pathname !== "/signup" && (
              <Link
                href="/signup"
                className="rounded-md bg-[#1f275d] px-3 py-2 font-semibold !text-white hover:!text-white min-h-[44px] inline-flex items-center justify-center md:min-h-0"
              >
                Signup
              </Link>
            )}
          </>
        )
      )}
    </>
  );

  return (
    <header className="relative border-b-2 border-[#1f275d] px-4 py-3 md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0">
          <LogoBadge />
          <span className="text-base font-bold tracking-tight text-[#1f275d] md:text-2xl [font-family:'Playfair_Display',serif]">
            Pariksha Samachar
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="relative hidden items-center gap-3 text-sm md:flex">
          {navLinks}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-[#1f275d]/30 text-[#1f275d] md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-b-2 border-[#1f275d] bg-white shadow-lg md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {hydrated && session ? (
              <>
                {session.role === "moderator" && (
                  <Link
                    href="/admin/community"
                    className={`block rounded-md px-4 py-3 text-base font-medium min-h-[48px] flex items-center ${
                      pathname?.startsWith("/admin/community") ? "bg-[#1f275d]/10 text-[#1f275d]" : "text-[#1f275d] hover:bg-[#1f275d]/5"
                    }`}
                  >
                    Community
                  </Link>
                )}
                {session.role === "student" && session.examSlug && (
                  <>
                    <Link
                      href={`/community/${session.examSlug}`}
                      className={`block rounded-md px-4 py-3 text-base font-medium min-h-[48px] flex items-center ${
                        pathname?.startsWith("/community") ? "bg-[#1f275d]/10 text-[#1f275d]" : "text-[#1f275d] hover:bg-[#1f275d]/5"
                      }`}
                    >
                      Community
                    </Link>
                    <Link
                      href={`/notifications/${session.examSlug}`}
                      className={`block rounded-md px-4 py-3 text-base font-medium min-h-[48px] flex items-center ${
                        pathname?.startsWith("/notifications") ? "bg-[#1f275d]/10 text-[#1f275d]" : "text-[#1f275d] hover:bg-[#1f275d]/5"
                      }`}
                    >
                      Notifications
                    </Link>
                  </>
                )}
                {session.role !== "admin" && (
                  <button
                    type="button"
                    onClick={() => router.push(session.role === "moderator" ? "/admin/community" : "/profile")}
                    className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base font-medium text-[#1f275d] hover:bg-[#1f275d]/5 min-h-[48px]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1f275d]/40 bg-white font-semibold">
                      {initials}
                    </span>
                    Profile
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-md bg-[#1f275d] px-4 py-3 text-base font-semibold !text-white min-h-[48px] text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              hydrated && (
                <div className="flex flex-col gap-2">
                  {pathname !== "/login" && (
                    <Link
                      href="/login"
                      className="block rounded-md border border-[#1f275d] px-4 py-3 text-center font-semibold text-[#1f275d] min-h-[48px] flex items-center justify-center"
                    >
                      Login
                    </Link>
                  )}
                  {pathname !== "/signup" && (
                    <Link
                      href="/signup"
                      className="block rounded-md bg-[#1f275d] px-4 py-3 text-center font-semibold !text-white min-h-[48px] flex items-center justify-center"
                    >
                      Signup
                    </Link>
                  )}
                </div>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
