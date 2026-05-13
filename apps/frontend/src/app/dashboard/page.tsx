"use client";

import { useWebsites } from "@/hooks/useWebsites";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Trash2,
  ExternalLink,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { API_URL } from "@/lib/constants";

interface ValidatorData {
  id: string;
  publicKey: string;
  location: string;
  isActive: boolean;
  pendingPayouts: number;
  totalPayouts: number;
  lastPayoutTx: string | null;
  _count: { ticks: number };
}

export default function DashboardPage() {
  const { websites, refreshWebsite } = useWebsites();
  const { getToken } = useAuth();
  const [validators, setValidators] = useState<ValidatorData[]>([]);
  const [activeTab, setActiveTab] = useState<"monitors" | "validators">("monitors");
  const [searchQuery, setSearchQuery] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchValidators = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/validators`);
      setValidators(res.data);
    } catch {}
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refreshWebsite(), fetchValidators()]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    fetchValidators();
    const i = setInterval(fetchValidators, 30000);
    return () => clearInterval(i);
  }, []);

  const stats = useMemo(() => {
    const total = websites.length;
    const up = websites.filter((w) => {
      if (w.ticks.length === 0) return true;
      return w.ticks[w.ticks.length - 1]?.status === "Good";
    }).length;
    return { total, up, down: total - up };
  }, [websites]);

  const totalSOL = useMemo(
    () => validators.reduce((a, v) => a + v.totalPayouts, 0) * 0.0001,
    [validators],
  );

  const filtered = useMemo(
    () => websites.filter((w) => w.url.toLowerCase().includes(searchQuery.toLowerCase())),
    [websites, searchQuery],
  );

  const handleAdd = async () => {
    if (!newUrl.trim()) return;
    setIsAdding(true);
    try {
      const token = await getToken();
      await axios.post(
        `${API_URL}/api/v1/website`,
        { url: newUrl },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNewUrl("");
      setDialogOpen(false);
      refreshWebsite();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      await axios.delete(`${API_URL}/api/v1/website?websiteId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshWebsite();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 animate-fade-up">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Monitors</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {stats.up} operational
              </span>
              {stats.down > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {stats.down} down
                </span>
              )}
              <span>{stats.total} total</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-zinc-500 transition-colors hover:text-white hover:bg-white/[0.06]"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger className="cursor-pointer flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-500">
                <Plus className="h-3.5 w-3.5" />
                Add monitor
              </DialogTrigger>
              <DialogContent className="sm:max-w-md border-white/[0.06] bg-[#111113]">
                <DialogHeader>
                  <DialogTitle className="text-base">Add a new monitor</DialogTitle>
                  <DialogDescription className="text-sm text-zinc-500">
                    Enter the URL to monitor. We&apos;ll check it every 60 seconds.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-2">
                  <Input
                    placeholder="https://api.example.com/health"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    className="h-10 bg-[#09090b] border-white/[0.06] text-sm font-mono"
                  />
                </div>
                <DialogFooter className="mt-4 gap-2 sm:gap-0">
                  <DialogClose className="cursor-pointer rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm font-medium transition-colors hover:bg-white/[0.06]">
                    Cancel
                  </DialogClose>
                  <button
                    onClick={handleAdd}
                    disabled={isAdding || !newUrl.trim()}
                    className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {isAdding ? "Adding..." : "Add monitor"}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 border-b border-white/[0.06] animate-fade-up-delay-1">
          <TabBtn active={activeTab === "monitors"} onClick={() => setActiveTab("monitors")}>
            Monitors
          </TabBtn>
          <TabBtn active={activeTab === "validators"} onClick={() => setActiveTab("validators")}>
            Validators
            {validators.length > 0 && (
              <span className="ml-2 rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                {validators.length}
              </span>
            )}
          </TabBtn>
        </div>

        {/* Content */}
        {activeTab === "monitors" ? (
          <div className="mt-6 animate-fade-up-delay-2">
            {websites.length > 0 && (
              <div className="relative mb-4 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
                <Input
                  placeholder="Filter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 bg-white/[0.02] border-white/[0.06] text-sm"
                />
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] py-20 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-zinc-300">No monitors yet</p>
                <p className="mt-1 text-sm text-zinc-600">
                  Add your first endpoint to start monitoring.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((w) => (
                  <MonitorCard key={w.id} website={w} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 animate-fade-up-delay-2">
            <div className="mb-5 flex items-center gap-6 text-sm text-zinc-500">
              <span>
                Distributed: <span className="font-mono font-medium text-emerald-400">{totalSOL.toFixed(4)} SOL</span>
              </span>
              <span>
                Rate: <span className="font-mono text-zinc-400">0.0001 SOL</span>/check
              </span>
            </div>

            {validators.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] py-20 text-center">
                <p className="text-sm font-medium text-zinc-300">No validators connected</p>
                <p className="mt-1 text-sm text-zinc-600">
                  Run <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-zinc-400">bun run index.ts</code> in <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-zinc-400">apps/validator</code>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {validators.map((v) => (
                  <ValidatorCard key={v.id} validator={v} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Components ─── */

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "border-emerald-500 text-white"
          : "border-transparent text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {children}
    </button>
  );
}

function MonitorCard({
  website,
  onDelete,
}: {
  website: {
    id: string;
    url: string;
    ticks: { id: string; status: string; latency: number; createdAt: string; updatedAt: string; validatorId?: string }[];
  };
  onDelete: (id: string) => void;
}) {
  const lastTick = website.ticks.length > 0 ? website.ticks[website.ticks.length - 1] : null;
  const isUp = !lastTick || lastTick.status === "Good";

  const uptimePercent = useMemo(() => {
    if (website.ticks.length === 0) return "100.0";
    const good = website.ticks.filter((t) => t.status === "Good").length;
    return ((good / website.ticks.length) * 100).toFixed(1);
  }, [website.ticks]);

  const avgLatency = useMemo(() => {
    if (website.ticks.length === 0) return 0;
    return Math.round(website.ticks.reduce((a, t) => a + t.latency, 0) / website.ticks.length);
  }, [website.ticks]);

  const domain = (() => {
    try { return new URL(website.url).hostname; } catch { return website.url; }
  })();

  // Build mini uptime bars from last 30 ticks
  const recentTicks = website.ticks.slice(-30);

  return (
    <div className="group rounded-xl border border-white/[0.06] bg-[#111113] p-5 transition-colors hover:border-white/[0.1]">
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`relative flex h-2.5 w-2.5`}>
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-40 ${isUp ? "bg-emerald-400 animate-ping" : "bg-red-400 animate-ping"}`} style={{ animationDuration: "2s" }} />
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isUp ? "bg-emerald-500" : "bg-red-500"}`} />
          </span>
          <div>
            <span className="text-sm font-medium text-white">{domain}</span>
            <span className="ml-3 font-mono text-xs text-zinc-600 hidden sm:inline">{website.url}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <a href={website.url} target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 hover:text-white hover:bg-white/[0.06] transition-colors">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button onClick={() => onDelete(website.id)} className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Uptime bars */}
      <div className="flex gap-[2px] h-6 items-end mb-4">
        {recentTicks.length > 0 ? (
          recentTicks.map((tick, i) => (
            <div
              key={tick.id}
              className={`flex-1 rounded-[2px] transition-all hover:opacity-80 ${
                tick.status === "Good" ? "bg-emerald-500/70" : "bg-red-500/70"
              }`}
              style={{ height: tick.status === "Good" ? `${60 + Math.random() * 40}%` : "100%" }}
            />
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-[11px] font-mono text-zinc-700">
            awaiting data
          </div>
        )}
      </div>

      {/* Bottom stats */}
      <div className="flex items-center gap-6 text-xs text-zinc-500">
        <span>Uptime <span className="font-mono text-zinc-300">{uptimePercent}%</span></span>
        <span>Latency <span className="font-mono text-zinc-300">{avgLatency}ms</span></span>
        <span>Checks <span className="font-mono text-zinc-300">{website.ticks.length}</span></span>
      </div>
    </div>
  );
}

function ValidatorCard({ validator: v }: { validator: ValidatorData }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111113] p-5 transition-colors hover:border-white/[0.1]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={`flex h-2 w-2 rounded-full ${v.isActive ? "bg-emerald-500" : "bg-zinc-600"}`} />
          <span className="font-mono text-sm text-zinc-300 truncate max-w-[200px] sm:max-w-[300px]" title={v.publicKey}>
            {v.publicKey}
          </span>
        </div>
        <span className={`text-xs font-medium ${v.isActive ? "text-emerald-500" : "text-zinc-600"}`}>
          {v.isActive ? "Active" : "Offline"}
        </span>
      </div>

      <div className="flex items-center gap-6 text-xs text-zinc-500">
        <span>{v.location}</span>
        <span>Checks: <span className="font-mono text-zinc-300">{v._count.ticks.toLocaleString()}</span></span>
        <span>Pending: <span className="font-mono text-amber-400">{(v.pendingPayouts * 0.0001).toFixed(4)}</span></span>
        <span>Earned: <span className="font-mono text-emerald-400">{(v.totalPayouts * 0.0001).toFixed(4)} SOL</span></span>
        {v.lastPayoutTx && (
          <a
            href={v.lastPayoutTx.startsWith("devnet_sim_") ? "#" : `https://explorer.solana.com/tx/${v.lastPayoutTx}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-zinc-500 hover:text-emerald-400 transition-colors ml-auto"
          >
            <span className="font-mono">{v.lastPayoutTx.slice(0, 8)}…</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
