import React from 'react';
import { FileText, ChevronRight, Check } from 'lucide-react';
import { Edition } from '@/types/newspaper';

interface Props {
  edition: Edition;
  activePage: number;
  onPageSelect: (pageNumber: number) => void;
  pageCount: number;
}

const PageListPanel = ({ edition, activePage, onPageSelect, pageCount }: Props) => {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  const getPageLabel = (num: number) => {
    const sections = [
      'Cover Page', 'Vision & Mission', 'Program Outcomes', 'Educational Objectives', 
      'Specific Outcomes', 'HOD Message', 'Faculty Note', 'Student Perspective',
      'Articles', 'Achievements', 'Research', 'Editorial'
    ];
    
    return sections[num - 1] || `Page ${num}`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Navigation</h3>
        <p className="text-lg font-black text-slate-900 uppercase tracking-tight mt-1">Page Designer</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {pages.map((num) => {
          const isActive = activePage === num;
          const isCustomized = !!edition.pageStyles?.[num];
          
          return (
            <button
              key={num}
              onClick={() => onPageSelect(num)}
              className={`w-full group flex items-center justify-between p-3 rounded-2xl transition-all border ${
                isActive 
                  ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200 text-white' 
                  : 'bg-white border-slate-100 hover:border-indigo-200 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {num}
                </div>
                <div className="flex flex-col items-start translate-y-[1px]">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    isActive ? 'text-white' : 'text-slate-900'
                  }`}>
                    {getPageLabel(num)}
                  </span>
                  {isCustomized && (
                    <span className={`text-[8px] font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1 ${
                      isActive ? 'text-indigo-100' : 'text-amber-600'
                    }`}>
                      <Check className="w-2 h-2" /> Customized
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${
                isActive ? 'text-white translate-x-1' : 'text-slate-300 group-hover:translate-x-1'
              }`} />
            </button>
          );
        })}
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100 italic text-[9px] text-slate-400 text-center">
        All changes apply ONLY to selected page.
      </div>
    </div>
  );
};

export default PageListPanel;
