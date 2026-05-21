import {
  Bell,
  Search,
} from 'lucide-react';

import {
  useLocation,
  useSearchParams,
} from 'react-router-dom';

const pageTitles = {
  '/': {
    title: 'Dashboard',

    subtitle:
      'Monitor platform activity and streaming analytics',
  },

  '/tracks': {
    title: 'Tracks',

    subtitle:
      'Manage music catalog, uploads, and metadata',
  },

  '/artists': {
    title: 'Artists',

    subtitle:
      'Manage artists, profiles, and releases',
  },

  '/playlists': {
    title: 'Playlists',

    subtitle:
      'Curate and organize streaming playlists',
  },

  '/users': {
    title: 'Users',

    subtitle:
      'Monitor listener activity and engagement',
  },

  '/analytics': {
    title: 'Analytics',

    subtitle:
      'Track streaming performance and platform insights',
  },

  '/settings': {
    title: 'Settings',

    subtitle:
      'Manage platform configuration and preferences',
  },
};

export default function Topbar() {

  const location =
    useLocation();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const search =
    searchParams.get(
      'search'
    ) || '';

  const currentPage =
    pageTitles[
      location.pathname
    ] ||
    pageTitles['/'];

  return (
    <header className="flex h-20 items-center justify-between border-b border-zinc-800 bg-black px-8">

      {/* ----------------------------------- */}
      {/* Left */}
      {/* ----------------------------------- */}

      <div>
        <h2 className="text-2xl font-bold text-white">
          {currentPage.title}
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          {currentPage.subtitle}
        </p>
      </div>

      {/* ----------------------------------- */}
      {/* Right */}
      {/* ----------------------------------- */}

      <div className="flex items-center gap-4">

        {/* Search */}

        <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3">

          <Search
            size={18}
            className="text-zinc-500"
          />

          <input
            type="text"

            value={search}

            onChange={(e) => {

              const value =
                e.target.value;

              setSearchParams(
                value
                  ? { search: value }
                  : {}
              );
            }}

            placeholder="Search tracks, artists, playlists..."

            className="w-72 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
          />
        </div>

        {/* Notifications */}

        <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-300 transition hover:bg-zinc-900 hover:text-white">
          <Bell size={18} />
        </button>

        {/* Profile */}

        <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-3 py-2">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-white">
            A
          </div>

          <div className="text-left">
            <p className="text-sm font-medium text-white">
              Admin
            </p>

            <p className="text-xs text-zinc-500">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}