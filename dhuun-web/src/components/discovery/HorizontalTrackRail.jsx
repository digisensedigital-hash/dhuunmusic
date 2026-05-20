import TrackCard
  from '../tracks/TrackCard';

export default function
HorizontalTrackRail({
  title,
  items = [],
}) {

  // -----------------------------------
  // Debug Incoming Items
  // -----------------------------------

  console.log(
    `[RAIL_DEBUG] ${title}`,
    items
  );

  // -----------------------------------
  // Remove Invalid Entries
  // -----------------------------------

  const validItems =
    items.filter(
      (item) =>
        item?.track
    );

  console.log(
    `[RAIL_VALID] ${title}`,
    validItems
  );

  // -----------------------------------
  // Empty State
  // -----------------------------------

  if (
    !validItems.length
  ) {
    return (
      <section className="mb-10">
        <div className="text-red-400 text-sm">
          No valid items for:
          {' '}
          {title}
        </div>

        <pre className="text-white text-xs overflow-auto mt-2 bg-black/30 p-3 rounded-xl">
          {JSON.stringify(
            items,
            null,
            2
          )}
        </pre>
      </section>
    );
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
      {/* Debug Preview */}
      {/* -------------------------------- */}

      <pre className="text-white text-[10px] overflow-auto mb-4 bg-black/30 p-3 rounded-xl">
        {JSON.stringify(
          validItems[0],
          null,
          2
        )}
      </pre>

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
                recommendationReason={
                  item.reason
                }
              />
            </div>
          )
        )}
      </div>
    </section>
  );
}