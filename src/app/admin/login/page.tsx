'use client';

import { supabase } from '@/lib/supabase';
import { ArrowRight, Key, Loader2, Mail, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ADMIN_EMAIL = 'tsiresymila@gmail.com';

export default function AdminLogin() {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    // Check if already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        router.push('/admin');
        router.refresh();
      }
    };
    checkUser();
  }, [router]);

  const handleSendOtp = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: ADMIN_EMAIL.toLowerCase(),
        options: {
          shouldCreateUser: true,
        }
      });
      if (error) throw error;
      setStep('verify');
      setCooldown(60); // Standard Supabase rate limit cooldown
    } catch (err) {
      if (err instanceof Error && 'code' in err && err.code === 'otp_disabled') {
        setError('Configuration needed: You must toggle "Allow new users to sign up" to ON in your Supabase Dashboard (Auth -> Settings) for this first-time setup.');
      } else if (err instanceof Error && (('code' in err && err.code === 'over_email_send_rate_limit') || ('status' in err && err.status === 429))) {
        setError('Rate limit reached: Please wait 60 seconds before requesting another code.');
        setCooldown(60);
      } else {
        const message = err instanceof Error ? err.message : 'Failed to send code';
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: ADMIN_EMAIL.toLowerCase(),
        token: otp,
        type: 'email',
      });

      if (error) throw error;

      // Force a refresh to ensure cookies are sent to the server for the next request
      router.refresh();

      // Wait a tiny bit for the refresh to trigger before navigation
      setTimeout(() => {
        router.push('/admin');
      }, 100);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid code';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#232323] border border-[#2e2e2e] rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/30">
            <Shield className="w-8 h-8 text-white/90" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Admin Access</h1>
        <p className="text-gray-400 text-center mb-8">
          Secure login for <strong>{ADMIN_EMAIL}</strong>
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {step === 'request' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-[#1c1c1c] rounded-xl border border-[#2e2e2e]">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="text-gray-300 font-mono text-sm">{ADMIN_EMAIL}</span>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="font w-full py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-md transition-all flex font-medium items-center justify-center gap-2 group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Send Code
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full pl-12 pr-4 py-3 bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl focus:border-[#3ecf8e] focus:ring-1 focus:ring-[#3ecf8e] outline-none transition-all font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#3ecf8e] hover:bg-[#34b27b] disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Enter'}
            </button>

            <button
              type="button"
              onClick={() => setStep('request')}
              className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Resend code
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
