
import React, { useState, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import EvaluationResult from './components/EvaluationResult';
import VisualComparison from './components/VisualComparison';
import { evaluateLandingPages } from './services/geminiService';
import { ComparisonResult, ImageFile } from './types';

const LOADING_MESSAGES = [
  "Calibrating visual weights...",
  "Parsing conversion signals...",
  "Analyzing typographic hierarchy...",
  "Evaluating color psychological impact...",
  "Synthesizing final design report..."
];

const App: React.FC = () => {
  const [imageA, setImageA] = useState<ImageFile | null>(null);
  const [imageB, setImageB] = useState<ImageFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPaidKey, setHasPaidKey] = useState(false);
  const [activeView, setActiveView] = useState<'report' | 'comparison'>('report');

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio?.hasSelectedApiKey) {
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasPaidKey(selected);
      }
    };
    checkKey();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio?.openSelectKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasPaidKey(true);
    }
  };

  const handleEvaluate = async () => {
    if (!imageA || !imageB) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const evaluation = await evaluateLandingPages(imageA.preview, imageB.preview);
      setResult(evaluation);
      setActiveView('report');
      
      if (evaluation.isValid) {
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
      }
    } catch (err: any) {
      console.error("Audit UI Error:", err);
      setError(err.message || 'Audit failed. Please ensure images are valid landing pages.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = imageA !== null && imageB !== null && !isLoading;

  return (
    <div className="min-h-screen bg-[#fcfdff] text-slate-900 pb-32 overflow-x-hidden selection:bg-indigo-100">
      {/* Dynamic Background Auras */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-200/30 blur-[180px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/40 blur-[160px] rounded-full"></div>
        <div className="absolute top-[30%] right-[15%] w-[30%] h-[30%] bg-violet-100/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Floating Header */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-4xl px-4">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] h-16 rounded-full flex items-center justify-between px-8 ring-1 ring-black/[0.03]">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3 transition-transform group-hover:rotate-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 uppercase">LanderVise <span className="text-indigo-600">Pro</span></span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={handleSelectKey} className={`text-[11px] font-black uppercase tracking-widest transition-all ${hasPaidKey ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-900'}`}>
              {hasPaidKey ? '● API ACTIVE' : 'CONNECT API'}
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <a href="#" className="text-[11px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Documentation</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-44">
        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto mb-32 space-y-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 rounded-full border border-slate-100 shadow-sm mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-3 animate-pulse"></span>
            <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-[0.2em]">High-Volume Forensic Auditing</span>
          </div>
          <h1 className="text-7xl md:text-[105px] font-[900] text-slate-900 tracking-[-0.05em] leading-[0.88] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Audit variants, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-gradient">reveal growth.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Upload two interface variants. Our high-fidelity neural auditor evaluates visual hierarchy, clarity, and identifies precise pixel-level differences.
          </p>
        </div>

        {/* Uploader Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <ImageUploader 
            id="image-a" 
            label="Version Alpha" 
            onImageSelect={setImageA} 
            selectedImage={imageA}
            isProcessing={isLoading}
          />
          <ImageUploader 
            id="image-b" 
            label="Version Beta" 
            onImageSelect={setImageB} 
            selectedImage={imageB}
            isProcessing={isLoading}
          />
        </div>

        {/* Action Bar */}
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="relative">
            {isLoading && (
              <div className="absolute -inset-4 bg-indigo-500/20 rounded-[32px] blur-2xl animate-pulse"></div>
            )}
            <button
              onClick={handleEvaluate}
              disabled={!isFormValid}
              className={`
                relative px-16 py-7 bg-slate-900 text-white rounded-[28px] font-black text-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 overflow-hidden
                ${!isFormValid ? 'opacity-40 grayscale cursor-not-allowed scale-95' : 'hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 group'}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              {isLoading ? (
                <div className="flex items-center space-x-6">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  </div>
                  <span className="w-56 text-left tracking-tight truncate uppercase text-sm">{LOADING_MESSAGES[loadingMsgIdx]}</span>
                </div>
              ) : (
                <span className="flex items-center uppercase tracking-widest text-sm font-black">
                  Run Forensic Audit
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </button>
          </div>
          
          {error && (
            <div className="max-w-md p-6 bg-rose-50 border border-rose-100 text-rose-600 rounded-3xl flex items-center space-x-4 animate-in fade-in slide-in-from-top-4 duration-500">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-black uppercase tracking-widest">{error}</p>
            </div>
          )}
        </div>

        {/* Audit Results Section */}
        {result && result.isValid && result.imageA && result.imageB && (
          <div id="results" className="mt-44 space-y-20 animate-in fade-in slide-in-from-bottom-20 duration-1000">
            
            {/* View Switcher */}
            <div className="flex flex-col items-center space-y-10">
              <div className="flex flex-col items-center text-center space-y-4 mb-4">
                <div className="h-1.5 w-16 bg-indigo-600 rounded-full mb-2"></div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Strategic Audit Overview</h2>
                <div className="px-5 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-[0.3em]">Session ID: LX-{Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
              </div>

              <div className="inline-flex p-2 bg-slate-100/80 rounded-[28px] border border-slate-200 shadow-inner">
                <button 
                  onClick={() => setActiveView('report')}
                  className={`px-10 py-4 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeView === 'report' ? 'bg-white text-indigo-600 shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Audit Report
                </button>
                <button 
                  onClick={() => setActiveView('comparison')}
                  className={`px-10 py-4 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeView === 'comparison' ? 'bg-white text-indigo-600 shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Visual Diff
                </button>
              </div>
            </div>

            {/* Content Rendering Based on Active View */}
            {activeView === 'report' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                <EvaluationResult 
                  title="Variant Alpha" 
                  data={result.imageA} 
                  isWinner={result.overallWinner === 'A'} 
                  imagePreview={imageA?.preview || ''}
                />
                <EvaluationResult 
                  title="Variant Beta" 
                  data={result.imageB} 
                  isWinner={result.overallWinner === 'B'} 
                  imagePreview={imageB?.preview || ''}
                />
              </div>
            ) : (
              <VisualComparison 
                imageA={imageA?.preview || ''} 
                imageB={imageB?.preview || ''} 
                differences={result.visualDifferences || []}
              />
            )}
          </div>
        )}

        {/* Validation Error Screen */}
        {result && !result.isValid && (
          <div className="mt-32 max-w-4xl mx-auto p-20 bg-white border border-slate-100 rounded-[60px] shadow-2xl shadow-slate-200/50 text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Audit Terminated</h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md mx-auto">
              {result.validationError || "Content mismatch detected. Please provide interface screenshots only."}
            </p>
            <button 
              onClick={() => setResult(null)}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all uppercase tracking-widest text-xs"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Premium Footer */}
      <footer className="mt-60 py-32 bg-white border-t border-slate-100 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-indigo-500 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 items-center">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg"></div>
              <span className="text-sm font-black uppercase tracking-widest">LanderVise Pro</span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
              Forged for design teams <br/> demanding visual precision.
            </p>
          </div>
          <div className="flex justify-center space-x-12">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic opacity-40">Insight</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic opacity-40">Clarity</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic opacity-40">Growth</div>
          </div>
          <div className="flex flex-col items-end space-y-4">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">&copy; 2025 ALL RIGHTS RESERVED</p>
            <div className="flex space-x-6">
               <div className="w-2 h-2 rounded-full bg-slate-100"></div>
               <div className="w-2 h-2 rounded-full bg-slate-100"></div>
               <div className="w-2 h-2 rounded-full bg-slate-100"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
