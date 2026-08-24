import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <RegisterForm />
      <p className="text-sm text-[var(--color-text-secondary)]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--color-accent-primary)] transition hover:text-[var(--color-text-primary)]">
          Log in here
        </Link>
      </p>
    </div>
  );
}
