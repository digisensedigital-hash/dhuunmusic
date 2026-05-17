import {
  Home,
  Search,
  Library,
  User,
} from 'lucide-react';

export default function
BottomNav() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-white/10 bg-[#11111A]/95 backdrop-blur-xl z-50">
      <div className="flex items-center justify-around h-20">
        {/* -------------------------------- */}
        {/* Home */}
        {/* -------------------------------- */}

        <button className="flex flex-col items-center gap-1 text-[#A855F7]">
          <Home size={22} />

          <span className="text-xs font-medium">
            Home
          </span>
        </button>

        {/* -------------------------------- */}
        {/* Search */}
        {/* -------------------------------- */}

        <button className="flex flex-col items-center gap-1 text-white/60">
          <Search size={22} />

          <span className="text-xs font-medium">
            Search
          </span>
        </button>

        {/* -------------------------------- */}
        {/* Library */}
        {/* -------------------------------- */}

        <button className="flex flex-col items-center gap-1 text-white/60">
          <Library size={22} />

          <span className="text-xs font-medium">
            Library
          </span>
        </button>

        {/* -------------------------------- */}
        {/* Profile */}
        {/* -------------------------------- */}

        <button className="flex flex-col items-center gap-1 text-white/60">
          <User size={22} />

          <span className="text-xs font-medium">
            Profile
          </span>
        </button>
      </div>
    </div>
  );
}