"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";


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
		<div className={`relative isolate overflow-hidden rounded-4xl border border-white/10 bg-slate-950/90 p-1 shadow-2xl shadow-black/30 ${className}`}>
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.18),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.92))]" />

			<div className="grid gap-0 overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-white backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
				<section className="relative flex flex-col justify-between gap-10 p-8 sm:p-10 lg:p-12">
					<div className="space-y-4">
						<span className="inline-flex w-fit items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-cyan-200">
							Join MetaCourt
						</span>

						<div className="space-y-3">
							<h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
								Create your secure MetaCourt account.
							</h2>
							<p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
								Register to access the complaint workflow, receive case updates, and keep your activity tied to a verified account.
							</p>
						</div>
					</div>

					<div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
						<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
							<p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Secure</p>
							<p className="mt-2 leading-6">JWT-based login with protected workflows.</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
							<p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Fast</p>
							<p className="mt-2 leading-6">Begin filing or responding in just a few seconds.</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
							<p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Clear</p>
							<p className="mt-2 leading-6">Juror access stays admin-controlled by design.</p>
						</div>
					</div>
				</section>

				<section className="bg-white px-6 py-8 text-slate-900 sm:px-8 sm:py-10 lg:px-10">
					<form className="space-y-5" onSubmit={handleSubmit(submitRegister)}>
						<div className="space-y-1">
							<h3 className="text-2xl font-semibold tracking-tight text-slate-950">
								Register your account
							</h3>
							<p className="text-sm text-slate-500">
								Juror accounts are not available here. They require admin approval.
							</p>
						</div>

						<div className="space-y-4">
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
								<label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
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
										className="absolute inset-y-0 right-2 my-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
									>
										{showPassword ? "Hide" : "Show"}
									</button>
								</div>
								<p className="mt-2 text-xs text-slate-500">Use at least 8 characters for a safer login.</p>
							</div>
						</div>

						<Button type="submit" isLoading={isSubmitting} className="w-full">
							{isSubmitting ? "Creating account..." : "Create account"}
						</Button>

						{errors.root?.message && (
							<p className="text-sm text-rose-600">{errors.root.message}</p>
						)}

						<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
							By continuing, you agree that your account will be created with a standard user role. Juror elevation is admin-controlled.
						</div>
					</form>
				</section>
			</div>
		</div>
	);
}
