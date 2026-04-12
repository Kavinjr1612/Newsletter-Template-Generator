import { Edition } from '@/types/newspaper';

import AcademicInstitutionalLayout from './AcademicInstitutionalLayout';
import ModernNexusLayout from './ModernNexusLayout';
import ModernAcademicMinimalLayout from './ModernAcademicMinimalLayout';
import EditorialMagazineLayout from './EditorialMagazineLayout';

interface Props {
  edition: Edition;
  layoutRef?: React.RefObject<HTMLDivElement>;
  activePageNumber?: number;
  onPageSelect?: (pageNumber: number) => void;
}

const TemplateRenderer = ({ edition, layoutRef, activePageNumber, onPageSelect }: Props) => {
  switch (edition.templateStyle) {
    case 'modern-nexus':
      return (
        <ModernNexusLayout 
          edition={edition} 
          layoutRef={layoutRef} 
          activePageNumber={activePageNumber}
          onPageSelect={onPageSelect}
        />
      );
    case 'modern-academic-minimal':
      return (
        <ModernAcademicMinimalLayout 
          edition={edition} 
          layoutRef={layoutRef} 
          activePageNumber={activePageNumber}
          onPageSelect={onPageSelect}
        />
      );
    case 'editorial-magazine':
      return (
        <EditorialMagazineLayout 
          edition={edition} 
          layoutRef={layoutRef} 
          activePageNumber={activePageNumber}
          onPageSelect={onPageSelect}
        />
      );
    case 'academic':
    case 'academic-institutional':
      return (
        <AcademicInstitutionalLayout 
          edition={edition} 
          layoutRef={layoutRef} 
          activePageNumber={activePageNumber}
          onPageSelect={onPageSelect}
        />
      );
    default:
      return null;
  }
};

export default TemplateRenderer;
