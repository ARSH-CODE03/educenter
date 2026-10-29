
import { Link, useNavigate } from "@/lib/router-compat";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button, Card, Input } from "@/components/ui-kit";
import { useAuth, roleHome } from "@/hooks/useAuth";

export default function LoginPage() {
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
      // Backend verifies credentials and determines the user's role.
      const session = await login({ email, password });

      const destination = roleHome[session.role];

      if (!destination) {
        throw new Error("Your account does not have a valid role.");
      }

      navigate({ to: destination });
    } catch (err) {
      setError(err.message || "Invalid email or password.");
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
              autoComplete="username"
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
              autoComplete="current-password"
              required
            />

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <Link
                to="/forgot-password"
                className="text-[13px] font-semibold text-primary hover:underline"
              >
                Forgot Password?
              </Link>
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
            New student or teacher?{" "}
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
