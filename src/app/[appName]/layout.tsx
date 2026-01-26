import { getAppBySlug, getApps } from "@/lib/content";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

export default async function AppLayout({ children, params }: LayoutProps) {
  const { appName } = await params;
  const app = await getAppBySlug(appName);

  if (!app) {
    notFound();
  }

  return (
    <ThemeWrapper theme={app.theme}>
      <div className="min-h-screen bg-[#1c1c1c] text-[#ededed] font-outfit">
        <nav className="border-b border-[#2e2e2e] bg-[#232323]/80 backdrop-blur-md sticky top-0 z-10 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href={app.redirect_url || "/"} className="inline-flex items-center text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" />
              {app.redirect_url ? 'Back to App' : 'Back to Platform'}
            </Link>
            <h1 className="font-bold text-base tracking-tight text-foreground uppercase">
              {app.name}
            </h1>
          </div>
        </nav>
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
