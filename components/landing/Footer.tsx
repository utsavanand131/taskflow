"use client";

import Link from "next/link";

import TaskFlowLogo from "@/components/brand/TaskFlowLogo";

export default function Footer() {
  return (
    <footer className="pointer-events-auto border-t border-zinc-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center">
          <TaskFlowLogo href="/" variant="wordmark" className="h-7 w-auto" />
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-zinc-600">
          <Link href="/" className="transition hover:text-zinc-300">
            Home
          </Link>

          <a href="#product" className="transition hover:text-zinc-300">
            Product
          </a>

          <a href="#features" className="transition hover:text-zinc-300">
            Features
          </a>

          <Link href="/login" className="transition hover:text-zinc-300">
            Sign In
          </Link>

          <Link href="/register" className="transition hover:text-zinc-300">
            Get Started
          </Link>
        </nav>

        <p className="text-xs text-zinc-700 md:text-right">
          © 2026 TaskFlow. Built for modern teams.
        </p>
      </div>
    </footer>
  );
}
