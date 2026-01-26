'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Edit2, Trash2, Globe, ArrowRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from 'sonner';

interface AppConfig {
  id: string;
  name: string;
  slug: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  redirect_url?: string;
}

interface AppListClientProps {
  initialApps: AppConfig[];
}

export function AppListClient({ initialApps }: AppListClientProps) {
  const [apps, setApps] = useState<AppConfig[]>(initialApps);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; appId: string; appName: string }>({
    isOpen: false,
    appId: '',
    appName: ''
  });

  const handleDelete = async () => {
    const { appId } = deleteModal;
    const { error } = await supabase.from('apps').delete().eq('id', appId);
    if (error) {
      toast.error('Failed to delete app: ' + error.message);
    } else {
      setApps(apps.filter(app => app.id !== appId));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TooltipProvider>
        {apps.map((app, index) => (
          <Card 
            key={app.id} 
            className="group overflow-hidden bg-[#232323] border-[#2e2e2e] hover:border-primary/50 hover:bg-[#282828] transition-all duration-300 flex flex-col shadow-lg hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5">
              <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl ring-2 ring-white/5 group-hover:ring-primary/20 transition-all duration-500"
                  style={{ backgroundColor: app.theme.primary }}
              >
                  {app.name.charAt(0)}
              </div>
              <div className="flex gap-1 items-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10">
                      <Link href={`/admin/apps/${app.slug}`}>
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-[10px]">Edit</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteModal({ isOpen: true, appId: app.id, appName: app.name })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-[10px]">Delete</TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            
            <CardContent className="p-5 pt-0 flex-grow">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300">{app.name}</CardTitle>
                <CardDescription className="flex items-center text-[11px] font-mono text-muted-foreground">
                    <Globe className="w-3 h-3 mr-1.5 opacity-70" /> {app.slug}
                </CardDescription>
              </div>
              
              <div className="mt-6 flex gap-4">
                 <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Theme</p>
                    <div className="flex -space-x-1">
                        <div className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: app.theme.primary }} />
                        <div className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: app.theme.secondary }} />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Public View</p>
                    <Button variant="outline" size="sm" className="h-7 px-3 text-[10px] border-[#2e2e2e] bg-[#1c1c1c] text-muted-foreground hover:text-primary hover:border-primary/50 transition-all font-bold group/preview shadow-sm" asChild>
                        <Link href={`/${app.slug}`} target="_blank">
                            <Eye className="w-3 h-3 mr-1.5 opacity-70 group-hover/preview:opacity-100 transition-opacity" /> Live Preview
                        </Link>
                    </Button>
                 </div>
              </div>
            </CardContent>

            <CardFooter className="p-5 pt-0 mt-auto flex items-center justify-between border-t border-white/[0.03]">
              <Button variant="ghost" className="p-0 h-auto text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-all duration-300" asChild>
                <Link href={`/admin/apps/${app.slug}`}>
                    View Content Editor <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </TooltipProvider>
      
      {apps.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 py-16 text-center bg-[#232323] border border-dashed border-[#2e2e2e] rounded-xl">
              <p className="text-muted-foreground text-sm tracking-tight">No applications registered in your ecosystem yet.</p>
          </div>
      )}

      <ConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleDelete}
        title="Delete Application"
        message={`Are you sure you want to delete "${deleteModal.appName}"? This will permanently remove all legal content and data associated with this app. This action cannot be undone.`}
        confirmText="Delete App"
        variant="danger"
      />
    </div>
  );
}
