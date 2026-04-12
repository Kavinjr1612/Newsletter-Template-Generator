/**
 * ModernNexusLayout (Internal name for 'Professional Executive')
 * 
 * DESIGN: Professional Executive / Departmental Standard.
 * 
 * FEATURES: 
 * - Full parity with academic data (Vision, Mission, POs, PEOs, PSOs, 
 *   Executive Messages, Articles, Placements, Publications, Editorial)
 */

import React from 'react';
import { Edition, Publication } from '@/types/newspaper';
import { PageShell } from '@/components/design-engine/PageShell';
import { ContentBlockSlot } from '@/components/design-engine/ContentBlockSlot';
import { Typography, getPageStyle } from '@/components/design-engine/Typography';
import { splitAtBreaks } from '@/lib/pageBreakUtils';
import { Separator } from '@/components/ui/separator';

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  if (!arr) return chunks;
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
};

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  PRIMARY: '#0f172a',    // Deep slate (Official)
  SECONDARY: '#1e293b',  // Mid slate
  ACCENT: '#10b981',     // Elegant emerald (Success/Growth)
  BORDER: '#e2e8f0',     // Light slate
  BG_SOFT: '#f8fafc',    // Very light slate
};

// ─── Shared sub-components ────────────────────────────────────────────────────

const ExecutiveHeader = ({ edition, pageTitle, style = {} }: { edition: Edition; pageTitle: string; style?: any }) => (
  <header className="mb-10 w-full z-10">
    <div className="flex justify-between items-end border-b-4 border-slate-900 pb-6 mb-6" style={{ borderColor: style.color || COLORS.PRIMARY }}>
      <div className="flex flex-col">
        <Typography.Subheading style={{ color: style.color }}>{edition.departmentName}</Typography.Subheading>
        <Typography.SectionHeading scale={style.scale} style={{ color: style.color, border: 'none', padding: 0 }}>{pageTitle}</Typography.SectionHeading>
      </div>
      <div className="text-right">
        <Typography.Caption className="bg-slate-900 !text-white px-3 py-1" style={{ ...style, backgroundColor: style.color || COLORS.PRIMARY }}>
          Volume {edition.editionNumber} • Edition {edition.date?.split('-')[0] || ''}
        </Typography.Caption>
      </div>
    </div>
  </header>
);

const ExecutiveFooter = ({ edition, pageNumber, style = {} }: { edition: Edition; pageNumber: number; style?: any }) => (
  <footer className="mt-auto border-t-2 border-slate-100 pt-6 flex justify-between items-center z-10">
    <div className="flex flex-col">
      <Typography.Caption style={{ ...style, color: style.color }}>{edition.name}</Typography.Caption>
      <Typography.Caption className="!text-[8px] !text-slate-300" style={style}>{edition.departmentName}</Typography.Caption>
    </div>
    {edition.showPageNumbers && (
      <div className="text-slate-900 font-serif italic text-2xl flex items-center gap-4">
        <div className="w-12 h-[1px] bg-slate-200"></div>
        {pageNumber.toString().padStart(2, '0')}
      </div>
    )}
  </footer>
);

// ─── Page Templates ───────────────────────────────────────────────────────────

interface PageProps {
  edition: Edition;
  pageNumber: number;
}

const ExecutiveCover = ({ edition, pageNumber }: PageProps) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={custom}>
      <div className="flex-1 flex flex-col items-center justify-between border-[1px] border-slate-300 p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 -translate-y-1/2 translate-x-1/2 rotate-45 pointer-events-none" />
        <header className="w-full relative z-10 flex flex-col items-center text-center">
           {edition.collegeLogoUrl && <img src={edition.collegeLogoUrl} alt="Logo" className="h-20 mb-6" />}
           <Typography.Subheading style={{ color: custom.color }}>{edition.collegeName}</Typography.Subheading>
           <div className="w-24 h-1 bg-slate-900 my-4" style={{ backgroundColor: custom.color }}></div>
           <Typography.Body className="font-bold tracking-[0.2em] uppercase text-xs">{edition.departmentName}</Typography.Body>
        </header>

        <section className="w-full relative z-10 text-center py-12">
            <ContentBlockSlot sectionKey="cover-title" pageNumber={pageNumber} defaultW={100} defaultH={25}>
               <Typography.Title 
                  scale={custom.scale} 
                  style={{ color: custom.color }} 
                  className="tracking-tight leading-[1.05] mb-4 whitespace-normal break-words"
               >
                  {edition.name}
               </Typography.Title>
            </ContentBlockSlot>
            <div className="flex items-center justify-center gap-6 mt-16">
               <div className="h-[2px] flex-1 bg-slate-900" style={{ backgroundColor: custom.color }}></div>
               <Typography.Body className="font-black uppercase tracking-[0.4em] italic text-xs">Excellence & Insight</Typography.Body>
               <div className="h-[2px] flex-1 bg-slate-900" style={{ backgroundColor: custom.color }}></div>
            </div>
        </section>

        <section className="w-full relative z-10">
           {edition.buildingPhotoUrl && (
             <div className="w-full h-80 border-4 border-white shadow-2xl overflow-hidden mb-12">
               <img src={edition.buildingPhotoUrl} alt="Campus" className="w-full h-full object-cover" />
             </div>
           )}
           <div className="flex justify-between items-end">
              <div className="max-w-xs text-left">
                <Typography.Subheading className="mb-2" style={{ color: custom.color }}>Mission Digest</Typography.Subheading>
                <Typography.Body className="text-xs italic leading-relaxed">{edition.tagline}</Typography.Body>
              </div>
              <div className="text-right">
                <div className="text-5xl font-black text-slate-100 mb-1" style={{ color: `${custom.color}20` }}>VOL {edition.editionNumber.toString().padStart(2, '0')}</div>
                <Typography.Body className="font-bold uppercase tracking-widest text-[10px]">{edition.date}</Typography.Body>
              </div>
           </div>
        </section>
      </div>
    </PageShell>
  );
};

const ExecutiveVMPage = ({ edition, pageNumber, title, vision, mission, image }: PageProps & { title: string; vision: string; mission: string; image?: string }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={custom}>
      <ExecutiveHeader edition={edition} pageTitle={title} style={custom} />
      <div className="flex-1 flex flex-col justify-center gap-16 z-10">
        <div className="grid grid-cols-2 gap-12 items-start">
           <div className="space-y-12">
             <div className="p-8 bg-slate-50 border-l-8 border-slate-900" style={{ borderColor: custom.color }}>
               <Typography.Label scale={custom.scale} className="mb-4" style={{ color: custom.color }}>The Vision</Typography.Label>
               <Typography.Body scale={custom.scale} className="text-xl font-bold text-slate-800 leading-snug">
                 {vision}
               </Typography.Body>
             </div>
             
             <div className="p-8 bg-white border border-slate-100 shadow-sm">
               <Typography.Label scale={custom.scale} className="mb-4" style={{ color: custom.color }}>The Mission</Typography.Label>
               <Typography.Body scale={custom.scale} className="text-slate-600">
                 {mission}
               </Typography.Body>
             </div>
           </div>

           <div className="h-full space-y-6">
             {image && (
               <div className="w-full aspect-square border-4 border-slate-100 shadow-lg overflow-hidden">
                 <img src={image} alt="Vision" className="w-full h-full object-cover" />
               </div>
             )}
             <div className="p-6 bg-slate-900 text-white" style={{ backgroundColor: custom.color }}>
               <Typography.Body scale={custom.scale} className="text-white text-xs italic font-medium leading-relaxed">
                 Official departmental registry focusing on high-fidelity academic excellence and innovative industry collaborations.
               </Typography.Body>
             </div>
           </div>
        </div>
      </div>
      <ExecutiveFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

const ExecutiveInfoPage = ({ edition, pageNumber, title, items, startIndex = 1 }: PageProps & { title: string; items: any[]; startIndex?: number }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={custom}>
      <ExecutiveHeader edition={edition} pageTitle={title} style={custom} />
      <div className="flex-1 z-10">
        <div className="grid grid-cols-1 divide-y divide-slate-100 bg-white border border-slate-100 shadow-sm">
            {items.map((item, idx) => {
               const title = typeof item === 'string' ? item : item.title;
               const desc = typeof item === 'string' ? '' : item.description;
               return (
                 <div key={idx} className="p-6 hover:bg-slate-50 transition-colors flex gap-8 items-start">
                   <div className="bg-slate-900 text-white w-10 h-10 flex items-center justify-center shrink-0 font-black text-xs" style={{ backgroundColor: custom.color }}>
                     {(startIndex + idx).toString().padStart(2, '0')}
                   </div>
                   <div className="space-y-1">
                     <Typography.Body scale={custom.scale} className="font-black text-slate-900 uppercase tracking-tight">{title}</Typography.Body>
                     {desc && <Typography.Body scale={custom.scale} className="text-xs text-slate-500">{desc}</Typography.Body>}
                   </div>
                 </div>
               );
            })}
        </div>
      </div>
      <ExecutiveFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

const ExecutiveMessagePage = ({ edition, pageNumber, label, deskMessage }: PageProps & { label: string; deskMessage?: any }) => {
  const custom = getPageStyle(edition, pageNumber);

  return (
    <PageShell pageNumber={pageNumber} style={custom}>
      <ExecutiveHeader edition={edition} pageTitle="Executive Messages" style={custom} />
      <div className="flex-1 flex flex-col justify-center items-center z-10">
        <div className="max-w-2xl w-full p-12 bg-slate-50 border border-slate-100 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-8 py-3 border border-slate-200">
             <Typography.Subheading scale={custom.scale} style={{ color: custom.color }}>{label}</Typography.Subheading>
          </div>
          <Typography.Body scale={custom.scale} className="text-justify leading-loose italic text-slate-700">
            {deskMessage?.message || "Professional message and departmental updates are pending documentation for this section."}
          </Typography.Body>
          <div className="mt-12 flex justify-between items-end border-t border-slate-200 pt-8">
              <div className="flex flex-col">
                 <Typography.Body className="font-black uppercase text-xs" style={custom}>{deskMessage?.name || edition.departmentName}</Typography.Body>
                 <Typography.Caption className="!text-slate-400" style={custom}>{deskMessage?.title || 'Institutional Registry'}</Typography.Caption>
              </div>
              {deskMessage?.photoUrl && (
                <img src={deskMessage.photoUrl} alt="Signature" className="h-12 w-auto object-contain opacity-50 grayscale mix-blend-multiply" />
              )}
          </div>
        </div>
      </div>
      <ExecutiveFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

const ExecutivePlacementPage = ({ edition, pageNumber, placement, isContinuation }: PageProps & { placement: any; isContinuation?: boolean }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={custom}>
      <ExecutiveHeader edition={edition} pageTitle="Placements & Achievements" style={custom} />
      <div className="flex-1 z-10">
        {!isContinuation && (
          <div className="mb-10 p-8 bg-slate-100 flex justify-between items-center border-b-2 border-slate-900" style={{ borderColor: custom.color || COLORS.PRIMARY }}>
            <div className="flex gap-16">
              <div className="min-w-[200px]">
                <Typography.Heading className="mb-1" style={custom}>{placement.companyName}</Typography.Heading>
                <Typography.Caption className="!text-slate-400" style={custom}>Recruitment Partner</Typography.Caption>
              </div>
              <div className="flex flex-col border-l border-slate-200 pl-10">
                <Typography.Caption className="mb-1" style={custom}>Students</Typography.Caption>
                <Typography.Heading className="leading-none" style={custom}>{placement.students.length}</Typography.Heading>
              </div>
              <div className="flex flex-col border-l border-slate-200 pl-10">
                <Typography.Caption className="mb-1" style={custom}>Package</Typography.Caption>
                <Typography.Heading className="!text-emerald-600 leading-none" style={custom}>{placement.lpa || 'N/A'}</Typography.Heading>
              </div>
            </div>
            {placement.companyLogoUrl && (
              <div className="h-12 w-32 flex items-center justify-end">
                <img src={placement.companyLogoUrl} alt="Logo" className="max-h-full max-w-full object-contain grayscale opacity-50 contrast-150" />
              </div>
            )}
          </div>
        )}
        <div className="grid grid-cols-3 gap-8">
           {(placement.students || []).map((student: any, idx: number) => (
             <div key={idx} className="flex flex-col items-center bg-white p-4 border border-slate-100 shadow-sm text-center space-y-4">
                 <div className="w-24 h-24 rounded-full bg-slate-50 border-2 border-slate-100 overflow-hidden">
                    {student.photoUrl ? <img src={student.photoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-200 font-bold">IMAGE</div>}
                 </div>
                <div className="space-y-1">
                  <Typography.Body scale={custom.scale} className="font-black text-slate-900 uppercase text-xs">{student.name}</Typography.Body>
                  <Typography.Caption scale={custom.scale}>{student.rollNo}</Typography.Caption>
                </div>
             </div>
           ))}
        </div>
      </div>
      <ExecutiveFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

const ExecutivePublicationPage = ({ edition, pageNumber, publications, isContinuation }: PageProps & { publications: Publication[]; isContinuation?: boolean }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={custom}>
      <ExecutiveHeader edition={edition} pageTitle="Research Index" style={custom} />
      <div className="flex-1 z-10">
        <div className="grid grid-cols-1 divide-y divide-slate-100 bg-white border border-slate-100">
           {publications.map((pub, idx) => (
             <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-baseline mb-2">
                   <Typography.Body scale={custom.scale} className="font-bold text-slate-900">{pub.paperDetails}</Typography.Body>
                   <Typography.Caption className="border border-slate-900 px-2 py-0.5" style={{ ...custom, color: custom.color, borderColor: custom.color }}>{pub.indexing}</Typography.Caption>
                </div>
                <div className="flex gap-4">
                   <Typography.Caption scale={custom.scale} className="text-slate-400 italic">Claimed by {pub.claimingAuthor}</Typography.Caption>
                   <Separator orientation="vertical" className="h-3" />
                   <Typography.Caption scale={custom.scale} className="font-bold" style={{ color: custom.color }}>{pub.dept}</Typography.Caption>
                </div>
             </div>
           ))}
        </div>
      </div>
      <ExecutiveFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

const ExecutiveEditorialPage = ({ edition, pageNumber }: PageProps) => {
  const custom = getPageStyle(edition, pageNumber);
  const facultyAdvisor = edition.editorialTeam?.facultyAdvisor;
  const members = edition.editorialTeam?.members || [];

  return (
    <PageShell pageNumber={pageNumber} style={custom}>
      <ExecutiveHeader edition={edition} pageTitle="Editorial Board" style={custom} />
      <div className="flex-1 flex flex-col justify-center z-10">
        <div className="grid grid-cols-2 gap-16">
           <div className="space-y-8">
             <Typography.Subheading style={{ color: custom.color }}>Institutional Board</Typography.Subheading>
             <div className="space-y-6">
                {facultyAdvisor && (
                  <div>
                    <Typography.Body scale={custom.scale} className="font-black text-slate-900 uppercase text-xs">Faculty Advisor</Typography.Body>
                    <Typography.Body scale={custom.scale} className="italic text-slate-500">{facultyAdvisor.name} • {facultyAdvisor.title}</Typography.Body>
                  </div>
                )}
                <div>
                  <Typography.Body scale={custom.scale} className="font-black text-slate-900 uppercase text-xs">Principal</Typography.Body>
                  <Typography.Body scale={custom.scale} className="italic text-slate-500">{edition.collegeName}</Typography.Body>
                </div>
                <div>
                  <Typography.Body scale={custom.scale} className="font-black text-slate-900 uppercase text-xs">HOD</Typography.Body>
                  <Typography.Body scale={custom.scale} className="italic text-slate-500">{edition.departmentName}</Typography.Body>
                </div>
             </div>
           </div>
           
           <div className="space-y-8">
             <Typography.Subheading style={{ color: custom.color }}>Editorial Team</Typography.Subheading>
             <div className="grid grid-cols-1 gap-6">
                {members.map((member, idx) => (
                  <div key={idx} className="flex flex-col pb-4 border-b border-slate-100">
                    <Typography.Body scale={custom.scale} className="font-black text-slate-900 uppercase text-xs">{member.name}</Typography.Body>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
      <Separator className="my-12 opacity-50" />
      <div className="text-center pb-12 z-10">
         <Typography.Body className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-300">Proudly curated by {edition.departmentName}</Typography.Body>
      </div>
      <ExecutiveFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

const ExecutiveArticlePage = ({ edition, pageNumber, article }: PageProps & { article: any }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={custom}>
      <ExecutiveHeader edition={edition} pageTitle="Core Articles" style={custom} />
      <div className="flex-1 flex flex-col z-10">
        <header className="mb-10 text-center">
           <Typography.Title scale={custom.scale} style={{ color: custom.color }} className="mb-4">{article.title}</Typography.Title>
           <Typography.Subheading scale={custom.scale} style={{ color: custom.color }}>BY {article.author.toUpperCase()}</Typography.Subheading>
        </header>

        <div className="grid grid-cols-12 gap-10 flex-1">
           {article.imageUrl && (
             <div className="col-span-12 h-64 overflow-hidden border-2 border-slate-100 shadow-sm mb-4">
               <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
             </div>
           )}
           <div className="col-span-12 columns-2 gap-12 text-justify">
             <Typography.Body scale={custom.scale} className="drop-cap-official first-letter:text-4xl first-letter:font-black first-letter:text-slate-900 first-letter:mr-2 first-letter:float-left">
               {article.body}
             </Typography.Body>
           </div>
        </div>
      </div>
      <ExecutiveFooter edition={edition} pageNumber={pageNumber} style={custom} />
    </PageShell>
  );
};

const ModernNexusLayout = ({ edition, layoutRef, activePageNumber, onPageSelect }: { edition: Edition; layoutRef?: React.RefObject<HTMLDivElement>; activePageNumber?: number; onPageSelect?: (n: number) => void }) => {
  let pageCounter = 1;
  const vm = edition.visionMission;

  const poGroups  = splitAtBreaks(vm?.programOutcomes || [], vm?.programOutcomeBreaks);
  const peoGroups = splitAtBreaks(vm?.peos || [], vm?.peoBreaks);
  const psoGroups = splitAtBreaks(vm?.psos || [], vm?.psoBreaks);

  return (
    <div ref={layoutRef} className="flex flex-col gap-10 bg-slate-100/50 p-10 min-h-screen items-center scroll-smooth">
      {/* 1. Cover */}
      <ExecutiveCover edition={edition} pageNumber={pageCounter} />
      
      {/* 2. Institutional VM */}
      {!!(vm?.institutionVision || vm?.institutionMission || vm?.institutionImageUrl) && (
        <ExecutiveVMPage 
          edition={edition} 
          pageNumber={++pageCounter} 
          title="Institutional Perspective"
          vision={vm?.institutionVision || ''}
          mission={vm?.institutionMission || ''}
          image={vm?.institutionImageUrl}
        />
      )}

      {/* 3. Departmental VM */}
      {!!(vm?.deptVision || vm?.deptMission || vm?.deptImageUrl) && (
        <ExecutiveVMPage 
          edition={edition} 
          pageNumber={++pageCounter} 
          title="Departmental Outlook"
          vision={vm?.deptVision || ''}
          mission={vm?.deptMission || ''}
          image={vm?.deptImageUrl}
        />
      )}

      {/* 4. PO / PEO / PSO Index */}
      {poGroups.map((g, i) => (
        <ExecutiveInfoPage key={`po-${i}`} edition={edition} pageNumber={++pageCounter} title="Program Outcomes" items={g.items} startIndex={g.startIndex} />
      ))}
      
      {peoGroups.map((g, i) => (
        <ExecutiveInfoPage key={`peo-${i}`} edition={edition} pageNumber={++pageCounter} title="Edu. Objectives" items={g.items} startIndex={g.startIndex} />
      ))}

      {psoGroups.map((g, i) => (
        <ExecutiveInfoPage key={`pso-${i}`} edition={edition} pageNumber={++pageCounter} title="Specific Outcomes" items={g.items} startIndex={g.startIndex} />
      ))}

      {/* 5. Executive Messages */}
      {!!(edition.hodMessage?.message || edition.hodMessage?.name) && (
        <ExecutiveMessagePage edition={edition} pageNumber={++pageCounter} label="HOD MESSAGE" deskMessage={edition.hodMessage} />
      )}
      {!!(edition.facultyMessage?.message || edition.facultyMessage?.name) && (
        <ExecutiveMessagePage edition={edition} pageNumber={++pageCounter} label="FACULTY ADVISOR" deskMessage={edition.facultyMessage} />
      )}
      {!!(edition.studentMessage?.message || edition.studentMessage?.name) && (
        <ExecutiveMessagePage edition={edition} pageNumber={++pageCounter} label="STUDENT EDITOR" deskMessage={edition.studentMessage} />
      )}

      {/* 6. Core Articles */}
      {(edition.articles || []).map((art) => (
        <ExecutiveArticlePage key={art.id} edition={edition} pageNumber={++pageCounter} article={art} />
      ))}

      {/* 7. Placements */}
      {(edition.placements || []).flatMap((site) =>
        chunk(site.students || [], 9).map((students, i) => (
          <ExecutivePlacementPage key={`${site.id}-${i}`} edition={edition} pageNumber={++pageCounter} placement={{ ...site, students }} isContinuation={i > 0} />
        ))
      )}

      {/* 8. Publications */}
      {chunk(edition.publications || [], 5).map((pubs, i) => (
        <ExecutivePublicationPage key={`pub-${i}`} edition={edition} pageNumber={++pageCounter} publications={pubs} isContinuation={i > 0} />
      ))}

      {/* 9. Editorial */}
      {!!(edition.editorialTeam?.facultyAdvisor?.name || (edition.editorialTeam?.members || []).length > 0) && (
        <ExecutiveEditorialPage edition={edition} pageNumber={++pageCounter} />
      )}
    </div>
  );
};

export default ModernNexusLayout;
