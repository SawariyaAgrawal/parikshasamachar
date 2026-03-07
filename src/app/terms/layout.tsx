import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Pariksha Samachar Terms and Conditions. Read our terms of service, privacy policy, and user guidelines.",
  robots: { index: true, follow: true }
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
