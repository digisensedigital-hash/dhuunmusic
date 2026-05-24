import PlaylistTrackRow
  from '../playlists/PlaylistTrackRow';

export default function
AllTracksView({

  tracks = [],

}) {

  if (
    !tracks.length
  ) {

    return (

      <div className="mt-12 rounded-[36px] border border-white/10 bg-white/[0.03] p-10 text-center">

        <h2 className="text-2xl font-bold text-white">

          No Tracks Found

        </h2>

        <p className="mt-4 text-white/50">

          Published tracks will appear here.

        </p>

      </div>
    );
  }

  return (

    <div className="mt-12">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.3em] text-white/40">

            Dhuun Catalog

          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">

            All Tracks

          </h2>

        </div>

        <div className="text-sm text-white/40">

          {tracks.length} Tracks

        </div>

      </div>

      <div className="mb-6 border-t border-white/10" />
        
      {/* Track List */}

      <div className="flex flex-col gap-2">

        {tracks.map(
          (
            track,
            index
          ) => (

            <PlaylistTrackRow

              key={
                track.id ||
                track._id
              }

              track={track}

              index={index}

              queue={tracks}
            />
          )
        )}

      </div>

    </div>
  );
}