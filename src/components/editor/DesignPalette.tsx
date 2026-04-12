import React from 'react';
import { SectionStyle, CustomizationMode, Edition, FloatingElement, BackgroundElement, BackgroundType } from '@/types/newspaper';
import { 
  Type, Palette, Layout, MousePointer2, Layers, Check, Hash, Plus, Trash2, Box, Sparkles,
  Circle, Square, Minus, Zap, Globe, 
  Waves as WaveIcon, Diamond, Star, Grid3X3
} from 'lucide-react';
import { useDesignEngine } from '../design-engine/DesignEngineContext';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  mode: CustomizationMode;
  globalStyle: SectionStyle;
  activeSectionId?: string;
  activeSectionStyle?: SectionStyle;
  onStyleChange: (style: SectionStyle, sectionId?: string) => void;
  showPageNumbers?: boolean;
  applyToAll?: boolean;
  onApplyToAllChange?: (val: boolean) => void;
  onSettingsChange?: (settings: Partial<Edition>) => void;
  pageSettings?: Record<number, any>;
  selectedElementId?: string | null;
  onUpdateElement?: (updates: Partial<FloatingElement>) => void;
  onCopyDesign?: (pageNum: number) => void;
  onApplyDesign?: (pageNum: number) => void;
  hasClipboardContent?: boolean;
}

const PRESETS = [
  { name: 'Classic Academic', theme: { primary: '#1e293b', secondary: '#64748b', font: 'Merriweather' } },
  { name: 'Modern Institutional', theme: { primary: '#0f172a', secondary: '#334155', font: 'Inter' } },
  { name: 'Minimal Clean', theme: { primary: '#334155', secondary: '#94a3b8', font: 'Outfit' } },
  { name: 'Editorial Bold', theme: { primary: '#000000', secondary: '#475569', font: 'Playfair Display' } },
];

const FONT_OPTIONS = [
  { 
    category: 'Sans-Serif', 
    fonts: ['Inter', 'Roboto', 'Arial', 'Helvetica', 'Open Sans'] 
  },
  { 
    category: 'Serif', 
    fonts: ['Playfair Display', 'Merriweather', 'Georgia', 'Times New Roman'] 
  },
  { 
    category: 'Display / Accent', 
    fonts: ['Poppins', 'Montserrat', 'Lora'] 
  },
];

const BG_PRESETS = [
  { 
     id: 'academic-minimal', 
     name: 'Academic Minimal', 
     elements: [
        { id: 'am-1', type: 'rectangle' as BackgroundType, color: '#f1f5f9', opacity: 100, x: 10, y: 50, size: 20, rotation: 0, zIndex: 0 },
        { id: 'am-2', type: 'line' as BackgroundType, color: '#10b981', opacity: 100, x: 18, y: 50, size: 90, rotation: 90, zIndex: 1, borderWidth: 2 },
        { id: 'am-3', type: 'circle' as BackgroundType, color: '#1e293b', opacity: 10, x: 5, y: 5, size: 15, rotation: 0, zIndex: 2 },
        { id: 'am-4', type: 'lines' as BackgroundType, color: '#f1f5f9', opacity: 40, x: 90, y: 90, size: 20, rotation: 45, zIndex: 0 }
     ] 
  },
  { 
     id: 'modern-diagonal', 
     name: 'Modern Diagonal', 
     elements: [
        { id: 'md-1', type: 'diagonal' as BackgroundType, color: '#f8fafc', opacity: 100, x: 50, y: 50, size: 100, rotation: 0, zIndex: 0 },
        { id: 'md-2', type: 'line' as BackgroundType, color: '#cbd5e1', opacity: 100, x: 50, y: 50, size: 160, rotation: -45, zIndex: 1, borderWidth: 1 },
        { id: 'md-3', type: 'circle' as BackgroundType, color: '#facc15', opacity: 100, x: 95, y: 5, size: 8, rotation: 0, zIndex: 2 },
        { id: 'md-4', type: 'blob' as BackgroundType, color: '#6366f1', opacity: 5, x: 10, y: 90, size: 100, rotation: 0, zIndex: 0 }
     ] 
  },
  { 
     id: 'soft-blob-dream', 
     name: 'Soft Blob Gradient', 
     elements: [
        { id: 'sb-1', type: 'blob' as BackgroundType, color: '#6366f1', opacity: 15, x: 15, y: 15, size: 120, rotation: 45, zIndex: 0 },
        { id: 'sb-2', type: 'blob' as BackgroundType, color: '#ec4899', opacity: 12, x: 85, y: 85, size: 110, rotation: -30, zIndex: 0 },
        { id: 'sb-3', type: 'blob' as BackgroundType, color: '#f59e0b', opacity: 10, x: 80, y: 20, size: 140, rotation: 15, zIndex: 0 },
        { id: 'sb-4', type: 'blob' as BackgroundType, color: '#10b981', opacity: 8, x: 20, y: 80, size: 90, rotation: 0, zIndex: 0 }
     ] 
  },
  { 
     id: 'geometric-clean', 
     name: 'Geometric Clean', 
     elements: [
        { id: 'gc-1', type: 'lines' as BackgroundType, color: '#f1f5f9', opacity: 100, x: 50, y: 50, size: 100, rotation: 0, zIndex: 0 },
        { id: 'gc-2', type: 'rectangle' as BackgroundType, color: '#0f172a', opacity: 100, x: 50, y: 3, size: 6, rotation: 0, zIndex: 1 },
        { id: 'gc-3', type: 'polygon' as BackgroundType, color: '#f1f5f9', opacity: 100, x: 10, y: 90, size: 30, rotation: 0, zIndex: 0, pathData: 'M0,100 L100,100 L0,0 Z' },
        { id: 'gc-4', type: 'line' as BackgroundType, color: '#334155', opacity: 100, x: 50, y: 50, size: 80, rotation: 90, zIndex: 1, borderWidth: 1 }
     ] 
  },
  { 
     id: 'editorial-magazine', 
     name: 'Editorial Magazine', 
     elements: [
        { id: 'em-1', type: 'rectangle' as BackgroundType, color: '#000000', opacity: 100, x: 50, y: 2, size: 4, rotation: 0, zIndex: 1 },
        { id: 'em-2', type: 'line' as BackgroundType, color: '#e2e8f0', opacity: 100, x: 8, y: 50, size: 90, rotation: 90, zIndex: 1, borderWidth: 1 },
        { id: 'em-3', type: 'polygon' as BackgroundType, color: '#f8fafc', opacity: 100, x: 85, y: 85, size: 40, rotation: 0, zIndex: 0, pathData: 'M20,10 Q40,10 40,40 L40,60 L20,60 L20,40 Q20,30 20,40 Z M60,10 Q80,10 80,40 L80,60 L60,60 L60,40 Q60,30 60,40 Z' },
        { id: 'em-4', type: 'rectangle' as BackgroundType, color: '#000000', opacity: 100, x: 92, y: 95, size: 4, rotation: 0, zIndex: 1 }
     ] 
  },
  { 
     id: 'corner-decoration', 
     name: 'Corner Decoration', 
     elements: [
        { id: 'cd-1', type: 'wave' as BackgroundType, color: '#eff6ff', opacity: 100, x: 90, y: 10, size: 40, rotation: 0, zIndex: 0, pathData: 'M0,0 L100,0 L100,50 Q75,100 50,50 T0,50 Z' },
        { id: 'cd-2', type: 'wave' as BackgroundType, color: '#eff6ff', opacity: 100, x: 10, y: 90, size: 40, rotation: 180, zIndex: 0, pathData: 'M0,50 Q25,0 50,50 T100,50 L100,100 L0,100 Z' },
        { id: 'cd-3', type: 'circle' as BackgroundType, color: '#3b82f6', variant: 'ring', opacity: 20, x: 92, y: 8, size: 15, rotation: 0, zIndex: 1, borderWidth: 2 },
        { id: 'cd-4', type: 'lines' as BackgroundType, color: '#3b82f6', opacity: 5, x: 5, y: 5, size: 10, rotation: 0, zIndex: 1, borderStyle: 'dashed' }
     ] 
  },
];

const SHAPE_LIBRARY = [
  {
    category: 'Circles',
    icon: Circle,
    variants: [
      { id: 'c-solid', name: 'Solid Circle', type: 'circle' as const, variant: 'solid', size: 40 },
      { id: 'c-glow', name: 'Soft Glow', type: 'circle' as const, variant: 'glow', size: 45 },
      { id: 'c-ring', name: 'Outline Ring', type: 'circle' as const, variant: 'ring', borderWidth: 2, size: 40 },
      { id: 'c-dashed', name: 'Dashed Ring', type: 'circle' as const, variant: 'ring', borderWidth: 2, borderStyle: 'dashed' as const, size: 40 },
      { id: 'c-double', name: 'Double Ring', type: 'circle' as const, variant: 'double-ring', borderWidth: 2, size: 40 },
      { id: 'c-gradient', name: 'Soft Gradient', type: 'circle' as const, variant: 'gradient', size: 50 },
    ]
  },
  {
    category: 'Rectangles',
    icon: Square,
    variants: [
      { id: 'r-solid', name: 'Solid Box', type: 'rectangle' as const, variant: 'solid', size: 40 },
      { id: 'r-rounded', name: 'Rounded Card', type: 'rectangle' as const, variant: 'rounded', size: 40 },
      { id: 'r-pill', name: 'Pill Shape', type: 'rectangle' as const, variant: 'pill', size: 50 },
      { id: 'r-outline', name: 'Border Only', type: 'rectangle' as const, variant: 'ring', borderWidth: 2, size: 40 },
      { id: 'r-dashed', name: 'Dashed Border', type: 'rectangle' as const, variant: 'ring', borderWidth: 2, borderStyle: 'dashed' as const, size: 40 },
      { id: 'r-shadow', name: 'Soft Shadow', type: 'rectangle' as const, variant: 'shadow', size: 40 },
    ]
  },
  {
    category: 'Lines',
    icon: Minus,
    variants: [
      { id: 'l-solid', name: 'Solid Line', type: 'line' as const, variant: 'solid', size: 100 },
      { id: 'l-dashed', name: 'Dashed Line', type: 'line' as const, borderStyle: 'dashed' as const, size: 100 },
      { id: 'l-thick', name: 'Thick Accent', type: 'line' as const, borderWidth: 8, size: 40 },
      { id: 'l-double', name: 'Double Line', type: 'line' as const, variant: 'ring', borderWidth: 4, size: 100 },
      { id: 'l-corners-tl', name: 'Top Left L', type: 'rectangle' as const, variant: 'ring', borderWidth: 4, size: 20 },
      { id: 'l-diag', name: 'Diagonal Span', type: 'line' as const, rotation: 45, size: 150 },
    ]
  },
  {
    category: 'Blobs',
    icon: Zap,
    variants: [
      { id: 'b-soft', name: 'Soft Cloud', type: 'blob' as const, variant: 'soft', opacity: 20, size: 100 },
      { id: 'b-vivid', name: 'Vivid Liquid', type: 'blob' as const, variant: 'vivid', opacity: 60, size: 80 },
      { id: 'b-flat', name: 'Organic Blob', type: 'blob' as const, opacity: 100, size: 60 },
      { id: 'b-sidebar', name: 'Sidebar Curve', type: 'blob' as const, x: 0, size: 150 },
      { id: 'b-nested', name: 'Nested Layers', type: 'blob' as const, variant: 'vivid', x: 50, y: 50, size: 100 },
      { id: 'b-glow', name: 'Abstract Aura', type: 'blob' as const, variant: 'soft', size: 200 },
    ]
  },
  {
    category: 'Polygons',
    icon: Diamond,
    variants: [
      { id: 'p-triangle', name: 'Triangle', type: 'polygon' as const, pathData: 'M50,0 L100,100 L0,100 Z', size: 40 },
      { id: 'p-diamond', name: 'Diamond', type: 'polygon' as const, pathData: 'M50,0 L100,50 L50,100 L0,50 Z', size: 40 },
      { id: 'p-hexagon', name: 'Hexagon', type: 'polygon' as const, pathData: 'M25,0 L75,0 L100,50 L75,100 L25,100 L0,50 Z', size: 40 },
      { id: 'p-star', name: 'Star', type: 'polygon' as const, pathData: 'M50,0 L61,35 L98,35 L68,57 L79,91 L50,70 L21,91 L32,57 L2,35 L39,35 Z', size: 40 },
      { id: 'p-badge', name: 'Emblem Badge', type: 'polygon' as const, variant: 'ring', borderWidth: 2, pathData: 'M50,0 L100,25 L100,75 L50,100 L0,75 L0,25 Z', size: 50 },
    ]
  },
  {
    category: 'Waves',
    icon: WaveIcon,
    variants: [
      { id: 'w-bottom-1', name: 'Gentle Wave', type: 'wave' as const, pathData: 'M0,50 Q25,0 50,50 T100,50 L100,100 L0,100 Z', y: 90, size: 120 },
      { id: 'w-top-1', name: 'Crest Wave', type: 'wave' as const, pathData: 'M0,0 L100,0 L100,50 Q75,100 50,50 T0,50 Z', y: 10, size: 120 },
      { id: 'w-side-l', name: 'Fluid Side', type: 'wave' as const, pathData: 'M0,0 Q50,25 0,50 T0,100 L0,100 L0,0 Z', x: 10, size: 80 },
      { id: 'w-bottom-2', name: 'Steep Curve', type: 'wave' as const, pathData: 'M0,100 C20,0 80,0 100,100 Z', y: 95, size: 150 },
      { id: 'w-diagonal-1', name: 'Modern Split', type: 'wave' as const, pathData: 'M0,0 L100,0 L100,50 Q50,100 0,0 Z', x: 50, y: 50, size: 150 },
    ]
  },
  {
    category: 'Decorations',
    icon: Grid3X3,
    variants: [
      { id: 'd-grid', name: 'Dot Grid', type: 'lines' as const, opacity: 10, size: 100 },
      { id: 'd-mesh', name: 'Fine Mesh', type: 'lines' as const, rotation: 45, opacity: 5, size: 100 },
      { id: 'd-quotes', name: 'Modern Quotes', type: 'polygon' as const, pathData: 'M20,10 Q40,10 40,40 L40,60 L20,60 L20,40 Q20,30 20,40 Z M60,10 Q80,10 80,40 L80,60 L60,60 L60,40 Q60,30 60,40 Z', opacity: 20, size: 30 },
    ]
  }
];

const DesignPalette = (props: Props) => {
  const { 
    mode, 
    globalStyle, 
    activeSectionId, 
    activeSectionStyle, 
    showPageNumbers,
    applyToAll,
    onApplyToAllChange,
    onStyleChange, 
    onSettingsChange,
    onCopyDesign,
    onApplyDesign,
    hasClipboardContent
  } = props;

  const [activeTab, setActiveTab] = React.useState<'design' | 'background'>('design');
  const [selectedBgId, setSelectedBgId] = React.useState<string | null>(null);
  const isDragging = React.useRef(false);

  const currentStyle = activeSectionId && !applyToAll ? activeSectionStyle : globalStyle;
  const pageIdx = activeSectionId ? parseInt(activeSectionId) : 0;
  const targetScope = applyToAll ? 'global' : pageIdx;

  const [localSliders, setLocalSliders] = React.useState({
    fontSize: parseInt(currentStyle?.fontSize || '16') || 16,
    letterSpacing: parseFloat(currentStyle?.letterSpacing || '0') || 0,
    wordSpacing: parseFloat(currentStyle?.wordSpacing || '0') || 0,
    lineHeight: parseFloat(currentStyle?.lineHeight || '1.6') || 1.6
  });

  React.useEffect(() => {
    const newFs = parseInt(currentStyle?.fontSize || '16') || 16;
    const newLs = parseFloat(currentStyle?.letterSpacing || '0') || 0;
    const newWs = parseFloat(currentStyle?.wordSpacing || '0') || 0;
    const newLh = parseFloat(currentStyle?.lineHeight || '1.6') || 1.6;

    setLocalSliders(prev => {
      if (isDragging.current) return prev;
      return {
        fontSize: newFs,
        letterSpacing: newLs,
        wordSpacing: newWs,
        lineHeight: newLh
      };
    });
  }, [currentStyle?.fontSize, currentStyle?.letterSpacing, currentStyle?.wordSpacing, currentStyle?.lineHeight, activeSectionId]);

  const { 
    onAddBackground, 
    onUpdateBackground, 
    onRemoveBackground, 
    onSetBackgrounds,
    edition 
  } = useDesignEngine();

  const [customFoundations, setCustomFoundations] = React.useState<any[]>([]);

  if (mode === 'academic') return null;

  const globalBgs = (edition.backgroundElements || []).map(bg => ({ ...bg, scope: 'global' as const }));
  const localBgs = (edition.pageSettings?.[pageIdx]?.backgroundElements || []).map(bg => ({ ...bg, scope: pageIdx }));
  const allRelevantBgs = applyToAll ? globalBgs : [...globalBgs, ...localBgs];
  
  const selectedBg = allRelevantBgs.find(bg => bg.id === selectedBgId);

  return (
    <div className="w-full h-full border-l border-slate-200 bg-slate-50 flex flex-col">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 bg-white">
         <button 
            onClick={() => setActiveTab('design')}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'design' ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
         >
            Design Palette
         </button>
         <button 
            onClick={() => setActiveTab('background')}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'background' ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/30' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
         >
            Backgrounds
         </button>
      </div>

      <div className="p-6 border-b border-slate-200 bg-white space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-tight text-xs">
              {activeTab === 'design' ? <Palette className="w-4 h-4 text-amber-500" /> : <Box className="w-4 h-4 text-emerald-500" />}
              {activeTab === 'design' ? 'Master Styles' : 'Background Layer'}
           </h2>
           <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold text-slate-400 uppercase">Apply All</span>
              <Switch 
                checked={applyToAll} 
                onCheckedChange={onApplyToAllChange}
                className={`scale-75 ${activeTab === 'design' ? 'data-[state=checked]:bg-amber-500' : 'data-[state=checked]:bg-emerald-500'}`}
              />
           </div>
        </div>
        
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 p-1.5 rounded-lg text-center border border-slate-100">
          {applyToAll ? 'Target: Every Page' : (activeSectionId ? `Target: Page ${activeSectionId}` : 'Target: Current View')}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {activeTab === 'design' ? (
          <>
            {/* Style Presets */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Layers className="w-3 h-3" /> Style Presets
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => onStyleChange({ 
                      ...(currentStyle || {}),
                      color: preset.theme.primary, 
                      fontFamily: preset.theme.font 
                    }, activeSectionId)}
                    className="group p-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-50 hover:shadow-md transition-all text-left"
                  >
                    <div className="w-full h-8 rounded-lg mb-2 flex" style={{ background: preset.theme.primary }}>
                       <div className="w-1/3 h-full opacity-50" style={{ background: preset.theme.secondary }}></div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-700 leading-tight">{preset.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-6">
              <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Type className="w-3 h-3" /> Typography
              </Label>
              <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 text-slate-800">
                 {/* Font Family Selector */}
                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Font Family</p>
                       <span className="text-[8px] text-slate-400 font-medium italic">Global Application</span>
                    </div>
                    <Select 
                      value={currentStyle?.fontFamily || (edition.theme.headlineFont || 'Inter')} 
                      onValueChange={(val) => {
                        // Apply globally to theme and current style
                        onSettingsChange?.({ 
                          theme: { 
                            ...edition.theme, 
                            headlineFont: val,
                            bodyFont: val
                          } 
                        });
                        onStyleChange({ ...currentStyle, fontFamily: val }, activeSectionId);
                      }}
                    >
                      <SelectTrigger className="w-full bg-white border-slate-100 rounded-xl h-10 text-xs font-semibold">
                        <SelectValue placeholder="Select Font" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] bg-white">
                        {FONT_OPTIONS.map((group) => (
                          <SelectGroup key={group.category}>
                            <SelectLabel className="text-[9px] uppercase tracking-widest text-slate-400 opacity-70">
                              {group.category}
                            </SelectLabel>
                            {group.fonts.map((f) => (
                              <SelectItem key={f} value={f} className="text-xs font-medium">
                                <span style={{ fontFamily: f }}>{f}</span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                 </div>

                 {/* Font Size */}
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Size</p>
                       <span className="text-[10px] font-black text-slate-900">{localSliders.fontSize}px</span>
                    </div>
                    <Slider 
                       value={[localSliders.fontSize]} 
                       min={10} max={48} step={1}
                       onPointerDown={() => { isDragging.current = true; }}
                       onPointerUp={() => { isDragging.current = false; }}
                       onValueChange={([v]) => {
                          setLocalSliders(prev => ({ ...prev, fontSize: v }));
                          onStyleChange({ ...currentStyle, fontSize: `${v}px` }, activeSectionId);
                       }}
                    />
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Line Height</p>
                       <span className="text-[10px] font-black text-slate-900">{localSliders.lineHeight}x</span>
                    </div>
                    <Slider 
                       value={[localSliders.lineHeight]} 
                       min={1} max={2.5} step={0.1}
                       onPointerDown={() => { isDragging.current = true; }}
                       onPointerUp={() => { isDragging.current = false; }}
                       onValueChange={([v]) => {
                          setLocalSliders(prev => ({ ...prev, lineHeight: v }));
                          onStyleChange({ ...currentStyle, lineHeight: v.toString() }, activeSectionId);
                       }}
                    />
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Letter Spacing</p>
                       <span className="text-[10px] font-black text-slate-900">{localSliders.letterSpacing}px</span>
                    </div>
                    <Slider 
                       value={[localSliders.letterSpacing]} 
                       min={-3} max={15} step={0.5}
                       onPointerDown={() => { isDragging.current = true; }}
                       onPointerUp={() => { isDragging.current = false; }}
                       onValueChange={([v]) => {
                          setLocalSliders(prev => ({ ...prev, letterSpacing: v }));
                          onStyleChange({ ...currentStyle, letterSpacing: `${v}px` }, activeSectionId);
                       }}
                    />
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Word Spacing</p>
                       <span className="text-[10px] font-black text-slate-900">{localSliders.wordSpacing}px</span>
                    </div>
                    <Slider 
                       value={[localSliders.wordSpacing]} 
                       min={-5} max={25} step={1}
                       onPointerDown={() => { isDragging.current = true; }}
                       onPointerUp={() => { isDragging.current = false; }}
                       onValueChange={([v]) => {
                          setLocalSliders(prev => ({ ...prev, wordSpacing: v }));
                          onStyleChange({ ...currentStyle, wordSpacing: `${v}px` }, activeSectionId);
                       }}
                    />
                 </div>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Palette className="w-3 h-3" /> Color Palette
              </Label>
              <div className="flex items-center gap-3 pt-2">
                <Input 
                  type="color" 
                  value={currentStyle?.color || '#000000'} 
                  onChange={(e) => onStyleChange({ ...currentStyle, color: e.target.value }, activeSectionId)}
                  className="w-10 h-10 p-1 rounded-lg border-none"
                />
                <Input 
                  value={currentStyle?.color || '#0f172a'} 
                  onChange={(e) => onStyleChange({ ...currentStyle, color: e.target.value }, activeSectionId)}
                  placeholder="#000000"
                  className="rounded-xl border border-slate-200 h-10 text-xs font-bold font-mono"
                />
              </div>
            </div>

            {/* Template Options */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Hash className="w-3 h-3" /> Template Options
              </Label>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-700">Page Numbering</span>
                    <span className="text-[8px] text-slate-400 font-medium">Show in footer of all pages</span>
                 </div>
                 <Switch 
                   checked={showPageNumbers} 
                   onCheckedChange={(checked) => onSettingsChange?.({ showPageNumbers: checked })}
                 />
              </div>
            </div>
          </>
        ) : (
          /* Background Layer View */
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Background Templates */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-900 border-b border-indigo-100 pb-2">
                <Layout className="w-3 h-3" /> Background Templates
              </Label>
              
              <div className="grid grid-cols-2 gap-3">
                {BG_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      // Generate fresh IDs for the elements in the preset
                      const newElements = preset.elements.map(el => ({
                        ...el,
                        id: Math.random().toString(36).substr(2, 9)
                      }));
                      onSetBackgrounds(targetScope, newElements);
                      setSelectedBgId(null); // Deselect any active element
                    }}
                    className="group flex flex-col items-start p-3 rounded-2xl bg-white border border-slate-100 hover:border-indigo-300 hover:shadow-lg transition-all text-left space-y-2 h-[100px]"
                  >
                    <div className="w-full h-8 rounded-lg bg-indigo-50/50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors relative overflow-hidden">
                      {/* Simple visual representation of multiple elements */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                         <Box className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                         <Box className="w-4 h-4 text-indigo-400 absolute translate-x-1 translate-y-1" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-tight text-slate-800 leading-none mb-1">{preset.name}</p>
                      <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none">Ready Layout</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Shape Library */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-900 border-b border-emerald-100 pb-2">
                <Sparkles className="w-3 h-3" /> Shape Library
              </Label>
              
              <Accordion type="multiple" className="w-full">
                {SHAPE_LIBRARY.map((cat) => (
                  <AccordionItem key={cat.category} value={cat.category} className="border-slate-100">
                    <AccordionTrigger className="hover:no-underline py-3 px-1 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                          <cat.icon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-tight text-slate-700">{cat.category}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <div className="grid grid-cols-2 gap-2">
                        {cat.variants.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => {
                              const newId = Math.random().toString(36).substr(2, 9);
                              onAddBackground(targetScope, v.type as any, [{
                                id: newId,
                                type: v.type as BackgroundType,
                                color: currentStyle?.color || '#cbd5e1',
                                opacity: v.opacity || 30,
                                x: v.x !== undefined ? v.x : 50,
                                y: v.y !== undefined ? v.y : 50,
                                size: v.size || 40,
                                rotation: v.rotation || 0,
                                zIndex: allRelevantBgs.length + 1,
                                variant: v.variant,
                                borderWidth: v.borderWidth,
                                borderStyle: v.borderStyle,
                                pathData: v.pathData
                              }]);
                              setSelectedBgId(newId);
                            }}
                            className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 hover:border-emerald-300 hover:shadow-md transition-all text-center space-y-1.5 min-h-[70px]"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                              <cat.icon className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                            </div>
                            <p className="text-[8px] font-bold text-slate-500 uppercase leading-tight">{v.name}</p>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Design Layers */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
               <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                     <Layers className="w-3 h-3" /> Design Layers
                  </Label>
                  <div className="flex gap-2">
                     {targetScope !== 'global' && (
                        <div className="flex bg-slate-100 rounded-full p-1 gap-1">
                           <button 
                             onClick={() => onCopyDesign?.(targetScope as number)}
                             className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-[8px] font-bold uppercase"
                             title="Copy background design from this page"
                           >
                              Copy
                           </button>
                           <button 
                             disabled={!hasClipboardContent}
                             onClick={() => onApplyDesign?.(targetScope as number)}
                             className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-[8px] font-bold uppercase ${hasClipboardContent ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                             title="Apply copied background design to this page"
                           >
                              Apply
                           </button>
                        </div>
                     )}
                     <button 
                       onClick={() => {
                         const id = Math.random().toString(36).substr(2, 9);
                         onAddBackground(targetScope, 'blob', [{
                           id, type: 'blob', color: '#cbd5e1', opacity: 20, x: 50, y: 50, size: 100, rotation: 0, zIndex: allRelevantBgs.length + 1
                         }]);
                         setSelectedBgId(id);
                       }}
                       className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-[9px] font-bold uppercase"
                     >
                        <Plus size={10} /> Add Layer
                     </button>
                  </div>
               </div>

               {allRelevantBgs.length === 0 ? (
                  <div className="p-8 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-center">
                     <p className="text-[10px] font-black text-slate-400 uppercase">Blank Canvas</p>
                  </div>
               ) : (
                  <div className="space-y-2">
                     {allRelevantBgs.map((bg, idx) => (
                        <button 
                           key={bg.id}
                           onClick={() => setSelectedBgId(bg.id)}
                           className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${selectedBgId === bg.id ? 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-50' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                        >
                           <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded flex items-center justify-center ${selectedBgId === bg.id ? 'bg-emerald-100' : 'bg-slate-50'}`}>
                                 <span className="text-[8px] font-black text-slate-400">{idx + 1}</span>
                              </div>
                              <div className="text-left">
                                 <p className={`text-[10px] font-black uppercase tracking-tight ${selectedBgId === bg.id ? 'text-emerald-900' : 'text-slate-700'}`}>{bg.type}</p>
                                 <p className="text-[8px] font-bold text-slate-400 uppercase">Layer {idx + 1}</p>
                              </div>
                           </div>
                           <button 
                             onClick={(e) => { 
                                e.stopPropagation(); 
                                onRemoveBackground(bg.scope as any, bg.id); 
                                if (selectedBgId === bg.id) setSelectedBgId(null); 
                             }}
                             className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 transition-all"
                           >
                              <Trash2 size={12} />
                           </button>
                        </button>
                     ))}
                  </div>
               )}
            </div>

            {/* Selected Property Panel */}
            {selectedBg && (
               <div className="space-y-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/10 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                     <span className="text-[9px] font-black uppercase tracking-widest text-emerald-900">Configure Element</span>
                     <button onClick={() => setSelectedBgId(null)} className="text-slate-300 hover:text-slate-600"><Trash2 size={10} /></button>
                  </div>

                  <div className="space-y-2">
                     <p className="text-[8px] font-bold text-slate-400 uppercase">Type</p>
                     <select 
                        value={selectedBg.type}
                        onChange={(e) => onUpdateBackground(selectedBg.scope as any, selectedBg.id, { type: e.target.value as BackgroundType })}
                        className="w-full text-[10px] font-black bg-slate-50 border-slate-100 p-2 rounded-xl uppercase"
                     >
                        <option value="diagonal">Diagonal</option>
                        <option value="blob">Blob</option>
                        <option value="circle">Circle</option>
                        <option value="rectangle">Rectangle</option>
                        <option value="line">Line</option>
                        <option value="polygon">Polygon</option>
                        <option value="wave">Wave</option>
                        <option value="lines">Pattern</option>
                     </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Color</p>
                        <input 
                           type="color" 
                           value={selectedBg.color.startsWith('#') ? selectedBg.color : '#cbd5e1'} 
                           onChange={(e) => onUpdateBackground(selectedBg.scope as any, selectedBg.id, { color: e.target.value })}
                           className="w-full h-8 rounded-lg border-none p-1 bg-slate-50"
                        />
                     </div>
                     <div className="space-y-2">
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Opacity ({Math.round(selectedBg.opacity)}%)</p>
                        <Slider value={[selectedBg.opacity]} max={100} onValueChange={([v]) => onUpdateBackground(selectedBg.scope as any, selectedBg.id, { opacity: v })} />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-2">
                       <p className="text-[8px] font-bold text-slate-400 uppercase">X ({Math.round(selectedBg.x)}%)</p>
                       <Slider value={[selectedBg.x]} max={100} onValueChange={([v]) => onUpdateBackground(selectedBg.scope as any, selectedBg.id, { x: v })} />
                    </div>
                    <div className="space-y-2">
                       <p className="text-[8px] font-bold text-slate-400 uppercase">Y ({Math.round(selectedBg.y)}%)</p>
                       <Slider value={[selectedBg.y]} max={100} onValueChange={([v]) => onUpdateBackground(selectedBg.scope as any, selectedBg.id, { y: v })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                       <p className="text-[8px] font-bold text-slate-400 uppercase">Scale</p>
                       <Slider value={[selectedBg.size]} max={300} onValueChange={([v]) => onUpdateBackground(selectedBg.scope as any, selectedBg.id, { size: v })} />
                    </div>
                    <div className="space-y-2">
                       <p className="text-[8px] font-bold text-slate-400 uppercase">Rotation</p>
                       <Slider value={[selectedBg.rotation]} max={360} onValueChange={([v]) => onUpdateBackground(selectedBg.scope as any, selectedBg.id, { rotation: v })} />
                    </div>
                  </div>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignPalette;
