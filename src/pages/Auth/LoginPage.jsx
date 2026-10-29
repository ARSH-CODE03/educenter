import { Link, useNavigate } from "@/lib/router-compat";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button, Card, Input } from "@/components/ui-kit";
import { useAuth, roleHome } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const roles = [
  { key: "admin", label: "Admin" },
  { key: "teacher", label: "Teacher" },
  { key: "student", label: "Student" },
];

export default function LoginPage() {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const session = await login({ email, password, role });
      navigate({ to: roleHome[session.role] || roleHome[role] });
    } catch (err) {
      setError(err.message || "Login failed");
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
          <h1 className="text-[28px] font-extrabold tracking-tight">
            Welcome Back
          </h1>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to continue to your dashboard.
          </p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <Input
              id="email"
              type="email"
              label="Email"
              icon={Mail}
              placeholder="you@educentre.in"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="off"
              required
            />

            <Input
              id="password"
              type="password"
              label="Password"
              icon={Lock}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
            />

            <div>
              <span className="mb-1.5 block text-[13px] font-medium">
                Sign in as
              </span>

              <div className="grid grid-cols-3 gap-2 rounded-xl bg-secondary p-1">
                {roles.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setRole(item.key)}
                    className={cn(
                      "rounded-lg py-2 text-[13px] font-semibold transition-colors",
                      role === item.key
                        ? "bg-surface text-primary shadow-soft"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <input
                  type="checkbox"
                  className="size-4 rounded border-input accent-primary"
                />
                Remember me
              </label>

              <a
                href="#reset"
                className="text-[13px] font-semibold text-primary hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In"}
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-[13px] text-muted-foreground">
            New centre?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}