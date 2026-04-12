import React, { useRef } from 'react';
import { useDesignEngine } from './DesignEngineContext';
import { FloatingElementLayer } from './FloatingElementLayer';
import { DesignerScanner } from './DesignerScanner';
import { cn } from "@/lib/utils";

interface PageShellProps {
  pageNumber: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const PageShell = ({ pageNumber, children, className = '', style = {} }: PageShellProps) => {
  const { mode, activePageNumber, edition, onPageSelect } = useDesignEngine();
  const pageRef = useRef<HTMLDivElement>(null);
  
  const isActive = activePageNumber === pageNumber;
  const isAdvanced = mode === 'advanced';
  
  const globalElements = edition.backgroundElements || [];
  const pageElements = edition.pageSettings?.[pageNumber]?.backgroundElements || [];
  const elements = [...globalElements, ...pageElements];
  
  const renderBackgrounds = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {elements.map(el => {
        const color = el.color === 'currentColor' ? '#cbd5e1' : el.color;
        const opacity = (el.opacity || 0) / 100;
        
        const isSVGShape = ['wave', 'polygon', 'decorative'].includes(el.type) && !!el.pathData;
        const isSymmetric = ['circle', 'blob', 'decorative'].includes(el.type) && !el.pathData;
        
        let shapeStyle: React.CSSProperties = {
          position: "absolute",
          left: `${el.x}%`,
          top: `${el.y}%`,
          width: `${el.size}%`, 
          minWidth: `${el.size}px`,
          height: isSymmetric ? 'auto' : `${el.size}%`,
          aspectRatio: isSymmetric ? '1 / 1' : 'auto',
          minHeight: isSymmetric ? 'auto' : `${el.size}px`,
          background: (isSVGShape || el.variant === 'ring') ? 'transparent' : color,
          border: el.variant === 'ring' ? `${el.borderWidth || 2}px ${el.borderStyle || 'solid'} ${color}` : 'none',
          opacity: opacity,
          transform: `translate(-50%, -50%) rotate(${el.rotation}deg)`,
          zIndex: el.zIndex || 1,
          transition: 'all 0.5s ease-out',
          boxSizing: 'border-box'
        };

        if (el.type === 'blob') {
            shapeStyle.borderRadius = '100%';
            shapeStyle.filter = 'blur(60px)';
        } else if (el.type === 'circle') {
            shapeStyle.borderRadius = '100%';
            if (el.variant === 'gradient') {
              shapeStyle.background = `radial-gradient(circle, ${color}, transparent)`;
            } else if (el.variant === 'glow') {
              shapeStyle.filter = 'blur(20px)';
            } else if (el.variant === 'double-ring') {
              shapeStyle.background = 'transparent';
              shapeStyle.border = `${el.borderWidth || 2}px solid ${color}`;
              shapeStyle.boxShadow = `inset 0 0 0 ${el.borderWidth || 2}px ${color}`;
            }
        } else if (el.type === 'diagonal') {
            shapeStyle.clipPath = 'polygon(0 0, 100% 0, 0 100%)';
            shapeStyle.width = '150%';
            shapeStyle.height = '150%';
        } else if (el.type === 'rectangle') {
            shapeStyle.borderRadius = el.variant === 'pill' ? '999px' : (el.variant === 'rounded' ? '32px' : '0');
            if (el.variant === 'shadow') {
              shapeStyle.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
            }
        } else if (el.type === 'line') {
            shapeStyle.height = `${el.borderWidth || 2}px`;
            shapeStyle.border = 'none';
            shapeStyle.background = color;
            if (el.borderStyle === 'dashed') {
              shapeStyle.background = `repeating-linear-gradient(90deg, ${color}, ${color} 10px, transparent 10px, transparent 20px)`;
            }
        } else if (el.type === 'lines') {
            shapeStyle.background = `repeating-linear-gradient(45deg, ${color}, ${color} 2px, transparent 2px, transparent 10px)`;
            shapeStyle.border = 'none';
        } else if (el.type === 'decorative') {
            shapeStyle.borderRadius = '40% 60% 70% 30% / 40% 50% 60% 50%';
            shapeStyle.filter = 'blur(20px)';
        }

        return (
          <div
            key={el.id}
            className={`background-shape-layer ${el.type}`}
            style={shapeStyle}
          >
            {isSVGShape && (
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                style={{ fill: el.variant === 'ring' ? 'none' : color, stroke: el.variant === 'ring' ? color : 'none', strokeWidth: el.variant === 'ring' ? el.borderWidth : 0 }}
                preserveAspectRatio="none"
              >
                <path d={el.pathData} vectorEffect="non-scaling-stroke" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div 
      id={`page-${pageNumber}`}
      ref={pageRef}
      onClick={(e) => {
        e.stopPropagation();
        onPageSelect?.(pageNumber);
      }}
      className={cn(
        "a4-page relative bg-white shadow-2xl transition-all duration-300 overflow-hidden print:shadow-none print:m-0 print:border-none cursor-pointer",
        "w-[210mm] h-[297mm] flex flex-col flex-shrink-0 group/page",
        className
      )}
      style={{
        ...style,
        fontFamily: style.fontFamily || (edition?.theme?.bodyFont ? `"${edition.theme.bodyFont}", sans-serif` : 'inherit'),
      }}
    >
      {/* ── Background Layer ── */}
      {renderBackgrounds()}

      {/* ── Selection Overlay (Visual Only) ── */}
      {isAdvanced && isActive && (
        <div 
          className="absolute inset-0 border-[8px] border-indigo-500/20 bg-indigo-600/3 pointer-events-none z-[100]" 
          aria-hidden="true"
        />
      )}

      {/* ── Page Content ── */}
      <div className="relative flex-1 flex flex-col p-12 z-10">
        <DesignerScanner pageNumber={pageNumber}>
          {children}
        </DesignerScanner>
      </div>

      {/* ── Floating Elements ── */}
      <FloatingElementLayer pageNumber={pageNumber} pageRef={pageRef} />

      {/* ── Advanced Mode Badge ── */}
      {isAdvanced && (
        <div className={cn(
          "absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 z-[110]",
          isActive ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-100 text-slate-400 opacity-0 group-hover/page:opacity-100"
        )}>
          {isActive ? (
            <><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Active Page</>
          ) : (
            "Click to Edit"
          )}
        </div>
      )}
    </div>
  );
};
