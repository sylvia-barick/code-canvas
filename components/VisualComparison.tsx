
import React, { useState } from 'react';

interface VisualComparisonProps {
  imageA: string;
  imageB: string;
  differences: string[];
}

const VisualComparison: React.FC<VisualComparisonProps> = ({ imageA, imageB, differences }) => {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Comparison Slider */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end px-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Interactive Diff</span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Overlay Inspection</h3>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Left: A</span>
              <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest">Right: B</span>
            </div>
          </div>

          <div className="relative h-[600px] w-full rounded-[48px] overflow-hidden shadow-2xl border border-slate-200 group">
            {/* Image B (Bottom) */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${imageB})` }}
            />
            
            {/* Image A (Top/Clipped) */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-none border-r-2 border-indigo-500 z-10"
              style={{ 
                backgroundImage: `url(${imageA})`,
                clipPath: `inset(0 ${100 - sliderPos}% 0 0)`
              }}
            />

            {/* Handle */}
            <div 
              className="absolute top-0 bottom-0 z-20 w-1 bg-white cursor-ew-resize flex items-center justify-center group-hover:scale-y-105 transition-transform"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-10 h-10 bg-white rounded-full shadow-2xl border-4 border-indigo-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7h8M8 12h8m-8 5h8" />
                </svg>
              </div>
            </div>

            {/* Hidden Input for Slider control */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>
        </div>

        {/* Technical Difference Log */}
        <div className="space-y-8 lg:pt-12">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Neural Observation</span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Detected Anomalies</h3>
          </div>

          <div className="space-y-4">
            {differences.map((diff, idx) => (
              <div 
                key={idx}
                className="p-6 bg-white border border-slate-100 rounded-[28px] shadow-sm hover:shadow-md transition-all duration-300 flex items-start space-x-4 group/item"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-black text-xs group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">
                  {idx + 1}
                </div>
                <p className="text-sm font-bold text-slate-600 leading-relaxed group-hover/item:text-slate-900 transition-colors">
                  {diff}
                </p>
              </div>
            ))}
          </div>

          <div className="p-8 bg-indigo-50/50 rounded-[32px] border border-indigo-100/50">
             <p className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.2em] mb-2">Pro Context</p>
             <p className="text-xs font-bold text-indigo-900/60 leading-relaxed">
               Differences are calculated by comparing spatial coordinates and pixel density distributions between Version A and Version B.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualComparison;
