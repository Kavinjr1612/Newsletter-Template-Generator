import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Eye, FileText, Users, GraduationCap, Settings, 
  Briefcase, FlaskConical, BookOpen, Download, PanelRight, ChevronRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Edition } from '@/types/newspaper';
import { getEdition, saveEdition } from '@/lib/store';
import CoverForm from '@/components/editor/CoverForm';
import VisionMissionForm from '@/components/editor/VisionMissionForm';
import PersonForm from '@/components/editor/PersonForm';
import ArticleForm from '@/components/editor/ArticleForm';
import PlacementsForm from '@/components/editor/PlacementsForm';
import EditorialTeamForm from '@/components/editor/EditorialTeamForm';
import PublicationsForm from '@/components/editor/PublicationsForm';
import EditionSettings from '@/components/editor/EditionSettings';
import TemplateRenderer from '@/components/preview/TemplateRenderer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  SidebarProvider, Sidebar, SidebarContent, SidebarGroup, 
  SidebarGroupContent, SidebarGroupLabel, SidebarMenu, 
  SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarHeader, SidebarRail
} from "@/components/ui/sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { DesignEngineProvider } from '@/components/design-engine/DesignEngineContext';

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('vision');
  const [edition, setEdition] = useState<Edition | null>(null);

  useEffect(() => {
    if (id) {
      const found = getEdition(id);
      if (found) setEdition(found);
      else navigate('/');
    }
  }, [id, navigate]);

  const updateEdition = (updated: Edition) => {
    setEdition(updated);
    saveEdition(updated);
  };

  if (!edition) return null;

  const navItems = [
    { id: 'vision', label: 'Vision & Mission', icon: BookOpen },
    { id: 'desks', label: 'Executive Messages', icon: Users },
    { id: 'articles', label: 'Core Articles', icon: FileText },
    { id: 'placements', label: 'Campus Placements', icon: Briefcase },
    { id: 'publications', label: 'R&D Publications', icon: FlaskConical },
    { id: 'editorial', label: 'Editorial Team', icon: GraduationCap },
    { id: 'settings', label: 'Global Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'vision': return <VisionMissionForm edition={edition} onUpdate={updateEdition} />;
      case 'desks': return <PersonForm edition={edition} onUpdate={updateEdition} />;
      case 'articles': return <ArticleForm edition={edition} onUpdate={updateEdition} />;
      case 'placements': return <PlacementsForm edition={edition} onUpdate={updateEdition} />;
      case 'publications': return <PublicationsForm edition={edition} onUpdate={updateEdition} />;
      case 'editorial': return <EditorialTeamForm edition={edition} onUpdate={updateEdition} />;
      case 'settings': return (
        <div className="space-y-10">
          <CoverForm edition={edition} onUpdate={updateEdition} />
          <Separator />
          <EditionSettings edition={edition} onUpdate={updateEdition} />
        </div>
      );
      default: return null;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="h-screen w-screen bg-slate-50 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          
          {/* --- LEFT NAVIGATION SIDEBAR PANEL --- */}
          <ResizablePanel 
            defaultSize={16} 
            minSize={12} 
            maxSize={25} 
            className="border-r bg-white flex flex-col"
          >
            <Sidebar collapsible="none" className="w-full h-full">
              <SidebarHeader className="h-16 flex items-center px-6 border-b shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-indigo-200 shadow-lg">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-headline font-bold text-slate-900 truncate">Newsletter Editor</span>
                </div>
              </SidebarHeader>
              <SidebarContent className="flex-1 overflow-auto">
                <SidebarGroup className="mt-4">
                  <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Main Content</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navItems.map((item) => (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton 
                            isActive={activeSection === item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full py-6 px-4 gap-3 transition-all ${activeSection === item.id ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-600 hover:bg-slate-50'}`}
                          >
                            <item.icon className={`h-4 w-4 ${activeSection === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                            <span className="font-bold text-xs uppercase tracking-wider">{item.label}</span>
                            {activeSection === item.id && <ChevronRight className="h-3 w-3 ml-auto opacity-50" />}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <div className="p-4 border-t shrink-0">
                <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:text-slate-900" onClick={() => navigate('/')}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-widest leading-none">Exit Dashboard</span>
                </Button>
              </div>
            </Sidebar>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-slate-100/50 hover:bg-indigo-200 transition-colors w-1.5" />

          {/* --- MAIN WORKSPACE PANEL --- */}
          <ResizablePanel defaultSize={84}>
            <SidebarInset className="flex h-full flex-col min-w-0 bg-slate-50 overflow-hidden relative">
              
              {/* Dashboard Header */}
              <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b z-20 shrink-0">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter shrink-0">{edition.name}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{edition.departmentName}</span>
                      <Separator orientation="vertical" className="h-2 bg-slate-200" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vol {edition.editionNumber}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      updateEdition({ ...edition, mode: 'advanced' });
                      navigate(`/preview/${edition.id}`);
                    }} 
                    className="gap-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold uppercase tracking-widest text-[10px] h-9"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Advanced Designer
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      updateEdition({ ...edition, mode: 'academic' });
                      navigate(`/preview/${edition.id}`);
                    }} 
                    className="gap-2 border-slate-200 font-bold uppercase tracking-widest text-[10px] h-9"
                  >
                    <Eye className="h-3.5 w-3.5" /> Full Preview
                  </Button>
                </div>
              </header>

              {/* Immersive 3-Panel Grid */}
              <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
                
                {/* PANEL 1: Editor Form */}
                <ResizablePanel defaultSize={45} minSize={30} className="bg-white">
                  <ScrollArea className="h-full">
                    <div className="max-w-4xl mx-auto px-10 py-12">
                      <div className="mb-12 flex justify-between items-end">
                        <div>
                          <h3 className="text-5xl font-black text-slate-900 leading-none tracking-tighter uppercase mb-3">
                            {navItems.find(i => i.id === activeSection)?.label.split(' ')[0]}
                            <span className="text-indigo-600">.</span>
                          </h3>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Module Editorial Access</p>
                        </div>
                      </div>
                      {renderContent()}
                    </div>
                  </ScrollArea>
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-slate-100 hover:bg-indigo-200 transition-colors" />

                {/* PANEL 2: Live Preview */}
                <ResizablePanel defaultSize={55} minSize={40} className="bg-slate-100 relative">
                  <div className="absolute top-5 left-8 right-8 z-10 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/70 backdrop-blur border rounded-full shadow-sm pointer-events-auto">
                      <PanelRight className="h-3 w-3 text-indigo-600" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Live Projection Window</span>
                    </div>
                  </div>
                  
                  <ScrollArea className="h-full">
                    <div className="w-full min-h-full flex flex-col items-center justify-start pb-24 pt-24">
                      {/* Centering Wrapper for Scaled Preview */}
                      <div className="w-0 flex justify-center h-fit overflow-visible">
                        <div className="flex flex-col items-center gap-16 origin-top transform scale-[0.7] xl:scale-[0.8] 2xl:scale-[0.9] shrink-0 transition-transform duration-500 ease-in-out">
                          <div className="shadow-[0_48px_100px_rgba(0,0,0,0.15)] ring-1 ring-black/5 rounded-sm overflow-hidden bg-white">
                            <DesignEngineProvider
                               mode={edition.mode || 'academic'}
                               pageSettings={edition.pageSettings || {}}
                               activePageNumber={undefined}
                               selectedElementId={null}
                               selectedBlockId={null}
                               edition={edition}
                               onPageSelect={() => {}}
                               onElementSelect={() => {}}
                               onBlockSelect={() => {}}
                               onAddFloating={() => {}}
                               onUpdateFloating={() => {}}
                               onRemoveFloating={() => {}}
                               onInitContentBlocks={() => {}}
                               onUpdateContentBlock={() => {}}
                               onResetContentBlocks={() => {}}
                               onAddBackground={() => {}}
                               onUpdateBackground={() => {}}
                               onRemoveBackground={() => {}}
                               onSetBackgrounds={() => {}}
                            >
                              <TemplateRenderer edition={edition} />
                            </DesignEngineProvider>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </ResizablePanel>

              </ResizablePanelGroup>
            </SidebarInset>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SidebarProvider>
  );
};

export default Editor;
