import { getAppBySlug, getApps } from "@/lib/content";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { notFound } from "next/navigation";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ appName: string }>;
}

export async function generateStaticParams() {
  const apps = await getApps();
  return apps.map((app) => ({
    appName: app.slug,
  }));
}

import { AppNavbar } from "@/components/AppNavbar";

export default async function AppLayout({ children, params }: LayoutProps) {
  const { appName } = await params;
  const app = await getAppBySlug(appName);

  if (!app) {
    notFound();
  }

  return (
    <ThemeWrapper theme={app.theme}>
      <div className="min-h-screen bg-[#1c1c1c] text-[#ededed] font-outfit">
        <AppNavbar appName={app.name} appSlug={app.slug} />
        <main className="max-w-4xl mx-auto p-6 md:p-12">
          {children}
        </main>
        <footer className="border-t border-[#2e2e2e] mt-12 py-12 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} {app.name}. All rights reserved.
            </p>
            <div className="mt-4 flex items-center justify-center gap-6">
              <Link href={`/${app.slug}/privacy-policy`} className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href={`/${app.slug}/data-deletion`} className="text-xs text-muted-foreground hover:text-primary transition-colors">Data Deletion</Link>
            </div>
          </div>
        </footer>
      </div>
    </ThemeWrapper>
  );
}
