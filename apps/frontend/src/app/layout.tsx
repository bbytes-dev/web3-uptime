import type { Metadata } from "next";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web3 Uptime — Decentralized Infrastructure Monitoring",
  description: "Monitor your Web3 endpoints with a decentralized network of validators. Cryptographically signed checks, on-chain payouts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#09090b] text-zinc-100`}>
        <ClerkProvider>
          <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
              <Link href="/" className="flex items-center gap-2.5 select-none group">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 transition-transform group-hover:scale-105">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <span className="text-sm font-semibold tracking-tight text-white">Web3 Uptime</span>
              </Link>

              <div className="hidden items-center gap-6 sm:flex">
                <Link href="/dashboard" className="text-[13px] text-zinc-400 transition-colors hover:text-white">
                  Dashboard
                </Link>
                <a href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noopener noreferrer" className="text-[13px] text-zinc-400 transition-colors hover:text-white">
                  Explorer
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Show when="signed-out">
                  <SignInButton>Sign in</SignInButton>
                  <SignUpButton>Get started</SignUpButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </div>
          </nav>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
