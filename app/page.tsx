"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ShapeGrid from "@/components/ShapeGrid";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090b] text-zinc-100">
      {/* Hero background */}
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

      {/* Dark overlay - does not block ShapeGrid interaction */}
      <div className="pointer-events-none absolute inset-0 bg-black/30" />

      {/* Main content */}
      <div className="pointer-events-none relative z-10">
        {/* Navbar */}
        <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 md:px-8">
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
        <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl items-center justify-center px-5 py-20 text-center md:px-8">
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

        {/* Dashboard Preview */}
        <section id="product" className="mx-auto max-w-7xl px-5 pb-28 md:px-8">
          <div className="relative">
            {/* Large soft shadow */}
            <div className="pointer-events-none absolute -inset-10 -z-10 bg-black/80 blur-3xl" />

            {/* Product frame */}
            <div className="overflow-hidden border border-zinc-800 bg-zinc-950 shadow-[0_50px_140px_rgba(0,0,0,0.8)]">
              {/* Browser bar */}
              <div className="flex h-11 items-center border-b border-zinc-800 bg-zinc-950 px-4">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 bg-zinc-700" />
                  <span className="h-2.5 w-2.5 bg-zinc-700" />
                  <span className="h-2.5 w-2.5 bg-zinc-700" />
                </div>

                <div className="mx-auto hidden text-[11px] text-zinc-700 sm:block">
                  TaskFlow · Workspace Dashboard
                </div>
              </div>

              <div className="relative">
                <Image
                  src="/taskflow-dashboard.png"
                  alt="TaskFlow dashboard"
                  width={1920}
                  height={1080}
                  priority
                  className="block h-auto w-full"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#08090b] via-[#08090b]/40 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Intro to features */}
        <section className="mx-auto max-w-4xl px-5 pb-28 text-center md:px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            Everything in one workspace
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built around the way your team actually works.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
            Projects, tasks, collaboration, analytics, and realtime activity —
            connected in one focused workspace.
          </p>
        </section>
      </div>
    </main>
  );
}
