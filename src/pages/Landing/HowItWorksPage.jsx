import { Link } from "@/lib/router-compat";
import { PublicShell, PageHero } from "@/components/PublicShell";
import { Button, Card } from "@/components/ui-kit";

const steps = [
  { no: "01", title: "Admin manages the centre", text: "Set up courses, batches, fees and staff, then keep everything in one register-free system." },
  { no: "02", title: "Teachers manage academics", text: "Mark attendance, upload notes and assignments, and post academic updates for their batches." },
  { no: "03", title: "Students access information", text: "Students check their batch, attendance, fee status, material and announcements anytime." },
];

export default function HowItWorksPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="How It Works"
        title="Three roles, one connected flow"
        subtitle="Each role sees only what matters to them — no clutter, no confusion."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="relative grid gap-6 lg:grid-cols-3">
          <div className="absolute left-0 right-0 top-[46px] hidden border-t border-dashed border-primary/30 lg:block" />
          {steps.map((step) => (
            <Card key={step.no} hover className="relative p-6">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary text-[15px] font-extrabold text-primary-foreground shadow-lift">
                {step.no}
              </span>
              <h2 className="mt-5 text-[20px] font-bold tracking-tight">{step.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{step.text}</p>
            </Card>
          ))}
        </div>

        <div className="mt-14 flex flex-col justify-center gap-3 sm:flex-row">
          <Button as={Link} to="/dashboard-preview" size="lg">See the dashboard</Button>
          <Button as={Link} to="/features" variant="secondary" size="lg">Explore features</Button>
        </div>
      </section>
    </PublicShell>
  );
}
