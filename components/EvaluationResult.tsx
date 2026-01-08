
import React from 'react';
import { LandingPageEvaluation } from '../types';

interface EvaluationResultProps {
  title: string;
  data: LandingPageEvaluation;
  isWinner: boolean;
  imagePreview: string;
}

const ScoreBar: React.FC<{ label: string; score: number; max: number }> = ({ label, score, max }) => (
  <div className="flex flex-col space-y-3">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
      <div className="flex items-baseline space-x-1">
        <span className="text-base font-black text-slate-900">{score}</span>
        <span className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter">/{max}</span>
      </div>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-[1px] border border-slate-100/50">
      <div 
        className={`h-full rounded-full transition-all duration-[2000ms] ease-out shadow-[0_0_8px_rgba(0,0,0,0.05)]
          ${score / max >= 0.85 ? 'bg-indigo-600' : score / max >= 0.7 ? 'bg-indigo-400' : 'bg-slate-300'}`}
        style={{ width: `${(score / max) * 100}%` }}
      />
    </div>
  </div>
);

const EvaluationResult: React.FC<EvaluationResultProps> = ({ title, data, isWinner, imagePreview }) => {
  return (
    <div className={`flex flex-col bg-white rounded-[64px] transition-all duration-700 relative group overflow-hidden
      ${isWinner 
        ? 'shadow-[0_40px_100px_-20px_rgba(99,102,241,0.15)] ring-2 ring-indigo-600/10' 
        : 'shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100'
      }
      hover:scale-[1.01] hover:-translate-y-2
    `}>
      {isWinner && (
        <div className="absolute top-10 right-10 z-20">
          <div className="bg-slate-900 text-white text-[9px] font-black py-3 px-6 rounded-full shadow-2xl uppercase tracking-[0.4em] flex items-center space-x-3 border border-white/10">
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
            <span>Primary Choice</span>
          </div>
        </div>
      )}
      
      <div className="p-12 md:p-16 space-y-12">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-4xl font-[900] text-slate-900 tracking-[-0.03em]">{title}</h3>
            <div className="flex items-center space-x-3">
               <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest px-3 py-1 bg-indigo-50 rounded-full">Report Verified</span>
            </div>
          </div>
          <div className="relative">
            <div className={`w-28 h-28 rounded-[40px] flex flex-col items-center justify-center transition-all duration-500
              ${isWinner ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-slate-50 text-slate-900'}
            `}>
              <span className="text-4xl font-black leading-none tracking-tighter">{data.totalScore}</span>
              <span className={`text-[8px] font-black uppercase tracking-widest mt-2 ${isWinner ? 'text-indigo-200' : 'text-slate-400'}`}>Points</span>
            </div>
          </div>
        </div>

        {/* High-Res Preview */}
        <div className="relative overflow-hidden rounded-[48px] aspect-[16/10] border border-slate-100 shadow-inner group-hover:shadow-2xl transition-all duration-700">
           <img 
            src={imagePreview} 
            alt={title} 
            className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-[3000ms] group-hover:scale-110" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
           <div className="absolute bottom-6 left-8 flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
              <span className="text-[10px] text-white font-black uppercase tracking-widest">Neural Scan Active</span>
           </div>
        </div>

        {/* Executive Summary */}
        <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 relative group-hover:bg-white group-hover:border-indigo-100 transition-all duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute -top-4 -left-4 h-12 w-12 text-indigo-600/10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V5C14.017 3.34315 15.3602 2 17.017 2H20.017C21.6739 2 23.017 3.34315 23.017 5V15C23.017 18.3137 20.3307 21 17.017 21H14.017ZM1 21L1 18C1 16.8954 1.89543 16 3 16H6C6.55228 16 7 15.5523 7 15V9C7 8.44772 6.55228 8 6 8H3C1.89543 8 1 7.10457 1 6V5C1 3.34315 2.34315 2 4 2H7C8.65685 2 10 3.34315 10 5V15C10 18.3137 7.31371 21 4 21H1Z" />
          </svg>
          <p className="text-slate-600 font-semibold leading-relaxed text-xl italic tracking-tight">
            {data.summary}
          </p>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
          <div className="space-y-8">
            <ScoreBar label="Visual Hierarchy" score={data.scores.visualHierarchy} max={25} />
            <ScoreBar label="Message Clarity" score={data.scores.clarityOfMessage} max={25} />
          </div>
          <div className="space-y-8">
            <ScoreBar label="CTA Momentum" score={data.scores.ctaStrength} max={20} />
            <div className="grid grid-cols-2 gap-8">
               <ScoreBar label="Layout" score={data.scores.layoutConsistency} max={15} />
               <ScoreBar label="Appeal" score={data.scores.aestheticAppeal} max={15} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationResult;
