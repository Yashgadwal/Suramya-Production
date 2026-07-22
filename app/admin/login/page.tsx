'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      router.push('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6 font-sans">
      <div className="max-w-md w-full bg-white border border-beige/40 p-8 sm:p-10 rounded-sm shadow-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="p-3 bg-ivory border border-beige/45 rounded-full w-fit mx-auto text-gold">
            <ShieldCheck size={28} />
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-xl tracking-wider text-charcoal">Suramya Studio Portal</h2>
            <span className="text-[9px] tracking-[0.25em] uppercase text-grey-secondary block">
              Authorized personnel only
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 text-xs p-3.5 border-l-2 border-red-500 rounded-r-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 text-xs">
          {/* Username Input */}
          <div className="space-y-2 relative">
            <label className="block uppercase text-charcoal tracking-wide font-semibold">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-secondary">
                <User size={16} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full pl-10 pr-4 py-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10"
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2 relative">
            <label className="block uppercase text-charcoal tracking-wide font-semibold">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-secondary">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-beige/65 focus:border-gold focus:outline-none rounded-sm bg-ivory/10"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gold hover:bg-gold-dark disabled:bg-gold/50 text-ivory font-serif text-xs tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer shadow-sm"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[10px] text-grey-secondary leading-relaxed">
            Trouble logging in? Contact your local database administrator to reset security credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
