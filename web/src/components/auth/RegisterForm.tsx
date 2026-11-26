"use client";

import { API_BASE_URL } from "@/config/api";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Eye, EyeOff, ShieldCheck } from "lucide-react";

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
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
    <section className={`w-full max-w-[440px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10 ${className}`}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-1">
            <Image src="/metacourt-logo.png" alt="MetaCourt" fill sizes="40px" className="object-contain" />
          </div>
          <div>
            <p className="font-display text-lg font-bold">MetaCourt</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              Protocol Registration
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Create New Account
        </h1>
        <p className="mt-1.5 text-xs text-[var(--color-text-secondary)]">
          File complaints, respond to disputes, and apply for juror access after verification.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(submitRegister)}>
        <Input
          id="register-name"
          label="Full name"
          placeholder="e.g. Satoshi Nakamoto"
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
              placeholder="Create a strong password (min 8 chars)"
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
          {isSubmitting ? "Creating account..." : "Complete Registration"}
        </Button>

        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/80 p-3 text-[11px] leading-5 text-[var(--color-text-muted)]">
          <span className="font-semibold text-[var(--color-text-secondary)]">Member Notice:</span> All accounts start with dispute filing permissions. Juror privileges are granted following admin identity and reputation review.
        </div>
      </form>
    </section>
  );
}
