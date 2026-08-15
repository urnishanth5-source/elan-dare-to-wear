import React, { useState } from 'react';
import {
  getSupabase,
  isSupabaseConfigured,
  getStoredConfig,
  saveSupabaseConfig,
} from '../lib/supabase';
import {
  Lock,
  Key,
  Database,
  Check,
  AlertCircle,
  ArrowLeft,
  Shield,
  RefreshCw,
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

const ALLOWED_ADMIN_EMAILS = new Set([
  'urnishanth11@gmail.com',
]);

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStore }) => {
  const stored = getStoredConfig();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState(stored.url || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(stored.key || '');
  const [isConfigOpen, setIsConfigOpen] = useState(!isSupabaseConfigured());
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [configSaved, setConfigSaved] = useState(false);

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      setErrorMessage('Please enter both Supabase Project URL and Publishable Key.');
      return;
    }
    saveSupabaseConfig(supabaseUrl.trim(), supabaseAnonKey.trim());
    setConfigSaved(true);
    setErrorMessage(null);
    setTimeout(() => setConfigSaved(false), 3000);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMessage('Enter your admin email and password.');
      return;
    }
    if (!ALLOWED_ADMIN_EMAILS.has(cleanEmail)) {
      setErrorMessage('This account does not have administrator access.');
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabase();
      if (!supabase || !isSupabaseConfigured()) {
        setErrorMessage('Supabase authentication is not configured.');
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error || !data.session || !data.user) {
        setErrorMessage('Invalid admin email or password.');
        return;
      }
      localStorage.setItem('elan_admin_authenticated', 'true');
      localStorage.setItem('elan_admin_email', cleanEmail);
      onLoginSuccess();
    } catch (err) {
      console.error('Admin sign-in error:', err);
      setErrorMessage('Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <button onClick={onBackToStore} className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to elan. Storefront</span>
        </button>

        <div className="bg-[#12151d] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Store Admin Portal</h1>
            <p className="text-xs text-zinc-400">Authorized store management access for elan. Coimbatore.</p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">Admin Email</label>
              <input type="email" required placeholder="urnishanth11@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-xs bg-[#090a0f] text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">Password</label>
              <input type="password" required placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full text-xs bg-[#090a0f] text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none transition-colors" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>Signing in...</span></> : <><Lock className="w-4 h-4" /><span>Sign In as Admin</span></>}
            </button>
          </form>

          <div className="pt-4 border-t border-white/[0.08]">
            <button onClick={() => setIsConfigOpen(!isConfigOpen)} className="w-full flex items-center justify-between text-xs text-zinc-400 hover:text-white py-1 transition-colors">
              <span className="flex items-center gap-2 font-semibold"><Database className="w-3.5 h-3.5 text-blue-400" /><span>Supabase Connection Settings</span></span>
              <span className="text-[10px] text-blue-400 font-bold uppercase">{isConfigOpen ? 'Hide' : 'Configure'}</span>
            </button>
            {isConfigOpen && (
              <form onSubmit={handleSaveSupabaseConfig} className="mt-4 space-y-3 bg-[#090a0f] p-4 rounded-xl border border-white/10">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">Supabase Project URL</label>
                  <input type="url" placeholder="https://xyzcompany.supabase.co" value={supabaseUrl} onChange={(e) => setSupabaseUrl(e.target.value)} className="w-full text-xs bg-[#12151d] text-white px-3 py-2 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">Supabase Publishable Key</label>
                  <input type="text" placeholder="sb_publishable_..." value={supabaseAnonKey} onChange={(e) => setSupabaseAnonKey(e.target.value)} className="w-full text-xs bg-[#12151d] text-white px-3 py-2 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none font-mono" />
                </div>
                <button type="submit" className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5">
                  {configSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Key className="w-3.5 h-3.5 text-blue-400" />}
                  <span>{configSaved ? 'Configuration Saved!' : 'Save Supabase Config'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
