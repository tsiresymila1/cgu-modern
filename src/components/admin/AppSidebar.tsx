'use client';

import { 
  LayoutDashboard, 
  AppWindow, 
  UserX, 
  LogOut, 
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

const ADMIN_EMAIL = 'tsiresymila@gmail.com';

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Applications', href: '/admin/apps', icon: AppWindow },
    { name: 'Deletion Requests', href: '/admin/requests', icon: UserX },
  ];

  return (
    <>
      <Sidebar className="border-r border-border bg-card">
        <SidebarHeader className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-base tracking-tight text-foreground">CGU Admin</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-4 px-2">Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`h-10 px-3 rounded-md transition-all ${
                          isActive 
                            ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary' 
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        }`}
                      >
                        <Link href={item.href}>
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{item.name}</span>
                          {isActive && <div className="ml-auto w-1 h-4 bg-primary rounded-full" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-border space-y-4">
          <div className="px-3 py-2 bg-background/50 rounded-lg border border-border">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-bold">Authenticated as</p>
            <p className="text-xs font-medium truncate text-foreground">{ADMIN_EMAIL}</p>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setLogoutModalOpen(true)}
                className="h-10 px-3 rounded-md text-destructive hover:bg-destructive/5 hover:text-destructive transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout System</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <ConfirmationModal 
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will need to request a new code to access the admin panel again."
        confirmText="Logout"
        variant="danger"
      />
    </>
  );
}
