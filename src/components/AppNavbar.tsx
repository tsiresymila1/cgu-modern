'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface AppNavbarProps {
  appName: string;
  appSlug: string;
}

export function AppNavbar({ appName, appSlug }: AppNavbarProps) {
  const pathname = usePathname();
  
  // Check if we are on the app's root page (e.g., /zenflow)
  // or a sub-page (e.g., /zenflow/privacy-policy)
  const isAppRoot = pathname === `/${appSlug}`;

  const backHref = isAppRoot ? "/" : `/${appSlug}`;
  const backLabel = isAppRoot ? "Back to Platform" : "Back to App";

  return (
    <nav className="border-b border-[#2e2e2e] bg-[#232323]/80 backdrop-blur-md sticky top-0 z-10 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link 
          href={backHref} 
          className="inline-flex items-center text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" />
          {backLabel}
        </Link>
        <h1 className="font-bold text-base tracking-tight text-foreground uppercase">
          {appName}
        </h1>
      </div>
    </nav>
  );
}
