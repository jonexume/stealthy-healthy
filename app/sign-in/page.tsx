"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "../components/Logo";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Alert from "../components/ui/Alert";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    // Simulate auth delay (prototype — no real auth)
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push("/home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 max-w-md mx-auto px-6 py-10">
      <div className="flex flex-col items-center mb-8">
        <Link href="/" aria-label="Back to welcome">
          <Logo size={64} />
        </Link>
        <h1 className="mt-4 text-2xl font-black text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500 mt-1">Prototype — no real credentials required</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {error && (
          <Alert variant="error" className="mb-4">{error}</Alert>
        )}
        <Alert variant="info" className="mb-5">
          This is a prototype. Enter any email and password to continue.
        </Alert>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
            Sign in
          </Button>
        </form>
      </div>

      <div className="mt-6 flex flex-col gap-3 items-center">
        <p className="text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href="/sign-in" className="text-teal-600 font-semibold hover:underline">
            Create one
          </Link>
        </p>
        <Link href="/home" className="text-sm text-slate-500 hover:text-slate-700">
          Continue as guest →
        </Link>
      </div>
    </div>
  );
}
