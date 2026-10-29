import { Link } from "@/lib/router-compat";
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Wallet,
  FolderOpen,
  Megaphone,
  Layers,
  BarChart3,
} from "lucide-react";
import { PublicShell, PageHero } from "@/components/PublicShell";
import { Button, Card } from "@/components/ui-kit";

const features = [
  { icon: Users, title: "Student Management", text: "Maintain student profiles, courses, batches and joining details." },
  { icon: GraduationCap, title: "Teacher Management", text: "Manage teachers and assign them to courses and batches." },
  { icon: CalendarCheck, title: "Attendance Management", text: "Mark attendance digitally and track attendance percentage." },
  { icon: Wallet, title: "Fee Management", text: "Track total fees, paid amount, pending fees and due dates." },
  { icon: FolderOpen, title: "Study Material", text: "Upload notes, PDFs and assignments for students." },
  { icon: Megaphone, title: "Announcements", text: "Share tests, holidays, class cancellations and important updates." },
  { icon: Layers, title: "Course & Batch Management", text: "Create courses, batches, timings and teacher assignments." },
  { icon: BarChart3, title: "Reports", text: "Get useful insights about students, attendance and fee status." },
];

export default function FeaturesPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Features"
        title="Everything Your Coaching Centre Needs"
        subtitle="Replace registers, Excel sheets and scattered WhatsApp messages with structured, role-based workflows."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} hover className="p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
                <feature.icon className="size-5" />
              </span>
              <h2 className="mt-5 text-[19px] font-bold tracking-tight">{feature.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{feature.text}</p>
            </Card>
          ))}
        </div>

        <div className="mt-14 flex flex-col justify-center gap-3 sm:flex-row">
          <Button as={Link} to="/register" size="lg">Get Started</Button>
          <Button as={Link} to="/roles" variant="secondary" size="lg">See role-based access</Button>
        </div>
      </section>
    </PublicShell>
  );
}
