export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.16),_transparent_32%),linear-gradient(180deg,_rgba(2,6,23,0.98),_rgba(15,23,42,1))]" />
			<div className="absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
			<div className="absolute bottom-0 right-0 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

			<div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
				<div className="w-full max-w-5xl rounded-[2rem] border border-white/10 bg-white/5 p-1 shadow-2xl shadow-black/30 backdrop-blur-xl">
					<div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-4 sm:p-6 lg:p-8">
						{children}
					</div>
				</div>
			</div>
		</main>
	);
}
