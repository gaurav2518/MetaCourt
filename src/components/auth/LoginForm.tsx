"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
    <section className={`w-full max-w-[420px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-10 ${className}`}>
      <div className="mb-8 flex items-center gap-3">
        <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)]">
          <Image src="/favicon_logo.png" alt="MetaCourt" fill sizes="44px" className="object-cover" />
        </div>
        <div>
          <p className="font-display text-xl font-bold">MetaCourt</p>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            Secure workspace
          </p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(submitLogin)}>
        <div>
          <h1 className="font-display text-3xl font-bold">Sign in</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Access your complaints, responses, jury cases, and blockchain proofs.
          </p>
        </div>

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
              className="absolute right-2 top-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {errors.root?.message && (
          <div className="rounded-lg bg-[rgba(239,68,68,0.15)] px-4 py-3 text-sm text-[var(--color-danger)]">
            {errors.root.message}
          </div>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>

        <div className="rounded-lg bg-[var(--color-bg-primary)] px-4 py-3 text-xs leading-5 text-[var(--color-text-muted)]">
          Keep your account secure and never share your MetaCourt password.
        </div>
      </form>
    </section>
  );
}
