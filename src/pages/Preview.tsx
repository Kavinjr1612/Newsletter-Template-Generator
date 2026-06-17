import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Download, Loader2, ChevronLeft, Printer, X, AlertCircle } from 'lucide-react';
import TemplateRenderer from '@/components/preview/TemplateRenderer';
import { Button } from '@/components/ui/button';
import { Edition, SectionStyle, CustomizationMode, FloatingElement, BackgroundElement } from '@/types/newspaper';
import { getEdition, saveEdition } from '@/lib/store';
import AcademicInstitutionalLayout from '@/components/preview/AcademicInstitutionalLayout';

import ValidationReport from '@/components/preview/ValidationReport';
import DesignPalette from '@/components/editor/DesignPalette';
import PageListPanel from '@/components/preview/PageListPanel';
import { DesignEngineProvider } from '@/components/design-engine/DesignEngineContext';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const Preview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [edition, setEdition] = useState<Edition | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [activePageNumber, setActivePageNumber] = useState<number | undefined>();
  const [applyToAll, setApplyToAll] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [designClipboard, setDesignClipboard] = useState<BackgroundElement[] | null>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  // Dynamic Page Count Calculation
  useEffect(() => {
    if (layoutRef.current) {
      const pages = layoutRef.current.querySelectorAll('.a4-page');
      setPageCount(pages.length);
    }
  }, [edition, layoutRef]);

  useEffect(() => {
    if (id) {
      const found = getEdition(id);
      if (found) setEdition(found);
      else navigate('/');
    }
  }, [id, navigate]);

  if (!edition) return null;

  const updateEdition = (updates: Partial<Edition> | ((prev: Edition) => Edition)) => {
    setEdition(prev => {
      if (!prev) return prev;
      const updated = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      saveEdition(updated);
      return updated;
    });
  };

  const handleModeChange = (mode: CustomizationMode) => {
    updateEdition({ mode });
    if (mode === 'academic') setActivePageNumber(undefined);
  };

  const handlePageStyleChange = (style: SectionStyle, pageNum?: string | number) => {
    const targetPage = typeof pageNum === 'string' ? parseInt(pageNum) : pageNum;
    
    updateEdition(prev => {
      if (applyToAll) {
        return {
          ...prev,
          sectionStyles: { ...(prev.sectionStyles || {}), global: style },
          pageStyles: {}
        };
      } else if (targetPage) {
        return {
          ...prev,
          pageStyles: { ...(prev.pageStyles || {}), [targetPage]: style }
        };
      } else {
        return {
          ...prev,
          sectionStyles: { ...(prev.sectionStyles || {}), global: style }
        };
      }
    });
  };

  const handleAddFloatingElement = (pageNum: number, type: 'image' | 'shape') => {
    const newElement: FloatingElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'image' ? 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=800&auto=format&fit=crop&q=60' : '#indigo-600',
      x: 10,
      y: 10,
      width: 30,
      height: 20,
      rotation: 0,
      zIndex: 100,
      wrapMode: 'tight',
      positionMode: 'floating-front'
    };

    updateEdition(prev => {
      const currentSettings = prev.pageSettings || {};
      const pageSetting = currentSettings[pageNum] || { floatingElements: [], lockContent: false, allowOverflow: false, pageBreak: false };
      return {
        ...prev,
        pageSettings: {
          ...currentSettings,
          [pageNum]: {
            ...pageSetting,
            floatingElements: [...(pageSetting.floatingElements || []), newElement]
          }
        }
      };
    });
  };

  const handleUpdateFloatingElement = (pageNum: number, elementId: string, updates: Partial<FloatingElement>) => {
    updateEdition(prev => {
      const currentSettings = prev.pageSettings || {};
      const pageSetting = currentSettings[pageNum];
      if (!pageSetting) return prev;

      const updatedElements = (pageSetting.floatingElements || []).map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      );

      return {
        ...prev,
        pageSettings: {
          ...currentSettings,
          [pageNum]: { ...pageSetting, floatingElements: updatedElements }
        }
      };
    });
  };

  const handleRemoveFloatingElement = (pageNum: number, elementId: string) => {
    updateEdition(prev => {
      const currentSettings = prev.pageSettings || {};
      const pageSetting = currentSettings[pageNum];
      if (!pageSetting) return prev;
      return {
        ...prev,
        pageSettings: {
          ...currentSettings,
          [pageNum]: {
            ...pageSetting,
            floatingElements: (pageSetting.floatingElements || []).filter(el => el.id !== elementId)
          }
        }
      };
    });
  };

  const handleAddBackground = (pageNum: number | 'global', type: any, presetElements?: any[]) => {
    updateEdition(prev => {
      const elementsToAdd = presetElements || [{
        id: Math.random().toString(36).substr(2, 9),
        type,
        color: '#cbd5e1',
        opacity: 0.2,
        x: 50,
        y: 50,
        size: 100,
        rotation: 0,
        zIndex: 1
      }];

      if (pageNum === 'global') {
        return {
          ...prev,
          globalBackgroundElements: [...(prev.globalBackgroundElements || []), ...elementsToAdd]
        };
      } else {
        const currentSettings = prev.pageSettings || {};
        const pageSetting = currentSettings[pageNum] || { floatingElements: [], lockContent: false, allowOverflow: false, pageBreak: false };
        return {
          ...prev,
          pageSettings: {
            ...currentSettings,
            [pageNum]: {
              ...pageSetting,
              backgroundElements: [...(pageSetting.backgroundElements || []), ...elementsToAdd]
            }
          }
        };
      }
    });
  };

  const handleUpdateBackground = (pageNum: number | 'global', elementId: string, updates: any) => {
    updateEdition(prev => {
      if (pageNum === 'global') {
        return {
          ...prev,
          globalBackgroundElements: (prev.globalBackgroundElements || []).map(bg => 
            bg.id === elementId ? { ...bg, ...updates } : bg
          )
        };
      } else {
        const currentSettings = prev.pageSettings || {};
        const pageSetting = currentSettings[pageNum];
        if (!pageSetting) return prev;
        return {
          ...prev,
          pageSettings: {
            ...currentSettings,
            [pageNum]: {
              ...pageSetting,
              backgroundElements: (pageSetting.backgroundElements || []).map(bg => 
                bg.id === elementId ? { ...bg, ...updates } : bg
              )
            }
          }
        };
      }
    });
  };

  const handleRemoveBackground = (pageNum: number | 'global', elementId: string) => {
    updateEdition(prev => {
      if (pageNum === 'global') {
        const globalBgs = prev.backgroundElements || [];
        return {
          ...prev,
          backgroundElements: globalBgs.filter(bg => bg.id !== elementId),
          globalBackgroundElements: (prev.globalBackgroundElements || []).filter(bg => bg.id !== elementId)
        };
      } else {
        const currentSettings = prev.pageSettings || {};
        const pageSetting = currentSettings[pageNum];
        if (!pageSetting) return prev;
        return {
          ...prev,
          pageSettings: {
            ...currentSettings,
            [pageNum]: {
              ...pageSetting,
              backgroundElements: (pageSetting.backgroundElements || []).filter(bg => bg.id !== elementId)
            }
          }
        };
      }
    });
  };

  const handleSetBackgrounds = (pageNum: number | 'global', elements: any[]) => {
    updateEdition(prev => {
      if (pageNum === 'global') {
        return {
          ...prev,
          backgroundElements: elements,
          globalBackgroundElements: elements // Keep for structural consistency if needed
        };
      } else {
        const currentSettings = prev.pageSettings || {};
        const pageSetting = currentSettings[pageNum] || { floatingElements: [], lockContent: false, allowOverflow: false, pageBreak: false };
        return {
          ...prev,
          pageSettings: {
            ...currentSettings,
            [pageNum]: {
              ...pageSetting,
              backgroundElements: elements
            }
          }
        };
      }
    });
  };

  const handleInitContentBlocks = (pageNum: number, blocks: any[]) => {
    updateEdition(prev => {
      const currentSettings = prev.pageSettings || {};
      const pageSetting = currentSettings[pageNum] || { lockContent: false, allowOverflow: false, pageBreak: false, floatingElements: [] };
      return {
        ...prev,
        pageSettings: { ...currentSettings, [pageNum]: { ...pageSetting, contentBlocks: blocks } }
      };
    });
  };

  const handleUpdateContentBlock = (pageNum: number, blockId: string, updates: any) => {
    updateEdition(prev => {
      const currentSettings = prev.pageSettings || {};
      const pageSetting = currentSettings[pageNum];
      if (!pageSetting) return prev;
      const updatedBlocks = (pageSetting.contentBlocks || []).map((b: any) => b.id === blockId ? { ...b, ...updates } : b);
      return {
        ...prev,
        pageSettings: { ...currentSettings, [pageNum]: { ...pageSetting, contentBlocks: updatedBlocks } }
      };
    });
  };

  const handleResetContentBlocks = (pageNum: number) => {
    updateEdition(prev => {
      const currentSettings = prev.pageSettings || {};
      const pageSetting = currentSettings[pageNum];
      if (!pageSetting) return prev;
      return {
        ...prev,
        pageSettings: { ...currentSettings, [pageNum]: { ...pageSetting, contentBlocks: [] } }
      };
    });
  };

  const handleReset = () => {
    updateEdition(prev => ({ 
      ...prev,
      sectionStyles: {}, 
      pageStyles: {}, 
      pageSettings: {},
      backgroundElements: [],
      globalBackgroundElements: []
    }));
    // We stay in the current mode and on the current activePageNumber
  };

  const handleCopyDesign = (pageNum: number) => {
    const pageSetting = edition.pageSettings?.[pageNum];
    if (pageSetting?.backgroundElements) {
       setDesignClipboard([...pageSetting.backgroundElements]);
    }
  };

  const handleApplyDesign = (pageNum: number) => {
    if (!designClipboard) return;
    
    // Refresh IDs for the pasted elements to ensure they are unique and editable as new objects
    const elementsToApply = designClipboard.map(el => ({
       ...el,
       id: Math.random().toString(36).substr(2, 9)
    }));

    handleSetBackgrounds(pageNum, elementsToApply);
  };

  const scrollToPage = (pageIndex: number) => {
    if (!layoutRef.current) return;
    const pages = layoutRef.current.querySelectorAll('.a4-page');
    const targetPage = pages[pageIndex - 1]; // pageIndex is 1-based
    if (targetPage) {
      targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrint = async () => {
    if (!layoutRef.current) return;
    try {
      setDownloading(true);
      const { toCanvas, getFontEmbedCSS } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');
      
      // Ensure fonts are ready
      if (document.fonts) await document.fonts.ready;

      // OPTIMIZATION: Extract font CSS once to prevent re-fetching for every page
      const fontEmbedCSS = await getFontEmbedCSS(layoutRef.current as HTMLElement);
      
      const pages = layoutRef.current.querySelectorAll('.a4-page');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      
      // Cleanup: Remove any existing clones
      const oldCleanRoom = document.getElementById('pdf-clean-room');
      if (oldCleanRoom) oldCleanRoom.remove();

      // NEW: "Clean Capture" mechanism
      const cleanRoom = document.createElement('div');
      cleanRoom.id = 'pdf-clean-room';
      cleanRoom.style.position = 'fixed';
      cleanRoom.style.top = '-10000px';
      cleanRoom.style.left = '-10000px';
      cleanRoom.style.width = '794px'; 
      document.body.appendChild(cleanRoom);

      const BATCH_SIZE = 3;
      const imageData = new Array(pages.length);

      for (let i = 0; i < pages.length; i += BATCH_SIZE) {
        const batchLimit = Math.min(i + BATCH_SIZE, pages.length);
        const batchPromises = [];

        for (let j = i; j < batchLimit; j++) {
          const sourcePage = pages[j] as HTMLElement;
          const pageClone = sourcePage.cloneNode(true) as HTMLElement;
          
          pageClone.style.transform = 'none';
          pageClone.style.boxShadow = 'none';
          pageClone.style.margin = '0';
          pageClone.style.border = 'none';
          pageClone.style.width = '794px';
          pageClone.style.height = '1123px';
          pageClone.querySelectorAll('[data-html2canvas-ignore]').forEach(el => el.remove());
          
          cleanRoom.appendChild(pageClone);

          batchPromises.push((async (index, clone) => {
            try {
              // OPTIMIZATION: Use toCanvas and reuse fontEmbedCSS
              const canvas = await toCanvas(clone, {
                pixelRatio: 1.5,
                backgroundColor: '#ffffff',
                width: 794,
                height: 1123,
                fontEmbedCSS, // Critical optimization
              });
              
              // OPTIMIZATION: Use JPEG instead of PNG for faster processing
              const img = canvas.toDataURL('image/jpeg', 0.85);
              clone.remove();
              return { index, img };
            } catch (err) {
              clone.remove();
              throw err;
            }
          })(j, pageClone));
        }

        const results = await Promise.all(batchPromises);
        results.forEach(res => {
          imageData[res.index] = res.img;
        });
      }

      for (let i = 0; i < imageData.length; i++) {
        if (i > 0) pdf.addPage();
        // Use JPEG format in PDF for smaller size and faster loading
        pdf.addImage(imageData[i], 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }
      
      pdf.save(`${edition.name || 'newsletter'}.pdf`);
      cleanRoom.remove();
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header Overlay */}
      <div className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 z-[100] shrink-0 sticky top-0">
        <div className="flex items-center gap-6">
          <Link 
            to={`/editor/${id}`}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold uppercase tracking-widest text-[10px]"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Editor
          </Link>
          <div className="h-4 w-[1px] bg-slate-200"></div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            Preview & Audit
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {edition.mode === 'advanced' && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset}
                className="rounded-xl border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-[9px] h-9 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
              >
                Reset Design
              </Button>
              <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
            </>
          )}
          <Button 
            onClick={handlePrint}
            disabled={downloading}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] px-6 h-10 shadow-lg shadow-slate-900/10 gap-2"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            {downloading ? 'Exporting...' : 'Export to PDF'}
          </Button>
        </div>
      </div>

      <main className="flex-1 flex overflow-hidden relative h-full">
        <DesignEngineProvider
          mode={edition.mode || 'academic'}
          pageSettings={edition.pageSettings || {}}
          activePageNumber={activePageNumber}
          selectedElementId={selectedElementId}
          selectedBlockId={selectedBlockId}
          edition={edition}
          onPageSelect={(num) => { setActivePageNumber(num); scrollToPage(num); }}
          onElementSelect={(id) => { setSelectedElementId(id); setSelectedBlockId(null); }}
          onBlockSelect={(id) => { setSelectedBlockId(id); setSelectedElementId(null); }}
          onAddFloating={handleAddFloatingElement}
          onUpdateFloating={handleUpdateFloatingElement}
          onRemoveFloating={handleRemoveFloatingElement}
          onInitContentBlocks={handleInitContentBlocks}
          onUpdateContentBlock={handleUpdateContentBlock}
          onResetContentBlocks={handleResetContentBlocks}
          onAddBackground={handleAddBackground}
          onUpdateBackground={handleUpdateBackground}
          onRemoveBackground={handleRemoveBackground}
          onSetBackgrounds={handleSetBackgrounds}
        >
          <ResizablePanelGroup direction="horizontal" className="flex-1 w-full bg-slate-50">
            {/* Left Sidebar: Page List (only if Advanced) */}
            {edition.mode === 'advanced' && (
              <>
                <ResizablePanel 
                  defaultSize={18} 
                  minSize={15} 
                  maxSize={25} 
                  className="bg-white border-r border-slate-200 z-30"
                >
                  <PageListPanel 
                    edition={edition}
                    activePage={activePageNumber || 0}
                    pageCount={pageCount}
                    onPageSelect={(num) => {
                      setActivePageNumber(num);
                      scrollToPage(num);
                    }}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle className="hover:bg-indigo-200 transition-colors" />
              </>
            )}

            {/* Main Content Area */}
            <ResizablePanel defaultSize={edition.mode === 'advanced' ? 64 : 100} className="h-full">
              <div className="flex-1 flex flex-col items-center p-12 overflow-y-auto scroll-smooth bg-slate-100/30 h-full">
                <div className="scale-[0.85] origin-top mb-32 pb-32 print:scale-100 print:m-0 print:origin-center transition-transform duration-500">
                  <TemplateRenderer 
                    edition={edition} 
                    layoutRef={layoutRef} 
                    activePageNumber={activePageNumber}
                    onPageSelect={(num) => { setActivePageNumber(num); scrollToPage(num); }}
                  />
                </div>
              </div>
            </ResizablePanel>

            {/* Right Sidebar: Design Palette (only if Advanced) */}
            {edition.mode === 'advanced' && (
              <>
                <ResizableHandle withHandle className="hover:bg-indigo-200 transition-colors" />
                <ResizablePanel 
                  defaultSize={18} 
                  minSize={15} 
                  maxSize={25} 
                  className="bg-white border-l border-slate-200 z-30"
                >
                  <DesignPalette 
                    mode={edition.mode}
                    globalStyle={(edition.sectionStyles || {}).global || {}}
                    activeSectionId={activePageNumber?.toString()}
                    activeSectionStyle={
                      activePageNumber 
                        ? (edition.pageStyles?.[activePageNumber] || (edition.sectionStyles || {}).global || {}) 
                        : (edition.sectionStyles || {}).global || {}
                    }
                    showPageNumbers={edition.showPageNumbers}
                    applyToAll={applyToAll}
                    onApplyToAllChange={setApplyToAll}
                    onStyleChange={handlePageStyleChange}
                    onSettingsChange={(settings) => updateEdition(settings)}
                    pageSettings={edition.pageSettings}
                    selectedElementId={selectedElementId}
                     onUpdateElement={(updates) => {
                      if (activePageNumber && selectedElementId) {
                        handleUpdateFloatingElement(activePageNumber, selectedElementId, updates);
                      }
                    }}
                    onCopyDesign={handleCopyDesign}
                    onApplyDesign={handleApplyDesign}
                    hasClipboardContent={!!designClipboard}
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </DesignEngineProvider>
      </main>

      {!showValidation && edition.mode === 'advanced' && (
        <Button 
          onClick={() => setShowValidation(true)}
          className="fixed left-8 bottom-8 rounded-full w-14 h-14 bg-white border border-slate-200 shadow-2xl flex items-center justify-center hover:bg-slate-50 z-[60]"
        >
          <div className="relative">
             <AlertCircle className="w-6 h-6 text-indigo-600" />
             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
        </Button>
      )}
    </div>
  );
};

export default Preview;
