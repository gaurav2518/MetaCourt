"use client";

import { useState } from "react";

type LoginFormValues = {
	email: string;
	password: string;
};

type LoginFormProps = {
	onSubmit?: (values: LoginFormValues) => void | Promise<void>;
	isSubmitting?: boolean;
	className?: string;
};

export default function LoginForm({
	onSubmit,
	isSubmitting = false,
	className = "",
}: LoginFormProps) {
	const [values, setValues] = useState<LoginFormValues>({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setValues((current) => ({
			...current,
			[name]: value,
		}));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (onSubmit) {
			await onSubmit(values);
		}
	};

	return (
		<div className={`relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 p-1 shadow-2xl shadow-black/30 ${className}`}>
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.22),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_32%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(2,6,23,0.92))]" />

			<div className="grid gap-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 text-white backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
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
					<form className="space-y-5" onSubmit={handleSubmit}>
						<div className="space-y-1">
							<h3 className="text-2xl font-semibold tracking-tight text-slate-950">
								Log in
							</h3>
							<p className="text-sm text-slate-500">
								Use the email and password you registered with.
							</p>
						</div>

						<div className="space-y-4">
							<label className="block">
								<span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
								<input
									type="email"
									name="email"
									value={values.email}
									onChange={handleChange}
									placeholder="you@example.com"
									className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
									autoComplete="email"
									disabled={isSubmitting}
									required
								/>
							</label>

							<label className="block">
								<span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										name="password"
										value={values.password}
										onChange={handleChange}
										placeholder="Enter your password"
										className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-24 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
										autoComplete="current-password"
										disabled={isSubmitting}
										required
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

						<button
							type="submit"
							disabled={isSubmitting}
							className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:scale-[1.01] hover:shadow-sky-600/30 focus:outline-none focus:ring-4 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-70"
						>
							{isSubmitting ? "Signing in..." : "Sign in"}
						</button>

						<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
							Keep your account secure and never share your password with anyone.
						</div>
					</form>
				</section>
			</div>
		</div>
	);
}
