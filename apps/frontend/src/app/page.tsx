import Link from "next/link";
import Image from "next/image";
import { SignUpButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero glow */}
      <div className="hero-glow top-[-200px] left-1/2 -translate-x-1/2" />

      {/* ─── Hero Section ─── */}
      <section className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 mb-8">
            <span className="animate-pulse-dot h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[13px] text-zinc-400">All systems operational — 99.98% uptime this month</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up-delay-1 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight">
            Uptime monitoring,{" "}
            <br className="hidden sm:block" />
            <span className="text-gradient">verified on-chain.</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up-delay-2 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
            A decentralized network of validators monitors your endpoints every 60 seconds.
            Every check is cryptographically signed and payouts settle on Solana.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-delay-3 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <SignUpButton mode="modal">
              Start monitoring — it&apos;s free
            </SignUpButton>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center rounded-lg border border-white/[0.08] bg-white/[0.03] px-6 text-sm font-medium text-white transition-all hover:bg-white/[0.06] hover:border-white/[0.12]"
            >
              Open dashboard
            </Link>
          </div>
        </div>

        {/* ─── Live Uptime Visualization ─── */}
        <div className="animate-fade-up-delay-4 mx-auto mt-20 max-w-4xl">
          <div className="rounded-xl border border-white/[0.06] bg-[#111113] overflow-hidden shadow-2xl shadow-emerald-500/[0.03]">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-zinc-800" />
                <div className="h-3 w-3 rounded-full bg-zinc-800" />
                <div className="h-3 w-3 rounded-full bg-zinc-800" />
              </div>
              <span className="font-mono text-[11px] text-zinc-600">dashboard.web3uptime.dev</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                <span className="font-mono text-[10px] text-emerald-500/70">LIVE</span>
              </div>
            </div>

            {/* Dashboard mockup content */}
            <div className="p-6">
              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <MetricCard label="Global Uptime" value="99.98%" accent />
                <MetricCard label="Avg. Latency" value="38ms" />
                <MetricCard label="Active Validators" value="12" />
              </div>

              {/* Uptime bars visualization */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[13px] font-medium text-zinc-300">api.example.com</span>
                <span className="font-mono text-xs text-emerald-500">operational</span>
              </div>
              <UptimeBars />

              <div className="mt-6 mb-4 flex items-center justify-between">
                <span className="text-[13px] font-medium text-zinc-300">rpc.solana-mainnet.io</span>
                <span className="font-mono text-xs text-emerald-500">operational</span>
              </div>
              <UptimeBars hasIncident />

              <div className="mt-6 mb-4 flex items-center justify-between">
                <span className="text-[13px] font-medium text-zinc-300">ws.validator-node.xyz</span>
                <span className="font-mono text-xs text-zinc-500">degraded</span>
              </div>
              <UptimeBars degraded />
            </div>
          </div>

          {/* Subtle reflection gradient */}
          <div className="mx-auto h-40 w-[80%] bg-gradient-to-b from-emerald-500/[0.04] to-transparent rounded-b-full blur-2xl -mt-8" />
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section className="border-t border-white/[0.04] bg-[#0c0c0e]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
            <p className="mt-3 text-zinc-500 text-[15px]">Three steps. No SDK. No agent installation.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <StepCard
              step="01"
              title="Add your endpoint"
              description="Paste any URL — API, RPC node, website. We start checking it within seconds."
            />
            <StepCard
              step="02"
              title="Validators verify"
              description="Independent nodes ping your endpoint, sign the result with Ed25519 keys, and report back."
            />
            <StepCard
              step="03"
              title="Payouts settle on-chain"
              description="Validators earn SOL for every verified check. Transparent, automatic, auditable."
            />
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="border-t border-white/[0.04]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Built different
            </h2>
            <p className="mt-3 text-zinc-500 text-[15px]">Not another centralized monitoring tool.</p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCell
              title="Decentralized validators"
              description="No single point of failure. Multiple independent nodes verify every check."
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500">
                  <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              }
            />
            <FeatureCell
              title="Cryptographic proofs"
              description="Every status check is signed with Ed25519. Tamper-proof, publicly verifiable."
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
            />
            <FeatureCell
              title="Solana payouts"
              description="Validators earn SOL for every verified check. Automatic settlement via Devnet."
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
            />
            <FeatureCell
              title="60-second intervals"
              description="High-frequency checks catch outages before your users notice anything."
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              }
            />
            <FeatureCell
              title="Real-time dashboard"
              description="See status, latency, uptime history, and validator payouts in one clean view."
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              }
            />
            <FeatureCell
              title="Run your own node"
              description="Open protocol. Anyone can run a validator with a Solana keypair."
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500">
                  <rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-white/[0.04] bg-[#0c0c0e]">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Start monitoring in 30 seconds
          </h2>
          <p className="mt-3 text-zinc-500 text-[15px]">
            No credit card. No setup. Just paste a URL.
          </p>
          <div className="mt-8">
            <SignUpButton mode="modal">
              Get started free
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/[0.04]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span className="text-xs text-zinc-600">© 2025 Web3 Uptime</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">GitHub</a>
            <a href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Solana Explorer</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Components ─── */

function UptimeBars({ hasIncident = false, degraded = false }: { hasIncident?: boolean; degraded?: boolean }) {
  const bars = Array.from({ length: 45 }, (_, i) => {
    if (degraded && i > 38) return "bad";
    if (hasIncident && i === 31) return "bad";
    return "good";
  });

  return (
    <div className="flex gap-[3px] h-8 items-end">
      {bars.map((status, i) => (
        <div
          key={i}
          className={`uptime-bar flex-1 rounded-sm transition-colors ${
            status === "good"
              ? "bg-emerald-500/80 hover:bg-emerald-400"
              : "bg-red-500/80 hover:bg-red-400"
          }`}
          style={{
            height: status === "good" ? `${70 + Math.random() * 30}%` : "100%",
            animationDelay: `${i * 15}ms`,
          }}
        />
      ))}
    </div>
  );
}

function MetricCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className={`text-2xl font-semibold font-mono tracking-tight ${accent ? "text-emerald-400" : "text-white"}`}>{value}</p>
    </div>
  );
}

function StepCard({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="relative rounded-xl border border-white/[0.06] bg-[#111113] p-8 group hover:border-emerald-500/20 transition-colors">
      <span className="font-mono text-xs text-emerald-500/60 mb-4 block">{step}</span>
      <h3 className="text-[15px] font-semibold mb-2 text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-500">{description}</p>
    </div>
  );
}

function FeatureCell({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#09090b] p-7 group hover:bg-[#0d0d10] transition-colors">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03]">
        {icon}
      </div>
      <h3 className="text-[14px] font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-[13px] leading-relaxed text-zinc-500">{description}</p>
    </div>
  );
}
