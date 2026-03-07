import logo from "@/assets/logo.png";
import "@fontsource/manufacturing-consent/400.css";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const today = new Date();
const formattedDate = "Tuesday, 24 February 2026";

const Index = () => {
  return (
    <div className="min-h-screen newspaper-bg">
      {/* Header Bar */}
      <header className="border-b-2 border-primary px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Pariksha Samachar Logo"
              className="h-12 w-12 rounded-full object-cover"
            />
            <h1
              className="text-xl font-bold tracking-tight text-primary md:text-2xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Pariksha Samachar
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
              Login
            </Button>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Masthead */}
      <div className="mx-auto max-w-6xl px-4 pt-6 text-center md:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Vol. I &bull; Issue 1 &bull; Est. 2025
        </p>
        <h2
          className="my-2 text-5xl font-black tracking-wide text-primary md:text-7xl lg:text-8xl"
          style={{ fontFamily: "'Manufacturing Consent', system-ui", fontWeight: 400 }}
        >
          Pariksha Samachar
        </h2>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>{formattedDate}</span>
          <span>&bull;</span>
          <span>India's Premier Exam Notification Platform</span>
          <span>&bull;</span>
          <span>Free to Join</span>
        </div>
        <hr className="newspaper-rule mt-4" />
      </div>

      {/* Main Headline */}
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <h1
          className="text-center text-3xl font-black leading-tight text-primary md:text-5xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Your One-Stop Destination for
          <br />
          <span className="text-accent">Exam Notifications</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-muted-foreground md:text-lg" style={{ fontFamily: "'Lora', serif" }}>
          Millions of aspirants trust Pariksha Samachar for timely, accurate updates on every exam — JEE, NEET, SAT, UPSC and more.
        </p>
        <hr className="newspaper-rule mt-6" />
      </div>

      {/* Newspaper Columns */}
      <div className="mx-auto max-w-6xl px-4 pb-8 md:px-8">
      <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
          {/* Column 1 */}
          <article className="newspaper-lined border-b border-primary/10 p-4 md:border-b-0 md:border-r md:pr-6">
            <h3
              className="mb-2 text-xl font-bold text-primary md:text-2xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Never Miss a Notification Again
            </h3>
            <p className="mb-3 text-sm leading-relaxed text-foreground/80">
              In the chaotic landscape of government examinations, missing a single notification can set an aspirant back by an entire year. Pariksha Samachar aggregates every official notification from SSC, UPSC, IBPS, RRB, and State Public Service Commissions into one unified dashboard.
            </p>
            <p className="mb-3 text-sm leading-relaxed text-foreground/80">
              Our dedicated team monitors hundreds of official websites daily, ensuring that every new vacancy, date change, admit card release, and result declaration reaches you within minutes of publication.
            </p>
            <p className="text-sm leading-relaxed text-foreground/80">
              Whether it's the SSC CGL notification dropping at midnight or a surprise UPSC calendar revision — <strong>we've got you covered, 24/7.</strong>
            </p>
          </article>

          {/* Column 2 */}
          <article className="newspaper-lined border-b border-primary/10 p-4 md:border-b-0 md:border-r md:px-6">
            <h3
              className="mb-2 text-xl font-bold text-primary md:text-2xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Join a Community of Aspirants
            </h3>
            <p className="mb-3 text-sm leading-relaxed text-foreground/80">
              Preparation is not a solitary journey. Pariksha Samachar connects you with thousands of fellow aspirants who share your goals, struggles, and determination. Our communities are organized by examination — find your tribe.
            </p>
            <p className="mb-3 text-sm leading-relaxed text-foreground/80">
              Share strategies, discuss previous year questions, exchange study material recommendations, and celebrate each other's successes. From UPSC prelims strategy threads to Banking PO interview tips — the collective wisdom of lakhs of aspirants is at your fingertips.
            </p>
            <p className="text-sm font-semibold text-accent">
              "The aspirant who studies alone finishes the race; the aspirant who studies together wins it."
            </p>
          </article>

          {/* Column 3 */}
          <article className="newspaper-lined p-4 md:pl-6">
            <h3
              className="mb-2 text-xl font-bold text-primary md:text-2xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              How It Works
            </h3>
            <p className="mb-3 text-sm leading-relaxed text-foreground/80">
              Getting started with Pariksha Samachar is simple and takes less than a minute:
            </p>
            <ul className="mb-3 space-y-1.5 text-sm text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span><strong>Step 1</strong> — Create your free account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span><strong>Step 2</strong> — Select the exams you're preparing for</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span><strong>Step 3</strong> — Get notifications delivered to your feed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span><strong>Step 4</strong> — Join exam-specific communities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span><strong>Step 5</strong> — Stay ahead of every deadline</span>
              </li>
            </ul>
            <p className="text-sm leading-relaxed text-foreground/80">
              No clutter. No spam. <strong>Just the updates that matter to you.</strong>
            </p>
          </article>
        </div>

        <hr className="newspaper-rule my-6" />

        {/* Second Row */}
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
          <article className="newspaper-lined border-b border-primary/10 p-4 md:border-b-0 md:border-r md:pr-6">
            <h3
              className="mb-2 text-xl font-bold text-primary"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              What Our Users Say
            </h3>
            <p className="mb-2 text-sm leading-relaxed text-foreground/80">
              Aspirants across the country rely on Pariksha Samachar to keep their preparation on track. From first-time exam takers to seasoned candidates, our platform serves everyone equally.
            </p>
            <p className="text-sm italic text-muted-foreground">
              "Having all exam updates in one place saves me hours every week. I can focus on studying instead of hunting for notifications." — <strong>A Pariksha Samachar User</strong>
            </p>
          </article>

          <article className="newspaper-lined p-4 md:pl-6">
            <h3
              className="mb-2 text-xl font-bold text-primary"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Coming Soon
            </h3>
            <p className="mb-2 text-sm leading-relaxed text-foreground/80">
              We're constantly working to improve Pariksha Samachar. Upcoming features include personalized study planners, previous year paper archives, and mock test integrations.
            </p>
            <p className="text-sm leading-relaxed text-foreground/80">
              Stay tuned for more updates. <strong>The best is yet to come.</strong>
            </p>
          </article>
        </div>

        <hr className="newspaper-rule my-6" />

        {/* CTA Section */}
        <div className="py-6 text-center">
          <h3
            className="mb-3 text-2xl font-bold text-primary md:text-3xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Join Lakhs of Aspirants Today
          </h3>
          <p className="mx-auto mb-6 max-w-xl text-sm text-muted-foreground">
            Sign up for free and never miss another exam notification. Your preparation journey deserves a reliable companion.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base px-8"
            >
              Sign Up — It's Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold text-base px-8"
            >
              Login
            </Button>
          </div>
        </div>

        <Separator className="bg-primary/20" />

        {/* Footer */}
        <footer className="py-4 text-center text-xs text-muted-foreground">
          <p>© {today.getFullYear()} Pariksha Samachar. All rights reserved. | India's most trusted exam notification platform.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
