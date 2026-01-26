import { createClient } from '@/lib/supabase-server';
import { AppWindow, Plus } from 'lucide-react';
import Link from 'next/link';
import { AppListClient } from '@/components/admin/AppListClient';
import { Button } from "@/components/ui/button";

export default async function AppsManagementPage() {
  const supabase = await createClient();
  
  const { data: apps, error } = await supabase
    .from('apps')
    .select('id, name, slug, theme')
    .order('name');
  
  if (error) {
    console.error('Error fetching apps:', error);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2e2e2e]">
        <div>
            <h1 className="text-xl font-bold tracking-tight text-white mb-0.5 flex items-center gap-3">
                <AppWindow className="w-5 h-5 text-primary" />
                Applications
            </h1>
            <p className="text-muted-foreground text-[13px]">Create and manage legal content for your ecosystem apps.</p>
        </div>
        <Button size="sm" className="rounded-md h-9 px-4 font-bold shadow-lg shadow-primary/20" asChild>
            <Link href="/admin/apps/new">
                <Plus className="w-4 h-4 mr-1" />
                Add New App
            </Link>
        </Button>
      </div>

      <AppListClient initialApps={apps || []} />
    </div>
  );
}
