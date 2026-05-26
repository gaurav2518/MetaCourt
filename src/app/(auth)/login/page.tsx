import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
	return (
		<div className="flex flex-col items-center gap-6">
			<LoginForm />
			<p className="text-sm text-slate-300">
				Don't have an account?{" "}
				<Link href="/register" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
					Register here
				</Link>
			</p>
		</div>
	);
}
