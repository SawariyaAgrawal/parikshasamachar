import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to Pariksha Samachar. Access your exam notifications, community, and profile. Students and admins sign in here.",
  openGraph: {
    title: "Login | Pariksha Samachar",
    description: "Sign in to access exam notifications and communities."
  }
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
