import TrackCard
  from '../tracks/TrackCard';

export default function
HorizontalTrackRail({
  title,
  items = [],
}) {
  // -----------------------------------
  // Remove Invalid Entries
  // -----------------------------------

  const validItems =
    items.filter(
      (item) =>
        item?.track
    );

  // -----------------------------------
  // Empty State
  // -----------------------------------

  if (
    !validItems.length
  ) {
    return null;
  }

  return (
    <section className="mb-10">
      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold">
          {title}
        </h2>

        <button className="text-sm text-white/40">
          View All
        </button>
      </div>

      {/* -------------------------------- */}
      {/* Horizontal Rail */}
      {/* -------------------------------- */}

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
        {validItems.map(
          (item) => (
            <div
              key={
                item.track?.id
              }
              className="min-w-[180px] max-w-[180px] flex-shrink-0"
            >
              <TrackCard
                track={
                  item.track
                }
              />
            </div>
          )
        )}
      </div>
    </section>
  );
}