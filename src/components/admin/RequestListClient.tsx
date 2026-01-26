'use client';

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from '@/lib/supabase';
import { CheckCircle2, Clock, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeletionRequest {
  id: string;
  email: string;
  app_name: string;
  reason: string;
  status: string;
  created_at: string;
}

interface RequestListClientProps {
  initialRequests: DeletionRequest[];
}

export function RequestListClient({ initialRequests }: RequestListClientProps) {
  const [requests, setRequests] = useState<DeletionRequest[]>(initialRequests);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('deletion_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    }
  };

  return (
    <div className="bg-[#232323] border border-[#2e2e2e] rounded-md overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <Table>
        <TableHeader className="bg-[#1c1c1c]">
          <TableRow className="hover:bg-transparent border-[#2e2e2e]">
            <TableHead className="w-[300px] text-muted-foreground uppercase text-xs font-bold tracking-wider">User / Email</TableHead>
            <TableHead className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Application</TableHead>
            <TableHead className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Status</TableHead>
            <TableHead className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Date</TableHead>
            <TableHead className="text-right text-muted-foreground uppercase text-xs font-bold tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="p-12 text-center text-muted-foreground">No deletion requests found yet.</TableCell>
            </TableRow>
          ) : requests.map((req) => (
            <TableRow key={req.id} className="border-[#2e2e2e] hover:bg-[#282828] transition-colors group">
              <TableCell className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1c1c1c] flex items-center justify-center border border-[#2e2e2e]">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-foreground text-[13px]">{req.email}</span>
                </div>
              </TableCell>
              <TableCell className="p-3">
                <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-[#2e2e2e]">
                  {req.app_name}
                </span>
              </TableCell>
              <TableCell className="p-3">
                <div className="flex items-center gap-2">
                  {req.status === 'pending' ? (
                    <span className="flex items-center text-yellow-500 text-[11px] gap-1 font-medium">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  ) : (
                    <span className="flex items-center text-primary text-[11px] gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="p-3 text-[12px] text-muted-foreground">
                {new Date(req.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="p-3 text-right">
                {req.status === 'pending' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateStatus(req.id, 'completed')}
                    className="text-[11px] h-7 px-3 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary rounded-md border border-primary/20 transition-all font-bold"
                  >
                    Complete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
