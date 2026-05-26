import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <RegisterForm />
      <p className="text-sm text-slate-300">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
          Log in here
        </Link>
      </p>
    </div>
  );
}