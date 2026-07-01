"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

type RegisterFormProps = {
  className?: string;
};

export default function RegisterForm({ className = "" }: RegisterFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const submitRegister = async (values: RegisterFormValues) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Registration failed");
      }

      router.push("/complainant");
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Registration failed",
      });
    }
  };

  return (
    <section className={`w-full max-w-[420px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-10 ${className}`}>
      <div className="mb-8 flex items-center gap-3">
        <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)]">
          <Image src="/metacourt-logo.png" alt="MetaCourt" fill sizes="44px" className="object-contain" />
        </div>
        <div>
          <p className="font-display text-xl font-bold">MetaCourt</p>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            New account
          </p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(submitRegister)}>
        <div>
          <h1 className="font-display text-3xl font-bold">Create account</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            File complaints, respond to disputes, and apply for juror access after verification.
          </p>
        </div>

        <Input
          id="register-name"
          label="Full name"
          placeholder="Enter your full name"
          {...register("name")}
          error={errors.name?.message}
          disabled={isSubmitting}
        />

        <Input
          id="register-email"
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
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
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
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Use at least 8 characters for a safer login.
          </p>
        </div>

        {errors.root?.message && (
          <div className="rounded-lg bg-[rgba(239,68,68,0.15)] px-4 py-3 text-sm text-[var(--color-danger)]">
            {errors.root.message}
          </div>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>

        <div className="rounded-lg bg-[var(--color-bg-primary)] px-4 py-3 text-xs leading-5 text-[var(--color-text-muted)]">
          Accounts start as standard users. Juror access remains admin verified.
        </div>
      </form>
    </section>
  );
}
