"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";


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
		<div className={`relative isolate overflow-hidden rounded-4xl border border-white/10 bg-slate-950/90 p-1 shadow-2xl shadow-black/30 ${className}`}>
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.92))]" />

			<div className="grid gap-0 overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-white backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
				<section className="relative flex flex-col justify-between gap-10 p-8 sm:p-10 lg:p-12">
					<div className="space-y-4">
						<span className="inline-flex w-fit items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-sky-200">
							Welcome back
						</span>

						<div className="space-y-3">
							<h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
								Sign in to your MetaCourt account.
							</h2>
							<p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
								Access your complaints, responses, and case updates from one secure place.
							</p>
						</div>
					</div>

					<div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
						<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
							<p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">Fast</p>
							<p className="mt-2 leading-6">Pick up right where your case activity left off.</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
							<p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">Secure</p>
							<p className="mt-2 leading-6">JWT-based authentication keeps your session protected.</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
							<p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">Focused</p>
							<p className="mt-2 leading-6">Built for every verified MetaCourt role.</p>
						</div>
					</div>
				</section>

				<section className="bg-white px-6 py-8 text-slate-900 sm:px-8 sm:py-10 lg:px-10">
					<form className="space-y-5" onSubmit={handleSubmit(submitLogin)}>
						<div className="space-y-1">
							<h3 className="text-2xl font-semibold tracking-tight text-slate-950">
								Log in
							</h3>
							<p className="text-sm text-slate-500">
								Use the email and password you registered with.
							</p>
						</div>

						<div className="space-y-4">
							<Input
								id="login-email"
								type="email"
								label="Email address"
								placeholder="you@example.com"
								{...register("email")}
								error={errors.email?.message}
								disabled={isSubmitting}
							/>

							<label className="block">
								<span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
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
										className="absolute inset-y-0 right-2 my-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
									>
										{showPassword ? "Hide" : "Show"}
									</button>
								</div>
							</label>
						</div>

						<Button type="submit" isLoading={isSubmitting} className="w-full">
							{isSubmitting ? "Signing in..." : "Sign in"}
						</Button>

						{errors.root?.message && (
							<p className="text-sm text-rose-600">{errors.root.message}</p>
						)}

						<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
							Keep your account secure and never share your password with anyone.
						</div>
					</form>
				</section>
			</div>
		</div>
	);
}
