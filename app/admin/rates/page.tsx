'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RatesManager() {
  const router = useRouter();
  const [goldRate, setGoldRate] = useState('');
  const [silverRate, setSilverRate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch('https://at-dey-backend.onrender.com');
        const data = await response.json();
        data.forEach((item: any) => {
          if (item.metal === 'GOLD_24K') setGoldRate(item.price.toString());
          if (item.metal === 'SILVER_1KG') setSilverRate(item.price.toString());
        });
      } catch (error) { console.error(error); }
    }
    fetchRates();
  }, []);

  const handleUpdateRate = async (metalType: string, price: string) => {
    setMessage(`Updating ${metalType.replace('_', ' ')}...`);
    try {
      const response = await fetch('https://at-dey-backend.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metal: metalType, price: parseFloat(price) }),
      });
      if (response.ok) {
        setMessage('Successfully updated.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) { setMessage('Error updating rate.'); }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-16">
      <div className="max-w-2xl mx-auto">
        
        <button onClick={() => router.push('/admin/dashboard')} className="text-sm text-slate-400 hover:text-slate-800 mb-8 transition-colors">
          ← Back to Workspace
        </button>

        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
          <h1 className="text-2xl font-light text-slate-800 mb-8">Daily Market Rates</h1>

          <div className="space-y-8">
            {/* Gold */}
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">24K Gold (10g)</label>
                <input
                  type="number"
                  value={goldRate}
                  onChange={(e) => setGoldRate(e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-b-2 border-slate-100 focus:border-amber-400 outline-none text-2xl font-light text-slate-800 transition-colors"
                />
              </div>
              <button
                onClick={() => handleUpdateRate('GOLD_24K', goldRate)}
                className="mt-6 px-6 py-3 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-sm font-medium transition-colors"
              >
                Update
              </button>
            </div>

            {/* Silver */}
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Silver (1Kg)</label>
                <input
                  type="number"
                  value={silverRate}
                  onChange={(e) => setSilverRate(e.target.value)}
                  className="w-full px-0 py-2 bg-transparent border-b-2 border-slate-100 focus:border-slate-400 outline-none text-2xl font-light text-slate-800 transition-colors"
                />
              </div>
              <button
                onClick={() => handleUpdateRate('SILVER_1KG', silverRate)}
                className="mt-6 px-6 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-medium transition-colors"
              >
                Update
              </button>
            </div>
          </div>

          {message && <p className="text-emerald-600 text-sm mt-8 text-center bg-emerald-50 py-3 rounded-xl">{message}</p>}
        </div>
      </div>
    </div>
  );
}