import NetworkBackground from "@/components/layout/NetworkBackground";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] px-4 py-10 text-[var(--color-text-primary)] sm:px-6 lg:px-8">
			<NetworkBackground />

			<div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
				<div className="w-full max-w-5xl rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-1 backdrop-blur-xl">
					<div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/70 p-4 sm:p-6 lg:p-8">
						{children}
					</div>
				</div>
			</div>
		</main>
	);
}
