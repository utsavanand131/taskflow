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
      return <CirclePlus size={18} />;

    case "TASK_UPDATED":
      return <RefreshCcw size={18} />;

    case "TASK_ASSIGNED":
      return <UserPlus size={18} />;

    default:
      return <CheckCircle2 size={18} />;
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
      <div className="rounded-xl border p-6 text-sm text-gray-500">
        No activity yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-6 space-y-6">
      <h2 className="text-xl font-semibold">Activity</h2>

      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border">
              {getIcon(activity.type)}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">{activity.message}</p>

              <p className="text-xs text-gray-500">
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
