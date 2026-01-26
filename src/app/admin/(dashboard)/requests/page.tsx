import { createClient } from '@/lib/supabase-server';
import { UserX } from 'lucide-react';
import { RequestListClient } from '@/components/admin/RequestListClient';

export default async function DeletionRequestsPage() {
  const supabase = await createClient();
  
  const { data: requests, error } = await supabase
    .from('deletion_requests')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching requests:', error);
  }

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-[#2e2e2e]">
        <h1 className="text-xl font-bold tracking-tight text-white mb-0.5 flex items-center gap-3">
            <UserX className="w-5 h-5 text-primary" />
            Deletion Requests
        </h1>
        <p className="text-muted-foreground text-[13px]">Manage user privacy and data erasure requests across all your platform applications.</p>
      </div>

      <RequestListClient initialRequests={requests || []} />
    </div>
  );
}
