'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeLogin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple PIN check for demonstration (Change '1234' to whatever you prefer)
    if (pin === '1234') {
      router.push('/admin/dashboard');
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 selection:bg-amber-100">
      <div className="bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md border border-slate-100 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">A.T. Dey & Son</h1>
        <p className="text-sm text-slate-400 mb-8">Employee Portal Access</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              placeholder="Enter Access PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 text-center text-xl tracking-[0.5em] bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
              autoFocus
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium tracking-wide hover:bg-slate-800 transition-colors shadow-sm"
          >
            Authenticate
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-6 animate-pulse">{error}</p>}
      </div>
    </div>
  );
}