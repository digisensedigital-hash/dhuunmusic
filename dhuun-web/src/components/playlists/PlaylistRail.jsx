import PlaylistCard
  from './PlaylistCard';

export default function
PlaylistRail({
  title,
  items = [],
}) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="mb-12">
      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold tracking-tight">
          {title}
        </h2>

        <button className="text-sm text-white/40">
          View All
        </button>
      </div>

      {/* -------------------------------- */}
      {/* Rail */}
      {/* -------------------------------- */}

      <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-1">
        {items.map(
          (playlist) => (
            <PlaylistCard
              key={
                playlist.id
              }
              playlist={
                playlist
              }
            />
          )
        )}
      </div>
    </section>
  );
}