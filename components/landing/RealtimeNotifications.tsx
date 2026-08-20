"use client";

import { Bell, CheckCircle2, UserPlus } from "lucide-react";

const notifications = [
  {
    icon: CheckCircle2,
    message: 'Assigned task "ui polishing"',
    time: "Just now",
  },
  {
    icon: CheckCircle2,
    message: 'Created task "Build Dashboard UI"',
    time: "2 minutes ago",
  },
  {
    icon: UserPlus,
    message: 'Invited john@test.com to team "backend team"',
    time: "5 minutes ago",
  },
];

export default function RealtimeNotifications() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
            Realtime notifications
          </p>

          <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Stay informed as your workspace changes.
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
            TaskFlow keeps important workspace events close at hand so teammates
            can see updates without constantly refreshing the page.
          </p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-8 -z-10 bg-blue-500/[0.035] blur-3xl" />

          <div className="overflow-hidden border border-zinc-800 bg-zinc-950 shadow-[0_35px_100px_rgba(0,0,0,0.65)]">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-zinc-200">
                  Notifications
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Latest workspace activity
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center border border-zinc-800 bg-zinc-900">
                <Bell size={16} className="text-zinc-400" />
              </div>
            </div>

            <div>
              {notifications.map((notification, index) => {
                const Icon = notification.icon;

                return (
                  <div
                    key={notification.message}
                    className={`flex gap-4 px-5 py-5 ${
                      index !== notifications.length - 1
                        ? "border-b border-zinc-800"
                        : ""
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-zinc-800 bg-zinc-900">
                      <Icon size={16} className="text-zinc-500" />
                    </div>

                    <div>
                      <p className="text-sm text-zinc-300">
                        {notification.message}
                      </p>

                      <p className="mt-1 text-xs text-zinc-700">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
