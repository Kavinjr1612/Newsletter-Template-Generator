import React from 'react';
import { useDesignEngine } from './DesignEngineContext';
import { Edition } from '@/types/newspaper';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getScaleMultiplier = (scale: string | number | undefined): number => {
  if (typeof scale === 'number') return scale;
  if (!scale) return 1.0;
  if (scale === 'small') return 0.85;
  if (scale === 'large') return 1.15;
  const num = parseFloat(scale);
  return isNaN(num) ? 1.0 : num;
};

/**
 * getPageStyle
 * Centralized logic for extracting design tokens for a specific page.
 */
export const getPageStyle = (edition: Edition, pageNum?: number): any => {
  if (!edition) return {};
  
  const global = (edition.sectionStyles as any)?.global || {};
  const pageSpecific = pageNum ? (edition.pageStyles || {})[pageNum] || {} : {};
  const theme = (edition.theme || {}) as any;
  
  // Design Palette uses edition.theme.letterSpacing/wordSpacing when in "Apply To All"
  // or when pageSpecific styles are not set.
  
  const ls = theme.letterSpacing || 'normal';
  const ws = theme.wordSpacing || 'normal';
  const themeFont = theme.headlineFont || theme.bodyFont || '"Inter", sans-serif';
  const scale = getScaleMultiplier(theme.fontSizeScale);
  
  // Prioritize page-specific overrides if they exist
  return { 
    ...global, 
    ...pageSpecific, 
    scale, 
    fontFamily: pageSpecific.fontFamily || global.fontFamily || themeFont,
    letterSpacing: pageSpecific.letterSpacing || global.letterSpacing || ls, 
    wordSpacing: pageSpecific.wordSpacing || global.wordSpacing || ws 
  };
};

// ─── Typography Components ────────────────────────────────────────────────────

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  pageNumber?: number;
  [key: string]: any;
}

const BaseTypography = ({ 
  tag: Tag, 
  children, 
  className = '', 
  style = {}, 
  pageNumber,
  ...props 
}: TypographyProps & { tag: any }) => {
  const { edition } = useDesignEngine();
  
  // Attempt to get style from context if not provided
  // This ensures that even if a layout doesn't pass props correctly, 
  // we still have a "Root Level" fallback.
  const pageStyle = getPageStyle(edition, pageNumber);
  
  const finalStyle: React.CSSProperties = {
    fontFamily: style.fontFamily || pageStyle.fontFamily,
    letterSpacing: style.letterSpacing || pageStyle.letterSpacing,
    wordSpacing: style.wordSpacing || pageStyle.wordSpacing,
    // Add other typography forcing here
    ...style,
  };

  return (
    <Tag className={className} style={finalStyle} {...props}>
      {children}
    </Tag>
  );
};

export const Typography = {
  H1: (props: TypographyProps) => (
    <BaseTypography tag="h1" className={`font-black uppercase tracking-tight ${props.className || ''}`} {...props} />
  ),
  H2: (props: TypographyProps) => (
    <BaseTypography tag="h2" className={`font-black uppercase tracking-tight ${props.className || ''}`} {...props} />
  ),
  H3: (props: TypographyProps) => (
    <BaseTypography tag="h3" className={`font-black uppercase tracking-normal ${props.className || ''}`} {...props} />
  ),
  Title: (props: TypographyProps) => (
    <BaseTypography tag="h1" className={`font-black uppercase tracking-tight ${props.className || ''}`} {...props} />
  ),
  Heading: (props: TypographyProps) => (
    <BaseTypography tag="h2" className={`font-extrabold uppercase tracking-tight ${props.className || ''}`} {...props} />
  ),
  SectionHeading: (props: TypographyProps) => (
    <BaseTypography tag="h2" className={`font-extrabold uppercase tracking-tight border-b-4 border-indigo-600 ${props.className || ''}`} {...props} />
  ),
  Subheading: (props: TypographyProps) => (
    <BaseTypography tag="h3" className={`font-bold uppercase tracking-normal ${props.className || ''}`} {...props} />
  ),
  Label: (props: TypographyProps) => (
    <BaseTypography tag="span" className={`text-[11px] font-black uppercase tracking-wider ${props.className || ''}`} {...props} />
  ),
  Body: (props: TypographyProps) => (
    <BaseTypography tag="p" className={`font-normal leading-relaxed ${props.className || ''}`} {...props} />
  ),
  Caption: (props: TypographyProps) => (
    <BaseTypography tag="span" className={`text-[10px] font-bold uppercase tracking-widest ${props.className || ''}`} {...props} />
  ),
};
