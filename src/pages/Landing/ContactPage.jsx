import { Mail, MapPin, Phone } from "lucide-react";
import { PublicShell, PageHero } from "@/components/PublicShell";
import { Button, Card, Input } from "@/components/ui-kit";

const details = [
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: Mail, label: "Email", value: "hello@educentre.in" },
  { icon: MapPin, label: "Office", value: "Shop 12, Model Town, Indore" },
];

export default function ContactPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Contact"
        title="Talk to the EduCentre team"
        subtitle="Questions about setting up your centre, migrating registers or pricing? Send us a message."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="grid gap-4">
            {details.map((item) => (
              <Card key={item.label} className="flex items-start gap-3 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
                  <item.icon className="size-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-sm font-semibold">{item.value}</span>
                </span>
              </Card>
            ))}
          </div>

          <Card className="p-6 lg:col-span-2">
            <h2 className="text-[20px] font-bold tracking-tight">Send an enquiry</h2>
            <form
              className="mt-6 grid gap-4 sm:grid-cols-2"
              onSubmit={(event) => event.preventDefault()}
            >
              <Input label="Your name" placeholder="Rakesh Sharma" />
              <Input label="Centre name" placeholder="Bright Future Classes" />
              <Input label="Email" type="email" placeholder="you@example.com" />
              <Input label="Phone" placeholder="+91 98765 43210" />
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-[13px] font-semibold">Message</span>
                <textarea
                  rows={5}
                  placeholder="Tell us about your centre and what you need."
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
              </label>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg">Send message</Button>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </PublicShell>
  );
}
