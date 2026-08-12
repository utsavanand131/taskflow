interface Activity {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

export default function ActivityFeed({
  activities,
}: {
  activities: Activity[];
}) {
  return (
    <div className="border border-zinc-800 bg-zinc-900/80 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Latest activity across your workspace
          </p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="border border-dashed border-zinc-800 p-8 text-center">
          <p className="text-sm text-zinc-500">No recent activity.</p>
        </div>
      ) : (
        <div className="space-y-0">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`flex gap-4 py-4 ${
                index !== activities.length - 1
                  ? "border-b border-zinc-800"
                  : ""
              }`}
            >
              <div className="mt-1 h-2 w-2 shrink-0 bg-zinc-400" />

              <div className="min-w-0">
                <p className="text-sm leading-6 text-zinc-200">
                  {activity.message}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {new Date(Number(activity.createdAt)).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
