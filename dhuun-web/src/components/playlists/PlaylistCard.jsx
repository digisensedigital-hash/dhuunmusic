import {
  Play,
} from 'lucide-react';

import {
  Link,
} from 'react-router-dom';

import {
  getMediaUrl,
} from '../../utils/media';

export default function
PlaylistCard({
  playlist,
}) {
  if (!playlist) {
    return null;
  }

  return (
    <Link
    to={`/app/playlist/${playlist.id}`}
    className="group relative overflow-hidden rounded-[34px] border border-white/10 bg-[#14141B] min-w-[240px] max-w-[240px] shadow-2xl">
      {/* -------------------------------- */}
      {/* Artwork Grid */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-2 aspect-square">
        {(playlist.images || [])
          .slice(0, 4)
          .map(
            (
              image,
              index
            ) => (
              <div
                key={index}
                className="overflow-hidden"
              >
                {image ? (
                  <img
                    src={
                      getMediaUrl(
                        image
                      )
                    }
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500" />
                )}
              </div>
            )
          )}
      </div>

      {/* -------------------------------- */}
      {/* Overlay */}
      {/* -------------------------------- */}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

      {/* -------------------------------- */}
      {/* Floating Play */}
      {/* -------------------------------- */}

      <button className="absolute bottom-20 right-5 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
        <Play
          size={22}
          fill="currentColor"
          className="ml-1"
        />
      </button>

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative p-5">
        <h3 className="text-lg font-bold truncate">
          {playlist.title}
        </h3>

        <p className="text-sm text-white/55 mt-2 line-clamp-2">
          {
            playlist.description
          }
        </p>

        <div className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
          <span>
            Curated Playlist
          </span>

          <div className="w-1 h-1 rounded-full bg-white/30" />

          <span>
            {
              playlist.trackCount
            } Tracks
          </span>
        </div>
      </div>
    </Link>
  );
}