import { Link } from "@/lib/router-compat";
import { PublicShell, PageHero } from "@/components/PublicShell";
import { Button, Card } from "@/components/ui-kit";

const stats = [
  { value: "248+", label: "Students managed" },
  { value: "12", label: "Active batches" },
  { value: "94%", label: "Avg. attendance" },
];

export default function AboutPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="About EduCentre"
        title="Built around how Indian coaching centres actually work"
        subtitle="Most local centres still track fees in notebooks and attendance in registers. EduCentre keeps the same familiar workflow but makes it searchable, shareable and reportable."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-[26px] font-extrabold tracking-tight sm:text-[32px]">
              One organised platform for your whole centre
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              EduCentre was designed with small and mid-sized tuition centres in mind. Admins keep
              control of fees, batches and staff, teachers handle attendance and study material, and
              students always know what is happening — without a single WhatsApp forward.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-2xl font-extrabold tracking-tight">{stat.value}</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-primary p-8 text-primary-foreground shadow-lift">
            <h2 className="text-[26px] font-extrabold leading-tight sm:text-[32px]">
              Ready to organise your centre?
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-primary-foreground/85">
              Create your centre account and invite teachers and students in a few minutes. Try the
              demo dashboards for each role right away.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/register" variant="secondary" size="lg" className="border-transparent">
                Get Started
              </Button>
              <Button
                as={Link}
                to="/contact"
                variant="ghost"
                size="lg"
                className="border border-primary-foreground/35 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Talk to us
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </PublicShell>
  );
}
