"use client";

import { useState } from "react";

type RegisterFormValues = {
	name: string;
	email: string;
	password: string;
};

type RegisterFormProps = {
	onSubmit?: (values: RegisterFormValues) => void | Promise<void>;
	isSubmitting?: boolean;
	className?: string;
};

export default function RegisterForm({
	onSubmit,
	isSubmitting = false,
	className = "",
}: RegisterFormProps) {
	const [values, setValues] = useState<RegisterFormValues>({
		name: "",
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
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.18),_transparent_32%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(2,6,23,0.92))]" />

			<div className="grid gap-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 text-white backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
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
					<form className="space-y-5" onSubmit={handleSubmit}>
						<div className="space-y-1">
							<h3 className="text-2xl font-semibold tracking-tight text-slate-950">
								Register your account
							</h3>
							<p className="text-sm text-slate-500">
								Juror accounts are not available here. They require admin approval.
							</p>
						</div>

						<div className="space-y-4">
							<label className="block">
								<span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
								<input
									type="text"
									name="name"
									value={values.name}
									onChange={handleChange}
									placeholder="Enter your full name"
									className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
									autoComplete="name"
									disabled={isSubmitting}
									required
								/>
							</label>

							<label className="block">
								<span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
								<input
									type="email"
									name="email"
									value={values.email}
									onChange={handleChange}
									placeholder="you@example.com"
									className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
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
										placeholder="Create a strong password"
										className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-24 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
										autoComplete="new-password"
										disabled={isSubmitting}
										required
										minLength={8}
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
								<p className="mt-2 text-xs text-slate-500">
									Use at least 8 characters for a safer login.
								</p>
							</label>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-600/20 transition hover:scale-[1.01] hover:shadow-cyan-600/30 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-70"
						>
							{isSubmitting ? "Creating account..." : "Create account"}
						</button>

						<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
							By continuing, you agree that your account will be created with a standard user role. Juror elevation is admin-controlled.
						</div>
					</form>
				</section>
			</div>
		</div>
	);
}
