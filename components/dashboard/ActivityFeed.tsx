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
    <div className="rounded-xl border p-5">
      <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id}>
            <p className="text-sm">{activity.message}</p>

            <p className="text-xs text-gray-500">
              {new Date(activity.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
