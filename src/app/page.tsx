import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
	return (
		<main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
			{/* Aesthetic radial glows to match authentication theme */}
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.16),_transparent_36%),linear-gradient(180deg,_rgba(2,6,23,0.98),_rgba(15,23,42,1))]" />
			<div className="absolute left-1/4 top-1/4 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
			<div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

			<div className="mx-auto max-w-6xl">
				{/* Top Header */}
				<Navbar />

				{/* Hero Body */}
				<section className="mx-auto max-w-4xl py-20 text-center sm:py-28">
					<span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
						Decentralized Justice
					</span>

					<h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
						Blockchain-Based Complaint & Dispute Resolution.
					</h1>

					<p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
						MetaCourt removes trust from central authorities. File cases, upload tamper-proof proof, and rely on mathematical consensus enforced by smart contracts.
					</p>

					<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Link
							href="/register"
							className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-cyan-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-95 hover:shadow-cyan-500/30 focus:ring-4 focus:ring-cyan-500/20"
						>
							Get Started
						</Link>
						<Link
							href="/login"
							className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
						>
							Login to Workspace
						</Link>
					</div>
				</section>

				{/* Pillars Grid */}
				<section className="grid gap-6 py-12 sm:grid-cols-3">
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
						<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v-6.75a2.25 2.25 0 0 0 2.25-2.25Z" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-white">Immutable Proof</h3>
						<p className="mt-2 text-sm leading-6 text-slate-400">
							Case data is serialized and cryptographically hashed. The fingerprint is written to the blockchain, preventing tampering or deletion.
						</p>
					</div>

					<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
						<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-white">Smart Decisions</h3>
						<p className="mt-2 text-sm leading-6 text-slate-400">
							Decision logic is fully encoded in Solidity. Rulings are calculated transparently and cannot be overridden by administrators.
						</p>
					</div>

					<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
						<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.97 5.97 0 0 0-.75-2.985m-.3-3.097A5.006 5.006 0 0 0 15 6.315a5.007 5.007 0 0 0-3.147 1.168M12 18.72A9.094 9.094 0 0 0 8.259 18.24 3 3 0 0 0 12 15a3 3 0 0 0 3.741 3.24M12 18.72v.03c0 .222-.011.441-.033.658A11.948 11.948 0 0 1 12 21m-6-2.28a9.09 9.09 0 0 1-3.741-.479 3 3 0 0 1 4.682-2.72m-.94 3.198.002.031c0 .225.012.447.037.666A11.944 11.944 0 0 0 12 21" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-white">Community Consensus</h3>
						<p className="mt-2 text-sm leading-6 text-slate-400">
							Verified community jurors analyze evidence. Jurors are rewarded or penalized based on consensus vote alignment.
						</p>
					</div>
				</section>
			</div>
		</main>
	);
}
