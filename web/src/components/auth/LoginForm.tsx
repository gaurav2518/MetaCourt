"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  className?: string;
};

export default function LoginForm({ className = "" }: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitLogin = async (values: LoginFormValues) => {
    try {
      const signedInUser = await login(values);
      if (signedInUser.role === "admin") {
        router.push("/admin");
      } else if (signedInUser.role === "juror") {
        router.push("/juror");
      } else {
        router.push("/complainant");
      }
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  return (
    <section className={`w-full max-w-[440px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10 ${className}`}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-1">
            <Image src="/metacourt-logo.png" alt="MetaCourt" fill sizes="40px" className="object-contain" />
          </div>
          <div>
            <p className="font-display text-lg font-bold">MetaCourt</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              Secure Authentication
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Welcome Back
        </h1>
        <p className="mt-1.5 text-xs text-[var(--color-text-secondary)]">
          Sign in to access your complaints, jury cases, and blockchain verification proofs.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(submitLogin)}>
        <Input
          id="login-email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          {...register("email")}
          error={errors.email?.message}
          disabled={isSubmitting}
        />

        <div>
          <label className="mc-label block">Password</label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              error={errors.password?.message}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              disabled={isSubmitting}
              className="absolute right-2 top-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-1.5 text-xs text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-70"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {errors.root?.message && (
          <div className="rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.12)] px-4 py-3 text-xs text-[var(--color-danger)]">
            {errors.root.message}
          </div>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
          {isSubmitting ? "Authenticating..." : "Sign In to Workspace"}
        </Button>

        {/* Security Assurance */}
        <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-[var(--color-text-muted)]">
          <LockKeyhole className="h-3.5 w-3.5 text-[var(--color-gold)]" />
          <span>Encrypted Session • Zero-Knowledge Architecture</span>
        </div>
      </form>
    </section>
  );
}
