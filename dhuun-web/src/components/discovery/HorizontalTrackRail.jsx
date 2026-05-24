import {
  useNavigate,
} from 'react-router-dom';

import TrackCard
  from '../tracks/TrackCard';

export default function
HorizontalTrackRail({
  title,
  items = [],
}) {

  const navigate =
    useNavigate();

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

      <div className="mb-5 flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          {title}

        </h2>

        <button

          onClick={() => {

            navigate(
              '/app/search'
            );
          }}

          className="text-sm text-white/40 transition hover:text-white"
        >

          View All

        </button>

      </div>

      {/* -------------------------------- */}
      {/* Horizontal Rail */}
      {/* -------------------------------- */}

      <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-1">

        {validItems.map(

          (
            item,
            index
          ) => (

            <div
              key={
                item.track?.id ||
                item.track?._id ||
                `${title}-${index}`
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