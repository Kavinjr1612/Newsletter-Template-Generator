/**
 * ContentBlockSlot
 *
 * Wraps a template section to make it draggable/resizable in Advanced canvas mode.
 * Fixes layout shifting by ensuring the DOM structure NEVER changes between active/inactive states.
 */

import React, { useRef, useEffect } from 'react';
import { ContentBlock } from '@/types/newspaper';
import { useDesignEngine } from './DesignEngineContext';

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

const HANDLE_CURSORS: Record<ResizeHandle, string> = {
  nw: 'nwse-resize', n: 'ns-resize', ne: 'nesw-resize',
  e: 'ew-resize', se: 'nwse-resize', s: 'ns-resize',
  sw: 'nesw-resize', w: 'ew-resize',
};

const HANDLE_POSITIONS: Record<ResizeHandle, React.CSSProperties> = {
  nw: { top: -5, left: -5 }, n: { top: -5, left: '50%', transform: 'translateX(-50%)' },
  ne: { top: -5, right: -5 }, e: { top: '50%', right: -5, transform: 'translateY(-50%)' },
  se: { bottom: -5, right: -5 }, s: { bottom: -5, left: '50%', transform: 'translateX(-50%)' },
  sw: { bottom: -5, left: -5 }, w: { top: '50%', left: -5, transform: 'translateY(-50%)' },
};

const ALL_HANDLES: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

interface ContentBlockSlotProps {
  pageNumber: number;
  sectionKey: string;
  children: React.ReactNode;
  defaultX?: number;
  defaultY?: number;
  defaultW?: number;
  defaultH?: number;
  defaultZ?: number;
  className?: string;
  style?: React.CSSProperties;
  useNativeLayout?: boolean;
}

export const ContentBlockSlot = ({
  pageNumber,
  sectionKey,
  children,
  defaultX = 0,
  defaultY = 0,
  defaultW = 100,
  defaultH = 20,
  defaultZ = 30,
  className = '',
  style = {},
  useNativeLayout = false,
}: ContentBlockSlotProps) => {
  const { mode, activePageNumber, pageSettings, selectedBlockId, onBlockSelect, onElementSelect,
          onInitContentBlocks, onUpdateContentBlock } = useDesignEngine();
  const slotRef = useRef<HTMLDivElement>(null);
  const blockId = `${sectionKey}`;

  const isPageActive = activePageNumber === pageNumber;
  const isAdvancedActive = mode === 'advanced' && isPageActive;
  
  const blocks = pageSettings?.[pageNumber]?.contentBlocks || [];
  const block = blocks.find(b => b.id === blockId);
  const isSelected = selectedBlockId === blockId && isAdvancedActive;

  // Initialize block default position if it's new
  useEffect(() => {
    if (!isAdvancedActive) return;
    if (!block) {
        const el = slotRef.current;
        const pageEl = el?.parentElement;
        if (el && pageEl) {
          const elRect = el.getBoundingClientRect();
          const pageRect = pageEl.getBoundingClientRect();
          
          const actualWidth = Math.max(elRect.width, el.scrollWidth);
          const actualHeight = Math.max(elRect.height, el.scrollHeight);
          
          const x = ((elRect.left - pageRect.left) / pageRect.width) * 100;
          const y = ((elRect.top - pageRect.top) / pageRect.height) * 100;
          
          const isHeadline = sectionKey.toLowerCase().includes('title') || sectionKey.toLowerCase().includes('header');
          const w = isHeadline ? Math.max(90, (actualWidth / pageRect.width) * 100) : (actualWidth / pageRect.width) * 100;
          const h = (actualHeight / pageRect.height) * 100;
          
          const newBlock: ContentBlock = { id: blockId, sectionKey, x, y, width: w, height: h, rotation: 0, zIndex: defaultZ };
          const existingBlocks = pageSettings?.[pageNumber]?.contentBlocks || [];
          onInitContentBlocks(pageNumber, [...existingBlocks, newBlock]);
        }
    }
  }, [isAdvancedActive]);

  const handleDragMouseDown = (e: React.MouseEvent) => {
    if (!isAdvancedActive || !block) return;
    e.preventDefault();
    e.stopPropagation();
    onBlockSelect(blockId);
    onElementSelect(null);

    const pageEl = slotRef.current?.parentElement;
    if (!pageEl) return;
    const rect = pageEl.getBoundingClientRect();
    const startX = e.clientX, startY = e.clientY;
    const startBX = block.x, startBY = block.y;

    const onMove = (me: MouseEvent) => {
      const dx = ((me.clientX - startX) / rect.width) * 100;
      const dy = ((me.clientY - startY) / rect.height) * 100;
      onUpdateContentBlock(pageNumber, blockId, {
        x: Math.max(0, Math.min(95, startBX + dx)),
        y: Math.max(0, Math.min(95, startBY + dy)),
      });
    };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, handle: ResizeHandle) => {
    if (!isAdvancedActive || !block) return;
    e.preventDefault();
    e.stopPropagation();

    const pageEl = slotRef.current?.parentElement;
    if (!pageEl) return;
    const rect = pageEl.getBoundingClientRect();
    const startX = e.clientX, startY = e.clientY;
    const startBX = block.x, startBY = block.y, startW = block.width, startH = block.height;

    const onMove = (me: MouseEvent) => {
      const dx = ((me.clientX - startX) / rect.width) * 100;
      const dy = ((me.clientY - startY) / rect.height) * 100;
      let newX = startBX, newY = startBY, newW = startW, newH = startH;
      if (handle.includes('e')) newW = Math.max(10, startW + dx);
      if (handle.includes('s')) newH = Math.max(5, startH + dy);
      if (handle.includes('w')) { newW = Math.max(10, startW - dx); newX = startBX + (startW - newW); }
      if (handle.includes('n')) { newH = Math.max(5, startH - dy); newY = startBY + (startH - newH); }
      onUpdateContentBlock(pageNumber, blockId, { x: newX, y: newY, width: newW, height: newH });
    };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── PURE OVERLAY SYSTEM ──
  // We NEVER conditionally wrap the child in different elements or apply explicit layout styling to native elements
  // Native blocks remain strictly native to prevent ANY layout shift on selection
  
  const isAbsoluteShape = !useNativeLayout;

  const baseStyle: React.CSSProperties = { ...style };
  
  if (isAbsoluteShape) {
    baseStyle.position = 'absolute';
    if (block) {
      baseStyle.left = `${block.x}%`;
      baseStyle.top = `${block.y}%`;
      baseStyle.width = `${block.width}%`;
      baseStyle.height = block.id.toLowerCase().includes('title') || block.id.toLowerCase().includes('header') 
              ? 'fit-content' 
              : `${block.height}%`;
      baseStyle.zIndex = block.zIndex;
      baseStyle.transform = `rotate(${block.rotation || 0}deg)`;
    } else {
      baseStyle.left = `${defaultX}%`;
      baseStyle.top = `${defaultY}%`;
      baseStyle.width = `${defaultW}%`;
      baseStyle.height = `${defaultH}%`;
      baseStyle.zIndex = defaultZ;
    }
    // Only absolute shapes should dictate their own box sizing independently
    baseStyle.boxSizing = 'border-box';
  } else {
    // Force a stable positioning context for the absolute overlay child, without disrupting flow
    baseStyle.position = 'relative';
  }

  // Determine cursor based strictly on whether it's absolute
  const combinedClassName = [
    className,
    isAbsoluteShape && isAdvancedActive ? 'cursor-move' : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={slotRef}
      style={baseStyle}
      className={combinedClassName}
      onClick={isAdvancedActive ? (e) => { e.stopPropagation(); onBlockSelect(blockId); onElementSelect(null); } : undefined}
      onMouseDown={isAbsoluteShape && isAdvancedActive ? handleDragMouseDown : undefined}
    >
      {/* ── Native Content Layer ── */}
      {/* We DO NOT wrap this in any display hooks or inline spans that could disrupt the layout */}
      {children}

      {/* ── Absolute Visual Overlay ── */}
      {/* This renders strictly ON TOP of the element without affecting its flow layout footprint */}
      {isAdvancedActive && (
        <div 
          className="absolute inset-0 pointer-events-none transition-colors z-[399]"
          style={{
             outline: isSelected ? '2px solid #8b5cf6' : '1px solid transparent',
             outlineOffset: isSelected ? '4px' : '0px',
             backgroundColor: isSelected ? 'transparent' : 'rgba(139, 92, 246, 0.02)'
          }}
        >
          
          {/* Hover highlight line */}
          {!isSelected && (
             <div className="absolute inset-0 border border-violet-400/0 hover:border-violet-400/60 transition-colors" />
          )}

          {/* Context Toolbar */}
          {isSelected && (
            <div
              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-violet-900 text-white flex items-center gap-0.5 px-1.5 py-1 rounded-lg shadow-2xl z-[400] whitespace-nowrap pointer-events-auto"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <span className="text-[8px] font-black uppercase tracking-widest text-violet-300 px-2">
                {sectionKey}
              </span>
              <div className="w-px h-5 bg-violet-700" />
              <button className="flex flex-col items-center px-2 py-0.5 text-[8px] font-black uppercase hover:bg-violet-700 rounded text-violet-200 gap-0.5" onClick={(e) => { e.stopPropagation(); if (block) onUpdateContentBlock(pageNumber, blockId, { zIndex: 999 }); }} title="Bring to Front">
                <span className="text-[10px]">⤒</span><span>Front</span>
              </button>
              <div className="w-px h-5 bg-violet-700" />
              <button className="flex flex-col items-center px-2 py-0.5 text-[8px] font-black uppercase hover:bg-violet-700 rounded text-violet-300 gap-0.5" onClick={(e) => { e.stopPropagation(); if (block) onUpdateContentBlock(pageNumber, blockId, { zIndex: Math.max(1, (block.zIndex || 30) - 1) }); }} title="Send Backward">
                <span className="text-[10px]">↓</span><span>Back</span>
              </button>
              <div className="w-px h-5 bg-violet-700" />
              <button className="flex flex-col items-center px-2 py-0.5 text-[8px] font-black uppercase hover:bg-violet-700 rounded text-violet-400 gap-0.5" onClick={(e) => { e.stopPropagation(); if (block) onUpdateContentBlock(pageNumber, blockId, { zIndex: 5 }); }} title="Send to Back">
                <span className="text-[10px]">⤓</span><span>Bottom</span>
              </button>
            </div>
          )}

          {/* 8-Point Resize Handles (Only for absolute shapes) */}
          {isSelected && isAbsoluteShape && ALL_HANDLES.map((h) => (
            <div
              key={h}
              style={{ position: 'absolute', width: 10, height: 10, background: 'white', border: '2px solid #7c3aed', borderRadius: 2, cursor: HANDLE_CURSORS[h], zIndex: 401, ...HANDLE_POSITIONS[h] }}
              className="pointer-events-auto"
              onMouseDown={(e) => handleResizeMouseDown(e, h)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
