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

      path: '/',
    },

    {
      label: 'Search',

      icon: Search,

      path: '/search',
    },

    {
      label: 'Library',

      icon: Library,

      path: '/library',
    },

    {
      label: 'Profile',

      icon: User,

      path: '/profile',
    },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-white/10 bg-[#11111A]/95 backdrop-blur-xl z-50">
      <div className="flex items-center justify-around h-20">
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
                to={item.path}
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