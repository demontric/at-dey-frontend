'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardHub() {
  const router = useRouter();
  const [goldRate, setGoldRate] = useState('Loading...');
  const [silverRate, setSilverRate] = useState('Loading...');

  // Fetch the live rates to display in the side widget
  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch('https://at-dey-backend.onrender.com/api/inventory');
        const data = await response.json();
        let foundGold = false;
        let foundSilver = false;
        
        data.forEach((item: any) => {
          if (item.metal === 'GOLD_24K') {
            setGoldRate(`₹${item.price.toLocaleString()}`);
            foundGold = true;
          }
          if (item.metal === 'SILVER_1KG') {
            setSilverRate(`₹${item.price.toLocaleString()}`);
            foundSilver = true;
          }
        });

        if (!foundGold) setGoldRate('Not Set');
        if (!foundSilver) setSilverRate('Not Set');
      } catch (error) {
        setGoldRate('Offline');
        setSilverRate('Offline');
      }
    }
    fetchRates();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b-2 border-slate-200">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
              A.T. Dey <span className="text-amber-500">&</span> Son
            </h1>
            <p className="text-slate-500 font-medium tracking-wide text-sm mt-1">EMPLOYEE WORKSPACE</p>
          </div>
          <button 
            onClick={() => router.push('/admin')} 
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-full transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* MAIN LAYOUT: Matches your sketch (2-column split) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: Big Action Buttons */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Valuate Ornaments Button */}
            <div 
              onClick={() => router.push('/admin/valuation')}
              className="bg-white border-2 border-slate-100 hover:border-amber-400 p-10 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <div>
                <h2 className="text-3xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Valuate Ornaments</h2>
                <p className="text-slate-500 mt-2 text-lg">Calculate point-of-sale buy & sell prices</p>
              </div>
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-amber-500">₹</span>
              </div>
            </div>

            {/* Manage Inventory Button */}
            <div 
              onClick={() => router.push('/admin/inventory')}
              className="bg-white border-2 border-slate-100 hover:border-amber-400 p-10 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <div>
                <h2 className="text-3xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Manage Inventory</h2>
                <p className="text-slate-500 mt-2 text-lg">Add and update digital catalog items</p>
              </div>
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-amber-500">❖</span>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Rates Display Widget */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-3xl p-8 shadow-lg border border-slate-800 h-full flex flex-col justify-between">
              
              <div>
                <h3 className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-8">Live Market Rates</h3>
                
                <div className="space-y-6">
                  <div className="border-b border-slate-700 pb-6">
                    <p className="text-slate-400 text-sm mb-1">24K Gold (per 10g)</p>
                    <p className="text-4xl font-light text-white">{goldRate}</p>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Silver (per 1Kg)</p>
                    <p className="text-4xl font-light text-white">{silverRate}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => router.push('/admin/rates')}
                className="mt-12 w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 text-lg font-black rounded-xl transition-colors shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                EDIT RATES
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}