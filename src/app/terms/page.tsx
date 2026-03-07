"use client";

import Link from "next/link";
import { TopNav } from "@/components/TopNav";

export default function TermsPage() {
  return (
    <main className="min-h-screen newspaper-bg">
      <TopNav />
      <section className="mx-auto max-w-2xl px-4 py-6 sm:py-8 md:px-6 md:py-10">
        <article className="card space-y-6 p-4 sm:p-6 text-sm leading-relaxed">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#1f275d]">
              Terms and Conditions
            </h1>
            <p className="mt-2 text-neutral-600">
              <strong>Last Updated:</strong> February 2025
            </p>
          </div>

          <p>
            Welcome to <strong>ParikshaSamachar</strong> (&quot;Platform&quot;, &quot;Service&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
          </p>
          <p>
            These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the ParikshaSamachar website, applications, and related services. By accessing or using the Platform, creating an account, or interacting with any feature of the Service, you agree to be bound by these Terms.
          </p>
          <p>
            If you do not agree with these Terms, you must discontinue use of the Platform.
          </p>

          <hr className="border-[#1f275d]/20" />

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">1. About ParikshaSamachar</h2>
            <p className="mt-2">
              ParikshaSamachar is an educational information platform designed to help students track examination-related updates, participate in exam-focused communities, and manage personalized notification preferences.
            </p>
            <p className="mt-2">The Platform may include:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>User registration and profiles</li>
              <li>Exam selection dashboards</li>
              <li>Community discussion sections</li>
              <li>Sidebar access to previous notifications</li>
              <li>Educational announcements and updates</li>
            </ul>
            <p className="mt-2">
              ParikshaSamachar is an independent platform and is <strong>not affiliated with or endorsed by any government authority, examination body, or educational institution</strong> unless explicitly stated.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">2. Eligibility</h2>
            <p className="mt-2">To use the Platform, you must:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Be at least 13 years old.</li>
              <li>Provide accurate and complete information during registration.</li>
              <li>Use the Platform only for lawful purposes.</li>
            </ul>
            <p className="mt-2">We reserve the right to restrict access to users who violate these requirements.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">3. User Registration and Account</h2>
            <p className="mt-2">To access certain features, users must create an account by providing:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Name</li>
              <li>Mobile number</li>
              <li>Email address</li>
              <li>City and State location</li>
              <li>Selected examinations</li>
            </ul>
            <p className="mt-2">
              Verification may occur through One-Time Password (OTP) authentication.
            </p>
            <p className="mt-2">
              You are responsible for maintaining the confidentiality of your account credentials and all activities occurring under your account.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">4. Platform Features and Layout</h2>
            <p className="mt-2">
              The Platform provides personalized user dashboards and community spaces designed similarly to discussion forums.
            </p>
            <p className="mt-2">Features may include:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Exam-specific communities</li>
              <li>User profiles displaying selected exams and location</li>
              <li>Historical notification sidebar</li>
              <li>Posting, commenting, and reactions</li>
              <li>Profile viewing within community discussions</li>
            </ul>
            <p className="mt-2">We may modify or update features at any time to improve user experience.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">5. Community Conduct</h2>
            <p className="mt-2">Users agree not to:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Post false or misleading examination information</li>
              <li>Harass, threaten, or abuse other users</li>
              <li>Upload spam, advertisements, or malicious content</li>
              <li>Attempt unauthorized access to the Platform</li>
            </ul>
            <p className="mt-2">
              We reserve the right to moderate, remove, or restrict content or accounts that violate community guidelines.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">6. Information Accuracy Disclaimer</h2>
            <p className="mt-2">ParikshaSamachar aims to provide timely and useful information; however:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>We do not guarantee accuracy or completeness.</li>
              <li>Users must verify examination decisions through official sources.</li>
              <li>The Platform shall not be responsible for missed exams, scheduling errors, or decisions made solely based on Platform content.</li>
            </ul>
            <p className="mt-2">All services are provided for informational purposes only.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">7. Notifications and Communications</h2>
            <p className="mt-2">Users may choose to receive informational communications through email, SMS, or messaging platforms. Delivery timing depends on third-party providers and may vary. Notifications are supportive informational tools and do not replace official announcements.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">8. Data Collection, Usage, and Sharing</h2>
            <p className="mt-2">
              ParikshaSamachar collects and processes certain user information necessary to operate and improve the Platform. This information is used to provide and maintain platform functionality, personalize user experience, enable community participation, deliver communications, and improve performance and security.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">9. Third-Party Services</h2>
            <p className="mt-2">
              The Platform relies on third-party infrastructure for hosting, analytics, authentication, and communication. By using ParikshaSamachar, you acknowledge and permit the processing and sharing of necessary user information with trusted third-party service providers.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">10. Partnerships and Promotional Communications</h2>
            <p className="mt-2">
              ParikshaSamachar may collaborate with educational partners, advertisers, or commercial affiliates. Subject to applicable laws and user preferences, user information may be processed or shared for promotional communications, partnership programs, and educational opportunities. Users may manage communication preferences or opt out where such options are provided.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">11. Aggregated and Anonymized Data</h2>
            <p className="mt-2">
              We may use or share aggregated, statistical, or anonymized data that does not directly identify individual users for analytics, reporting, research, or service improvement purposes.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">12. User Content</h2>
            <p className="mt-2">
              Users retain ownership of content they post but grant ParikshaSamachar a non-exclusive, worldwide license to display, distribute, and present such content within the Platform. We may remove content that violates these Terms or applicable laws.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">13. Intellectual Property</h2>
            <p className="mt-2">
              All platform branding, design, software, and original content are owned by ParikshaSamachar and protected by intellectual property laws. Unauthorized copying, reproduction, or redistribution is prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">14. Account Suspension and Termination</h2>
            <p className="mt-2">
              We may suspend or terminate accounts that violate these Terms, disrupt platform operations, or misuse community features. Users may request account deletion through available settings.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">15. Limitation of Liability</h2>
            <p className="mt-2">To the maximum extent permitted by law, ParikshaSamachar shall not be liable for:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Academic or examination outcomes</li>
              <li>Missed deadlines or opportunities</li>
              <li>Third-party service failures</li>
              <li>Temporary service interruptions</li>
            </ul>
            <p className="mt-2">The Platform is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">16. Modifications to Terms</h2>
            <p className="mt-2">
              We may update these Terms periodically. Continued use of the Platform after updates constitutes acceptance of revised Terms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">17. Governing Law</h2>
            <p className="mt-2">
              These Terms shall be governed by the laws of India. Any disputes shall fall under the jurisdiction of competent courts within India.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#1f275d]">18. Contact Information</h2>
            <p className="mt-2">For questions regarding these Terms:</p>
            <p className="mt-2">
              <strong>Email:</strong> support@parikshasamachar.com
            </p>
          </div>

          <p className="border-t border-[#1f275d]/20 pt-6 font-medium">
            By using ParikshaSamachar, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
          </p>

          <Link
            href="/signup"
            className="mt-6 inline-block text-sm font-semibold text-[#1f275d] hover:underline"
          >
            ← Back to Signup
          </Link>
        </article>
      </section>
    </main>
  );
}
