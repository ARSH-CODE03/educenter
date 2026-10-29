import { Link } from "@/lib/router-compat";
import { PublicShell, PageHero } from "@/components/PublicShell";
import { Button } from "@/components/ui-kit";
import { DashboardPreview } from "@/pages/Landing/DashboardPreview";

export default function DashboardPreviewPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Dashboard"
        title="A clean, light dashboard your staff will actually use"
        subtitle="Real numbers, quick actions and clear reports — no dark, noisy admin panels."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <DashboardPreview />
        <div className="mt-14 flex flex-col justify-center gap-3 sm:flex-row">
          <Button as={Link} to="/login" size="lg">Open the live demo</Button>
          <Button as={Link} to="/features" variant="secondary" size="lg">Explore features</Button>
        </div>
      </section>
    </PublicShell>
  );
}
