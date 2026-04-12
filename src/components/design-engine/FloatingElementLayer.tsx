import React, { useRef } from 'react';
import { FloatingElement } from '@/types/newspaper';
import { useDesignEngine } from './DesignEngineContext';
import { Image as ImageIcon } from 'lucide-react';

// ─── Resize handle types ──────────────────────────────────────────────────────

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

const HANDLE_CURSORS: Record<ResizeHandle, string> = {
  nw: 'nwse-resize', n: 'ns-resize', ne: 'nesw-resize',
  e: 'ew-resize',   se: 'nwse-resize', s: 'ns-resize',
  sw: 'nesw-resize', w: 'ew-resize',
};

const HANDLE_POSITIONS: Record<ResizeHandle, React.CSSProperties> = {
  nw: { top: -5, left: -5 },
  n:  { top: -5, left: '50%', transform: 'translateX(-50%)' },
  ne: { top: -5, right: -5 },
  e:  { top: '50%', right: -5, transform: 'translateY(-50%)' },
  se: { bottom: -5, right: -5 },
  s:  { bottom: -5, left: '50%', transform: 'translateX(-50%)' },
  sw: { bottom: -5, left: -5 },
  w:  { top: '50%', left: -5, transform: 'translateY(-50%)' },
};

const ALL_HANDLES: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

// ─── Single floating element ──────────────────────────────────────────────────

interface FloatingElementItemProps {
  element: FloatingElement;
  pageNum: number;
  pageRef: React.RefObject<HTMLDivElement>;
}

const FloatingElementItem = ({ element, pageNum, pageRef }: FloatingElementItemProps) => {
  const { mode, selectedElementId, onElementSelect, onUpdateFloating, onRemoveFloating } = useDesignEngine();
  const elRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedElementId === element.id;

  // ── Drag ──────────────────────────────────────────────────────────────────
  const handleDragMouseDown = (e: React.MouseEvent) => {
    if (mode !== 'advanced') return;
    e.preventDefault();
    e.stopPropagation();
    onElementSelect(element.id);

    const page = pageRef.current;
    if (!page) return;
    const rect = page.getBoundingClientRect();
    const startX = e.clientX, startY = e.clientY;
    const startElX = element.x, startElY = element.y;

    const onMove = (me: MouseEvent) => {
      const dx = ((me.clientX - startX) / rect.width) * 100;
      const dy = ((me.clientY - startY) / rect.height) * 100;
      onUpdateFloating(pageNum, element.id, {
        x: Math.max(0, Math.min(95, startElX + dx)),
        y: Math.max(0, Math.min(95, startElY + dy)),
      });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── Resize ────────────────────────────────────────────────────────────────
  const handleResizeMouseDown = (e: React.MouseEvent, handle: ResizeHandle) => {
    if (mode !== 'advanced') return;
    e.preventDefault();
    e.stopPropagation();

    const page = pageRef.current;
    if (!page) return;
    const rect = page.getBoundingClientRect();
    const startX = e.clientX, startY = e.clientY;
    const startElX = element.x, startElY = element.y;
    const startW = element.width, startH = element.height;

    const onMove = (me: MouseEvent) => {
      const dx = ((me.clientX - startX) / rect.width) * 100;
      const dy = ((me.clientY - startY) / rect.height) * 100;
      let newX = startElX, newY = startElY, newW = startW, newH = startH;

      if (handle.includes('e')) newW = Math.max(5, startW + dx);
      if (handle.includes('s')) newH = Math.max(5, startH + dy);
      if (handle.includes('w')) { newW = Math.max(5, startW - dx); newX = startElX + (startW - newW); }
      if (handle.includes('n')) { newH = Math.max(5, startH - dy); newY = startElY + (startH - newH); }

      onUpdateFloating(pageNum, element.id, { x: newX, y: newY, width: newW, height: newH });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      ref={elRef}
      style={{
        position: 'absolute',
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        zIndex: element.zIndex,
        transform: `rotate(${element.rotation || 0}deg)`,
        pointerEvents: mode === 'advanced' ? 'auto' : 'none',
        cursor: mode === 'advanced' ? 'move' : 'default',
      }}
      className={isSelected ? 'outline outline-2 outline-indigo-500 outline-offset-1' : 'hover:outline hover:outline-1 hover:outline-indigo-400/50'}
      onMouseDown={handleDragMouseDown}
      onClick={(e) => { if (mode === 'advanced') { e.stopPropagation(); onElementSelect(element.id); } }}
    >
      {/* Content */}
      {element.type === 'image' && (
        element.content
          ? <img src={element.content} alt="Floating" className="w-full h-full object-cover shadow-lg select-none" draggable={false} />
          : <div className="w-full h-full bg-slate-200 border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-slate-500 text-xs font-bold gap-2">
              <ImageIcon size={20} />
              <span>Paste URL in sidebar</span>
            </div>
      )}

      {/* Floating Toolbar — Canva-style 4-button layer control */}
      {isSelected && mode === 'advanced' && (
        <div
          className="absolute -top-11 left-1/2 -translate-x-1/2 bg-slate-900 text-white flex items-center gap-0.5 px-1.5 py-1 rounded-lg shadow-2xl z-[300] whitespace-nowrap select-none"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Bring to Front */}
          <button
            className="flex flex-col items-center px-2 py-0.5 text-[8px] font-black uppercase tracking-widest hover:bg-slate-700 rounded text-indigo-300 transition-colors gap-0.5 leading-none"
            title="Bring to Front (Ctrl+Alt+])"
            onClick={(e) => { e.stopPropagation(); onUpdateFloating(pageNum, element.id, { zIndex: 999 }); }}
          >
            <span className="text-[10px]">⤒</span>
            <span>Front</span>
          </button>
          <div className="w-px h-5 bg-slate-700" />
          {/* Bring Forward */}
          <button
            className="flex flex-col items-center px-2 py-0.5 text-[8px] font-black uppercase tracking-widest hover:bg-slate-700 rounded text-indigo-200 transition-colors gap-0.5 leading-none"
            title="Bring Forward (Ctrl+])"
            onClick={(e) => { e.stopPropagation(); onUpdateFloating(pageNum, element.id, { zIndex: (element.zIndex || 100) + 1 }); }}
          >
            <span className="text-[10px]">↑</span>
            <span>Fwd</span>
          </button>
          <div className="w-px h-5 bg-slate-700" />
          {/* Send Backward */}
          <button
            className="flex flex-col items-center px-2 py-0.5 text-[8px] font-black uppercase tracking-widest hover:bg-slate-700 rounded text-slate-400 transition-colors gap-0.5 leading-none"
            title="Send Backward (Ctrl+[)"
            onClick={(e) => { e.stopPropagation(); onUpdateFloating(pageNum, element.id, { zIndex: Math.max(1, (element.zIndex || 100) - 1) }); }}
          >
            <span className="text-[10px]">↓</span>
            <span>Bwd</span>
          </button>
          <div className="w-px h-5 bg-slate-700" />
          {/* Send to Back */}
          <button
            className="flex flex-col items-center px-2 py-0.5 text-[8px] font-black uppercase tracking-widest hover:bg-slate-700 rounded text-slate-500 transition-colors gap-0.5 leading-none"
            title="Send to Back (Ctrl+Alt+[) — places behind page text"
            onClick={(e) => { e.stopPropagation(); onUpdateFloating(pageNum, element.id, { zIndex: 5 }); }}
          >
            <span className="text-[10px]">⤓</span>
            <span>Back</span>
          </button>
          <div className="w-px h-5 bg-slate-700" />
          {/* Delete */}
          <button
            className="flex flex-col items-center px-2 py-0.5 text-[8px] font-black uppercase tracking-widest hover:bg-red-800 rounded text-red-400 transition-colors gap-0.5 leading-none"
            onClick={(e) => { e.stopPropagation(); onRemoveFloating(pageNum, element.id); onElementSelect(null); }}
          >
            <span className="text-[10px]">✕</span>
            <span>Del</span>
          </button>
        </div>
      )}


      {/* 8-Point Resize Handles */}
      {isSelected && mode === 'advanced' && ALL_HANDLES.map((h) => (
        <div
          key={h}
          style={{
            position: 'absolute',
            width: 10, height: 10,
            background: 'white',
            border: '2px solid #6366f1',
            borderRadius: 2,
            cursor: HANDLE_CURSORS[h],
            zIndex: 301,
            ...HANDLE_POSITIONS[h],
          }}
          onMouseDown={(e) => handleResizeMouseDown(e, h)}
        />
      ))}
    </div>
  );
};

// ─── Layer: renders all floating elements for one page ────────────────────────

interface FloatingElementLayerProps {
  pageNumber: number;
  pageRef: React.RefObject<HTMLDivElement>;
}

export const FloatingElementLayer = ({ pageNumber, pageRef }: FloatingElementLayerProps) => {
  const { pageSettings, mode } = useDesignEngine();
  if (mode !== 'advanced') return null;

  const elements: FloatingElement[] = pageSettings?.[pageNumber]?.floatingElements || [];

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
      {elements.map((el) => (
        <FloatingElementItem key={el.id} element={el} pageNum={pageNumber} pageRef={pageRef} />
      ))}
    </div>
  );
};
