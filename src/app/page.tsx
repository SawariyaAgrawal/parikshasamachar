import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TopNav } from "@/components/TopNav";

const formattedDate = "Tuesday, 24 February 2026";

export default function LandingPage() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen newspaper-bg text-[#1f233a]">
      <TopNav />

      <section className="mx-auto max-w-6xl px-4 pt-4 pb-2 text-center md:px-8 md:pt-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#66666d]">Vol. I • Issue 1 • Est. 2025</p>
        <h2
          className="my-2 text-3xl font-normal tracking-wide text-[#1f275d] sm:text-4xl md:text-7xl lg:text-8xl"
          style={{ fontFamily: "'Manufacturing Consent', system-ui" }}
        >
          Pariksha Samachar
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#66666d]">
          <span>{formattedDate}</span>
          <span>•</span>
          <span>India&apos;s Premier Exam Notification Platform</span>
          <span>•</span>
          <span>Free to Join</span>
        </div>
        <hr className="newspaper-rule mt-4" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <h1 className="text-center text-2xl font-black leading-tight text-[#1f275d] sm:text-3xl md:text-5xl [font-family:'Playfair_Display',serif]">
          Your One-Stop Destination for
          <br />
          <span className="text-[#c5a54b]">Exam Notifications</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-[#66666d] md:text-lg">
          Millions of aspirants trust Pariksha Samachar for timely, accurate updates on every exam —
          JEE, NEET, SAT (Undergraduate), SAT (Postgraduate) and more.
        </p>
        <hr className="newspaper-rule mt-6" />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <article className="newspaper-lined border-b border-[#1f275d]/10 p-4 md:border-b-0 md:border-r md:pr-6">
            <h3 className="mb-2 text-xl font-bold text-[#1f275d] md:text-2xl [font-family:'Playfair_Display',serif]">
              Never Miss a Notification Again
            </h3>
            <p className="mb-3 text-sm leading-relaxed text-[#1f233a]/85">
              In the chaotic landscape of government examinations, missing a single notification can set
              an aspirant back by an entire year. Pariksha Samachar aggregates every official notification
              from SSC, UPSC, IBPS, RRB, and State Public Service Commissions into one unified dashboard.
            </p>
            <p className="mb-3 text-sm leading-relaxed text-[#1f233a]/85">
              Our dedicated team monitors hundreds of official websites daily, ensuring every new vacancy,
              date change, admit card release, and result declaration reaches you within minutes.
            </p>
            <p className="text-sm leading-relaxed text-[#1f233a]/85">
              Whether it&apos;s the SSC CGL notification dropping at midnight or a UPSC calendar revision —
              <strong> we&apos;ve got you covered, 24/7.</strong>
            </p>
          </article>

          <article className="newspaper-lined border-b border-[#1f275d]/10 p-4 md:border-b-0 md:border-r md:px-6">
            <h3 className="mb-2 text-xl font-bold text-[#1f275d] md:text-2xl [font-family:'Playfair_Display',serif]">
              Join a Community of Aspirants
            </h3>
            <p className="mb-3 text-sm leading-relaxed text-[#1f233a]/85">
              Preparation is not a solitary journey. Pariksha Samachar connects you with thousands of
              fellow aspirants who share your goals, struggles, and determination.
            </p>
            <p className="mb-3 text-sm leading-relaxed text-[#1f233a]/85">
              Share strategies, discuss previous year questions, exchange study resources, and celebrate
              each other&apos;s progress in exam-specific communities.
            </p>
            <p className="text-sm font-semibold text-[#c5a54b]">
              &quot;The aspirant who studies alone finishes the race; the aspirant who studies together wins
              it.&quot;
            </p>
          </article>

          <article className="newspaper-lined p-4 md:pl-6">
            <h3 className="mb-2 text-xl font-bold text-[#1f275d] md:text-2xl [font-family:'Playfair_Display',serif]">
              How It Works
            </h3>
            <p className="mb-3 text-sm leading-relaxed text-[#1f233a]/85">
              Getting started with Pariksha Samachar is simple and takes less than a minute:
            </p>
            <ul className="mb-3 space-y-1.5 text-sm text-[#1f233a]/85">
              <li>
                <strong>Step 1</strong> — Create your free account
              </li>
              <li>
                <strong>Step 2</strong> — Select the exam you&apos;re preparing for
              </li>
              <li>
                <strong>Step 3</strong> — Get notifications delivered to your feed
              </li>
              <li>
                <strong>Step 4</strong> — Join exam-specific communities
              </li>
              <li>
                <strong>Step 5</strong> — Stay ahead of every deadline
              </li>
            </ul>
            <p className="text-sm leading-relaxed text-[#1f233a]/85">
              No clutter. No spam. <strong>Just the updates that matter to you.</strong>
            </p>
          </article>
        </div>

        <hr className="newspaper-rule my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2">
          <article className="newspaper-lined border-b border-[#1f275d]/10 p-4 md:border-b-0 md:border-r md:pr-6">
            <h3 className="mb-2 text-xl font-bold text-[#1f275d] [font-family:'Playfair_Display',serif]">
              What Our Users Say
            </h3>
            <p className="mb-2 text-sm leading-relaxed text-[#1f233a]/85">
              Aspirants across the country rely on Pariksha Samachar to keep their preparation on track.
            </p>
            <p className="text-sm italic text-[#66666d]">
              &quot;Having all exam updates in one place saves me hours every week.&quot; —
              <strong> A Pariksha Samachar User</strong>
            </p>
          </article>

          <article className="newspaper-lined p-4 md:pl-6">
            <h3 className="mb-2 text-xl font-bold text-[#1f275d] [font-family:'Playfair_Display',serif]">
              Coming Soon
            </h3>
            <p className="mb-2 text-sm leading-relaxed text-[#1f233a]/85">
              Upcoming features include personalized study planners, previous year paper archives, and
              mock test integrations.
            </p>
            <p className="text-sm leading-relaxed text-[#1f233a]/85">
              Stay tuned for more updates. <strong>The best is yet to come.</strong>
            </p>
          </article>
        </div>

        <hr className="newspaper-rule my-6" />

        <div className="py-6 text-center">
          <h3 className="mb-3 text-2xl font-bold text-[#1f275d] md:text-3xl [font-family:'Playfair_Display',serif]">
            Join Lakhs of Aspirants Today
          </h3>
          <p className="mx-auto mb-6 max-w-xl text-sm text-[#66666d]">
            Sign up for free and never miss another exam notification. Your preparation journey deserves a
            reliable companion.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto bg-[#1f275d] !text-white hover:bg-[#1f275d]/90 hover:!text-white min-h-[48px]">
              <Link href="/signup">Sign Up — It&apos;s Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto min-h-[48px]">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>

        <Separator className="bg-[#1f275d]/20" />
        <footer className="py-4 text-center text-xs text-[#66666d]">
          <p>
            © {year} Pariksha Samachar. All rights reserved. | India&apos;s most trusted exam notification
            platform.
          </p>
        </footer>
      </section>
    </main>
  );
}
