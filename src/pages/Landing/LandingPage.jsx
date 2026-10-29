
import { Link } from "@/lib/router-compat";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Smartphone,
  LayoutDashboard,
  Users,
  Workflow,
  Info,
  Mail,
  Grid3x3,
  GraduationCap,
  CalendarCheck,
  CreditCard,
} from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { Button, Card, SectionHeading } from "@/components/ui-kit";

const pages = [
  {
    to: "/features",
    icon: Grid3x3,
    title: "Features",
    text: "All eight management modules explained in detail.",
  },
  {
    to: "/how-it-works",
    icon: Workflow,
    title: "How It Works",
    text: "The three-role flow from admin setup to student access.",
  },
  {
    to: "/roles",
    icon: Users,
    title: "Roles & Access",
    text: "What admins, teachers and students can each do.",
  },
  {
    to: "/dashboard-preview",
    icon: LayoutDashboard,
    title: "Dashboard Preview",
    text: "See the light, clean dashboard your staff will use.",
  },
  {
    to: "/about",
    icon: Info,
    title: "About",
    text: "Why EduCentre is built for local coaching centres.",
  },
  {
    to: "/contact",
    icon: Mail,
    title: "Contact",
    text: "Talk to us about setting up your centre.",
  },
];

const benefits = [
  {
    icon: Users,
    title: "Students",
    text: "Add and manage student records easily.",
  },
  {
    icon: GraduationCap,
    title: "Teachers",
    text: "Manage faculty, subjects and schedules.",
  },
  {
    icon: CalendarCheck,
    title: "Batches",
    text: "Organize classes and timings efficiently.",
  },
  {
    icon: CreditCard,
    title: "Attendance & Fees",
    text: "Track attendance, fees and payments.",
  },
];

export default function LandingPage() {
  return (
    <PublicShell>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-4 lg:px-10 lg:py-12">
          {/* LEFT: HERO CONTENT */}
          <div className="relative z-10 pb-4 lg:py-8">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary sm:text-sm">
              <span className="h-px w-7 bg-primary" />
              All-in-one platform for coaching centres
            </p>

            <h1 className="mt-6 text-[42px] font-bold leading-[1.12] tracking-tight text-foreground sm:text-[54px] lg:text-[66px]">
              Manage Your
              <span className="block text-primary">
                Coaching Centre
              </span>
              <span className="block">Smarter.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Keep students, teachers, batches, attendance, fees and study
              material in one simple platform. Spend less time managing
              records and more time helping students succeed.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button as={Link} to="/register" size="lg">
                Get Started
                <ArrowRight className="size-4" />
              </Button>

              <Button
                as={Link}
                to="/how-it-works"
                variant="secondary"
                size="lg"
              >
                How It Works
              </Button>
            </div>

            {/* SMALL TRUST POINTS */}
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-[13px] text-muted-foreground sm:text-sm">
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 shrink-0 text-primary" />
                Organized records
              </span>

              <span className="flex items-center gap-2">
                <Clock className="size-4 shrink-0 text-primary" />
                Simple management
              </span>

              <span className="flex items-center gap-2">
                <Smartphone className="size-4 shrink-0 text-primary" />
                Any device
              </span>
            </div>
          </div>

          {/* RIGHT: IMAGE BLENDS INTO THE PAGE */}
          <div className="relative min-w-0 self-stretch lg:-mr-10">
            <img
              src="/educentre-classroom-hero.png"
              alt="A teacher helping students study together in a classroom"
              className="block h-full min-h-[320px] w-full object-cover object-center sm:min-h-[420px] lg:min-h-[610px]"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
          <div className="mb-7 flex flex-col gap-3 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Everything in one place
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Your centre, better organized.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Practical tools for managing the everyday work of a coaching
              institute.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => (
              <Card
                key={item.title}
                hover
                className="h-full border-border bg-background p-5 transition-colors hover:border-primary/30 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </span>

                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* EXISTING PAGE LINKS — ROUTES PRESERVED */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          <SectionHeading
            eyebrow="Explore"
            title="Browse EduCentre page by page"
            subtitle="Each part of the platform has its own dedicated page — pick where you want to start."
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {pages.map((page) => (
              <Link key={page.to} to={page.to} className="block">
                <Card
                  hover
                  className="h-full border-border bg-background p-6"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
                    <page.icon className="size-5" />
                  </span>

                  <h2 className="mt-5 flex items-center gap-2 text-[19px] font-bold tracking-tight">
                    {page.title}
                    <ArrowRight className="size-4 text-primary" />
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {page.text}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
