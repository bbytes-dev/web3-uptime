import type { Metadata } from "next";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Outfit, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Web3 Uptime — Decentralized Infrastructure Monitoring",
  description:
    "Monitor your Web3 endpoints with a decentralized network of validators. Cryptographically signed checks, on-chain payouts on Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased bg-[#060611] text-zinc-100 font-sans`}
      >
        <ClerkProvider>
          <nav className="fixed top-0 z-50 w-full border-b border-white/[0.04] bg-[#060611]/70 backdrop-blur-2xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
              <Link
                href="/"
                className="flex items-center gap-2.5 select-none group"
              >
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20 transition-shadow group-hover:shadow-blue-500/40">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <span className="font-display text-[15px] font-bold tracking-tight text-white">
                  Web3 Uptime
                </span>
              </Link>

              <div className="hidden items-center gap-8 md:flex">
                <Link
                  href="#features"
                  className="text-[13px] font-medium text-zinc-500 transition-colors hover:text-white"
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-[13px] font-medium text-zinc-500 transition-colors hover:text-white"
                >
                  How It Works
                </Link>
                <Link
                  href="/validator"
                  className="text-[13px] font-medium text-zinc-500 transition-colors hover:text-white"
                >
                  Validators
                </Link>
                <Link
                  href="/dashboard"
                  className="text-[13px] font-medium text-zinc-500 transition-colors hover:text-white"
                >
                  Dashboard
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <Show when="signed-out">
                  <SignInButton>Sign in</SignInButton>
                  <SignUpButton>Get started</SignUpButton>
                </Show>
                <Show when="signed-in">
                  <Link
                    href="/dashboard"
                    className="text-[13px] font-medium text-zinc-400 transition-colors hover:text-white mr-2"
                  >
                    Dashboard
                  </Link>
                  <UserButton />
                </Show>
              </div>
            </div>
          </nav>
          <main className="pt-16">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
