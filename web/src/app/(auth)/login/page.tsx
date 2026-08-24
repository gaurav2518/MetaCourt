import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
	return (
		<div className="flex flex-col items-center gap-6">
			<LoginForm />
			<p className="text-sm text-[var(--color-text-secondary)]">
				Don't have an account?{" "}
				<Link href="/register" className="font-semibold text-[var(--color-accent-primary)] transition hover:text-[var(--color-text-primary)]">
					Register here
				</Link>
			</p>
		</div>
	);
}
