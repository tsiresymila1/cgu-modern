import { createClient } from '@/lib/supabase-server';
import { AppWindow, UserX, FileText, CheckCircle, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function getStats() {
    const supabase = await createClient();
    const { count: appsCount } = await supabase.from('apps').select('*', { count: 'exact', head: true });
    const { count: requestsCount } = await supabase.from('deletion_requests').select('*', { count: 'exact', head: true });
    const { count: pendingRequests } = await supabase.from('deletion_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending');

    return {
        apps: appsCount || 0,
        requests: requestsCount || 0,
        pending: pendingRequests || 0
    };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { name: 'Active Apps', value: stats.apps, icon: AppWindow, color: '#3ecf8e' },
    { name: 'Total Requests', value: stats.requests, icon: UserX, color: '#F472B6' },
    { name: 'Pending Action', value: stats.pending, icon: FileText, color: '#FBBF24' },
    { name: 'System Status', value: 'Healthy', icon: CheckCircle, color: '#818CF8' },
  ];

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-xl font-bold mb-1">Platform Overview</h1>
        <p className="text-muted-foreground text-[13px]">Welcome back. Here is what is happening across your applications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card 
            key={card.name} 
            className="bg-[#232323] border-[#2e2e2e] relative overflow-hidden group hover:border-primary/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider">{card.name}</CardDescription>
              <CardTitle className="text-2xl font-bold">{card.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
               <div 
                  className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ color: card.color }}
              >
                  <card.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="bg-[#232323] border-[#2e2e2e]">
            <CardHeader className="p-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                  <AppWindow className="w-4 h-4 text-primary" />
                  Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
               <p className="text-muted-foreground text-xs">Live activity stream tracking app updates and user requests.</p>
            </CardContent>
         </Card>
         
         <Card className="bg-[#232323] border-[#2e2e2e]">
            <CardHeader className="p-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="p-3 bg-[#1c1c1c] rounded-lg border border-[#2e2e2e]">
                  <p className="text-[11px] text-muted-foreground mb-1 uppercase font-bold">Access restricted to whitelist:</p>
                  <div className="font-mono text-xs text-primary font-bold">tsiresymila@gmail.com</div>
              </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
