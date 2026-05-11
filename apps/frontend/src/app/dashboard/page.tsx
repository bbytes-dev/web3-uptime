"use client";

import { useWebsites } from "@/hooks/useWebsites";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Activity,
  Globe,
  PauseCircle,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  Wifi,
  WifiOff,
  Trash2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { API_URL } from "@/lib/constants";

export default function DashboardPage() {
  const { websites } = useWebsites();
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "up" | "down">(
    "all",
  );
  const [newUrl, setNewUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Compute stats from real data
  const stats = useMemo(() => {
    const total = websites.length;
    const operational = websites.filter((w) => {
      if (w.ticks.length === 0) return true;
      const lastTick = w.ticks[w.ticks.length - 1];
      return lastTick?.status === "Good";
    }).length;
    const down = total - operational;
    return { total, operational, down };
  }, [websites]);

  // Filter websites
  const filteredWebsites = useMemo(() => {
    return websites.filter((w) => {
      const matchesSearch = w.url
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (filterStatus === "all") return matchesSearch;
      const isUp =
        w.ticks.length === 0 || w.ticks[w.ticks.length - 1]?.status === "Good";
      if (filterStatus === "up") return matchesSearch && isUp;
      return matchesSearch && !isUp;
    });
  }, [websites, searchQuery, filterStatus]);

  const handleAddMonitor = async () => {
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
    } catch (err) {
      console.error("Failed to add monitor:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteMonitor = async (websiteId: string) => {
    try {
      const token = await getToken();
      await axios.delete(`${API_URL}/api/v1/website?websiteId=${websiteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to delete monitor:", err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here&apos;s the current status of your systems.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md shadow-purple-600/20 px-4 py-2 text-sm font-medium transition-colors cursor-pointer">
              <Plus className="h-4 w-4" />
              Add Monitor
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Monitor</DialogTitle>
                <DialogDescription>
                  Enter the URL of the website or endpoint you want to monitor.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="https://example.com"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMonitor()}
              />
              <DialogFooter>
                <DialogClose className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                  Cancel
                </DialogClose>
                <button
                  onClick={handleAddMonitor}
                  disabled={isAdding || !newUrl.trim()}
                  className="inline-flex items-center justify-center rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {isAdding ? "Adding..." : "Add Monitor"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard
            title="Total Monitors"
            value={stats.total}
            icon={<Activity className="h-5 w-5 text-purple-500" />}
            accentColor="purple"
          />
          <StatCard
            title="Operational"
            value={stats.operational}
            icon={<Globe className="h-5 w-5 text-emerald-500" />}
            accentColor="emerald"
          />
          <StatCard
            title="Down"
            value={stats.down}
            icon={<PauseCircle className="h-5 w-5 text-rose-500" />}
            accentColor="rose"
          />
        </div>

        {/* Your Monitors Header + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Your Monitors
          </h2>
          <div className="flex gap-3">
            <div className="relative flex-1 sm:min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search monitors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-1 rounded-lg border border-border p-1 bg-muted/30">
              <FilterBtn
                active={filterStatus === "all"}
                onClick={() => setFilterStatus("all")}
              >
                All
              </FilterBtn>
              <FilterBtn
                active={filterStatus === "up"}
                onClick={() => setFilterStatus("up")}
              >
                Up
              </FilterBtn>
              <FilterBtn
                active={filterStatus === "down"}
                onClick={() => setFilterStatus("down")}
              >
                Down
              </FilterBtn>
            </div>
          </div>
        </div>

        {/* Monitor Cards */}
        {filteredWebsites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No monitors found</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              {websites.length === 0
                ? "Get started by adding your first monitor to track uptime."
                : "No monitors match your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWebsites.map((website) => (
              <MonitorCard
                key={website.id}
                website={website}
                onDelete={handleDeleteMonitor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function StatCard({
  title,
  value,
  icon,
  accentColor,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  accentColor: "purple" | "emerald" | "rose";
}) {
  const glowMap = {
    purple:
      "from-purple-500/10 to-transparent border-purple-500/20 hover:border-purple-500/40",
    emerald:
      "from-emerald-500/10 to-transparent border-emerald-500/20 hover:border-emerald-500/40",
    rose: "from-rose-500/10 to-transparent border-rose-500/20 hover:border-rose-500/40",
  };

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-br ${glowMap[accentColor]} transition-colors duration-300 group`}
    >
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-4xl font-bold tracking-tight">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-background/50 border border-border flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function MonitorCard({
  website,
  onDelete,
}: {
  website: {
    id: string;
    url: string;
    ticks: {
      id: string;
      status: string;
      latency: number;
      createdAt: string;
      updatedAt: string;
    }[];
  };
  onDelete: (id: string) => void;
}) {
  const lastTick =
    website.ticks.length > 0 ? website.ticks[website.ticks.length - 1] : null;
  const isUp = !lastTick || lastTick.status === "Good";

  // Calculate uptime percentage
  const uptimePercent = useMemo(() => {
    if (website.ticks.length === 0) return 0;
    const goodTicks = website.ticks.filter((t) => t.status === "Good").length;
    return ((goodTicks / website.ticks.length) * 100).toFixed(2);
  }, [website.ticks]);

  // Calculate average response time
  const avgResponse = useMemo(() => {
    const validTicks = website.ticks.filter(
      (t) => t.status === "Good" && t.latency > 0,
    );
    if (validTicks.length === 0) return "0.00";
    const avg =
      validTicks.reduce((sum, t) => sum + t.latency, 0) / validTicks.length;
    return avg.toFixed(2);
  }, [website.ticks]);

  // Get last 30 ticks for the mini chart
  const recentTicks = website.ticks.slice(-30);

  return (
    <Card className="group relative overflow-hidden hover:border-purple-500/30 transition-all duration-300 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div
                className={`w-3 h-3 rounded-full ${isUp ? "bg-emerald-500" : "bg-rose-500"}`}
              />
              <div
                className={`absolute inset-0 w-3 h-3 rounded-full animate-ping ${isUp ? "bg-emerald-500/50" : "bg-rose-500/50"}`}
              />
            </div>
            <CardTitle className="text-base font-semibold truncate">
              {extractDomain(website.url)}
            </CardTitle>
          </div>
          <Badge
            variant={isUp ? "default" : "destructive"}
            className={`flex-shrink-0 text-xs ${
              isUp
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/25"
            }`}
          >
            {isUp ? "Operational" : "Down"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-1 pl-6">
          {website.url}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg bg-muted/40 border border-border/50 p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Wifi className="h-3 w-3" />
              Uptime
            </div>
            <p className="text-lg font-bold tracking-tight">{uptimePercent}%</p>
          </div>
          <div className="rounded-lg bg-muted/40 border border-border/50 p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Clock className="h-3 w-3" />
              Response
            </div>
            <p className="text-lg font-bold tracking-tight">{avgResponse}ms</p>
          </div>
        </div>

        {/* Mini Uptime Timeline */}
        <div className="mb-4">
          <div className="flex gap-[2px] h-6 items-end">
            {recentTicks.length > 0 ? (
              recentTicks.map((tick, i) => (
                <div
                  key={tick.id}
                  className={`flex-1 rounded-sm transition-all duration-200 min-w-[3px] ${
                    tick.status === "Good"
                      ? "bg-emerald-500/70 hover:bg-emerald-500"
                      : "bg-rose-500/70 hover:bg-rose-500"
                  }`}
                  style={{
                    height: `${Math.max(20, Math.min(100, (tick.latency / 500) * 100))}%`,
                  }}
                  title={`${tick.status} - ${tick.latency}ms`}
                />
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
                No data yet
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Visit
          </a>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
            onClick={() => onDelete(website.id)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer ${
        active
          ? "bg-background text-foreground shadow-sm border border-border"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace("www.", "");
  } catch {
    return url;
  }
}
