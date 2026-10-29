import { useNavigate } from "@/lib/router-compat";
import { LogOut } from "lucide-react";
import { Button, Card, Input, PageHeader } from "@/components/ui-kit";
import { roleLabel } from "@/data/navigation";
import { useAuth } from "@/hooks/useAuth";
import { initials } from "@/utils/format";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <>
      <PageHeader title="Profile" subtitle="Your account details and preferences" />

      <Card className="p-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 sm:flex sm:items-center sm:gap-5">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary text-xl font-extrabold text-primary-foreground">
            {initials(user.name)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[22px] font-extrabold tracking-tight">{user.name}</span>
            <span className="block truncate text-sm text-muted-foreground">
              {user.title} · {roleLabel[user.role]}
            </span>
          </span>
        </div>

        <form className="mt-7 grid gap-4 sm:grid-cols-2">
          <Input id="p-name" label="Full name" defaultValue={user.name} />
          <Input id="p-email" label="Email" type="email" defaultValue={user.email} />
          <Input id="p-phone" label="Contact number" defaultValue="+91 98765 43210" />
          <Input id="p-role" label="Role" defaultValue={roleLabel[user.role]} readOnly />
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button">Save changes</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              logout();
              navigate({ to: "/login", replace: true });
            }}
          >
            <LogOut className="size-4" /> Logout
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-[17px] font-bold tracking-tight">Security</h3>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Passwords are hashed with bcrypt and sessions are issued as JWT tokens by the backend.
        </p>
        <form className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input id="p-current" type="password" label="Current password" placeholder="••••••••" />
          <Input id="p-new" type="password" label="New password" placeholder="••••••••" />
        </form>
        <Button type="button" variant="secondary" className="mt-5">
          Update password
        </Button>
      </Card>
    </>
  );
}
