import {
  Link,
} from 'react-router-dom';

export default function
ArtistResultCard({
  artist,
}) {
  if (!artist) {
    return null;
  }

  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 min-w-[180px] max-w-[180px] block transition-transform duration-300 hover:scale-[1.02]"
    >
      {/* -------------------------------- */}
      {/* Glow */}
      {/* -------------------------------- */}

      <div className="absolute -top-10 right-[-20px] w-[120px] h-[120px] bg-fuchsia-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* -------------------------------- */}
      {/* Content */}
      {/* -------------------------------- */}

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Avatar */}

        {artist.profileImage ? (
          <img
            src={
              artist.profileImage
            }
            alt={
              artist.stageName
            }
            className="w-24 h-24 rounded-full object-cover border border-white/10 shadow-2xl"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 flex items-center justify-center text-3xl font-black text-white shadow-2xl">
            {artist.stageName
              ?.charAt(0)
              ?.toUpperCase()}
          </div>
        )}

        {/* Meta */}

        <h3 className="mt-5 text-lg font-bold truncate w-full">
          {
            artist.stageName
          }
        </h3>

        <p className="text-sm text-white/45 mt-2">
          Artist
        </p>

        {/* Verified Feel */}

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/10 px-4 h-10 text-xs uppercase tracking-[0.2em] text-white/60">
          <div className="w-2 h-2 rounded-full bg-sky-400" />

          Verified
        </div>
      </div>
    </Link>
  );
}