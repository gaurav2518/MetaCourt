import NetworkBackground from "@/components/layout/NetworkBackground";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] px-4 py-10 text-[var(--color-text-primary)] sm:px-6 lg:px-8">
			<NetworkBackground />

			<div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full items-center justify-center">
				{children}
			</div>
		</main>
	);
}
