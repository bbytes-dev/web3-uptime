import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Globe, Zap, Shield, BarChart3, Database } from "lucide-react";
import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 flex flex-col items-center text-center">
        {/* Dynamic Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium mb-8 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
          <span className="text-purple-700 dark:text-purple-300">Web3 Uptime 2.0 is now live</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Unbreakable Monitoring for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500">
            Decentralized Networks
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
          The ultimate uptime checker built exclusively for Web3. Monitor your RPC endpoints, dApps, and validator nodes with sub-second accuracy across the globe.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <SignUpButton mode="modal">
            <Button size="lg" className="h-14 px-8 text-base bg-foreground text-background hover:bg-foreground/90 rounded-full group transition-all duration-300 shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] hover:shadow-[0_0_60px_-15px_rgba(168,85,247,0.7)]">
              Start Monitoring Free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SignUpButton>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-zinc-300 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-300">
              View Live Dashboard
            </Button>
          </Link>
        </div>

        {/* Hero Image / Dashboard Mockup */}
        <div className="mt-24 w-full relative z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20 h-full w-full pointer-events-none" />
          <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-card overflow-hidden shadow-2xl backdrop-blur-sm ring-1 ring-white/10 mx-auto max-w-5xl">
            {/* Window Controls */}
            <div className="h-12 border-b border-zinc-200 dark:border-zinc-800/60 bg-muted/30 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="ml-4 text-xs text-muted-foreground font-mono">dashboard.web3uptime.com</div>
            </div>
            
            {/* Dashboard Content Mockup */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-90 bg-card/50">
              <div className="h-40 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 flex flex-col justify-center p-6 relative overflow-hidden group hover:border-green-500/40 transition-colors">
                <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-green-500/20 rounded-full blur-2xl group-hover:bg-green-500/30 transition-colors" />
                <Activity className="h-8 w-8 text-green-500 mb-4" />
                <p className="text-sm text-muted-foreground mb-1">Global RPC Uptime</p>
                <p className="text-4xl font-bold text-foreground">99.999%</p>
              </div>
              
              <div className="h-40 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 flex flex-col justify-center p-6 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
                <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-colors" />
                <Database className="h-8 w-8 text-blue-500 mb-4" />
                <p className="text-sm text-muted-foreground mb-1">Active Validators</p>
                <p className="text-4xl font-bold text-foreground">1,248</p>
              </div>
              
              <div className="h-40 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 flex flex-col justify-center p-6 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
                <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-colors" />
                <Globe className="h-8 w-8 text-purple-500 mb-4" />
                <p className="text-sm text-muted-foreground mb-1">Avg Global Latency</p>
                <p className="text-4xl font-bold text-foreground">42ms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full relative py-24 border-t border-zinc-200 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for the <span className="text-purple-500">decentralized web</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Traditional monitoring tools fail when it comes to Web3. We built Web3 Uptime from the ground up to understand blockchain infrastructure, RPCs, and validator health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Globe className="h-6 w-6 text-purple-500" />}
              title="Global Multi-Region Checks"
              description="We ping your nodes from 15+ global locations simultaneously to ensure true global availability and detect regional DNS issues."
            />
            <FeatureCard 
              icon={<Zap className="h-6 w-6 text-cyan-500" />}
              title="Sub-second Resolution"
              description="Web3 moves fast. Our high-frequency polling detects micro-outages and latency spikes before your users even notice."
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-blue-500" />}
              title="RPC Health Verification"
              description="We don't just check if the port is open. We verify block heights, peer counts, and chain sync status."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-6 w-6 text-emerald-500" />}
              title="SLA Analytics"
              description="Generate beautiful, public-facing status pages to prove your 99.99% uptime to your community and investors."
            />
            <FeatureCard 
              icon={<Activity className="h-6 w-6 text-rose-500" />}
              title="Instant Multi-Channel Alerts"
              description="Get notified immediately via Telegram, Discord, Slack, PagerDuty, or Webhook the second an endpoint drops."
            />
            <FeatureCard 
              icon={<Database className="h-6 w-6 text-amber-500" />}
              title="Validator Slashing Protection"
              description="Monitor your validator balance, missed attestations, and slashing risks automatically across EVM and Cosmos chains."
            />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="w-full py-20 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center bg-card">
        <h2 className="text-3xl font-bold mb-6">Ready to secure your infrastructure?</h2>
        <p className="text-muted-foreground mb-8">Join hundreds of protocols already using Web3 Uptime.</p>
        <SignUpButton mode="modal">
          <Button size="lg" className="h-12 px-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white border-none">
            Get Started for Free
          </Button>
        </SignUpButton>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-background border border-zinc-200 dark:border-zinc-800/60 hover:border-purple-500/50 transition-all duration-300 group shadow-sm hover:shadow-md">
      <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-zinc-200 dark:border-zinc-800">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
