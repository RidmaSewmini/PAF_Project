import Navbar from "./Navbar";

export default function DashboardLayout({ sidebar, children }) {
  return (
    <div className="flex h-[100dvh] min-h-[100dvh] bg-[#f8f9fc] font-titillium text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden w-full">
      {/* Optional Sidebar Injection */}
      {sidebar && (
        <div className="hidden lg:block h-full z-20 flex-shrink-0">
          {sidebar}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative w-full overflow-hidden">
        {/* Unified Navbar globally injected */}
        <Navbar />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-28 w-full relative">
          <div className="mx-auto w-full max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
