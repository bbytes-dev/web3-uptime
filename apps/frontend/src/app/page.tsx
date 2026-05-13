"use client";

import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-grid">
      <div className="hero-glow top-[-250px] left-1/2 -translate-x-1/2" />

      {/* ═══ HERO ═══ */}
      <section className="relative mx-auto max-w-7xl px-6 pt-24 pb-12 sm:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          <div className="anim-fade-up inline-flex items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2 mb-8 backdrop-blur-sm">
            <span className="anim-pulse-slow h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-[13px] text-zinc-400 font-medium">Network operational · 12 validators active</span>
          </div>

          <h1 className="anim-fade-up-d1 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight">
            Infrastructure monitoring,{" "}
            <span className="text-gradient-blue">verified on-chain.</span>
          </h1>

          <p className="anim-fade-up-d2 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
            A decentralized network of validators monitors your endpoints.
            Every check is cryptographically signed. Payouts settle on Solana.
          </p>

          <div className="anim-fade-up-d3 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SignUpButton mode="modal">
              Start monitoring — free
            </SignUpButton>
            <Link href="/dashboard" className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white">
              Open dashboard
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>

        {/* ═══ DASHBOARD MOCKUP ═══ */}
        <div className="anim-fade-up-d5 mx-auto mt-20 max-w-5xl">
          <div className="card-glow rounded-2xl border border-white/[0.06] bg-[#0a0a1a] overflow-hidden shadow-2xl shadow-blue-500/[0.05]">
            <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#1a1a2e]" />
                <span className="h-3 w-3 rounded-full bg-[#1a1a2e]" />
                <span className="h-3 w-3 rounded-full bg-[#1a1a2e]" />
              </div>
              <span className="font-mono text-[11px] text-zinc-700">dashboard.web3uptime.dev</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 anim-pulse-slow" />
                <span className="font-mono text-[10px] text-blue-500/70">LIVE</span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-12 gap-4">
              {/* Left: Uptime Ring */}
              <div className="col-span-12 sm:col-span-4 flex flex-col items-center justify-center rounded-xl border border-white/[0.04] bg-[#0c0c1d] p-6">
                <UptimeRing />
                <p className="mt-3 text-xs text-zinc-600">Service Uptime</p>
              </div>

              {/* Right: Latency Chart */}
              <div className="col-span-12 sm:col-span-8 rounded-xl border border-white/[0.04] bg-[#0c0c1d] p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-zinc-400">Response Time</span>
                  <span className="font-mono text-[10px] text-zinc-600">Last 10 min</span>
                </div>
                <LatencyChart />
              </div>

              {/* Bottom: Status rows */}
              <div className="col-span-12 rounded-xl border border-white/[0.04] bg-[#0c0c1d] overflow-hidden">
                <div className="px-5 py-3 border-b border-white/[0.04]">
                  <span className="text-xs font-medium text-zinc-400">Service Health</span>
                </div>
                <HealthBar label="Database Performance" pct={98.8} color="blue" />
                <HealthBar label="Successful Transactions" pct={96} color="cyan" />
                <HealthBar label="Monitoring Accuracy" pct={98.5} color="purple" />
              </div>

              {/* Bottom stats */}
              <StatCard label="Avg Response" value="38ms" change="+12%" />
              <StatCard label="Alerts Sent" value="2" change="+18%" />
              <StatCard label="Satisfaction" value="91%" change="+63%" />
            </div>
          </div>
          <div className="mx-auto h-32 w-[60%] bg-gradient-to-b from-blue-500/[0.06] to-transparent rounded-b-full blur-3xl -mt-6" />
        </div>
      </section>

      {/* ═══ METRICS STRIP ═══ */}
      <section className="border-y border-white/[0.04] bg-[#08081a]/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <MetricBig value="99.98%" label="Global uptime" />
          <MetricBig value="38ms" label="Avg latency" />
          <MetricBig value="12,847" label="Checks today" />
          <MetricBig value="0.42 SOL" label="Distributed today" />
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="relative">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-400 tracking-wider uppercase mb-3">How it works</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Three steps. Zero configuration.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <StepCard n="01" title="Add your endpoint" desc="Paste any URL — API, RPC node, website. Monitoring starts in seconds." icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-400"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>} />
            <StepCard n="02" title="Validators verify" desc="Independent nodes ping your endpoint, cryptographically sign the result, and report back." icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>} />
            <StepCard n="03" title="Payouts settle on Solana" desc="Validators earn SOL for every verified check. Transparent, automatic, auditable on-chain." icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-400"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="border-t border-white/[0.04] bg-[#08081a]">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-400 tracking-wider uppercase mb-3">Features</p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Built for Web3 infrastructure</h2>
            <p className="mt-3 text-zinc-500 max-w-lg mx-auto">Everything you need to ensure your decentralized services stay online, verified, and rewarded.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard title="Decentralized checks" desc="No single point of failure. Multiple independent validator nodes verify every health check simultaneously." icon="globe" />
            <FeatureCard title="Signed attestations" desc="Every uptime check is signed with Ed25519 keys — tamper-proof, publicly verifiable on the blockchain." icon="shield" />
            <FeatureCard title="On-chain payouts" desc="Validators earn SOL automatically via Solana for every verified check. Zero manual intervention." icon="dollar" />
            <FeatureCard title="Sub-minute polling" desc="Detect outages in under 60 seconds with high-frequency concurrent health checks from multiple regions." icon="clock" />
            <FeatureCard title="Real-time dashboard" desc="See status, latency sparklines, payout history, and validator performance in a unified control panel." icon="chart" />
            <FeatureCard title="Open protocol" desc="Run your own validator node. All you need is a Solana keypair and an internet connection." icon="server" />
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="border-t border-white/[0.04] relative">
        <div className="hero-glow bottom-[-200px] left-1/2 -translate-x-1/2" />
        <div className="mx-auto max-w-7xl px-6 py-28 text-center relative z-10">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Start monitoring in <span className="text-gradient-blue">30 seconds</span>
          </h2>
          <p className="mt-4 text-zinc-500 max-w-md mx-auto">No credit card. No setup. Just paste a URL and your decentralized monitoring network is live.</p>
          <div className="mt-8">
            <SignUpButton mode="modal">Create free account</SignUpButton>
          </div>
          <p className="mt-4 text-xs text-zinc-700">Free forever · No credit card required</p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/[0.04]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-cyan-400">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <span className="text-xs text-zinc-700">© 2025 Web3 Uptime</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors">GitHub</a>
            <a href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors">Solana Explorer</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══ Visual Components ═══ */

function UptimeRing() {
  return (
    <div className="relative w-28 h-28">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#ringGrad)" strokeWidth="8" strokeDasharray="251" strokeDashoffset="0.5" strokeLinecap="round" style={{ animation: "ring-draw 1.5s ease-out forwards" }} />
        <defs><linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold text-white">99.9%</span>
      </div>
    </div>
  );
}

function LatencyChart() {
  const points = [120, 145, 130, 200, 180, 160, 135, 125, 110, 105, 115, 108, 102, 98, 105, 110, 100, 95, 100, 98];
  const max = 220; const h = 80; const w = 100;
  const coords = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - (p / max) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h + 5}`} className="w-full h-24" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient>
        <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="rgba(59,130,246,0.15)"/><stop offset="100%" stopColor="transparent"/></linearGradient>
      </defs>
      <polygon points={`0,${h} ${coords} ${w},${h}`} fill="url(#areaGrad)" />
      <polyline points={coords} fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" strokeLinejoin="round" style={{ strokeDasharray: 300, animation: "line-draw 2s ease-out forwards" }} />
    </svg>
  );
}

function HealthBar({ label, pct, color }: { label: string; pct: number; color: "blue" | "cyan" | "purple" }) {
  const colors = { blue: "from-blue-500 to-blue-400", cyan: "from-cyan-500 to-cyan-400", purple: "from-purple-500 to-purple-400" };
  return (
    <div className="flex items-center gap-4 px-5 py-3 border-b border-white/[0.03] last:border-0">
      <span className="text-[13px] text-zinc-400 w-48 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${colors[color]} uptime-bar`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-xs text-zinc-400 w-12 text-right">{pct}%</span>
    </div>
  );
}

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="col-span-12 sm:col-span-4 rounded-xl border border-white/[0.04] bg-[#0c0c1d] p-5">
      <p className="text-xs text-zinc-600 mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold text-white">{value}</span>
        <span className="text-xs font-medium text-blue-400">{change}</span>
      </div>
    </div>
  );
}

function MetricBig({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">{value}</p>
      <p className="mt-1 text-sm text-zinc-600">{label}</p>
    </div>
  );
}

function StepCard({ n, title, desc, icon }: { n: string; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="card-glow group rounded-2xl border border-white/[0.06] bg-[#0a0a1a] p-8 transition-all hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/[0.03]">
      <div className="flex items-center gap-4 mb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] group-hover:border-blue-500/20 transition-colors">{icon}</div>
        <span className="font-mono text-xs text-zinc-600">{n}</span>
      </div>
      <h3 className="font-display text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-500">{desc}</p>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    globe: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    shield: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    dollar: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    clock: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    chart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    server: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1"/><circle cx="6" cy="18" r="1"/></svg>,
  };
  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-[#0a0a1a] p-7 transition-all hover:border-blue-500/15 hover:bg-[#0c0c20]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-blue-400 group-hover:border-blue-500/20 group-hover:text-cyan-400 transition-colors">
        {icons[icon]}
      </div>
      <h3 className="font-display text-[15px] font-semibold text-white mb-2">{title}</h3>
      <p className="text-[13px] leading-relaxed text-zinc-500">{desc}</p>
    </div>
  );
}
