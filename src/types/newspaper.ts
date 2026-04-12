export type ArticlePriority = 'headline' | 'feature' | 'brief';
export type ArticleCategory = 'academics' | 'research' | 'achievements' | 'campus-life';
export type PersonRole = 'student' | 'faculty';
export type PhotoCategory = 'events' | 'campus' | 'projects';
export type ColumnLayout = '1-col' | '2-col' | '3-col' | 'mixed';
export type ThemePreset = 'classic' | 'modern' | 'elegant' | 'vintage';

export interface Article {
  id: string;
  title: string;
  author: string;
  category: ArticleCategory;
  body: string;
  imageUrl?: string;
  sourceUrl?: string;
  priority: ArticlePriority;
  isUrgent?: boolean;
  createdAt: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Person {
  id: string;
  name: string;
  role: PersonRole;
  photoUrl?: string;
  bio: string;
  achievements: string;
  createdAt: string;
}

export interface Alumni {
  id: string;
  name: string;
  graduationYear: number;
  currentRole: string;
  careerJourney: string;
  photoUrl?: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  category: PhotoCategory;
  createdAt: string;
}

export interface FunContent {
  id: string;
  type: 'quiz' | 'poll' | 'fact';
  question: string;
  options?: string[];
  answer?: string;
  createdAt: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface SectionLayout {
  id: string;
  sectionType: string;
  columnLayout: ColumnLayout;
  order: number;
  visible: boolean;
}

export type LayoutDensity = 'compact' | 'comfortable' | 'spacious' | 'magazine';
export type FontSizeScale = 'small' | 'medium' | 'large';
export type SectionSpacing = 'tight' | 'normal' | 'wide';
export type ImageStyle = 'none' | 'rounded' | 'shadow' | 'framed';
export type MastheadStyle = 'classic' | 'minimal' | 'banner';
export type ColumnGap = 'narrow' | 'normal' | 'wide';

export interface EditionTheme {
  preset: ThemePreset;
  primaryColor: string;
  backgroundColor: string;
  headingColor: string;
  headlineFont: string;
  bodyFont: string;
  showTicker: boolean;
  showDropCaps: boolean;
  showColumnDividers: boolean;
  layoutDensity: LayoutDensity;
  fontSizeScale: FontSizeScale;
  sectionSpacing: SectionSpacing;
  imageStyle: ImageStyle;
  mastheadStyle: MastheadStyle;
  columnGap: ColumnGap;
  letterSpacing?: string;
  wordSpacing?: string;
}

// Page break control
export interface PageBreak {
  afterIndex: number;
  continueNumbering: boolean;
}

// GAZETICA-specific types
export interface VisionMission {
  institutionVision: string;
  institutionMission: string;
  deptVision: string;
  deptMission: string;
  programOutcomes: string[];
  peos: string[];
  psos: string[];
  programOutcomeBreaks?: PageBreak[];
  peoBreaks?: PageBreak[];
  psoBreaks?: PageBreak[];
  institutionImageUrl?: string;
  deptImageUrl?: string;
  programOutcomeImageUrls?: Record<number, string>;
  peoImageUrls?: Record<number, string>;
  psoImageUrls?: Record<number, string>;
}



export interface DeskMessage {
  name: string;
  title: string;
  photoUrl: string;
  message: string;
}

export interface PlacementStudent {
  name: string;
  photoUrl: string;
}

export interface Placement {
  id: string;
  companyName: string;
  lpa: string;
  companyLogoUrl: string;
  students: PlacementStudent[];
}

export interface Publication {
  id: string;
  dept: string;
  paperDetails: string;
  claimingAuthor: string;
  indexing: string;
}

export interface EditorialMember {
  name: string;
  photoUrl: string;
}

export interface EditorialTeam {
  facultyAdvisor: { name: string; title: string; photoUrl: string };
  members: EditorialMember[];
}

export interface SectionStyle {
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  letterSpacing?: string;
  wordSpacing?: string;
  color?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

export type TemplateStyle = 'academic' | 'academic-institutional' | 'modern-nexus' | 'modern-academic-minimal' | 'editorial-magazine';
export type CustomizationMode = 'academic' | 'advanced';

export interface FloatingElement {
  id: string;
  type: 'image' | 'shape';
  content: string; // URL for image, svg for shape
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage
  height: number; // percentage
  rotation: number;
  zIndex: number;
  positionMode: 'inline' | 'floating-front' | 'floating-back';
  wrapMode: 'none' | 'square' | 'tight' | 'left' | 'right' | 'break';
}

export type BackgroundType = 'none' | 'diagonal' | 'blob' | 'rectangle' | 'circle' | 'line' | 'polygon' | 'wave' | 'lines' | 'decorative';

export interface BackgroundElement {
  id: string;
  type: BackgroundType;
  color: string;
  opacity: number;       // 0-100
  x: number;             // % from handle
  y: number;             // % from handle
  size: number;          // multiplier (e.g. 1-200)
  rotation: number;      // degrees
  zIndex: number;        // typically 0-5
  variant?: string;      // e.g. 'solid', 'ring', 'dashed', 'gradient'
  borderWidth?: number;  // px
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  pathData?: string;     // For SVG shapes (waves, polygons)
}

// A draggable/resizable section of the template (in Advanced canvas mode)
export interface ContentBlock {
  id: string;             // e.g. 'header', 'body', 'footer', 'image-1'
  sectionKey: string;     // stable key to identify which template slot this is
  x: number;              // % from left of page
  y: number;              // % from top of page
  width: number;          // % of page width
  height: number;         // % of page height
  rotation: number;
  zIndex: number;
}

export interface PageSettings {
  lockContent: boolean;
  allowOverflow: boolean;
  pageBreak: boolean;
  floatingElements?: FloatingElement[];
  contentBlocks?: ContentBlock[];   // Canva-style movable template sections
  backgroundElements?: BackgroundElement[];
}


export interface Edition {
  id: string;
  departmentName: string;
  editionNumber: number;
  date: string;
  name: string;
  tagline: string;
  collegeName: string;
  collegeLogoUrl?: string;
  logoUrl?: string;
  buildingPhotoUrl?: string;
  collegeLocation?: string;
  templateStyle: 'academic' | 'academic-institutional' | 'modern-nexus' | 'modern-academic-minimal' | 'editorial-magazine';
  theme: EditionTheme;
  
  // Customization
  mode: CustomizationMode;
  showPageNumbers: boolean;
  sectionStyles: Record<string, SectionStyle>;
  pageStyles: Record<number, SectionStyle>;
  pageSettings: Record<number, PageSettings>;
  backgroundElements?: BackgroundElement[];
  globalBackgroundElements?: BackgroundElement[];

  events: Event[];
  people: Person[];
  alumni: Alumni[];
  photos: Photo[];
  funContent: FunContent[];
  articles: Article[];
  customSections: CustomSection[];
  sectionLayouts: SectionLayout[];

  // Content sections
  visionMission?: VisionMission;
  hodMessage?: DeskMessage;
  facultyMessage?: DeskMessage;
  studentMessage?: DeskMessage;
  placements?: Placement[];
  publications?: Publication[];
  editorialTeam?: EditorialTeam;

  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_THEME: EditionTheme = {
  preset: 'modern',
  primaryColor: '235 65% 30%',
  backgroundColor: '0 0% 100%',
  headingColor: '235 65% 30%',
  headlineFont: 'Merriweather',
  bodyFont: 'Open Sans',
  showTicker: true,
  showDropCaps: true,
  showColumnDividers: true,
  layoutDensity: 'spacious',
  fontSizeScale: 'medium',
  sectionSpacing: 'normal',
  imageStyle: 'none',
  mastheadStyle: 'classic',
  columnGap: 'normal',
  letterSpacing: 'normal',
  wordSpacing: 'normal'
};

export const DEFAULT_SECTION_LAYOUTS: SectionLayout[] = [
  { id: '1', sectionType: 'articles', columnLayout: '3-col', order: 0, visible: true },
  { id: '2', sectionType: 'events', columnLayout: '2-col', order: 1, visible: true },
  { id: '3', sectionType: 'people', columnLayout: '3-col', order: 2, visible: true },
  { id: '4', sectionType: 'alumni', columnLayout: '2-col', order: 3, visible: true },
  { id: '5', sectionType: 'photos', columnLayout: '3-col', order: 4, visible: true },
  { id: '6', sectionType: 'fun', columnLayout: '2-col', order: 5, visible: true },
];

export function createEdition(name: string, departmentName: string): Edition {
  return {
    id: crypto.randomUUID(),
    name,
    date: new Date().toISOString().split('T')[0],
    editionNumber: 1,
    departmentName,
    tagline: '',
    collegeName: '',
    collegeLocation: '',
    templateStyle: 'academic-institutional',
    theme: { ...DEFAULT_THEME },
    articles: [],
    events: [],
    people: [],
    alumni: [],
    photos: [],
    funContent: [],
    customSections: [],
    sectionLayouts: [...DEFAULT_SECTION_LAYOUTS],
    placements: [],
    publications: [],
    visionMission: {
      institutionVision: '',
      institutionMission: '',
      deptVision: '',
      deptMission: '',
      programOutcomes: [],
      peos: [],
      psos: [],
    },
    editorialTeam: {
      facultyAdvisor: { name: '', title: '', photoUrl: '' },
      members: [],
    },
    mode: 'academic',
    showPageNumbers: true,
    sectionStyles: {},
    pageStyles: {},
    pageSettings: {},
    backgroundElements: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
