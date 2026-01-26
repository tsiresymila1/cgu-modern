'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    Save, 
    ArrowLeft, 
    Eye, 
    Edit3, 
    Palette, 
    ChevronRight,
    Loader2,
    Info
} from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AppData {
    id?: string;
    name: string;
    slug: string;
    theme: {
        primary: string;
        secondary: string;
        accent: string;
    };
    pages: {
        home: string;
        privacy_policy: string;
        data_deletion: string;
    };
    redirect_url?: string;
}

interface AppEditorClientProps {
    initialData: AppData;
    isNew: boolean;
}

import { toast } from "sonner";

export function AppEditorClient({ initialData, isNew }: AppEditorClientProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'home' | 'privacy' | 'deletion'>('home');
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
    const [data, setData] = useState<AppData>(initialData);

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = isNew 
                ? await supabase.from('apps').insert([data])
                : await supabase.from('apps').update(data).eq('id', data.id);
            
            if (error) {
                toast.error('Save failed', { description: error.message });
            } else {
                toast.success('App updated', { description: `${data.name} has been saved successfully.` });
                if (isNew) router.push('/admin/apps');
                else router.refresh();
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unexpected error occurred';
            toast.error('Error', { description: message });
        } finally {
            setSaving(false);
        }
    };

    const tabsList = [
        { id: 'home', name: 'Home View', key: 'home' },
        { id: 'privacy', name: 'Privacy Policy', key: 'privacy_policy' },
        { id: 'deletion', name: 'Data Deletion', key: 'data_deletion' }
    ] as const;

    return (
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
                <div className="flex items-center gap-5">
                    <Button variant="outline" size="icon" onClick={() => router.push('/admin/apps')} className="h-10 w-10 border-border bg-card hover:bg-accent hover:text-foreground">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">
                            <span>Ecosystem</span>
                            <ChevronRight className="w-3 h-3" />
                            <span>{isNew ? 'New Entry' : 'Configuration'}</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{isNew ? 'Register New App' : data.name}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!isNew && (
                        <Button variant="outline" className="h-11 px-6 border-border bg-card hover:bg-accent hover:text-foreground font-bold" asChild>
                            <Link href={`/${data.slug}`} target="_blank">
                                <Eye className="w-4 h-4 mr-2" />
                                View Live
                            </Link>
                        </Button>
                    )}
                    <Button 
                        onClick={handleSave}
                        disabled={saving}
                        className="h-11 px-6 font-bold shadow-lg shadow-primary/20"
                    >
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Branding Left Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-[#232323] border-[#2e2e2e] shadow-xl overflow-hidden">
                        <CardHeader className="border-b border-[#2e2e2e] pb-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                                <Palette className="w-5 h-5 text-primary" />
                                Branding & Identity
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">App Name</label>
                                <Input 
                                    value={data.name} 
                                    onChange={e => {
                                        const newName = e.target.value;
                                        const newSlug = newName.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                                        setData({...data, name: newName, slug: newSlug});
                                    }}
                                    placeholder="e.g. ZenFlow"
                                    className="bg-[#1c1c1c] border-[#2e2e2e] h-11 focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">URL Slug</label>
                                <div className="flex gap-2">
                                    <div className="flex flex-1 items-center group">
                                        <div className="bg-[#1c1c1c] border border-r-0 border-[#2e2e2e] rounded-l-md h-11 px-4 flex items-center text-muted-foreground text-sm">/</div>
                                        <Input 
                                            value={data.slug} 
                                            onChange={e => setData({...data, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                                            placeholder="zenflow"
                                            className="bg-[#1c1c1c] border-[#2e2e2e] rounded-l-none h-11 focus:ring-primary flex-1"
                                        />
                                    </div>
                                    {!isNew && (
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            className="h-11 w-11 border-border bg-card hover:bg-accent hover:text-foreground shrink-0"
                                            asChild
                                        >
                                            <Link href={`/${data.slug}`} target="_blank">
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5 text-center">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Primary</label>
                                    <div className="relative group">
                                      <input 
                                          type="color" 
                                          value={data.theme.primary} 
                                          onChange={e => setData({...data, theme: {...data.theme, primary: e.target.value}})}
                                          className="w-full h-10 rounded-md cursor-pointer bg-[#1c1c1c] border border-[#2e2e2e] p-1"
                                      />
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-center">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Secondary</label>
                                    <input 
                                        type="color" 
                                        value={data.theme.secondary} 
                                        onChange={e => setData({...data, theme: {...data.theme, secondary: e.target.value}})}
                                        className="w-full h-10 rounded-md cursor-pointer bg-[#1c1c1c] border border-[#2e2e2e] p-1"
                                    />
                                </div>
                                <div className="space-y-1.5 text-center">
                                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Accent</label>
                                    <input 
                                        type="color" 
                                        value={data.theme.accent} 
                                        onChange={e => setData({...data, theme: {...data.theme, accent: e.target.value}})}
                                        className="w-full h-10 rounded-md cursor-pointer bg-[#1c1c1c] border border-[#2e2e2e] p-1"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[#2e2e2e]">
                                <h3 className="text-xs font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-widest mb-4">
                                    <Info className="w-3.5 h-3.5" /> Preview Branding
                                </h3>
                                <div className="p-4 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] flex flex-col items-center gap-3">
                                    <div 
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl border border-white/10"
                                        style={{ backgroundColor: data.theme.primary }}
                                    >
                                        {data.name?.charAt(0) || '?'}
                                    </div>
                                    <span className="text-sm font-bold" style={{ color: data.theme.primary }}>{data.name || 'Sample App'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Editor Main */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-[#232323] border-[#2e2e2e] rounded-2xl overflow-hidden flex flex-col min-h-[700px] shadow-2xl">
                        {/* Tab Bar */}
                        <div className="bg-[#1c1c1c] border-b border-[#2e2e2e] p-3 flex flex-wrap items-center justify-between gap-4">
                            <Tabs 
                                value={activeTab} 
                                onValueChange={(value) => setActiveTab(value as 'home' | 'privacy' | 'deletion')} 
                                className="bg-[#232323] p-1 rounded-lg border border-[#2e2e2e]"
                            >
                                <TabsList className="bg-transparent border-none">
                                    {tabsList.map(tab => (
                                        <TabsTrigger
                                            key={tab.id}
                                            value={tab.id}
                                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium px-4 h-8"
                                        >
                                            {tab.name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>

                            <div className="flex items-center gap-2 bg-[#232323] p-1 rounded-lg border border-[#2e2e2e]">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => setViewMode('edit')}
                                          className={`h-8 w-8 rounded-md ${viewMode === 'edit' ? 'bg-[#2e2e2e] text-primary' : 'text-muted-foreground'}`}
                                      >
                                          <Edit3 className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Edit Markdown</TooltipContent>
                                  </Tooltip>

                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => setViewMode('preview')}
                                          className={`h-8 w-8 rounded-md ${viewMode === 'preview' ? 'bg-[#2e2e2e] text-primary' : 'text-muted-foreground'}`}
                                      >
                                          <Eye className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Live Preview</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>

                        {/* Editor/Preview Surface */}
                        <div className="flex-1 relative bg-[#1c1c1c]/50">
                            {viewMode === 'edit' ? (
                                <textarea
                                    className="w-full h-full min-h-[600px] p-10 bg-transparent text-[#ededed] font-mono text-sm resize-none outline-none focus:ring-0 leading-relaxed"
                                    value={activeTab === 'home' ? data.pages.home : activeTab === 'privacy' ? data.pages.privacy_policy : data.pages.data_deletion}
                                    onChange={e => {
                                        const field = activeTab === 'home' ? 'home' : activeTab === 'privacy' ? 'privacy_policy' : 'data_deletion';
                                        setData({
                                            ...data,
                                            pages: { ...data.pages, [field]: e.target.value }
                                        });
                                    }}
                                    placeholder={`# Start writing ${activeTab} content...`}
                                />
                            ) : (
                                <div className="p-10 h-full min-h-[600px] overflow-auto prose prose-invert max-w-none">
                                    <MarkdownRenderer 
                                        content={activeTab === 'home' ? data.pages.home : activeTab === 'privacy' ? data.pages.privacy_policy : data.pages.data_deletion} 
                                    />
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
