import Sidebar
  from './Sidebar';

import Topbar
  from './Topbar';

export default function AdminLayout({
  children,
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      
      {/* ----------------------------------- */}
      {/* Sidebar */}
      {/* ----------------------------------- */}

      <Sidebar />

      {/* ----------------------------------- */}
      {/* Main Content */}
      {/* ----------------------------------- */}

      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Topbar */}

        <Topbar />

        {/* Page Content */}

        <main className="flex-1 overflow-y-auto bg-black p-8">
          {children}
        </main>
      </div>
    </div>
  );
}