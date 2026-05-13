"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";

interface ValidatorData {
  id: string;
  publicKey: string;
  location: string;
  isActive: boolean;
  pendingPayouts: number;
  totalPayouts: number;
  _count: { ticks: number };
}

// Simple coordinate mapping for common locations
const LOCATION_MAP: Record<string, { x: number; y: number }> = {
  "New York, US": { x: 25, y: 35 },
  "London, UK": { x: 47, y: 28 },
  "Frankfurt, DE": { x: 49, y: 30 },
  "Singapore, SG": { x: 78, y: 65 },
  "Tokyo, JP": { x: 88, y: 38 },
  "San Francisco, US": { x: 15, y: 38 },
  "Mumbai, IN": { x: 72, y: 55 },
  "Bengaluru, IN": { x: 72, y: 58 },
  "Sydney, AU": { x: 88, y: 82 },
  "Paris, FR": { x: 47, y: 32 },
  "Toronto, CA": { x: 22, y: 32 },
};

export default function ValidatorPage() {
  const [validators, setValidators] = useState<ValidatorData[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/validators`);
        setValidators(res.data);
      } catch (err) {
        console.error("Failed to fetch validators:", err);
      }
    };
    fetchData();
    const i = setInterval(fetchData, 15000);
    return () => clearInterval(i);
  }, []);

  const stats = useMemo(() => {
    const activeCount = validators.filter((v) => v.isActive).length;
    const totalChecks = validators.reduce((a, v) => a + (v._count?.ticks || 0), 0);
    const totalEarned = validators.reduce((a, v) => a + (v.totalPayouts || 0), 0) * 0.0001;
    return { activeCount, totalChecks, totalEarned };
  }, [validators]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="relative overflow-hidden bg-grid min-h-screen">
      <div className="hero-glow top-[-250px] left-1/2 -translate-x-1/2" />

      {/* ═══ HERO ═══ */}
      <section className="relative mx-auto max-w-7xl px-6 pt-24 pb-8 sm:pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <div className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2 mb-8">
              <span className="h-2 w-2 rounded-full bg-blue-500 anim-pulse-slow" />
              <span className="text-[13px] text-zinc-400 font-medium">
                {stats.activeCount} validators online · {stats.totalChecks.toLocaleString()} checks
              </span>
            </div>

            <h1 className="anim-fade-up-d1 font-display text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-[1.05] tracking-tight mb-6">
              Become a node.{" "}
              <span className="text-gradient-blue">Earn SOL.</span>
            </h1>

            <p className="anim-fade-up-d2 text-lg leading-relaxed text-zinc-400 mb-8">
              Deploy a decentralized monitor in minutes. Validate Web3 endpoints globally and get rewarded with automatic Solana payouts for every verified check.
            </p>

            <div className="anim-fade-up-d3 flex items-center gap-4">
              <a href="#setup" className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20">
                Get started
              </a>
              <a href="https://github.com" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                View documentation →
              </a>
            </div>
          </div>

          {/* ═══ ANIMATED GLOBE ═══ */}
          <div className="anim-fade-up-d4 relative aspect-square max-w-[500px] mx-auto lg:mx-0 w-full flex items-center justify-center">
            <GlobeVisualization validators={validators} />
          </div>
        </div>
      </section>

      {/* ═══ LIVE NETWORK STATS ═══ */}
      <section className="border-y border-white/[0.04] bg-[#08081a]/80 backdrop-blur-sm mt-12">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <MetricSmall value={stats.activeCount.toString()} label="Active nodes" />
          <MetricSmall value={stats.totalChecks.toLocaleString()} label="Total checks" />
          <MetricSmall value={stats.totalEarned.toFixed(4)} label="SOL distributed" />
          <MetricSmall value="0.0001" label="SOL per check" />
        </div>
      </section>

      {/* ═══ SETUP STEPS ═══ */}
      <section id="setup" className="mx-auto max-w-7xl px-6 py-28">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-400 tracking-wider uppercase mb-3">Setup Guide</p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Node deployment</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <SetupStep n="01" title="Clone" code="git clone https://github.com/web3-uptime/validator" onCopy={copyToClipboard} copied={copied === "git clone https://github.com/web3-uptime/validator"} />
          <SetupStep n="02" title="Install" code="bun install" onCopy={copyToClipboard} copied={copied === "bun install"} />
          <SetupStep n="03" title="Config" code="echo 'PRIVATE_KEY=[...]' > .env" onCopy={copyToClipboard} copied={copied === "echo 'PRIVATE_KEY=[...]' > .env"} />
          <SetupStep n="04" title="Launch" code="bun run index.ts" onCopy={copyToClipboard} copied={copied === "bun run index.ts"} />
        </div>
      </section>

      {/* ═══ ACTIVE NODES GRID ═══ */}
      <section className="border-t border-white/[0.04] pb-32">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <h3 className="font-display text-2xl font-bold mb-10">Active validators</h3>
          {validators.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/[0.08] rounded-2xl">
              <p className="text-zinc-500">No active validators found. Be the first to join.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {validators.map((v) => (
                <ValidatorCard key={v.id} v={v} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function GlobeVisualization({ validators }: { validators: ValidatorData[] }) {
  return (
    <div className="relative w-full h-full">
      {/* Abstract World Map SVG */}
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-20 text-blue-500/50" fill="currentColor">
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.1" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.1" />
        <path d="M50 2 L50 98 M2 50 L98 50" stroke="currentColor" strokeWidth="0.1" />
        
        {/* Simple Map Dots (Pseudo-map) */}
        <circle cx="20" cy="35" r="0.5" /><circle cx="25" cy="40" r="0.5" />
        <circle cx="45" cy="30" r="0.5" /><circle cx="50" cy="35" r="0.5" />
        <circle cx="75" cy="60" r="0.5" /><circle cx="85" cy="45" r="0.5" />
        <circle cx="15" cy="50" r="0.5" /><circle cx="80" cy="75" r="0.5" />
      </svg>

      {/* Orbiting Ring */}
      <div className="absolute inset-0 border border-blue-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
      
      {/* Active Validator Pins */}
      {validators.map((v, i) => {
        const coords = LOCATION_MAP[v.location] || { 
          x: 20 + Math.random() * 60, 
          y: 20 + Math.random() * 60 
        };
        return (
          <div
            key={v.id}
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
          >
            <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-75" style={{ animationDelay: `${i * 0.5}s` }} />
            <span className="relative block h-1.5 w-1.5 mx-auto mt-[3px] rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            
            {/* Hover Tooltip */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md border border-white/10 rounded px-2 py-1 whitespace-nowrap pointer-events-none z-10">
              <p className="text-[10px] font-mono text-cyan-400">{v.location}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MetricSmall({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-600 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function SetupStep({ n, title, code, onCopy, copied }: { n: string; title: string; code: string; onCopy: (c: string, n: string) => void; copied: boolean }) {
  return (
    <div className="group rounded-xl border border-white/[0.06] bg-[#0a0a1a] p-6 transition-all hover:border-blue-500/20">
      <span className="font-mono text-xs text-zinc-700 mb-2 block">{n}</span>
      <h4 className="font-display font-semibold text-white mb-4">{title}</h4>
      <div className="relative">
        <code className="block bg-[#050510] border border-white/[0.04] rounded p-3 text-[11px] font-mono text-zinc-500 truncate group-hover:text-zinc-300 transition-colors">
          {code}
        </code>
        <button
          onClick={() => onCopy(code, code)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-white/5 transition-colors"
        >
          {copied ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-600"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          )}
        </button>
      </div>
    </div>
  );
}

function ValidatorCard({ v }: { v: ValidatorData }) {
  return (
    <div className="card-glow rounded-2xl border border-white/[0.06] bg-[#0a0a1a] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${v.isActive ? "bg-blue-500" : "bg-zinc-700"}`} />
          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-tighter">
            {v.isActive ? "Online" : "Offline"}
          </span>
        </div>
        <span className="text-[10px] text-zinc-700 font-mono">{v.location}</span>
      </div>
      <p className="font-mono text-xs text-zinc-400 truncate mb-6">{v.publicKey}</p>
      <div className="grid grid-cols-3 gap-2 border-t border-white/[0.03] pt-4">
        <div className="text-center">
          <p className="text-[9px] text-zinc-600 uppercase">Checks</p>
          <p className="font-mono text-xs font-bold text-white">{v._count?.ticks || 0}</p>
        </div>
        <div className="text-center border-x border-white/[0.03]">
          <p className="text-[9px] text-zinc-600 uppercase">Pending</p>
          <p className="font-mono text-xs font-bold text-amber-500">{(v.pendingPayouts || 0) * 0.0001}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-zinc-600 uppercase">Earned</p>
          <p className="font-mono text-xs font-bold text-blue-400">{(v.totalPayouts || 0) * 0.0001}</p>
        </div>
      </div>
    </div>
  );
}
