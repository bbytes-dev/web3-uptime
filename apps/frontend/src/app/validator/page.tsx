"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import createGlobe from "cobe";

interface ValidatorData {
  id: string;
  publicKey: string;
  location: string;
  isActive: boolean;
  pendingPayouts: number;
  totalPayouts: number;
  _count: { ticks: number };
}

const LOCATION_MAP: Record<string, { lat: number; lng: number }> = {
  "New York, US": { lat: 40.7128, lng: -74.006 },
  "London, UK": { lat: 51.5074, lng: -0.1278 },
  "Frankfurt, DE": { lat: 50.1109, lng: 8.6821 },
  "Singapore, SG": { lat: 1.3521, lng: 103.8198 },
  "Tokyo, JP": { lat: 35.6762, lng: 139.6503 },
  "San Francisco, US": { lat: 37.7749, lng: -122.4194 },
  "Mumbai, IN": { lat: 19.076, lng: 72.8777 },
  "Bengaluru, IN": { lat: 12.9716, lng: 77.5946 },
  "Sydney, AU": { lat: -33.8688, lng: 151.2093 },
  "Paris, FR": { lat: 48.8566, lng: 2.3522 },
  "Toronto, CA": { lat: 43.6532, lng: -79.3832 },
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
        console.warn("Could not load validator data. Retrying...");
      }
    };
    fetchData();
    const i = setInterval(fetchData, 10000);
    return () => clearInterval(i);
  }, []);

  const stats = useMemo(() => {
    const activeCount = (validators || []).filter((v) => v.isActive).length;
    const totalChecks = (validators || []).reduce((a, v) => a + (v._count?.ticks || 0), 0);
    const totalEarned = (validators || []).reduce((a, v) => a + (v.totalPayouts || 0), 0) * 0.0001;
    return { activeCount, totalChecks, totalEarned };
  }, [validators]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="relative overflow-hidden bg-[#050510] min-h-screen">
      <div className="hero-glow top-[-250px] left-1/2 -translate-x-1/2" />

      {/* ═══ HERO ═══ */}
      <section className="relative mx-auto max-w-7xl px-6 pt-24 pb-8 sm:pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl z-10">
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
              <a href="https://github.com/bbytes-dev/web3-uptime-validator-cli" target="_blank" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                View CLI Repo →
              </a>
            </div>
          </div>

          {/* ═══ ANIMATED 3D GLOBE ═══ */}
          <div className="anim-fade-up-d4 relative aspect-square max-w-[600px] mx-auto lg:mx-0 w-full flex items-center justify-center">
            <GlobeVisualization validators={validators} />
          </div>
        </div>
      </section>

      {/* ═══ LIVE NETWORK STATS ═══ */}
      <section className="border-y border-white/[0.04] bg-[#08081a]/80 backdrop-blur-sm mt-12 z-10 relative">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <MetricSmall value={stats.activeCount.toString()} label="Active nodes" />
          <MetricSmall value={stats.totalChecks.toLocaleString()} label="Total checks" />
          <MetricSmall value={stats.totalEarned.toFixed(4)} label="SOL distributed" />
          <MetricSmall value="0.0001" label="SOL per check" />
        </div>
      </section>

      {/* ═══ SETUP STEPS ═══ */}
      <section id="setup" className="mx-auto max-w-7xl px-6 py-28 relative z-10">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-400 tracking-wider uppercase mb-3">Setup Guide</p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Node deployment</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <SetupStep n="01" title="Clone Repo" code="git clone https://github.com/bbytes-dev/web3-uptime-validator-cli" onCopy={copyToClipboard} copied={copied === "git clone https://github.com/bbytes-dev/web3-uptime-validator-cli"} />
          <SetupStep n="02" title="Install" code="bun install" onCopy={copyToClipboard} copied={copied === "bun install"} />
          <SetupStep n="03" title="Config" code="cp .env.example .env" onCopy={copyToClipboard} copied={copied === "cp .env.example .env"} />
          <SetupStep n="04" title="Activate" code="bun start" onCopy={copyToClipboard} copied={copied === "bun start"} />
        </div>
      </section>

      {/* ═══ ACTIVE NODES GRID ═══ */}
      <section className="border-t border-white/[0.04] pb-32 relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <h3 className="font-display text-2xl font-bold mb-10">Active validators</h3>
          {validators.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/[0.08] rounded-2xl bg-white/[0.02]">
              <p className="text-zinc-500">Connecting to network...</p>
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 10,
      baseColor: [0.1, 0.1, 0.3], 
      markerColor: [0.1, 0.8, 1],    
      glowColor: [0.3, 0.3, 0.7],    // Brighter glow
      markers: (validators || []).map((v) => {
        const coords = LOCATION_MAP[v.location] || { lat: 0, lng: 0 };
        return { location: [coords.lat, coords.lng], size: 0.08 };
      }),
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => globe.destroy();
  }, [validators]);

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[500px]">
      <div className="absolute inset-0 bg-radial-glow opacity-40 pointer-events-none" />
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[600px] max-h-[600px] aspect-square"
        style={{ cursor: 'grab', opacity: 1, visibility: 'visible' }}
      />
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
    <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-blue-500/20">
      <span className="font-mono text-xs text-zinc-700 mb-2 block">{n}</span>
      <h4 className="font-display font-semibold text-white mb-4">{title}</h4>
      <div className="relative">
        <code className="block bg-black/40 border border-white/[0.04] rounded p-3 text-[11px] font-mono text-zinc-500 truncate group-hover:text-zinc-300 transition-colors">
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
    <div className="card-glow rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
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
