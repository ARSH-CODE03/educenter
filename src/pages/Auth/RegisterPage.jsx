import { Link, useNavigate } from "@/lib/router-compat";
import { Mail, Lock, User, Building2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button, Card, Input, Select } from "@/components/ui-kit";
import { useAuth, roleHome } from "@/hooks/useAuth";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    centre: "",
    email: "",
    password: "",
    role: "teacher",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  function update(key) {
    return (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register({
        name: form.name,
        centreName: form.centre,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      navigate({ to: roleHome[user.role] || roleHome[form.role] });
    } catch (err) {
      setError(err.message || "Account creation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <Link to="/" className="mx-auto">
          <Logo />
        </Link>

        <Card className="mt-8 p-7 shadow-card">
          <h1 className="text-[28px] font-extrabold tracking-tight">Create your account</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Set up your coaching centre in a couple of minutes.
          </p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <Input id="name" label="Full name" icon={User} placeholder="Priya Malhotra" value={form.name} onChange={update("name")} required />
            <Input id="centre" label="Coaching centre name" icon={Building2} placeholder="Bright Future Classes" value={form.centre} onChange={update("centre")} required />
            <Input id="email" type="email" label="Email" icon={Mail} placeholder="you@educentre.in" value={form.email} onChange={update("email")} required />
            <Input id="password" type="password" label="Password" icon={Lock} placeholder="Minimum 8 characters" value={form.password} onChange={update("password")} minLength={8} required />
            <Select id="role" label="Account type" value={form.role} onChange={update("role")}>
        
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </Select>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"} <ArrowRight className="size-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-[13px] text-muted-foreground">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
