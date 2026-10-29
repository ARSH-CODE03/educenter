import { Link } from "@/lib/router-compat";
import { Check } from "lucide-react";
import { PublicShell, PageHero } from "@/components/PublicShell";
import { Badge, Button, Card } from "@/components/ui-kit";

const roles = [
  {
    name: "Admin",
    tagline: "Complete control of the coaching centre",
    items: ["Manage students", "Manage teachers", "Manage courses & batches", "Manage fees", "View reports", "Publish announcements"],
    highlight: true,
  },
  {
    name: "Teacher",
    tagline: "Manage your academic activities",
    items: ["View assigned batches", "View students", "Mark attendance", "Upload study material", "Post academic updates"],
  },
  {
    name: "Student",
    tagline: "Everything you need in one place",
    items: ["View batch", "Check attendance", "Check fee status", "Access study material", "View announcements"],
  },
];

export default function RolesPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Role-based access"
        title="Made for admins, teachers and students"
        subtitle="Every user signs in to a dashboard designed for their daily work."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.name} hover className={role.highlight ? "border-primary/40 p-7 shadow-card" : "p-7"}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-extrabold tracking-tight">{role.name}</h2>
                {role.highlight ? <Badge variant="primary">Most used</Badge> : null}
              </div>
              <p className="mt-2 text-[15px] text-muted-foreground">{role.tagline}</p>
              <ul className="mt-6 space-y-3">
                {role.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px]">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-14 flex flex-col justify-center gap-3 sm:flex-row">
          <Button as={Link} to="/login" size="lg">Sign in to a demo role</Button>
          <Button as={Link} to="/how-it-works" variant="secondary" size="lg">How it works</Button>
        </div>
      </section>
    </PublicShell>
  );
}
