/**
 * AcademicInstitutionalLayout
 *
 * PURE TEMPLATE — zero interaction logic.
 * All design interactions (drag, resize, layers, selection) are provided
 * automatically by the Design Engine (PageShell reads DesignEngineContext).
 *
 * To add a new page type:
 *   1. Create a component that accepts { edition, pageNumber }
 *   2. Wrap its content in <PageShell pageNumber={n}>
 *   3. That's it — drag, resize, layer controls are automatic.
 */

import React from 'react';
import { withAdvancedDesigner } from '@/components/design-engine/withAdvancedDesigner';
import { Edition, FloatingElement, Publication } from '@/types/newspaper';
import { PageShell } from '@/components/design-engine/PageShell';
import { ContentBlockSlot } from '@/components/design-engine/ContentBlockSlot';
import { Typography, getPageStyle } from '@/components/design-engine/Typography';
import { splitAtBreaks } from '@/lib/pageBreakUtils';

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  PRIMARY: '#1e293b',
  SECONDARY: '#64748b',
};

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  if (!arr) return chunks;
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
};

// ─── Shared sub-components ────────────────────────────────────────────────────

const InstitutionalHeader = ({ edition, pageTitle, style = {} }: { edition: Edition; pageTitle: string; style?: any }) => (
  <header className="mb-12 space-y-4 relative z-10">
    <div className="flex justify-between items-end border-b-2 border-slate-900 pb-6" style={{ borderColor: style.color }}>
      <Typography.H3 className="italic text-slate-500" style={style}>{pageTitle}</Typography.H3>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-3 py-1" style={{ backgroundColor: style.color || '#0f172a' }}>
          Volume {edition.editionNumber} • No. 01
        </span>
        <span className="text-[9px] font-bold text-slate-400 mt-1 tracking-widest uppercase">{edition.date}</span>
      </div>
    </div>
  </header>
);

const InstitutionalFooter = ({ edition, pageNumber, style = {} }: { edition: Edition; pageNumber: number; style?: any }) => (
  <footer className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center z-10">
    <div className="flex flex-col">
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{edition.departmentName}</span>
    </div>
    {edition.showPageNumbers && (
      <div className="bg-slate-900 text-white font-black text-[10px] w-8 h-8 flex items-center justify-center rounded-sm" style={{ backgroundColor: style.color }}>
        {pageNumber}
      </div>
    )}
  </footer>
);

// ─── Page Templates ───────────────────────────────────────────────────────────

interface PageProps {
  edition: Edition;
  pageNumber: number;
  onSelect?: (n: number) => void;
  activePage?: number;
}

// Cover Page
const CoverPage = ({ edition, pageNumber, onSelect, activePage }: PageProps) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col items-center justify-center border-[12px] border-slate-900 p-8 relative z-10" style={{ borderColor: custom.color }}>
        <div className="absolute top-8 left-8 flex items-center gap-4">
          {edition.collegeLogoUrl && <img src={edition.collegeLogoUrl} alt="Logo" className="h-12" />}
          <Typography.Caption style={{ color: custom.color }}>{edition.collegeName}</Typography.Caption>
        </div>
        {edition.buildingPhotoUrl && (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <img src={edition.buildingPhotoUrl} alt="Campus" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="text-center space-y-4 relative z-10">
          <Typography.H2 
            data-section-key="dept-title"
            data-use-native-layout="true"
            scale={custom.scale} 
            style={{ ...custom }}
          >
            {edition.departmentName}
          </Typography.H2>
          <div className="h-2 w-24 bg-slate-900 mx-auto" style={{ backgroundColor: custom.color }}></div>
          <Typography.H1 
            data-section-key="cover-title"
            data-use-native-layout="true"
            scale={custom.scale} 
            style={{ ...custom }}
          >
            {edition.name}
          </Typography.H1>
          <Typography.Body 
             data-section-key="cover-tagline"
             data-use-native-layout="true"
             scale={custom.scale} 
             className="italic opacity-60" 
             style={{ ...custom }}
          >
            {edition.tagline}
          </Typography.Body>
        </div>
        {edition.buildingPhotoUrl && (
          <div className="mt-12 w-full h-64 border-4 border-slate-900 relative z-10 overflow-hidden shadow-2xl" style={{ borderColor: custom.color }}>
            <img src={edition.buildingPhotoUrl} alt="Campus Building" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="absolute bottom-8 right-8 text-right">
          <Typography.Caption scale={custom.scale} style={{ ...custom }}>Edition {edition.editionNumber}</Typography.Caption>
          <Typography.Body className="font-bold text-xs" style={custom}>{edition.date}</Typography.Body>
        </div>
      </div>
    </PageShell>
  );
};

// Institution Vision & Mission
const InstitutionVMPage = ({ edition, pageNumber }: PageProps) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <InstitutionalHeader edition={edition} pageTitle="Institution Vision & Mission" style={custom} />
      <div className="flex-1 flex flex-col justify-center gap-12 z-10">
        <div className="space-y-12">
          {[{ label: 'Vision', key: 'institution-vision', text: edition.visionMission?.institutionVision }, { label: 'Mission', key: 'institution-mission', text: edition.visionMission?.institutionMission }].map(({ label, key, text }) => (
            <div key={label} className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-12 h-1 bg-slate-900" style={{ backgroundColor: custom.color }}></span>
                <Typography.H3 data-section-key={`${key}-header`} data-use-native-layout="true" style={custom}>Institution {label}</Typography.H3>
              </div>
              <Typography.Body 
                data-section-key={`${key}-body`} 
                data-use-native-layout="true" 
                className="pl-16 text-xl italic leading-relaxed" 
                style={custom}
              >
                {text || `Institution ${label.toLowerCase()} not provided.`}
              </Typography.Body>
            </div>
          ))}
        </div>
        
        {edition.visionMission?.institutionImageUrl && (
          <div className="mt-8 relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <img src={edition.visionMission.institutionImageUrl} alt="Institution Vision" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        )}
      </div>
      <InstitutionalFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

// Department Vision & Mission
const DeptVMPage = ({ edition, pageNumber }: PageProps) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <InstitutionalHeader edition={edition} pageTitle="Department Vision & Mission" style={custom} />
      <div className="flex-1 flex flex-col justify-center gap-12 z-10">
        <div className="space-y-12">
          {[{ label: 'Vision', key: 'dept-vision', text: edition.visionMission?.deptVision }, { label: 'Mission', key: 'dept-mission', text: edition.visionMission?.deptMission }].map(({ label, key, text }) => (
            <div key={label} className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-12 h-1 bg-slate-900" style={{ backgroundColor: custom.color }}></span>
                <Typography.H3 data-section-key={`${key}-header`} data-use-native-layout="true" style={custom}>Department {label}</Typography.H3>
              </div>
              <Typography.Body 
                data-section-key={`${key}-body`} 
                data-use-native-layout="true" 
                className="pl-16 text-xl italic leading-relaxed" 
                style={custom}
              >
                {text || `Department ${label.toLowerCase()} not provided.`}
              </Typography.Body>
            </div>
          ))}
        </div>

        {edition.visionMission?.deptImageUrl && (
          <div className="mt-8 relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <img src={edition.visionMission.deptImageUrl} alt="Department Vision" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        )}
      </div>
      <InstitutionalFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

// Academic Info (PO / PEO / PSO)
const AcademicInfoPage = ({ edition, pageNumber, title, items, startIndex = 0, continueNumbering = false }: PageProps & { title: string; items: string[]; startIndex?: number; continueNumbering?: boolean }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <InstitutionalHeader edition={edition} pageTitle={continueNumbering ? `${title} (Continued)` : title} style={custom} />
      <div className="flex-1 flex flex-col z-10 justify-between">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl">
            <Typography.Body className="text-slate-300 font-black uppercase text-xs" style={custom}>Content not provided</Typography.Body>
          </div>
        ) : (
          <div className="space-y-8">
            {items.map((item, i) => (
              <div key={i} className="flex gap-8 items-start">
                <Typography.Body className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white font-black text-lg shrink-0 rounded-sm" style={{ ...custom, backgroundColor: custom.color }}>
                  {(startIndex + i + 1).toString().padStart(2, '0')}
                </Typography.Body>
                <div className="flex-1 pt-2">
                  <Typography.Body 
                    data-section-key={`outcome-${title.toLowerCase().replace(/\s+/g, '-')}-${startIndex + i}`}
                    data-use-native-layout="true"
                    className="text-[15px] leading-relaxed" 
                    style={custom}
                  >
                    {item}
                  </Typography.Body>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Image for these sections */}
        {(() => {
          let imageUrl = '';
          if (title.toLowerCase().includes('outcome')) imageUrl = edition.visionMission?.programOutcomeImageUrls?.[startIndex] || '';
          else if (title.toLowerCase().includes('peo')) imageUrl = edition.visionMission?.peoImageUrls?.[startIndex] || '';
          else if (title.toLowerCase().includes('pso')) imageUrl = edition.visionMission?.psoImageUrls?.[startIndex] || '';
          
          if (!imageUrl) return null;
          return (
            <div className="mt-auto mb-12 relative h-48 w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          );
        })()}
      </div>
      <InstitutionalFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

// Message Pages (HoD, Faculty, Student)
const MessagePage = ({ edition, pageNumber, label, deskMessage }: PageProps & { label: string; deskMessage?: any }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <InstitutionalHeader edition={edition} pageTitle={label} style={custom} />
      <div className="flex-1 flex flex-col bg-slate-50 p-12 border-l-8 border-slate-900 shadow-inner z-10" style={{ borderColor: custom.color || '#0f172a' }}>
        {deskMessage ? (
          <div className="space-y-10">
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 bg-slate-100 border-4 border-white shadow-xl overflow-hidden">
                {deskMessage.photoUrl && <img src={deskMessage.photoUrl} alt="Photo" className="w-full h-full object-cover" />}
              </div>
              <div>
                <Typography.H3 data-section-key={`${label.toLowerCase().replace(/\s+/g, '-')}-name`} data-use-native-layout="true" style={custom}>{deskMessage.name}</Typography.H3>
                <Typography.Caption data-section-key={`${label.toLowerCase().replace(/\s+/g, '-')}-title`} data-use-native-layout="true" style={custom}>{deskMessage.title}</Typography.Caption>
              </div>
            </div>
            <Typography.Body 
              data-section-key={`${label.toLowerCase().replace(/\s+/g, '-')}-body`} 
              data-use-native-layout="true" 
              className="text-lg leading-relaxed whitespace-pre-line" 
              style={custom}
            >
              {deskMessage.message}
            </Typography.Body>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl">
            <Typography.Body className="text-slate-300 font-black uppercase text-xs" style={custom}>Content not provided</Typography.Body>
          </div>
        )}
      </div>
      <InstitutionalFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

// Article Page
const ArticlePage = ({ edition, pageNumber, article }: PageProps & { article: any }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <InstitutionalHeader edition={edition} pageTitle="Academic Article" style={custom} />
      <div className="flex-1 flex flex-col gap-8 z-10">
        <div className="w-full h-64 bg-slate-100 border border-slate-200 overflow-hidden">
          {article.imageUrl
            ? <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-slate-300">Image not provided</div>}
        </div>
        <div className="space-y-4">
          <Typography.H2 data-section-key={`article-${article.id}-title`} data-use-native-layout="true" className="text-3xl" style={custom}>{article.title}</Typography.H2>
          <Typography.Caption style={custom}>By {article.author} • {article.category}</Typography.Caption>
        </div>
        <Typography.Body 
          data-section-key={`article-${article.id}-body`} 
          data-use-native-layout="true" 
          className="text-lg leading-relaxed whitespace-pre-line text-justify" 
          style={custom}
        >
          {article.body}
        </Typography.Body>
      </div>
      <InstitutionalFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

// Achievement / Placement Page
const AchievementPage = ({ edition, pageNumber, placement, isContinuation = false }: PageProps & { placement: any; isContinuation?: boolean }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <InstitutionalHeader edition={edition} pageTitle={isContinuation ? 'Placements & Achievements (Cont.)' : 'Placements & Achievements'} style={custom} />
      <div className="flex flex-col flex-1 gap-8 z-10">
        <div data-section-key={`placement-${placement.id}-header`} data-use-native-layout="true" className="bg-slate-50 border-l-4 border-slate-900 p-8 flex justify-between items-center" style={{ borderColor: custom.color }}>
          <div className="flex gap-16">
            <div className="min-w-[200px]">
              <Typography.H3 className="uppercase mb-1" style={custom}>{placement.companyName}</Typography.H3>
              <Typography.Caption style={custom}>Recruitment Partner</Typography.Caption>
            </div>
            <div className="flex flex-col border-l border-slate-200 pl-10">
              <Typography.Caption className="mb-1" style={custom}>Students</Typography.Caption>
              <Typography.H2 className="text-slate-900 leading-none" style={{ ...custom, fontSize: '1.5rem' }}>{placement.students.length}</Typography.H2>
            </div>
            <div className="flex flex-col border-l border-slate-200 pl-10">
              <Typography.Caption className="mb-1" style={custom}>Package</Typography.Caption>
              <Typography.H2 className="text-emerald-600 leading-none" style={{ ...custom, fontSize: '1.5rem' }}>{placement.lpa || 'N/A'}</Typography.H2>
            </div>
          </div>
          {placement.companyLogoUrl && (
            <div className="h-16 w-32 flex items-center justify-end">
              <img src={placement.companyLogoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-6">
          {placement.students.map((s: any, i: number) => (
            <div key={i} className="border border-slate-100 p-4 flex flex-col items-center bg-white shadow-sm">
              <div className="w-24 h-24 bg-slate-100 border border-slate-900 mb-3 overflow-hidden" style={{ borderColor: custom.color }}>
                {s.photoUrl && <img src={s.photoUrl} alt={s.name} className="w-full h-full object-cover" />}
              </div>
              <Typography.Body className="text-[11px] font-bold text-center" style={custom}>{s.name}</Typography.Body>
            </div>
          ))}
        </div>
      </div>
      <InstitutionalFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

// Research / Publication Page
const PublicationPage = ({ edition, pageNumber, publications, isContinuation = false }: PageProps & { publications: Publication[]; isContinuation?: boolean }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <InstitutionalHeader edition={edition} pageTitle={isContinuation ? 'Scholarly Research Index (Cont.)' : 'Scholarly Research Index'} style={custom} />
      <div className="flex flex-col flex-1 z-10">
        <div className="grid grid-cols-12 gap-x-8 pb-4 border-b-2 border-slate-900 mb-6" style={{ borderColor: custom.color }}>
          <div className="col-span-1"><Typography.Caption style={custom}>S.No</Typography.Caption></div>
          <div className="col-span-8"><Typography.Caption style={custom}>Publication Details</Typography.Caption></div>
          <div className="col-span-3 text-right"><Typography.Caption style={custom}>Indexing</Typography.Caption></div>
        </div>
        <div className="flex flex-col gap-6">
          {publications.map((pub, i) => (
            <div key={i} data-section-key={`publication-${pub.id}`} data-use-native-layout="true" className="grid grid-cols-12 gap-x-8 pb-6 border-b border-slate-100">
              <div className="col-span-1"><Typography.Body className="text-[14px] font-black text-slate-200" style={custom}>{pub.id.slice(0, 2).toUpperCase()}</Typography.Body></div>
              <div className="col-span-8 flex flex-col gap-1">
                <Typography.Body className="text-[15px] font-bold leading-snug" style={custom}>{pub.paperDetails}</Typography.Body>
                <div className="flex items-center gap-3">
                  <Typography.Caption style={{ ...custom, opacity: 0.8 }}>{pub.claimingAuthor}</Typography.Caption>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <Typography.Caption style={custom}>Dept of {pub.dept}</Typography.Caption>
                </div>
              </div>
              <div className="col-span-3 text-right flex flex-col items-end gap-1">
                <Typography.Caption className="bg-slate-50 border px-2 py-0.5 text-slate-500" style={{ ...custom, borderColor: custom.color }}>{pub.indexing}</Typography.Caption>
                <Typography.Body className="text-[8px] font-mono text-slate-300" style={custom}>ID: {pub.id.slice(0, 8)}</Typography.Body>
              </div>
            </div>
          ))}
        </div>
      </div>
      <InstitutionalFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

// Editorial Team Page
const EditorialPage = ({ edition, pageNumber }: PageProps) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <InstitutionalHeader edition={edition} pageTitle="Editorial Team" style={custom} />
      <div className="flex flex-col flex-1 z-10">
        <div className="w-full bg-slate-900 text-white p-8 flex items-center gap-10 mb-12" style={{ backgroundColor: custom.color }}>
          <div className="w-32 h-32 border-4 border-white shrink-0 mb-[-64px] shadow-xl relative z-10 overflow-hidden">
            {edition.editorialTeam?.facultyAdvisor?.photoUrl && <img src={edition.editorialTeam.facultyAdvisor.photoUrl} alt="Advisor" className="w-full h-full object-cover" />}
          </div>
          <div className="flex flex-col">
            <Typography.H2 data-section-key="faculty-advisor-name" data-use-native-layout="true" style={{ color: 'white' }}>{edition.editorialTeam?.facultyAdvisor?.name || ''}</Typography.H2>
            <Typography.Caption data-section-key="faculty-advisor-title" data-use-native-layout="true" className="text-indigo-300" style={custom}>{edition.editorialTeam?.facultyAdvisor?.title || ''}</Typography.Caption>
          </div>
        </div>
        <div className="mt-12">
          <div className="grid grid-cols-4 gap-6">
            {edition.editorialTeam?.members?.map((m, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 border border-slate-200 mb-2 overflow-hidden" style={{ borderColor: custom.color }}>
                  {m.photoUrl && <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />}
                </div>
                <Typography.Body data-section-key={`editorial-member-${i}`} data-use-native-layout="true" className="text-[10px] font-bold text-center leading-tight" style={custom}>{m.name}</Typography.Body>
              </div>
            ))}
          </div>
        </div>
      </div>
      <InstitutionalFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

// ─── Empty page placeholder ───────────────────────────────────────────────────

const EmptyPage = ({ edition, pageNumber, title }: PageProps & { title: string }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <InstitutionalHeader edition={edition} pageTitle={title} style={custom} />
      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl z-10">
        <Typography.Body className="text-slate-300 font-black uppercase text-xs" style={custom}>Content not provided</Typography.Body>
      </div>
      <InstitutionalFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

// ─── Main Layout ──────────────────────────────────────────────────────────────

interface Props {
  edition: Edition;
  layoutRef?: React.RefObject<HTMLDivElement>;
  activePageNumber?: number;
  onPageSelect?: (pageNumber: number) => void;
}

const AcademicInstitutionalLayout = ({ edition, layoutRef, activePageNumber, onPageSelect }: Props) => {
  let pageCounter = 1;
  const vm = edition.visionMission;

  const poGroups  = splitAtBreaks(vm?.programOutcomes || [], vm?.programOutcomeBreaks);
  const peoGroups = splitAtBreaks(vm?.peos || [], vm?.peoBreaks);
  const psoGroups = splitAtBreaks(vm?.psos || [], vm?.psoBreaks);

  return (
    <div ref={layoutRef} className="flex flex-col gap-10 bg-slate-100/50 p-10 min-h-screen items-center scroll-smooth">
      {/* 1. Cover */}
      <div className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
        <div data-html2canvas-ignore className="absolute -top-8 left-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-600 transition-colors">Page {pageCounter} — Cover</div>
        <CoverPage edition={edition} pageNumber={pageCounter++} onSelect={onPageSelect} activePage={activePageNumber} />
      </div>

      {/* 2. Institutional Vision & Mission */}
      {!!(vm?.institutionVision || vm?.institutionMission || vm?.institutionImageUrl) && (
        <div className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
          <div data-html2canvas-ignore className="absolute -top-8 left-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-600 transition-colors">Page {pageCounter} — Institution V/M</div>
          <InstitutionVMPage edition={edition} pageNumber={pageCounter++} onSelect={onPageSelect} activePage={activePageNumber} />
        </div>
      )}

      {/* 3. Departmental Vision & Mission */}
      {!!(vm?.deptVision || vm?.deptMission || vm?.deptImageUrl) && (
        <div className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
          <div data-html2canvas-ignore className="absolute -top-8 left-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-600 transition-colors">Page {pageCounter} — Department V/M</div>
          <DeptVMPage edition={edition} pageNumber={pageCounter++} onSelect={onPageSelect} activePage={activePageNumber} />
        </div>
      )}

      {/* 4. PO / PEO / PSO Index */}
      {poGroups.map((g, i) => (
        <div key={`po-${i}`} className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
          <div data-html2canvas-ignore className="absolute -top-8 left-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-600 transition-colors">Page {pageCounter} — Program Outcomes</div>
          <AcademicInfoPage edition={edition} pageNumber={pageCounter++} onSelect={onPageSelect} activePage={activePageNumber} title="Program Outcomes (PO)" items={g.items} startIndex={g.startIndex} continueNumbering={i > 0 && g.continueNumbering} />
        </div>
      ))}
      
      {peoGroups.map((g, i) => (
        <div key={`peo-${i}`} className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
          <div data-html2canvas-ignore className="absolute -top-8 left-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-600 transition-colors">Page {pageCounter} — Edu. Objectives</div>
          <AcademicInfoPage edition={edition} pageNumber={pageCounter++} onSelect={onPageSelect} activePage={activePageNumber} title="Program Educational Objectives (PEO)" items={g.items} startIndex={g.startIndex} continueNumbering={i > 0 && g.continueNumbering} />
        </div>
      ))}

      {psoGroups.map((g, i) => (
        <div key={`pso-${i}`} className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
          <div data-html2canvas-ignore className="absolute -top-8 left-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-600 transition-colors">Page {pageCounter} — Specific Outcomes</div>
          <AcademicInfoPage edition={edition} pageNumber={pageCounter++} onSelect={onPageSelect} activePage={activePageNumber} title="Program Specific Outcomes (PSO)" items={g.items} startIndex={g.startIndex} continueNumbering={i > 0 && g.continueNumbering} />
        </div>
      ))}

      {/* 5. Executive Messages */}
      {!!(edition.hodMessage?.message || edition.hodMessage?.name) && (
        <div className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
          <div data-html2canvas-ignore className="absolute -top-8 left-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-600 transition-colors">Page {pageCounter} — HOD Message</div>
          <MessagePage edition={edition} pageNumber={pageCounter++} onSelect={onPageSelect} activePage={activePageNumber} label="Head of Department's Desk" deskMessage={edition.hodMessage} />
        </div>
      )}
      {!!(edition.facultyMessage?.message || edition.facultyMessage?.name) && (
        <div className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
          <div data-html2canvas-ignore className="absolute -top-8 left-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-600 transition-colors">Page {pageCounter} — Faculty Advisor</div>
          <MessagePage edition={edition} pageNumber={pageCounter++} onSelect={onPageSelect} activePage={activePageNumber} label="Faculty Advisor's Note" deskMessage={edition.facultyMessage} />
        </div>
      )}
      {!!(edition.studentMessage?.message || edition.studentMessage?.name) && (
        <div className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
          <div data-html2canvas-ignore className="absolute -top-8 left-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-600 transition-colors">Page {pageCounter} — Student Editor</div>
          <MessagePage edition={edition} pageNumber={pageCounter++} onSelect={onPageSelect} activePage={activePageNumber} label="Student Editor's Perspective" deskMessage={edition.studentMessage} />
        </div>
      )}

      {/* 8. Articles */}
      {(edition.articles || []).map((art) => (
        <div key={art.id} className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
          <div data-html2canvas-ignore className="absolute -top-8 left-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-600 transition-colors">Page {pageCounter} — {art.title}</div>
          <ArticlePage edition={edition} pageNumber={pageCounter++} onSelect={onPageSelect} activePage={activePageNumber} article={art} />
        </div>
      ))}

      {/* 9. Placements & Achievements */}
      {(edition.placements || []).flatMap((site) =>
        chunk(site.students || [], 9).map((students, i) => (
          <div key={`${site.id}-${i}`} className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
            <div data-html2canvas-ignore className="absolute -top-8 left-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-600 transition-colors">Page {pageCounter} — {site.companyName}</div>
            <AchievementPage edition={edition} pageNumber={pageCounter++} onSelect={onPageSelect} activePage={activePageNumber} placement={{ ...site, students }} isContinuation={i > 0} />
          </div>
        ))
      )}

      {/* 10. Research */}
      {chunk(edition.publications || [], 5).map((pubs, i) => (
        <div key={`pub-${i}`} className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
          <div data-html2canvas-ignore className="absolute -top-8 left-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-600 transition-colors">Page {pageCounter} — Research Index</div>
          <PublicationPage edition={edition} pageNumber={pageCounter++} onSelect={onPageSelect} activePage={activePageNumber} publications={pubs} isContinuation={i > 0} />
        </div>
      ))}

      {/* 11. Editorial */}
      {!!(edition.editorialTeam?.facultyAdvisor?.name || (edition.editorialTeam?.members || []).length > 0) && (
        <div className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
          <div data-html2canvas-ignore className="absolute -top-8 left-0 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-indigo-600 transition-colors">Page {pageCounter} — Editorial Board</div>
          <EditorialPage edition={edition} pageNumber={pageCounter++} onSelect={onPageSelect} activePage={activePageNumber} />
        </div>
      )}
    </div>
  );
};

export default withAdvancedDesigner(AcademicInstitutionalLayout);
