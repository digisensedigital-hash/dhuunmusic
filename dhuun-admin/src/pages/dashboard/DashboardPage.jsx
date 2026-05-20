const stats = [
  {
    title: 'Total Tracks',
    value: '1,284',
  },

  {
    title: 'Total Artists',
    value: '312',
  },

  {
    title: 'Active Users',
    value: '18,420',
  },

  {
    title: 'Streams Today',
    value: '92,184',
  },
];

export default function DashboardPage() {
  return (
    <div>

      {/* ----------------------------------- */}
      {/* Page Header */}
      {/* ----------------------------------- */}

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">
          Streaming Overview
        </h1>

        <p className="mt-2 text-zinc-500">
          Monitor platform performance, engagement, and streaming activity.
        </p>
      </div>

      {/* ----------------------------------- */}
      {/* KPI Grid */}
      {/* ----------------------------------- */}

      <div className="grid grid-cols-4 gap-6">

        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6"
          >
            <p className="text-sm text-zinc-500">
              {stat.title}
            </p>

            <h2 className="mt-4 text-4xl font-bold text-white">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ----------------------------------- */}
      {/* Placeholder Analytics Blocks */}
      {/* ----------------------------------- */}

      <div className="mt-8 grid grid-cols-3 gap-6">

        <div className="col-span-2 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h3 className="text-xl font-semibold text-white">
            Streaming Analytics
          </h3>

          <div className="mt-6 flex h-80 items-center justify-center rounded-2xl border border-dashed border-zinc-700">
            <p className="text-zinc-500">
              Analytics charts coming soon
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h3 className="text-xl font-semibold text-white">
            Recent Activity
          </h3>

          <div className="mt-6 space-y-4">
            
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-zinc-900 p-4"
              >
                <p className="text-sm text-white">
                  New track uploaded
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  2 minutes ago
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}