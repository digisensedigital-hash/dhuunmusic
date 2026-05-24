import {
  Home,
  Search,
  Library,
  User,
} from 'lucide-react';

import {
  Link,
  useLocation,
} from 'react-router-dom';

export default function
BottomNav() {
  const location =
    useLocation();

  const isActive =
    (path) =>
      location.pathname ===
      path;

  const navItems = [
    {
      label: 'Home',

      icon: Home,

      path: '/app',
    },

    {
      label: 'Search',

      icon: Search,

      path: '/app/search',
    },

    {
      label: 'Library',

      icon: Library,

      path: '/app/library',
    },

    {
      label: 'Profile',

      icon: User,

      path: '/app/profile',
    },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-white/10 bg-[#11111A]/95 backdrop-blur-xl">

      <div className="flex h-20 items-center justify-around">

        {navItems.map(
          (item) => {
            const Icon =
              item.icon;

            const active =
              isActive(
                item.path
              );

            return (
              <Link
                key={
                  item.path
                }

                to={
                  item.path
                }

                className={`flex flex-col items-center gap-1 transition-colors ${
                  active
                    ? 'text-[#A855F7]'
                    : 'text-white/60'
                }`}
              >

                <Icon size={22} />

                <span className="text-xs font-medium">
                  {
                    item.label
                  }
                </span>

              </Link>
            );
          }
        )}

      </div>

    </div>
  );
}