"use client";

import { CheckCircle2, CirclePlus, RefreshCcw, UserPlus } from "lucide-react";

interface ActivityTimelineProps {
  activities: {
    id: string;
    type: string;
    message: string;
    createdAt: string;

    user?: {
      name: string;
    } | null;
  }[];
}

function getIcon(type: string) {
  switch (type) {
    case "TASK_CREATED":
      return <CirclePlus size={17} />;

    case "TASK_UPDATED":
      return <RefreshCcw size={17} />;

    case "TASK_ASSIGNED":
      return <UserPlus size={17} />;

    default:
      return <CheckCircle2 size={17} />;
  }
}

function getTime(date: string) {
  const diff = Date.now() - Number(date);

  const minutes = Math.floor(diff / 1000 / 60);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hours ago`;
  }

  return new Date(Number(date)).toLocaleDateString();
}

export default function ActivityTimeline({
  activities,
}: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="border border-dashed border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-sm text-zinc-500">No activity yet.</p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-800 bg-zinc-900/80 p-6">
      <div className="mb-6 border-b border-zinc-800 pb-5">
        <h2 className="text-lg font-semibold text-zinc-100">Activity</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Recent changes and actions on this task.
        </p>
      </div>

      <div className="space-y-0">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`flex gap-4 py-4 ${
              index !== activities.length - 1 ? "border-b border-zinc-800" : ""
            }`}
          >
            <div className="relative flex shrink-0">
              <div className="flex h-9 w-9 items-center justify-center border border-zinc-700 bg-zinc-950 text-zinc-400">
                {getIcon(activity.type)}
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-medium leading-6 text-zinc-200">
                {activity.message}
              </p>

              <p className="text-xs text-zinc-600">
                {activity.user?.name ?? "Unknown user"}
                {" • "}
                {getTime(activity.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
