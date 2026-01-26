'use client';

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { AdminAppBar } from "@/components/admin/AdminAppBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#1c1c1c] font-outfit text-sm">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminAppBar />
          <main className="flex-1 overflow-y-auto bg-[#1c1c1c]">
            <div className="p-8 md:p-12 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
