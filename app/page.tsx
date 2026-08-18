"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ShapeGrid from "@/components/ShapeGrid";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090b] text-zinc-100">
      {/* ShapeGrid Background */}
      <div className="absolute inset-0">
        <ShapeGrid
          speed={0.35}
          squareSize={42}
          direction="diagonal"
          borderColor="#3f3f46"
          hoverFillColor="#52525b"
          shape="square"
          hoverTrailAmount={0}
        />
      </div>

      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/30" />

      {/* Hero content */}
      <div className="pointer-events-none relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between px-5 py-6 md:px-8">
          <Link
            href="/"
            className="pointer-events-auto text-xl font-semibold tracking-tight text-white"
          >
            TaskFlow
          </Link>

          <div className="pointer-events-auto flex items-center gap-2">
            <Link
              href="/login"
              className="border border-zinc-800 bg-zinc-950/80 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="border border-zinc-500 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white"
            >
              Get Started
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="flex flex-1 items-center justify-center px-5 py-20 text-center md:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex border border-zinc-800 bg-black/60 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-zinc-500 backdrop-blur-sm">
              Project management for modern teams
            </div>

            <h1 className="mt-8 text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
              Plan.
              <br />
              Collaborate.
              <br />
              Ship.
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Manage projects, tasks, teams, and progress from one focused
              workspace built for modern teams.
            </p>

            <div className="pointer-events-auto mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 border border-zinc-500 bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-white"
              >
                Get Started
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/login"
                className="border border-zinc-800 bg-black/60 px-5 py-3 text-sm font-medium text-zinc-300 backdrop-blur-sm transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white"
              >
                Sign In
              </Link>
            </div>

            <p className="mt-5 text-xs text-zinc-600">
              Projects · Tasks · Teams · Analytics · Realtime Notifications
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
