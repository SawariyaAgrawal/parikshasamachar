"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { EXAMS, ENGINEERING_YEARS, NOTIFICATION_LANGUAGES } from "@/lib/constants";
import { saveProfile, setSession } from "@/lib/storage";
import { Profile } from "@/types";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [examSlug, setExamSlug] = useState("");
  const [examYear, setExamYear] = useState("");
  const [engineeringYear, setEngineeringYear] = useState("");
  const [currentCoaching, setCurrentCoaching] = useState("");
  const [preferredLang, setPreferredLang] = useState("en");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);

  useEffect(() => {
    fetch("/api/auth/otp-required")
      .then((r) => r.json())
      .then((data) => setOtpRequired(Boolean(data?.required)))
      .catch(() => setOtpRequired(false));
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("You must accept the Terms and Conditions to sign up.");
      return;
    }
    if (!examSlug) {
      setError("Please select an exam.");
      return;
    }
    if (examSlug === "engineering-sppu" && !engineeringYear) {
      setError("Please select your current year of engineering.");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10 || !/^\d{10}$/.test(phoneDigits)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (fullName.trim().length < 2) {
      setError("Full name must be at least 2 characters.");
      return;
    }
    if (city.trim().length < 2) {
      setError("City must be at least 2 characters.");
      return;
    }
    if (!/^[0-9]{4}$/.test(examYear.trim())) {
      setError("Exam year must be exactly 4 digits.");
      return;
    }
    if (Number(examYear.trim()) < 2026) {
      setError("Exam year must be 2026 or later.");
      return;
    }
    if (otpRequired && !otp.trim()) {
      setError("Please verify your email with the OTP sent to your inbox.");
      return;
    }

    const useSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

    if (useSupabase) {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            password,
            phone: phoneDigits,
            city: city.trim(),
            examSlug,
            examYear: examYear.trim(),
            engineeringYear: examSlug === "engineering-sppu" ? engineeringYear : "",
            currentCoaching: currentCoaching.trim(),
            preferredLang,
            ...(otpRequired && { otp: otp.trim() })
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Signup failed. Please try again.");
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
            engineeringYear: data.profile.engineeringYear || "",
            currentCoaching: data.profile.currentCoaching || "",
            preferredLang: data.profile.preferredLang || "en",
            role: "student",
            createdAt: data.profile.createdAt
          };
          saveProfile(p);
        }
        router.push(`/community/${examSlug}`);
      } catch {
        setError("Signup failed. Please try again.");
      }
      return;
    }

    const profile: Profile = {
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phoneDigits,
      city: city.trim(),
      examSlug,
      examYear: examYear.trim(),
      engineeringYear: examSlug === "engineering-sppu" ? engineeringYear : "",
      currentCoaching: currentCoaching.trim(),
      preferredLang,
      role: "student",
      createdAt: new Date().toISOString()
    };
    saveProfile(profile);

    setSession({
      userId: profile.id,
      email: profile.email,
      role: profile.role,
      examSlug: profile.examSlug,
      preferredLang: profile.preferredLang
    });

    router.push(`/community/${examSlug}`);
  };

  return (
    <main className="min-h-screen newspaper-bg">
      <TopNav />

      <section className="mx-auto max-w-xl px-4 py-6 sm:py-8 md:px-8 md:py-10">
        <div className="rounded-sm border border-[#1f275d]/20 bg-[#f0ede6] p-4 sm:p-6 md:p-8">
          <h1 className="mb-1 text-2xl sm:text-4xl font-bold text-[#1f275d] [font-family:'Playfair_Display',serif]">
            Signup
          </h1>
          <p className="mb-6 text-sm text-[#c5a54b]">
            Fill all mandatory placeholders. Your selected exam decides your next page.
          </p>

          <form onSubmit={onSubmit} className="grid gap-3">
            <input
              className="input"
              placeholder="Full name (mandatory)"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              minLength={2}
              required
            />
            <input
              className="input"
              placeholder="Email (mandatory)"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setOtpSent(false);
                setOtp("");
              }}
              required
            />
            {otpRequired && (
              <div className="space-y-2 rounded-md border border-[#1f275d]/20 bg-white/50 p-3">
                <label className="text-sm font-semibold text-[#1f275d]">
                  Verify your email
                </label>
                <div className="flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!email.trim()) {
                        setError("Enter your email first.");
                        return;
                      }
                      setError("");
                      setSendingOtp(true);
                      try {
                        const res = await fetch("/api/auth/send-otp", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: email.trim().toLowerCase() })
                        });
                        const data = await res.json();
                        if (!res.ok) {
                          setError(data.error ?? "Failed to send OTP.");
                          return;
                        }
                        setOtpSent(true);
                        if (data.devOtp) {
                          setOtp(data.devOtp);
                          setError("");
                        }
                      } finally {
                        setSendingOtp(false);
                      }
                    }}
                    disabled={sendingOtp}
                    className="shrink-0 rounded-md border border-[#1f275d]/40 px-4 py-2 text-sm font-semibold text-[#1f275d] hover:bg-[#1f275d]/5 disabled:opacity-50"
                  >
                    {sendingOtp ? "Sending…" : otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </div>
                {otpSent && (
                  <p className="text-xs text-green-700">OTP sent! Check your inbox.</p>
                )}
              </div>
            )}
            <input
              className="input"
              placeholder="Password (mandatory)"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
            <input
              className="input"
              placeholder="Phone number (mandatory)"
              value={phone}
              onChange={(event) => {
                const v = event.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(v);
              }}
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]{10}"
              required
            />
            <input
              className="input"
              placeholder="City (mandatory)"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              minLength={2}
              required
            />

            <label className="text-sm font-semibold">
              Exam you are preparing for (mandatory)
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
            {examSlug === "engineering-sppu" && (
              <>
                <label className="text-sm font-semibold">
                  Current year of engineering (mandatory)
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
              </>
            )}
            <input
              className="input"
              placeholder={examSlug === "engineering-sppu" ? "Year of passing (mandatory)" : "Year of appearing exam (mandatory)"}
              value={examYear}
              onChange={(event) => setExamYear(event.target.value)}
              minLength={4}
              maxLength={4}
              pattern="[0-9]{4}"
              required
            />
            <label className="text-sm font-semibold">
              Preferred language for communication (mandatory)
            </label>
            <select
              className="input"
              value={preferredLang}
              onChange={(event) => setPreferredLang(event.target.value)}
              required
            >
              {NOTIFICATION_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
            <input
              className="input"
              placeholder="Current coaching"
              value={currentCoaching}
              onChange={(event) => setCurrentCoaching(event.target.value)}
            />
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <span className="text-sm">
                I accept the{" "}
                <Link href="/terms" target="_blank" className="font-semibold text-[#1f275d] underline">
                  Terms and Conditions
                </Link>{" "}
                of Pariksha Samachar (mandatory)
              </span>
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="rounded-md bg-[#1f275d] px-4 py-2 text-sm font-semibold !text-white hover:!text-white">
              Create account
            </button>
          </form>
          <p className="mt-4 text-sm text-[#66666d]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#1f275d] underline">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
