'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InventoryManager() {
  const router = useRouter();
  
  // List State
  const [inventory, setInventory] = useState<any[]>([]);
  
  // Form State
  const [name, setName] = useState('');
  const [metal, setMetal] = useState('GOLD');
  const [purityMode, setPurityMode] = useState('RATING');
  const [purityRating, setPurityRating] = useState(0.916);
  const [purityPercent, setPurityPercent] = useState('');
  const [weight, setWeight] = useState('');
  const [makingCharge, setMakingCharge] = useState('');
  const [images, setImages] = useState<string[]>([]); // New Images State
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/inventory');
      const data = await response.json();
      setInventory(data);
    } catch (err) {
      console.error("Failed to fetch inventory", err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Convert uploaded files to Base64 text
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > 4) {
      setError("You can only upload a maximum of 4 images.");
      return;
    }
    setError('');

    const newImages = await Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );

    setImages((prev) => [...prev, ...newImages].slice(0, 4));
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleAddOrnament = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const finalPurity = purityMode === 'PERCENT' ? Number(purityPercent) / 100 : Number(purityRating);

    if (!name || !weight || !finalPurity) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    let generatedLabel = '';
    if (purityMode === 'PERCENT') {
      generatedLabel = `${purityPercent}%`;
    } else {
      if (metal === 'GOLD') {
        if (purityRating === 0.999) generatedLabel = '24K';
        else if (purityRating === 0.916) generatedLabel = '22K';
        else if (purityRating === 0.750) generatedLabel = '18K';
        else generatedLabel = `${(purityRating * 100).toFixed(1)}%`;
      } else {
        generatedLabel = purityRating === 0.999 ? 'Pure Silver' : 'Sterling';
      }
    }

    try {
      const response = await fetch('http://localhost:5000/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          metal,
          purity: finalPurity,
          purityLabel: generatedLabel,
          weightGrams: Number(weight),
          makingCharge: Number(makingCharge) || 0,
          imageUrls: images // Send images to backend
        }),
      });

      if (!response.ok) throw new Error("Failed to add to catalog");

      // Reset form and refresh list
      setName('');
      setWeight('');
      setMakingCharge('');
      setImages([]);
      fetchInventory();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12 text-slate-900 *:text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-black tracking-tight text-slate-900">
            Digital Catalog
          </h1>
          <button onClick={() => router.push('/admin/dashboard')} className="text-sm font-bold text-slate-500 hover:text-amber-600 transition-colors uppercase tracking-widest">
            ← Back to Workspace
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Add to Inventory Form */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-md border-2 border-slate-100 p-8 h-fit">
            <h2 className="text-xl font-serif font-bold text-slate-800 mb-6 border-b-2 border-slate-100 pb-4">Add Ornament</h2>
            
            <form onSubmit={handleAddOrnament} className="space-y-5">
              
              {/* Image Upload Section */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                  Photos ({images.length}/4)
                </label>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg border-2 border-slate-200 overflow-hidden group">
                        <img src={img} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
                        <button 
                          type="button" 
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {images.length < 4 && (
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-amber-400 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <span className="text-2xl text-slate-400 mb-1">📷</span>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Add Photos</p>
                    </div>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Item Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Gold Bangle" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-400 outline-none text-base font-bold transition-all" />
              </div>

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
                    <button type="button" onClick={() => setPurityMode('RATING')} className={`text-[10px] uppercase tracking-wider ${purityMode === 'RATING' ? 'font-black text-amber-600' : 'font-bold text-slate-400 hover:text-slate-600'}`}>Rating</button>
                    <span className="text-slate-300 text-[10px] font-black">|</span>
                    <button type="button" onClick={() => setPurityMode('PERCENT')} className={`text-[10px] uppercase tracking-wider ${purityMode === 'PERCENT' ? 'font-black text-amber-600' : 'font-bold text-slate-400 hover:text-slate-600'}`}>%</button>
                  </div>
                </div>

                {purityMode === 'RATING' ? (
                  <select value={purityRating} onChange={(e) => setPurityRating(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-400 outline-none text-base font-bold appearance-none">
                    {metal === 'GOLD' ? (
                      <>
                        <option value={0.999}>24K (99.9%)</option>
                        <option value={0.916}>22K (91.6%)</option>
                        <option value={0.750}>18K (75.0%)</option>
                      </>
                    ) : (
                      <>
                        <option value={0.999}>Pure (99.9%)</option>
                        <option value={0.925}>Sterling (92.5%)</option>
                      </>
                    )}
                  </select>
                ) : (
                  <input type="number" value={purityPercent} onChange={(e) => setPurityPercent(e.target.value)} placeholder="e.g., 91.6" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-400 outline-none text-base font-bold" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Weight (g)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0.00" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-400 outline-none text-base font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Making (%)</label>
                  <input type="number" value={makingCharge} onChange={(e) => setMakingCharge(e.target.value)} placeholder="e.g., 12" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-amber-400 outline-none text-base font-bold" />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-extrabold tracking-widest uppercase hover:bg-slate-800 transition-colors disabled:opacity-50 mt-4 shadow-lg shadow-slate-900/20">
                {isLoading ? 'Saving...' : 'Add to Catalog'}
              </button>

              {error && <p className="text-red-600 font-bold text-sm text-center mt-2">{error}</p>}
            </form>
          </div>

          {/* RIGHT COLUMN: The Inventory List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md border-2 border-slate-100 overflow-hidden">
              <div className="p-6 border-b-2 border-slate-100 bg-slate-50 flex justify-between items-center">
                <h2 className="text-xl font-serif font-bold text-slate-800">Current Stock</h2>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                  {inventory.length} Items
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200 bg-white">
                      <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-widest w-16">Pic</th>
                      <th className="py-4 px-2 text-xs font-extrabold text-slate-400 uppercase tracking-widest">Item</th>
                      <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-widest">Metal</th>
                      <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-widest">Purity</th>
                      <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-widest text-right">Weight</th>
                      <th className="py-4 px-6 text-xs font-extrabold text-amber-600 uppercase tracking-widest text-right">Live Est. Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-100">
                    {inventory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                          No items in inventory
                        </td>
                      </tr>
                    ) : (
                      inventory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6">
                            {item.imageUrls && item.imageUrls.length > 0 ? (
                              <img src={item.imageUrls[0]} alt={item.name} className="w-10 h-10 rounded-md object-cover border border-slate-200 shadow-sm" />
                            ) : (
                              <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200">
                                <span className="text-slate-300 text-xs font-bold">✦</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-2 font-bold text-slate-800">{item.name}</td>
                          <td className="py-4 px-6">
                            <span className={`text-[10px] font-extrabold px-2 py-1 rounded uppercase tracking-widest ${item.metal === 'GOLD' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}`}>
                              {item.metal}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-semibold text-slate-600">{item.purityLabel}</td>
                          <td className="py-4 px-6 font-black text-slate-900 text-right">{item.weightGrams}g</td>
                          <td className="py-4 px-6 font-black text-slate-900 text-right">
                            {item.livePrice === "Rate Not Set" ? (
                              <span className="text-red-500 text-xs uppercase">No Rate</span>
                            ) : (
                              `₹${Number(item.livePrice).toLocaleString('en-IN')}`
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}