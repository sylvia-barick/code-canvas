
import React, { useCallback, useState } from 'react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageSelect: (image: ImageFile | null) => void;
  selectedImage: ImageFile | null;
  isProcessing?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageSelect, selectedImage, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect({
          file,
          preview: e.target?.result as string,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col space-y-6 group">
      <div className="flex items-center justify-between px-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{label}</label>
        {selectedImage && (
          <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest flex items-center">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
            Asset Loaded
          </span>
        )}
      </div>
      
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative h-[480px] rounded-[48px] transition-all duration-700 overflow-hidden flex items-center justify-center border-2 border-dashed
          ${selectedImage 
            ? 'border-indigo-200/50 bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]' 
            : 'border-slate-200 bg-white/50 hover:bg-white hover:border-indigo-300 shadow-sm'}
          ${isDragging ? 'bg-indigo-50 border-indigo-400 scale-[1.01] shadow-2xl' : ''}
        `}
      >
        {selectedImage ? (
          <div className="relative w-full h-full p-4">
            <img 
              src={selectedImage.preview} 
              alt="Preview" 
              className={`w-full h-full object-cover rounded-[36px] transition-all duration-700 ${isProcessing ? 'brightness-50 grayscale blur-[2px]' : ''}`}
            />
            
            {/* Scanning Animation */}
            {isProcessing && (
              <div className="absolute inset-0 z-20 overflow-hidden rounded-[36px] pointer-events-none">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_20px_#6366f1] animate-[scan_2s_linear_infinite]"></div>
                <style>{`
                  @keyframes scan {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(480px); }
                  }
                `}</style>
              </div>
            )}

            <div className="absolute inset-0 bg-slate-900/60 opacity-0 hover:opacity-100 transition-all duration-500 backdrop-blur-[4px] flex flex-col items-center justify-center rounded-[48px] p-8 text-center space-y-4">
              <button
                onClick={() => onImageSelect(null)}
                className="p-5 bg-white text-slate-900 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl flex items-center space-x-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="font-black text-xs uppercase tracking-widest">Replace Asset</span>
              </button>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">{selectedImage.name}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center p-12 text-center space-y-6">
            <div className="w-24 h-24 bg-indigo-50/50 rounded-[40px] flex items-center justify-center mb-2 border border-indigo-100/50 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-slate-900 tracking-tight">Import Workspace</p>
              <p className="text-sm font-medium text-slate-400">Drag or <span className="text-indigo-600 font-bold hover:underline">browse gallery</span></p>
            </div>
            <div className="pt-6 flex items-center space-x-3 opacity-20 grayscale transition-all group-hover:opacity-60 group-hover:grayscale-0">
               <div className="px-3 py-1 bg-slate-100 text-[9px] font-black rounded-lg uppercase">High-Res Only</div>
            </div>
          </div>
        )}
        <input 
          id={id}
          type="file" 
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={handleChange}
          disabled={!!selectedImage || isProcessing}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
