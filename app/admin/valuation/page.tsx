'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ValuationCalculator() {
  const router = useRouter();
  const [transactionType, setTransactionType] = useState('SELL');
  const [metal, setMetal] = useState('GOLD');
  
  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Purity
  const [purityMode, setPurityMode] = useState('RATING');
  const [purityRating, setPurityRating] = useState(0.916);
  const [purityPercent, setPurityPercent] = useState('');
  
  const [weight, setWeight] = useState('');
  const [makingCharge, setMakingCharge] = useState('10');
  const [processingLoss, setProcessingLoss] = useState('2');
  
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    setError('');
    setResult(null);

    const finalPurity = purityMode === 'PERCENT' ? Number(purityPercent) / 100 : Number(purityRating);

    if (!finalPurity || finalPurity <= 0) {
      setError("Please enter a valid purity amount.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/valuate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionType,
          metal,
          purity: finalPurity,
          weightGrams: Number(weight),
          makingChargePercent: Number(makingCharge) || 0,
          processingLossPercent: Number(processingLoss) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Calculation failed');
      
      setResult({ ...data, transactionType, finalPurity });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* ========================================== */}
      {/* ON-SCREEN DASHBOARD                        */}
      {/* ========================================== */}
      <div className="print:hidden min-h-screen bg-slate-50 p-8 md:p-12 text-slate-900 *:text-slate-900">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-serif font-black tracking-tight text-slate-900">
              Point of Sale
            </h1>
            <button onClick={() => router.push('/admin/dashboard')} className="text-sm font-bold text-slate-500 hover:text-amber-600 transition-colors uppercase tracking-widest">
              ← Back to Workspace
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LEFT COLUMN: Input Form */}
            <div className="bg-white rounded-2xl shadow-md border-2 border-slate-100 p-8 lg:p-10">
              <h2 className="text-xl font-serif font-bold text-slate-800 mb-8 border-b-2 border-slate-100 pb-4">Transaction Details</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 pb-6 border-b-2 border-slate-100">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Customer</label>
                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Name" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-400 outline-none text-base font-bold transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Phone</label>
                    <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Number" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-400 outline-none text-base font-bold transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Transaction Type</label>
                  <div className="flex bg-slate-100 p-1.5 rounded-xl">
                    <button onClick={() => { setTransactionType('SELL'); setResult(null); }} className={`flex-1 py-3 rounded-lg text-sm font-extrabold transition-all ${transactionType === 'SELL' ? 'bg-white shadow-md text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}>
                      SELLING TO CUSTOMER
                    </button>
                    <button onClick={() => { setTransactionType('BUY'); setResult(null); }} className={`flex-1 py-3 rounded-lg text-sm font-extrabold transition-all ${transactionType === 'BUY' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}>
                      EXCHANGE
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Metal</label>
                    <select value={metal} onChange={(e) => { setMetal(e.target.value); setPurityRating(e.target.value === 'GOLD' ? 0.916 : 0.925); }} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-400 outline-none text-base font-bold appearance-none">
                      <option value="GOLD">Gold</option>
                      <option value="SILVER">Silver</option>
                    </select>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest">Purity</label>
                      <div className="flex gap-2">
                        <button onClick={() => setPurityMode('RATING')} className={`text-[10px] uppercase tracking-wider ${purityMode === 'RATING' ? 'font-black text-amber-600' : 'font-bold text-slate-400 hover:text-slate-600'}`}>Rating</button>
                        <span className="text-slate-300 text-[10px] font-black">|</span>
                        <button onClick={() => setPurityMode('PERCENT')} className={`text-[10px] uppercase tracking-wider ${purityMode === 'PERCENT' ? 'font-black text-amber-600' : 'font-bold text-slate-400 hover:text-slate-600'}`}>%</button>
                      </div>
                    </div>

                    {purityMode === 'RATING' ? (
                      <select value={purityRating} onChange={(e) => setPurityRating(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-400 outline-none text-base font-bold appearance-none">
                        {metal === 'GOLD' ? (
                          <>
                            <option value={0.999}>24K (99.9%)</option>
                            <option value={0.916}>22K (91.62%)</option>
                            <option value={0.750}>18K (75.0%)</option>
                            <option value={0.583}>14K (58.3%)</option>
                            <option value={0.375}>9K (37.5%)</option>
                          </>
                        ) : (
                          <>
                            <option value={0.999}>Pure (99.9%)</option>
                            <option value={0.925}>Sterling (92.5%)</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <input type="number" value={purityPercent} onChange={(e) => setPurityPercent(e.target.value)} placeholder="e.g., 88.5" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-400 outline-none text-base font-bold" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Weight (Grams)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0.00" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-400 outline-none text-lg font-black" />
                </div>

                {transactionType === 'SELL' && (
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Making Charge (%)</label>
                    <input type="number" value={makingCharge} onChange={(e) => setMakingCharge(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-400 outline-none text-lg font-black" />
                  </div>
                )}

                {transactionType === 'BUY' && (
                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Processing Loss (%)</label>
                    <input type="number" value={processingLoss} onChange={(e) => setProcessingLoss(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-400 outline-none text-lg font-black" />
                  </div>
                )}

                <button onClick={handleCalculate} disabled={!weight} className="w-full bg-slate-900 text-white py-4 rounded-xl font-extrabold tracking-widest uppercase hover:bg-slate-800 transition-colors disabled:opacity-50 mt-4 shadow-lg shadow-slate-900/20">
                  Calculate Valuation
                </button>

                {error && <p className="text-red-600 font-bold text-sm text-center mt-4">{error}</p>}
              </div>
            </div>

            {/* RIGHT COLUMN: The Summary */}
            <div className="bg-white rounded-2xl shadow-md border-2 border-slate-100 p-8 lg:p-10 h-fit">
              <h2 className="text-2xl font-serif font-bold text-slate-800 mb-8 border-b-2 border-slate-100 pb-4">Valuation Summary</h2>
              
              {result ? (
                <div className="space-y-5 text-base text-slate-700">
                  <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl mb-6">
                    <span className="text-slate-500 uppercase tracking-widest text-xs font-extrabold">Client</span>
                    <span className="font-black text-slate-900">{customerName || 'WALK-IN'}</span>
                  </div>

                  <div className="flex justify-between px-2">
                    <span className="font-bold">Net Weight</span>
                    <span className="font-black text-slate-900">{result.weightGrams}g</span>
                  </div>
                  <div className="flex justify-between px-2 border-b-2 bForder-slate-100 pb-5">
                    <span className="font-bold">Metal Value</span>
                    <span className="font-black text-slate-900">₹{result.baseMetalValue}</span>
                  </div>

                  {transactionType === 'SELL' ? (
                    <div className="flex justify-between px-2 border-b-2 border-slate-100 pb-5">
                      <span className="font-bold">Making Charges</span>
                      <span className="font-black text-amber-600">+ ₹{result.makingCharge}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between px-2 border-b-2 border-slate-100 pb-5 text-red-600">
                      <span className="font-bold">Processing Loss</span>
                      <span className="font-black">- ₹{result.deduction}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center px-2 pt-4">
                    <span className="text-slate-500 uppercase tracking-widest text-sm font-extrabold">Grand Total</span>
                    <span className="text-4xl font-black text-slate-900">₹{result.totalPrice}</span>
                  </div>

                  <button onClick={() => window.print()} className="w-full mt-8 flex items-center justify-center gap-2 bg-slate-200 text-slate-800 py-4 rounded-xl font-extrabold uppercase tracking-widest hover:bg-slate-300 transition-colors border-2 border-slate-300">
                    Print Formal Invoice
                  </button>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                  <span className="text-5xl mb-4">✦</span>
                  <p className="text-base font-bold tracking-wide uppercase">Awaiting Parameters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* PRINT TEMPLATE (ONLY VISIBLE ON PAPER)     */}
      {/* ========================================== */}
      {result && (
        <div className="hidden print:block bg-white text-black p-8 font-sans w-[210mm] min-h-[297mm] mx-auto">
          <div className="text-center border-b-4 border-black pb-6 mb-6">
            <h1 className="text-5xl font-serif font-black uppercase tracking-widest">A.T. Dey & Son</h1>
            <p className="text-xl font-bold mt-2 text-gray-800">Jewellers</p>
            <p className="text-xl font-bold mt-2 text-gray-800">Gold | Diamonds | Silver</p>
            <p className="text-sm font-semibold text-gray-600 mt-2">107B, B.B. Ganguly Street</p>
            <p className="text-sm font-semibold text-gray-600">Phone: +91 9830714658</p>
          </div>

          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-widest mb-4 border-b-2 border-black inline-block pb-1">
                {result.transactionType === 'SELL' ? 'ESTIMATE / INVOICE' : 'EXCHANGE VOUCHER'}
              </h2>
              <div className="space-y-2 text-base">
                <p><span className="font-extrabold w-28 inline-block">Customer:</span> <span className="font-semibold">{customerName || 'Cash Sale / Walk-in'}</span></p>
                <p><span className="font-extrabold w-28 inline-block">Phone:</span> <span className="font-semibold">{customerPhone || 'N/A'}</span></p>
              </div>
            </div>
            <div className="text-right text-base space-y-2">
              <p><span className="font-extrabold">Invoice No:</span> <span className="font-semibold">{Math.floor(100000 + Math.random() * 900000)}</span></p>
              <p><span className="font-extrabold">Date:</span> <span className="font-semibold">{new Date().toLocaleDateString('en-IN')}</span></p>
              <p><span className="font-extrabold">Time:</span> <span className="font-semibold">{new Date().toLocaleTimeString('en-IN')}</span></p>
            </div>
          </div>

          <table className="w-full text-left border-collapse mb-8 text-lg">
            <thead>
              <tr className="border-y-4 border-black">
                <th className="py-4 px-2 font-black">Description</th>
                <th className="py-4 px-2 font-black text-center">Purity</th>
                <th className="py-4 px-2 font-black text-right">Weight</th>
                <th className="py-4 px-2 font-black text-right">Rate (/g)</th>
                <th className="py-4 px-2 font-black text-right">Metal Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b-2 border-gray-400">
                <td className="py-5 px-2 font-bold">{result.metal} Ornament</td>
                <td className="py-5 px-2 text-center font-bold">{(result.finalPurity * 100).toFixed(1)}%</td>
                <td className="py-5 px-2 text-right font-bold">{result.weightGrams}g</td>
                <td className="py-5 px-2 text-right font-bold">₹{(result.ratePerGram*result.finalPurity).toFixed(0)}</td>
                <td className="py-5 px-2 text-right font-bold">₹{result.baseMetalValue}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end mb-16">
            <div className="w-1/2 space-y-4 text-lg">
              <div className="flex justify-between px-2 font-bold text-gray-700">
                <span>Base Metal Value:</span>
                <span>₹{result.baseMetalValue}</span>
              </div>
              
              {result.transactionType === 'SELL' ? (
                <div className="flex justify-between px-2 font-bold text-gray-700">
                  <span>Making Charges:</span>
                  <span>₹{result.makingCharge}</span>
                </div>
              ) : (
                <div className="flex justify-between px-2 font-bold text-gray-700">
                  <span>Processing Loss Deduction:</span>
                  <span>- ₹{result.deduction}</span>
                </div>
              )}
              
              <div className="flex justify-between px-2 py-4 border-y-4 border-black font-black text-2xl mt-4">
                <span>GRAND TOTAL:</span>
                <span>₹{result.totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end pt-16 mt-8">
            <div className="text-center">
              <div className="w-64 border-t-2 border-black pt-2 font-bold">Customer Signature</div>
            </div>
            <div className="text-center">
              <div className="w-64 border-t-2 border-black pt-2 font-bold">Authorized Signatory</div>
              <p className="text-sm font-semibold text-gray-600 mt-1">For A.T. Dey & Son</p>
            </div>
          </div>
          
          <div className="text-center text-sm font-bold text-gray-500 mt-20 pt-8 border-t-2 border-gray-300">
            {result.transactionType === 'SELL' 
              ? 'Thank you for your business. Goods once sold cannot be returned without original invoice.' 
              : 'I declare that the items sold belong to me and are free from all encumbrances.'}
          </div>
        </div>
      )}
    </>
  );
}