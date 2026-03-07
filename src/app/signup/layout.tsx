import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up Free",
  description: "Create your free Pariksha Samachar account. Get JEE, NEET, SAT exam notifications and join exam communities. Sign up in under a minute.",
  openGraph: {
    title: "Sign Up | Pariksha Samachar",
    description: "Create your free account for exam notifications. JEE, NEET, SAT updates."
  }
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
