import React from 'react';
import { withAdvancedDesigner } from '@/components/design-engine/withAdvancedDesigner';
import { Edition, Publication } from '@/types/newspaper';
import { PageShell } from '@/components/design-engine/PageShell';
import { Typography, getPageStyle } from '@/components/design-engine/Typography';
import { splitAtBreaks } from '@/lib/pageBreakUtils';

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  if (!arr) return chunks;
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
};

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  PRIMARY: '#0f172a',    // Slate 900
  SECONDARY: '#475569',  // Slate 600
  ACCENT: '#1d4ed8',     // Academic Blue
};

// ─── Shared sub-components ────────────────────────────────────────────────────

const EditorialHeader = ({ edition, pageTitle, style = {} }: { edition: Edition; pageTitle: string; style?: any }) => (
  <header className="mb-12 relative z-10 w-full overflow-hidden">
    <div className="flex justify-between items-center bg-slate-900 text-white px-8 py-3 mb-4" style={{ backgroundColor: style.color || COLORS.PRIMARY }}>
       <Typography.Caption className="!text-white" style={style}>Volume {edition.editionNumber} • {edition.date}</Typography.Caption>
       <Typography.Caption style={{ color: 'white', opacity: 0.6 }}>{edition.collegeName}</Typography.Caption>
    </div>
    <div className="flex items-center gap-6 border-b border-slate-100 pb-4">
       <Typography.H3 className="!text-slate-900 !tracking-[0.1em]" style={style}>{pageTitle}</Typography.H3>
       <div className="flex-1 h-px bg-slate-100"></div>
    </div>
  </header>
);

const EditorialFooter = ({ edition, pageNumber, style = {} }: { edition: Edition; pageNumber: number; style?: any }) => (
  <footer className="mt-auto px-8 pt-6 flex justify-between items-center z-10 border-t border-slate-50">
    <div className="flex flex-col">
      <Typography.Caption className="!text-slate-300" style={style}>{edition.departmentName} PRESS</Typography.Caption>
      <Typography.Caption className="!text-[7px] !text-slate-200 mt-0.5" style={style}>© ACADEMIC INSTITUTION • VOL {edition.editionNumber}</Typography.Caption>
    </div>
    {edition.showPageNumbers && (
      <div className="text-slate-400 font-serif italic text-sm tracking-widest flex items-center gap-4">
        <span className="w-8 h-px bg-slate-100"></span>
        {pageNumber.toString().padStart(2, '0')}
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

// Cover Page - REARRANGED
const CoverPage = ({ edition, pageNumber }: PageProps) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col items-center justify-between z-10 relative pb-16">
        
        {edition.buildingPhotoUrl && (
          <div className="w-full h-[380px] overflow-hidden grayscale contrast-125 mb-8">
            <img src={edition.buildingPhotoUrl} alt="Campus" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="px-16 w-full flex flex-col items-center text-center gap-6">
          <div className="flex items-center gap-8 mb-8 pb-8 border-b border-slate-100 w-full justify-center">
             {edition.collegeLogoUrl && <img src={edition.collegeLogoUrl} alt="Logo" className="h-10 grayscale" />}
             <Typography.Caption style={{ color: custom.color }}>{edition.collegeName}</Typography.Caption>
          </div>

          <Typography.H2 
            data-section-key="dept-title"
            data-use-native-layout="true"
            className="text-slate-400"
            style={{ color: COLORS.SECONDARY }}
          >
            {edition.departmentName}
          </Typography.H2>

          <Typography.H1 
            data-section-key="cover-title"
            data-use-native-layout="true"
            style={{ color: custom.color || COLORS.PRIMARY }}
          >
            {edition.name}
          </Typography.H1>

          <div className="max-w-md">
             <Typography.Body 
               data-section-key="cover-tagline"
               data-use-native-layout="true"
               className="italic text-lg text-slate-400 leading-relaxed" 
            >
              "{edition.tagline}"
            </Typography.Body>
          </div>
        </div>

        <div className="mt-auto px-16 w-full flex justify-between items-end">
           <div className="flex flex-col gap-1">
             <Typography.Caption style={custom}>Academic Release</Typography.Caption>
             <Typography.H2 className="!text-slate-300 italic" style={custom}>01.{edition.editionNumber}</Typography.H2>
           </div>
           <div className="text-right flex flex-col gap-1">
             <Typography.Caption style={custom}>{edition.date}</Typography.Caption>
             <Typography.Caption className="!text-slate-900" style={{ ...custom, color: custom.color }}>Institutional Issue</Typography.Caption>
           </div>
        </div>
      </div>
    </PageShell>
  );
};

// V/M Page - REARRANGED
const VisionMissionPage = ({ edition, pageNumber, type = 'institution' }: PageProps & { type?: 'institution' | 'dept' }) => {
  const custom = getPageStyle(edition, pageNumber);
  const isDept = type === 'dept';
  const label = isDept ? 'Departmental' : 'Institutional';
  const vision = isDept ? edition.visionMission?.deptVision : edition.visionMission?.institutionVision;
  const mission = isDept ? edition.visionMission?.deptMission : edition.visionMission?.institutionMission;
  const imageUrl = isDept ? edition.visionMission?.deptImageUrl : edition.visionMission?.institutionImageUrl;

  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col p-12 relative z-10 overflow-hidden">
        <EditorialHeader edition={edition} pageTitle={`${label} Protocol`} style={custom} />
        <div className="flex-1 flex flex-col gap-12 justify-center">
          <div className="flex gap-16 items-start">
             <div className="w-1/2 space-y-6">
                <Typography.H3 style={custom}>{label} Vision</Typography.H3>
                <Typography.Body 
                  data-section-key={`${type}-vision-body`} 
                  data-use-native-layout="true" 
                  className="font-serif italic text-2xl leading-relaxed text-slate-800" 
                  style={custom}
                >
                  {vision || `${label} vision description pending.`}
                </Typography.Body>
             </div>
             {imageUrl && (
              <div className="w-1/2 h-80 bg-slate-50 border-8 border-slate-50 overflow-hidden shadow-2xl grayscale">
                 <img src={imageUrl} alt="Protocol" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="bg-slate-900 text-white p-16 shadow-2xl flex flex-col gap-4 border-l-[12px] border-blue-700" style={{ backgroundColor: custom.color || COLORS.PRIMARY }}>
              <Typography.H3 className="!text-blue-400 mb-2">Academic Mission</Typography.H3>
              <Typography.Body 
                data-section-key={`${type}-mission-body`} 
                data-use-native-layout="true" 
                className="text-lg font-light leading-relaxed whitespace-pre-line" 
                style={{ color: 'white' }}
              >
                {mission || `${label} mission description pending.`}
              </Typography.Body>
          </div>
        </div>
        <EditorialFooter edition={edition} pageNumber={pageNumber} style={custom} />
      </div>
    </PageShell>
  );
};

// Academic Info Page - REARRANGED
const AcademicIndexPage = ({ edition, pageNumber, title, items, startIndex = 0, continueNumbering = false }: PageProps & { title: string; items: string[]; startIndex?: number; continueNumbering?: boolean }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col p-12 relative z-10 overflow-hidden">
        <EditorialHeader edition={edition} pageTitle={continueNumbering ? `${title} (Continued)` : title} style={custom} />
        <div className="flex-1 flex flex-col py-8">
           <div className="grid grid-cols-1 gap-6">
            {items.map((item, i) => (
              <div key={i} className="flex gap-10 items-start pb-8 border-b border-slate-50 last:border-0">
                <span className="text-4xl font-serif italic font-black text-slate-100 shrink-0" style={{ color: custom.backgroundColor ? 'rgba(0,0,0,0.05)' : undefined }}>
                  {(startIndex + i + 1).toString().padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <Typography.Body 
                    data-section-key={`outcome-${title.toLowerCase().replace(/\s+/g, '-')}-${startIndex + i}`}
                    data-use-native-layout="true"
                    className="text-lg leading-relaxed text-justify" 
                    style={custom}
                  >
                    {item}
                  </Typography.Body>
                </div>
              </div>
            ))}
          </div>
        </div>
        <EditorialFooter edition={edition} pageNumber={pageNumber} style={custom} />
      </div>
    </PageShell>
  );
};

// Message Page - REARRANGED
const MessagePage = ({ edition, pageNumber, label, deskMessage }: PageProps & { label: string; deskMessage?: any }) => {
  const custom = getPageStyle(edition, pageNumber);
  const identifier = label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col p-12 relative z-10 overflow-hidden">
        <EditorialHeader edition={edition} pageTitle="Executive Insight" style={custom} />
        <div className="flex-1 flex flex-col justify-center gap-12">
          {deskMessage ? (
             <div className="flex gap-16 items-start">
                 <div className="w-1/3 flex flex-col items-center gap-6">
                    <div className="w-full aspect-[3/4] bg-slate-50 border-4 border-slate-900 shadow-2xl grayscale overflow-hidden" style={{ borderColor: custom.color || COLORS.PRIMARY }}>
                       {deskMessage.photoUrl && <img src={deskMessage.photoUrl} alt="Portrait" className="w-full h-full object-cover" />}
                    </div>
                    <div className="text-center">
                       <Typography.H3 data-section-key={`${identifier}-name`} data-use-native-layout="true" style={custom}>{deskMessage.name}</Typography.H3>
                       <Typography.Caption data-section-key={`${identifier}-title`} data-use-native-layout="true" className="mt-2 text-slate-400" style={custom}>{deskMessage.title}</Typography.Caption>
                    </div>
                 </div>
                 <div className="w-2/3 border-l border-slate-100 pl-16">
                    <Typography.H3 className="mb-8">{label}</Typography.H3>
                    <Typography.Body 
                       data-section-key={`${identifier}-body`} 
                       data-use-native-layout="true" 
                       className="text-lg leading-relaxed whitespace-pre-line italic" 
                       style={custom}
                    >
                       {deskMessage.message}
                    </Typography.Body>
                 </div>
             </div>
          ) : (
            <div className="flex-1 flex items-center justify-center opacity-10">
              <Typography.H1>Note Pending</Typography.H1>
            </div>
          )}
        </div>
        <EditorialFooter edition={edition} pageNumber={pageNumber} style={custom} />
      </div>
    </PageShell>
  );
};

// Article Page - REARRANGED
const ArticlePage = ({ edition, pageNumber, article, layout = 'standard' }: PageProps & { article: any; layout?: 'standard' | 'alternate' }) => {
  const custom = getPageStyle(edition, pageNumber);
  const isAlt = layout === 'alternate';

  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col p-12 relative z-10 overflow-hidden">
        <EditorialHeader edition={edition} pageTitle="Institutional Analysis" style={custom} />
        <div className={`flex-1 flex ${isAlt ? 'flex-row-reverse' : 'flex-row'} gap-16 py-8`}>
           <div className="w-1/2 flex flex-col gap-8">
              <Typography.H2 data-section-key={`article-${article.id}-title`} data-use-native-layout="true" className="text-4xl" style={custom}>{article.title}</Typography.H2>
              <div className="flex items-center gap-4">
                 <span className="w-12 h-px bg-slate-200"></span>
                 <Typography.Caption style={custom}>{article.author} • {article.category}</Typography.Caption>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                 <Typography.Body 
                    data-section-key={`article-${article.id}-body`} 
                    data-use-native-layout="true" 
                    className="text-[17px] leading-relaxed text-justify" 
                    style={custom}
                  >
                    {article.body}
                  </Typography.Body>
              </div>
           </div>
           <div className="w-1/2 h-full bg-slate-50 border-[12px] border-slate-50 shadow-inner overflow-hidden grayscale">
              {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />}
           </div>
        </div>
        <EditorialFooter edition={edition} pageNumber={pageNumber} style={custom} />
      </div>
    </PageShell>
  );
};

// Achievement Page - REARRANGED
const AchievementPage = ({ edition, pageNumber, placement }: PageProps & { placement: any }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col p-12 relative z-10 overflow-hidden">
        <EditorialHeader edition={edition} pageTitle="Career Outcomes" style={custom} />
        <div className="flex-1 flex flex-col gap-12">
          <div data-section-key={`placement-${placement.id}-header`} data-use-native-layout="true" className="flex justify-between items-center bg-slate-50 p-10 border border-slate-100 rounded-3xl" style={{ borderColor: custom.color ? 'rgba(0,0,0,0.1)' : undefined }}>
            <div className="space-y-1">
               <Typography.H3 style={custom}>{placement.companyName}</Typography.H3>
               <Typography.Caption>Institutional Partner</Typography.Caption>
            </div>
            <div className="flex gap-12 border-l border-slate-200 pl-12 text-center">
               <div>
                  <Typography.Caption style={custom}>Package</Typography.Caption>
                  <Typography.H1 className="!text-3xl" style={{ ...custom, color: custom.color || COLORS.PRIMARY }}>{placement.lpa || 'N/A'}</Typography.H1>
               </div>
               <div>
                  <Typography.Caption style={custom}>Placed</Typography.Caption>
                  <Typography.H1 className="!text-3xl" style={{ ...custom, color: custom.color || COLORS.PRIMARY }}>{placement.students.length}</Typography.H1>
               </div>
            </div>
            {placement.companyLogoUrl && <img src={placement.companyLogoUrl} alt="Logo" className="h-12 w-24 object-contain grayscale" />}
          </div>

          <div className="grid grid-cols-4 gap-x-8 gap-y-12">
            {placement.students.map((s: any, i: number) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 bg-slate-100 rounded-full border-4 border-slate-50 shadow-lg overflow-hidden grayscale">
                  {s.photoUrl && <img src={s.photoUrl} alt={s.name} className="w-full h-full object-cover" />}
                </div>
                <Typography.Caption className="text-center !text-slate-900 !tracking-normal line-clamp-1" style={{ color: custom.color }}>{s.name}</Typography.Caption>
              </div>
            ))}
          </div>
        </div>
        <EditorialFooter edition={edition} pageNumber={pageNumber} style={custom} />
      </div>
    </PageShell>
  );
};

// Publication Page - REARRANGED
const PublicationPage = ({ edition, pageNumber, publications, isContinuation = false }: PageProps & { publications: Publication[]; isContinuation?: boolean }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col p-12 relative z-10 overflow-hidden">
        <EditorialHeader edition={edition} pageTitle={isContinuation ? 'Scholarly Index (Cont.)' : 'Scholarly Index'} style={custom} />
        <div className="flex-1 flex flex-col gap-10 py-4">
          {publications.map((pub, i) => (
            <div key={i} data-section-key={`publication-${pub.id}`} data-use-native-layout="true" className="flex gap-12 items-start group">
               <div className="w-2 h-2 rounded-full bg-slate-900 mt-2 shrink-0" style={{ backgroundColor: custom.color || COLORS.PRIMARY }}></div>
               <div className="flex-1 space-y-3 pb-8 border-b border-slate-50">
                  <div className="flex justify-between items-start gap-8">
                     <Typography.H3 className="!text-[14px] !leading-snug" style={{ color: custom.color || COLORS.PRIMARY }}>{pub.paperDetails}</Typography.H3>
                     <Typography.Caption className="bg-slate-50 px-2 py-1 border border-slate-100 shrink-0" style={custom}>{pub.indexing}</Typography.Caption>
                  </div>
                  <div className="flex items-center gap-3">
                     <Typography.Caption style={{ color: custom.color }}>{pub.claimingAuthor}</Typography.Caption>
                     <Typography.Caption className="opacity-40" style={custom}>Dept of {pub.dept}</Typography.Caption>
                  </div>
               </div>
            </div>
          ))}
        </div>
        <EditorialFooter edition={edition} pageNumber={pageNumber} style={custom} />
      </div>
    </PageShell>
  );
};

// Editorial Team Page - REARRANGED
const EditorialTeamPage = ({ edition, pageNumber }: PageProps) => {
  const custom = getPageStyle(edition, pageNumber);
  const et = edition.editorialTeam;

  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col p-12 relative z-10 overflow-hidden">
        <EditorialHeader edition={edition} pageTitle="Administrative Board" style={custom} />
        <div className="flex-1 flex flex-col gap-20 items-center justify-center">
           <div className="flex flex-col items-center gap-10">
              <div className="w-48 h-48 rounded-full border-[10px] border-slate-50 shadow-2xl overflow-hidden grayscale">
                 {et?.facultyAdvisor?.photoUrl && <img src={et.facultyAdvisor.photoUrl} alt="Advisor" className="w-full h-full object-cover" />}
              </div>
              <div className="text-center">
                 <Typography.Caption>Faculty Representative</Typography.Caption>
                 <Typography.H2 data-section-key="faculty-advisor-name" data-use-native-layout="true" className="text-4xl mt-2" style={custom}>{et?.facultyAdvisor?.name || 'Board Advisor'}</Typography.H2>
                 <Typography.Caption data-section-key="faculty-advisor-title" data-use-native-layout="true" className="mt-3 !text-blue-700" style={{ ...custom, color: custom.color || COLORS.ACCENT }}>{et?.facultyAdvisor?.title || ''}</Typography.Caption>
              </div>
           </div>

           <div className="w-full max-w-2xl px-12 pt-12 border-t border-slate-50 flex flex-wrap justify-center gap-12">
              {et?.members?.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                   <div className="w-14 h-14 rounded-full border border-slate-100 overflow-hidden grayscale opacity-40">
                      {m.photoUrl && <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />}
                   </div>
                   <Typography.Caption data-section-key={`editorial-member-${i}`} data-use-native-layout="true" className="text-center" style={{ ...custom, color: custom.color }}>{m.name}</Typography.Caption>
                </div>
              ))}
           </div>
        </div>
        <EditorialFooter edition={edition} pageNumber={pageNumber} style={custom} />
      </div>
    </PageShell>
  );
};

const EmptyPagePlaceholder = ({ edition, pageNumber, title }: PageProps & { title: string }) => (
  <PageShell pageNumber={pageNumber}>
    <div className="flex-1 flex flex-col p-12 relative z-10 overflow-hidden">
      <EditorialHeader edition={edition} pageTitle="Institutional Archive" />
      <div className="flex-1 flex flex-col items-center justify-center opacity-10">
         <Typography.H2 className="uppercase tracking-[0.2em]">{title} Pending</Typography.H2>
      </div>
      <EditorialFooter edition={edition} pageNumber={pageNumber} />
    </div>
  </PageShell>
);

// ─── Main Layout ──────────────────────────────────────────────────────────────

interface Props {
  edition: Edition;
  layoutRef?: React.RefObject<HTMLDivElement>;
  activePageNumber?: number;
  onPageSelect?: (pageNumber: number) => void;
}

const EditorialMagazineLayout = ({ edition, layoutRef, activePageNumber, onPageSelect }: Props) => {
  let pageCounter = 1;
  const vm = edition.visionMission;

  const poGroups  = splitAtBreaks(vm?.programOutcomes || [], vm?.programOutcomeBreaks);
  const peoGroups = splitAtBreaks(vm?.peos || [], vm?.peoBreaks);
  const psoGroups = splitAtBreaks(vm?.psos || [], vm?.psoBreaks);

  const Label = ({ pNum, label }: { pNum: number, label: string }) => (
    <div data-html2canvas-ignore className="absolute -top-10 left-0 text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors">
      Page {pNum} • {label}
    </div>
  );

  return (
    <div ref={layoutRef} className="flex flex-col gap-10 bg-slate-100/50 p-10 min-h-screen items-center scroll-smooth">
      
      {/* 1. Cover */}
      <div className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
        <Label pNum={pageCounter} label="Cover Archive" />
        <CoverPage edition={edition} pageNumber={pageCounter++} />
      </div>

      {/* 2. Vision/Mission */}
      {!!(vm?.institutionVision || vm?.institutionMission || vm?.institutionImageUrl) && (
        <div className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
          <Label pNum={pageCounter} label="Institutional Charter" />
          <VisionMissionPage edition={edition} pageNumber={pageCounter++} type="institution" />
        </div>
      )}
      {!!(vm?.deptVision || vm?.deptMission || vm?.deptImageUrl) && (
        <div className="relative group" onClick={() => onPageSelect?.(pageCounter)}>
          <Label pNum={pageCounter} label="Departmental Charter" />
          <VisionMissionPage edition={edition} pageNumber={pageCounter++} type="dept" />
        </div>
      )}

      {/* 4. Outcomes/Objectives */}
      {poGroups.map((g, i) => {
        const pNum = pageCounter++;
        return (
          <div key={`po-${i}`} className="relative group" onClick={() => onPageSelect?.(pNum)}>
            <Label pNum={pNum} label="Project Outcomes" />
            <AcademicIndexPage edition={edition} pageNumber={pNum} title="Outcome Protocols" items={g.items} startIndex={g.startIndex} continueNumbering={i > 0 && g.continueNumbering} />
          </div>
        );
      })}
      
      {peoGroups.map((g, i) => {
        const pNum = pageCounter++;
        return (
          <div key={`peo-${i}`} className="relative group" onClick={() => onPageSelect?.(pNum)}>
            <Label pNum={pNum} label="Educational Goal" />
            <AcademicIndexPage edition={edition} pageNumber={pNum} title="Strategic Objectives" items={g.items} startIndex={g.startIndex} continueNumbering={i > 0 && g.continueNumbering} />
          </div>
        );
      })}

      {psoGroups.map((g, i) => {
        const pNum = pageCounter++;
        return (
          <div key={`pso-${i}`} className="relative group" onClick={() => onPageSelect?.(pNum)}>
            <Label pNum={pNum} label="Specific Outcome" />
            <AcademicIndexPage edition={edition} pageNumber={pNum} title="Technical Index" items={g.items} startIndex={g.startIndex} continueNumbering={i > 0 && g.continueNumbering} />
          </div>
        );
      })}

      {/* 5. Messages */}
      {[
        { label: "Administration Note", message: edition.hodMessage, type: 'DEAN MSG' },
        { label: "Faculty Note", message: edition.facultyMessage, type: 'FACULTY MSG' },
        { label: "Executive Note", message: edition.studentMessage, type: 'STUDENT MSG' },
      ].filter(m => !!(m.message?.message || m.message?.name)).map(m => {
        const pNum = pageCounter++;
        return (
          <div key={m.label} className="relative group" onClick={() => onPageSelect?.(pNum)}>
            <Label pNum={pNum} label={m.type} />
            <MessagePage edition={edition} pageNumber={pNum} label={m.label} deskMessage={m.message} />
          </div>
        );
      })}

      {/* 8. Articles */}
      {(edition.articles || []).map((art, idx) => {
        const pNum = pageCounter++;
        return (
          <div key={art.id} className="relative group" onClick={() => onPageSelect?.(pNum)}>
            <Label pNum={pNum} label="Technical Feature" />
            <ArticlePage edition={edition} pageNumber={pNum} article={art} layout={idx % 2 === 0 ? 'standard' : 'alternate'} />
          </div>
        );
      })}

      {/* 9. Placements */}
      {(edition.placements || []).flatMap(site => 
        chunk(site.students || [], 12).map((students, i) => {
          const pNum = pageCounter++;
          return (
            <div key={`${site.id}-${i}`} className="relative group" onClick={() => onPageSelect?.(pNum)}>
              <Label pNum={pNum} label="Outcome Achievement" />
              <AchievementPage edition={edition} pageNumber={pNum} placement={{ ...site, students }} />
            </div>
          );
        })
      )}

      {/* 10. Publications */}
      {chunk(edition.publications || [], 5).map((pubs, i) => {
        const pNum = pageCounter++;
        return (
          <div key={`pub-${i}`} className="relative group" onClick={() => onPageSelect?.(pNum)}>
            <Label pNum={pNum} label="Publication Log" />
            <PublicationPage edition={edition} pageNumber={pNum} publications={pubs} isContinuation={i > 0} />
          </div>
        );
      })}

      {/* 11. Editorial */}
      {!!(edition.editorialTeam?.facultyAdvisor?.name || (edition.editorialTeam?.members || []).length > 0) && (() => {
        const pNum = pageCounter++;
        return (
          <div key="editorial" className="relative group" onClick={() => onPageSelect?.(pNum)}>
            <Label pNum={pNum} label="Board Record" />
            <EditorialTeamPage edition={edition} pageNumber={pNum} />
          </div>
        );
      })()}

    </div>
  );
};

export default withAdvancedDesigner(EditorialMagazineLayout);
