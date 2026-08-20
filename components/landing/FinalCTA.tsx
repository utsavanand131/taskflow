"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import TaskFlowLogo from "@/components/brand/TaskFlowLogo";

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div className="relative overflow-hidden border border-zinc-800 bg-zinc-950 px-6 py-16 text-center shadow-[0_40px_120px_rgba(0,0,0,0.65)] sm:px-10 md:py-20">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.035] blur-[110px]" />

        <div className="relative">
          <TaskFlowLogo variant="mark" className="mx-auto h-10 w-10" />

          <p className="mt-7 text-xs font-medium uppercase tracking-[0.22em] text-zinc-600">
            Start building
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Bring your team&apos;s work into one place.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
            Organize projects, manage tasks, collaborate with your team, and
            keep progress visible from one focused workspace.
          </p>

          <div className="pointer-events-auto mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
              className="border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
