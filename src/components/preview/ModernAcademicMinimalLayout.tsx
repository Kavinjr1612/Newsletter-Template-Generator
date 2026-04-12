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
  PRIMARY: '#0f172a',    // Deep slate
  SECONDARY: '#64748b',  // Slate 500
  ACCENT: '#10b981',     // Emerald 500
  BG_SOFT: '#f8fafc',    // Slate 50
};

// ─── Shared sub-components ────────────────────────────────────────────────────

const MinimalHeader = ({ edition, pageTitle, style = {} }: { edition: Edition; pageTitle: string; style?: any }) => (
  <header className="mb-16 relative z-10 w-full">
    <div className="flex justify-between items-start pt-8">
      <div className="space-y-1">
        <Typography.Caption style={style}>{edition.name} • {edition.date}</Typography.Caption>
        <Typography.H3 style={style}>{pageTitle}</Typography.H3>
      </div>
      <div className="text-right">
        <Typography.H1 className="!text-[48px] !text-slate-100 absolute -top-4 right-0 pointer-events-none" style={{ ...style, letterSpacing: 'normal', wordSpacing: 'normal' }}>
          {pageTitle.split(' ')[0]}
        </Typography.H1>
        <div className="relative z-10 pt-4">
           <div className="h-px w-12 bg-emerald-500 ml-auto" style={{ backgroundColor: style.color || COLORS.ACCENT }}></div>
        </div>
      </div>
    </div>
  </header>
);

const MinimalFooter = ({ edition, pageNumber, style = {} }: { edition: Edition; pageNumber: number; style?: any }) => (
  <footer className="mt-auto pt-10 flex justify-between items-end z-10 w-full">
    <div className="flex flex-col gap-2">
      <div className="h-px w-32 bg-slate-100"></div>
      <Typography.Caption className="!text-slate-400 !text-[8px]" style={style}>{edition.collegeName}</Typography.Caption>
    </div>
    {edition.showPageNumbers && (
      <div className="text-slate-900 font-light text-2xl tracking-tighter" style={{ color: style.color }}>
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

const CoverPage = ({ edition, pageNumber }: PageProps) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col p-12 relative z-10 bg-white w-full h-full">
        <div className="flex justify-between items-center mb-24">
          {edition.collegeLogoUrl && <img src={edition.collegeLogoUrl} alt="Logo" className="h-10" />}
          <div className="text-right">
            <Typography.Caption style={{ color: custom.color }}>Establishment</Typography.Caption>
            <Typography.Caption className="!text-slate-900" style={custom}>{edition.date.split('-')[0]}</Typography.Caption>
          </div>
        </div>

        <div className="space-y-12 relative">
          <div className="absolute -left-12 top-0 w-1 bg-emerald-500 h-full opacity-20" style={{ backgroundColor: custom.color }}></div>
          <div className="space-y-4">
            <Typography.H3 
              data-section-key="dept-title"
              data-use-native-layout="true"
              style={{ color: custom.color || COLORS.ACCENT }}
            >
              {edition.departmentName}
            </Typography.H3>
            <Typography.H1 
              data-section-key="cover-title"
              data-use-native-layout="true"
              scale={custom.scale} 
              style={{ color: COLORS.PRIMARY, ...custom }}
            >
              {edition.name}
            </Typography.H1>
          </div>
          
          <div className="max-w-md">
            <Typography.Body 
               data-section-key="cover-tagline"
               data-use-native-layout="true"
               scale={custom.scale} 
               className="text-lg font-light leading-relaxed italic" 
               style={{ ...custom }}
            >
              {edition.tagline}
            </Typography.Body>
          </div>
        </div>

        {edition.buildingPhotoUrl && (
          <div className="mt-auto w-full h-80 relative overflow-hidden">
            <img src={edition.buildingPhotoUrl} alt="Campus" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          </div>
        )}
      </div>
    </PageShell>
  );
};

const VisionMissionPage = ({ edition, pageNumber, type = 'institution' }: PageProps & { type?: 'institution' | 'dept' }) => {
  const custom = getPageStyle(edition, pageNumber);
  const isDept = type === 'dept';
  const label = isDept ? 'Department' : 'Institution';
  const vision = isDept ? edition.visionMission?.deptVision : edition.visionMission?.institutionVision;
  const mission = isDept ? edition.visionMission?.deptMission : edition.visionMission?.institutionMission;
  const imageUrl = isDept ? edition.visionMission?.deptImageUrl : edition.visionMission?.institutionImageUrl;

  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col p-12 w-full h-full bg-white relative z-10">
        <MinimalHeader edition={edition} pageTitle={`${label} Purpose`} style={custom} />
        <div className="flex-1 flex flex-col gap-20">
          <div className="grid grid-cols-1 gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <Typography.Caption className="!text-emerald-500" style={{ ...custom, color: custom.color }}>Vision</Typography.Caption>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              <Typography.Body 
                data-section-key={`${type}-vision-body`} 
                data-use-native-layout="true" 
                className="text-2xl font-light leading-snug" 
                style={custom}
              >
                {vision || `${label} vision not provided.`}
              </Typography.Body>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <Typography.Caption className="!text-emerald-500" style={{ ...custom, color: custom.color }}>Mission</Typography.Caption>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              <Typography.Body 
                data-section-key={`${type}-mission-body`} 
                data-use-native-layout="true" 
                className="text-xl font-light italic leading-relaxed pl-8 border-l border-emerald-100" 
                style={{ ...custom, borderColor: custom.color }}
              >
                {mission || `${label} mission not provided.`}
              </Typography.Body>
            </div>
          </div>
          
          {imageUrl && (
            <div className="mt-auto h-64 w-full bg-slate-50 relative overflow-hidden">
              <img src={imageUrl} alt="Purpose" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent"></div>
            </div>
          )}
        </div>
        <MinimalFooter edition={edition} pageNumber={pageNumber} style={custom} />
      </div>
    </PageShell>
  );
};

const AcademicIndexPage = ({ edition, pageNumber, title, items, startIndex = 0, continueNumbering = false }: PageProps & { title: string; items: string[]; startIndex?: number; continueNumbering?: boolean }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col p-12 w-full h-full bg-white relative z-10">
        <MinimalHeader edition={edition} pageTitle={continueNumbering ? `${title} (Cont.)` : title} style={custom} />
        <div className="flex-1 flex flex-col">
          <div className="space-y-12">
            {items.map((item, i) => (
              <div key={i} className="flex gap-12 items-start">
                <div className="pt-1 flex flex-col items-center">
                  <Typography.H2 className="!text-slate-200 !text-4xl" style={{ ...custom, color: custom.color + '20' }}>
                    {(startIndex + i + 1).toString().padStart(2, '0')}
                  </Typography.H2>
                  <div className="w-px h-full bg-slate-50 mt-2"></div>
                </div>
                <div className="flex-1 pt-2">
                  <Typography.Body 
                    data-section-key={`outcome-${title.toLowerCase().replace(/\s+/g, '-')}-${startIndex + i}`}
                    data-use-native-layout="true"
                    className="text-lg font-light leading-relaxed" 
                    style={custom}
                  >
                    {item}
                  </Typography.Body>
                </div>
              </div>
            ))}
          </div>
        </div>
        <MinimalFooter edition={edition} pageNumber={pageNumber} style={custom} />
      </div>
    </PageShell>
  );
};

const MessagePage = ({ edition, pageNumber, label, deskMessage }: PageProps & { label: string; deskMessage?: any }) => {
  const custom = getPageStyle(edition, pageNumber);
  const identifier = label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col p-12 w-full h-full bg-white relative z-10">
        <MinimalHeader edition={edition} pageTitle={label} style={custom} />
        <div className="flex-1 flex flex-col">
          {deskMessage ? (
            <div className="grid grid-cols-12 gap-12 pt-8">
              <div className="col-span-4 space-y-6">
                <div className="aspect-[4/5] bg-slate-50 overflow-hidden">
                  {deskMessage.photoUrl && <img src={deskMessage.photoUrl} alt="Portrait" className="w-full h-full object-cover" />}
                </div>
                <div className="space-y-1 border-t border-slate-100 pt-6">
                  <Typography.H3 data-section-key={`${identifier}-name`} data-use-native-layout="true" style={custom}>{deskMessage.name}</Typography.H3>
                  <Typography.Caption data-section-key={`${identifier}-title`} data-use-native-layout="true" style={custom}>{deskMessage.title}</Typography.Caption>
                </div>
              </div>
              <div className="col-span-8">
                <Typography.Body 
                  data-section-key={`${identifier}-body`} 
                  data-use-native-layout="true" 
                  className="text-xl font-light leading-relaxed whitespace-pre-line first-letter:text-5xl first-letter:font-thin first-letter:mr-3 first-letter:float-left first-letter:text-emerald-500" 
                  style={custom}
                >
                  {deskMessage.message}
                </Typography.Body>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl">
              <Typography.Caption className="!text-slate-300" style={custom}>Documentation pending</Typography.Caption>
            </div>
          )}
        </div>
        <MinimalFooter edition={edition} pageNumber={pageNumber} style={custom} />
      </div>
    </PageShell>
  );
};

const ArticlePage = ({ edition, pageNumber, article }: PageProps & { article: any }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col p-12 w-full h-full bg-white relative z-10">
        <MinimalHeader edition={edition} pageTitle={article.category} style={custom} />
        <div className="flex-1 flex flex-col gap-12">
          <Typography.H2 data-section-key={`article-${article.id}-title`} data-use-native-layout="true" className="text-5xl font-thin leading-[1.1]" style={custom}>{article.title}</Typography.H2>
          
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 h-[300px] bg-slate-50 overflow-hidden">
              {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />}
            </div>
            <div className="col-span-3">
               <div className="space-y-4 border-t border-slate-100 pt-6">
                  <Typography.Caption style={custom}>Article By</Typography.Caption>
                  <Typography.Caption className="!text-slate-900" style={custom}>{article.author}</Typography.Caption>
               </div>
            </div>
            <div className="col-span-9">
              <Typography.Body 
                data-section-key={`article-${article.id}-body`} 
                data-use-native-layout="true" 
                className="text-lg font-light leading-relaxed whitespace-pre-line text-justify" 
                style={custom}
              >
                {article.body}
              </Typography.Body>
            </div>
          </div>
        </div>
        <MinimalFooter edition={edition} pageNumber={pageNumber} style={custom} />
      </div>
    </PageShell>
  );
};

const AchievementPage = ({ edition, pageNumber, placement, isContinuation = false }: PageProps & { placement: any; isContinuation?: boolean }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col p-12 w-full h-full bg-white relative z-10">
        <MinimalHeader edition={edition} pageTitle={isContinuation ? 'Placement Index (Cont.)' : 'Placement Index'} style={custom} />
        <div className="flex-1 flex flex-col gap-12">
          <div data-section-key={`placement-${placement.id}-header`} data-use-native-layout="true" className="flex items-end justify-between border-b border-slate-100 pb-12">
            <div className="space-y-4">
              <Typography.H2 style={custom} className="text-6xl font-thin">{placement.companyName}</Typography.H2>
              <div className="flex items-center gap-4">
                 <Typography.Caption style={custom}>LPA Portfolio</Typography.Caption>
                 <span className="text-3xl font-light text-emerald-600">{placement.lpa || 'N/A'}</span>
              </div>
            </div>
            <div className="text-right">
              <Typography.Caption className="!text-slate-400 mb-2" style={custom}>Cohort Size</Typography.Caption>
              <Typography.H1 className="!text-7xl" style={custom}>{placement.students.length}</Typography.H1>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-8">
            {placement.students.map((s: any, i: number) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-slate-50 p-2 border border-slate-100">
                  {s.photoUrl && <img src={s.photoUrl} alt={s.name} className="w-full h-full object-cover" />}
                </div>
                <Typography.Caption className="text-center" style={{ ...custom, color: custom.color }}>{s.name}</Typography.Caption>
              </div>
            ))}
          </div>
        </div>
        <MinimalFooter edition={edition} pageNumber={pageNumber} style={custom} />
      </div>
    </PageShell>
  );
};

const PublicationPage = ({ edition, pageNumber, publications, isContinuation = false }: PageProps & { publications: Publication[]; isContinuation?: boolean }) => {
  const custom = getPageStyle(edition, pageNumber);
  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col p-12 w-full h-full bg-white relative z-10">
        <MinimalHeader edition={edition} pageTitle={isContinuation ? 'Research Journal (Cont.)' : 'Research Journal'} style={custom} />
        <div className="flex-1 flex flex-col space-y-8">
          {publications.map((pub, i) => (
            <div key={i} data-section-key={`publication-${pub.id}`} data-use-native-layout="true" className="p-8 border border-slate-100 bg-white">
               <div className="flex justify-between items-start mb-6">
                  <Typography.Caption className="!text-emerald-500" style={{ ...custom, color: custom.color }}>{pub.indexing}</Typography.Caption>
                  <Typography.Caption className="!text-slate-300" style={custom}>REF: {pub.id.slice(0,8)}</Typography.Caption>
               </div>
               <Typography.H2 className="!text-2xl mb-6" style={{ ...custom, color: custom.color }}>{pub.paperDetails}</Typography.H2>
               <div className="flex justify-between items-center border-t border-slate-50 pt-6">
                  <Typography.Caption style={custom}>{pub.claimingAuthor}</Typography.Caption>
                  <div className="h-4 w-px bg-slate-100"></div>
                  <Typography.Caption style={custom}>Dept of {pub.dept}</Typography.Caption>
               </div>
            </div>
          ))}
        </div>
        <MinimalFooter edition={edition} pageNumber={pageNumber} style={custom} />
      </div>
    </PageShell>
  );
};

const EditorialPage = ({ edition, pageNumber }: PageProps) => {
  const custom = getPageStyle(edition, pageNumber);
  const et = edition.editorialTeam;

  return (
    <PageShell pageNumber={pageNumber} style={{ ...custom }}>
      <div className="flex-1 flex flex-col p-12 w-full h-full bg-white relative z-10">
        <MinimalHeader edition={edition} pageTitle="Editorial Board" style={custom} />
        <div className="flex-1 flex flex-col gap-16">
          <div className="grid grid-cols-12 gap-12 items-center">
             <div className="col-span-5 aspect-square bg-slate-50 overflow-hidden">
                {et?.facultyAdvisor?.photoUrl && <img src={et.facultyAdvisor.photoUrl} alt="Advisor" className="w-full h-full object-cover" />}
             </div>
             <div className="col-span-7 space-y-4">
                <Typography.Caption style={custom}>Faculty Mentorship</Typography.Caption>
                <Typography.H2 data-section-key="faculty-advisor-name" data-use-native-layout="true" className="text-5xl font-thin" style={custom}>{et?.facultyAdvisor?.name || ''}</Typography.H2>
                <Typography.Caption data-section-key="faculty-advisor-title" data-use-native-layout="true" className="!text-emerald-600" style={custom}>{et?.facultyAdvisor?.title || ''}</Typography.Caption>
             </div>
          </div>

          <div className="space-y-8">
             <div className="flex items-center gap-6">
                <Typography.Caption>Student Editors</Typography.Caption>
                <div className="h-px flex-1 bg-slate-100"></div>
             </div>
             <div className="grid grid-cols-4 gap-12">
                {et?.members?.map((m, i) => (
                  <div key={i} className="flex flex-col gap-4">
                     <div className="aspect-square bg-slate-50 overflow-hidden">
                        {m.photoUrl && <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />}
                     </div>
                     <Typography.Caption data-section-key={`editorial-member-${i}`} data-use-native-layout="true" className="text-center" style={{ ...custom, color: custom.color }}>{m.name}</Typography.Caption>
                  </div>
                ))}
             </div>
          </div>
        </div>
        <MinimalFooter edition={edition} pageNumber={pageNumber} style={custom} />
      </div>
    </PageShell>
  );
};

const EmptyPage = ({ edition, pageNumber, title }: PageProps & { title: string }) => (
  <PageShell pageNumber={pageNumber}>
    <div className="flex-1 flex flex-col p-12 w-full h-full bg-white relative z-10">
      <MinimalHeader edition={edition} pageTitle={title} />
      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-50 uppercase text-[10px] font-black tracking-widest text-slate-300">
        Section Undefined
      </div>
      <MinimalFooter edition={edition} pageNumber={pageNumber} />
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

const ModernAcademicMinimalLayout = ({ edition, layoutRef, activePageNumber, onPageSelect }: Props) => {
  let pageCounter = 1;
  const vm = edition.visionMission;

  const poGroups  = splitAtBreaks(vm?.programOutcomes || [], vm?.programOutcomeBreaks);
  const peoGroups = splitAtBreaks(vm?.peos || [], vm?.peoBreaks);
  const psoGroups = splitAtBreaks(vm?.psos || [], vm?.psoBreaks);

  return (
    <div ref={layoutRef} className="flex flex-col gap-24 bg-slate-200 p-24 min-h-screen items-center scroll-smooth font-['Outfit']">
      
      {/* Page Loop with Selectors */}
      {[
        { type: 'Cover', component: <CoverPage edition={edition} pageNumber={pageCounter} /> },
        { type: 'Institution V/M', component: <VisionMissionPage edition={edition} pageNumber={pageCounter + 1} type="institution" /> },
        { type: 'Department V/M', component: <VisionMissionPage edition={edition} pageNumber={pageCounter + 2} type="dept" /> },
      ].map((p, idx) => {
        const pNum = pageCounter++;
        return (
          <div key={p.type} className="relative group" onClick={() => onPageSelect?.(pNum)}>
            <div data-html2canvas-ignore className="absolute -top-10 left-0 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Page {pNum} — {p.type}
            </div>
            {p.component}
          </div>
        );
      })}

      {/* PO / PEO / PSO */}
      {[
        { title: 'Program Outcomes', groups: poGroups, label: 'Outcomes' },
        { title: 'Edu. Objectives', groups: peoGroups, label: 'Objectives' },
        { title: 'Specific Outcomes', groups: psoGroups, label: 'Specifics' },
      ].map(sect => (
        sect.groups.map((g, i) => {
          const pNum = pageCounter++;
          return (
            <div key={`${sect.label}-${i}`} className="relative group" onClick={() => onPageSelect?.(pNum)}>
              <div data-html2canvas-ignore className="absolute -top-10 left-0 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Page {pNum} — {sect.title}
              </div>
              <AcademicIndexPage edition={edition} pageNumber={pNum} title={sect.title} items={g.items} startIndex={g.startIndex} continueNumbering={i > 0 && g.continueNumbering} />
            </div>
          );
        })
      ))}

      {/* Messages */}
      {[
        { label: "Head of Department's Desk", message: edition.hodMessage, type: "HOD Message" },
        { label: "Faculty Advisor's Note", message: edition.facultyMessage, type: "Faculty Advisor" },
        { label: "Student Editor's Perspective", message: edition.studentMessage, type: "Student Editor" },
      ].filter(m => !!(m.message?.message || m.message?.name)).map(m => {
        const pNum = pageCounter++;
        return (
          <div key={m.label} className="relative group" onClick={() => onPageSelect?.(pNum)}>
            <div data-html2canvas-ignore className="absolute -top-10 left-0 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Page {pNum} — {m.type}
            </div>
            <MessagePage edition={edition} pageNumber={pNum} label={m.label} deskMessage={m.message} />
          </div>
        );
      })}

      {/* Articles */}
      {/* Articles */}
      {(edition.articles || []).map(art => {
        const pNum = pageCounter++;
        return (
          <div key={art.id} className="relative group" onClick={() => onPageSelect?.(pNum)}>
            <div data-html2canvas-ignore className="absolute -top-10 left-0 text-[11px] font-black text-slate-400 uppercase tracking-widest">Page {pNum} — {art.title.slice(0, 20)}</div>
            <ArticlePage edition={edition} pageNumber={pNum} article={art} />
          </div>
        );
      })}

      {/* Placements */}
      {/* Placements */}
      {(edition.placements || []).flatMap(site => 
        chunk(site.students || [], 8).map((students, i) => {
          const pNum = pageCounter++;
          return (
            <div key={`${site.id}-${i}`} className="relative group" onClick={() => onPageSelect?.(pNum)}>
              <div data-html2canvas-ignore className="absolute -top-10 left-0 text-[11px] font-black text-slate-400 uppercase tracking-widest">Page {pNum} — {site.companyName}</div>
              <AchievementPage edition={edition} pageNumber={pNum} placement={{ ...site, students }} isContinuation={i > 0} />
            </div>
          );
        })
      )}

      {/* Research */}
      {/* Research */}
      {chunk(edition.publications || [], 4).map((pubs, i) => {
        const pNum = pageCounter++;
        return (
          <div key={`pub-${i}`} className="relative group" onClick={() => onPageSelect?.(pNum)}>
            <div data-html2canvas-ignore className="absolute -top-10 left-0 text-[11px] font-black text-slate-400 uppercase tracking-widest">Page {pNum} — Research Index</div>
            <PublicationPage edition={edition} pageNumber={pNum} publications={pubs} isContinuation={i > 0} />
          </div>
        );
      })}

      {/* Editorial */}
      {/* Editorial */}
      {!!(edition.editorialTeam?.facultyAdvisor?.name || (edition.editorialTeam?.members || []).length > 0) && (() => {
        const pNum = pageCounter++;
        return (
          <div className="relative group" onClick={() => onPageSelect?.(pNum)}>
            <div data-html2canvas-ignore className="absolute -top-10 left-0 text-[11px] font-black text-slate-400 uppercase tracking-widest">Page {pNum} — Editorial Board</div>
            <EditorialPage edition={edition} pageNumber={pNum} />
          </div>
        );
      })()}

    </div>
  );
};

export default withAdvancedDesigner(ModernAcademicMinimalLayout);
