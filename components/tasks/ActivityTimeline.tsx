"use client";

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
    <div className="rounded-xl border p-6 space-y-5">
      <h2 className="text-xl font-semibold">Activity</h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border-l-2 pl-4 space-y-1">
            <p className="text-sm">{activity.message}</p>

            <p className="text-xs text-gray-500">
              {activity.user?.name ?? "Unknown user"}
              {" • "}
              {new Date(Number(activity.createdAt)).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
