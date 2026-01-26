'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface DeletionFormProps {
  appName: string;
}

export function DeletionForm({ appName }: DeletionFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const reason = formData.get('reason') as string;

    try {
      const { error: insertError } = await supabase
        .from('deletion_requests')
        .insert([{
            email,
            app_name: appName,
            reason: reason || null,
            status: 'pending'
        }]);
      
      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit request. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-primary/10 border border-primary/30 rounded-2xl p-8 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Request Received</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We have received your request to delete data for <strong>{appName}</strong>. 
          Our team will review it and notify you via email once processed (usually within 30 days).
        </p>
      </div>
    );
  }

  return (
    <Card className="bg-[#232323] border-[#2e2e2e] shadow-xl overflow-hidden">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-destructive text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Registered Email Address
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              required
              placeholder="your@email.com"
              className="bg-[#1c1c1c] border-[#2e2e2e] rounded-xl h-12 focus:ring-primary"
            />
            <p className="text-[10px] text-muted-foreground">The email used to create your account in {appName}.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="reason" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Reason for deletion (Optional)
            </label>
            <textarea
              name="reason"
              id="reason"
              rows={3}
              className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-foreground resize-none text-sm"
              placeholder="I no longer use the service..."
            />
          </div>

          <div className="flex items-start">
            <label className="flex items-start cursor-pointer group">
                <div className="relative flex items-center h-5">
                    <input
                        id="confirm"
                        name="confirm"
                        type="checkbox"
                        required
                        className="h-4 w-4 bg-[#1c1c1c] border-[#2e2e2e] rounded accent-primary cursor-pointer mt-1"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                        I confirm that I want to permanently delete my data and understand this cannot be undone.
                    </span>
                </div>
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl text-white font-bold transition-all shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Deletion'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
