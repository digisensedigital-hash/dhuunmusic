import {
  LayoutDashboard,
  Music2,
  Disc3,
  ListMusic,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react';

import {
  NavLink,
} from 'react-router-dom';

const navigation = [
  {
    section: 'Core',

    items: [
      {
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/',
      },

      {
        label: 'Tracks',
        icon: Music2,
        path: '/tracks',
      },

      {
        label: 'Artists',
        icon: Disc3,
        path: '/artists',
      },

      {
        label: 'Playlists',
        icon: ListMusic,
        path: '/playlists',
      },
    ],
  },

  {
    section: 'Intelligence',

    items: [
      {
        label: 'Users',
        icon: Users,
        path: '/users',
      },

      {
        label: 'Analytics',
        icon: BarChart3,
        path: '/analytics',
      },
    ],
  },

  {
    section: 'System',

    items: [
      {
        label: 'Settings',
        icon: Settings,
        path: '/settings',
      },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-zinc-800 bg-zinc-950">

      {/* ----------------------------------- */}
      {/* Branding */}
      {/* ----------------------------------- */}

      <div className="border-b border-zinc-800 px-6 py-6">
        <h1 className="text-2xl font-bold text-white">
          Dhuun Admin
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Streaming Control Center
        </p>
      </div>

      {/* ----------------------------------- */}
      {/* Navigation */}
      {/* ----------------------------------- */}

      <div className="flex-1 overflow-y-auto px-4 py-6">

        {navigation.map((group) => (
          <div
            key={group.section}
            className="mb-8"
          >
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {group.section}
            </p>

            <div className="space-y-1">

              {group.items.map((item) => {
                const Icon =
                  item.icon;

                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    className={({
                      isActive,
                    }) =>
                      `
                      flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? 'bg-white text-black'
                          : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                      }
                    `
                    }
                  >
                    <Icon
                      size={19}
                    />

                    <span>
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ----------------------------------- */}
      {/* Footer */}
      {/* ----------------------------------- */}

      <div className="border-t border-zinc-800 p-4">
        <div className="rounded-2xl bg-zinc-900 p-4">
          <p className="text-sm font-medium text-white">
            Dhuun Platform
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Streaming Operations Suite
          </p>
        </div>
      </div>
    </aside>
  );
}