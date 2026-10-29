import { Link } from "@/lib/router-compat";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  Smartphone,
  LayoutDashboard,
  Users,
  Workflow,
  Info,
  Mail,
  Grid3x3,
} from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { Button, Card, SectionHeading } from "@/components/ui-kit";

const pages = [
  { to: "/features", icon: Grid3x3, title: "Features", text: "All eight management modules explained in detail." },
  { to: "/how-it-works", icon: Workflow, title: "How It Works", text: "The three-role flow from admin setup to student access." },
  { to: "/roles", icon: Users, title: "Roles & Access", text: "What admins, teachers and students can each do." },
  { to: "/dashboard-preview", icon: LayoutDashboard, title: "Dashboard Preview", text: "See the light, clean dashboard your staff will use." },
  { to: "/about", icon: Info, title: "About", text: "Why EduCentre is built for local coaching centres." },
  { to: "/contact", icon: Mail, title: "Contact", text: "Talk to us about setting up your centre." },
];

export default function LandingPage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-72 max-w-3xl rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Smart Management for Local Coaching Centres
          </span>

          <h1 className="animate-fade-up mt-7 font-extrabold tracking-tight">
            <span className="block text-[38px] font-bold leading-[1.05] sm:text-[52px] lg:text-[64px]">
              Manage Your
            </span>
            <span className="mt-1 block text-[44px] font-extrabold leading-[1] text-primary sm:text-[64px] lg:text-[86px]">
              Coaching Centre
            </span>
            <span className="mt-1 block text-[38px] font-bold leading-[1.05] sm:text-[52px] lg:text-[64px]">
              Smarter.
            </span>
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-muted-foreground sm:text-[18px]">
            Manage students, teachers, batches, attendance, fees, study material and announcements
            from one simple platform.
          </p>

          <div className="animate-fade-up mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button as={Link} to="/register" size="lg">
              Get Started <ArrowRight className="size-4" />
            </Button>
            <Button as={Link} to="/features" variant="secondary" size="lg">
              Explore Features
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[13px] font-medium text-muted-foreground">
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Built for modern local coaching centres</span>
            <span className="flex items-center gap-2"><Clock className="size-4 text-primary" /> Set up in minutes</span>
            <span className="flex items-center gap-2"><Smartphone className="size-4 text-primary" /> Works on any device</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Explore"
          title="Browse EduCentre page by page"
          subtitle="Each part of the platform has its own dedicated page — pick where you want to start."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Link key={page.to} to={page.to} className="block">
              <Card hover className="h-full p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
                  <page.icon className="size-5" />
                </span>
                <h2 className="mt-5 flex items-center gap-2 text-[19px] font-bold tracking-tight">
                  {page.title} <ArrowRight className="size-4 text-primary" />
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{page.text}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
