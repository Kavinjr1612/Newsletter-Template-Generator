import React, { createContext, useContext } from 'react';
import { FloatingElement, ContentBlock, Edition, BackgroundElement, BackgroundType } from '@/types/newspaper';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DesignEngineState {
  mode: string;
  activePageNumber: number | undefined;
  selectedElementId: string | null;
  selectedBlockId: string | null;
  pageSettings: Edition['pageSettings'];
  edition: Edition;
}

export interface DesignEngineActions {
  onPageSelect: (pageNum: number) => void;
  onElementSelect: (id: string | null) => void;
  onBlockSelect: (id: string | null) => void;
  onAddFloating: (pageNum: number, type: 'image' | 'shape') => void;
  onUpdateFloating: (pageNum: number, elementId: string, updates: Partial<FloatingElement>) => void;
  onRemoveFloating: (pageNum: number, elementId: string) => void;
  onInitContentBlocks: (pageNum: number, blocks: ContentBlock[]) => void;
  onUpdateContentBlock: (pageNum: number, blockId: string, updates: Partial<ContentBlock>) => void;
  onResetContentBlocks: (pageNum: number) => void;
  onAddBackground: (pageNum: number | 'global', type: BackgroundType, presetElements?: BackgroundElement[]) => void;
  onUpdateBackground: (pageNum: number | 'global', elementId: string, updates: Partial<BackgroundElement>) => void;
  onRemoveBackground: (pageNum: number | 'global', elementId: string) => void;
  onSetBackgrounds: (pageNum: number | 'global', elements: BackgroundElement[]) => void;
}

export type DesignEngineCtxValue = DesignEngineState & DesignEngineActions;

// ─── Context default (no-op when outside provider) ───────────────────────────

const DEFAULT_CTX: DesignEngineCtxValue = {
  mode: 'academic',
  activePageNumber: undefined,
  selectedElementId: null,
  selectedBlockId: null,
  pageSettings: {},
  edition: {} as Edition,
  onPageSelect: () => {},
  onElementSelect: () => {},
  onBlockSelect: () => {},
  onAddFloating: () => {},
  onUpdateFloating: () => {},
  onRemoveFloating: () => {},
  onInitContentBlocks: () => {},
  onUpdateContentBlock: () => {},
  onResetContentBlocks: () => {},
  onAddBackground: () => {},
  onUpdateBackground: () => {},
  onRemoveBackground: () => {},
  onSetBackgrounds: () => {},
};

const DesignEngineCtx = createContext<DesignEngineCtxValue>(DEFAULT_CTX);

export const useDesignEngine = (): DesignEngineCtxValue => useContext(DesignEngineCtx);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface DesignEngineProviderProps extends DesignEngineActions {
  children: React.ReactNode;
  mode: string;
  pageSettings: Edition['pageSettings'];
  activePageNumber: number | undefined;
  selectedElementId: string | null;
  selectedBlockId: string | null;
  edition: Edition;
}

export const DesignEngineProvider = (props: DesignEngineProviderProps) => {
  const value: DesignEngineCtxValue = {
    mode: props.mode,
    pageSettings: props.pageSettings,
    activePageNumber: props.activePageNumber,
    selectedElementId: props.selectedElementId,
    selectedBlockId: props.selectedBlockId,
    edition: props.edition,
    onPageSelect: props.onPageSelect,
    onElementSelect: props.onElementSelect,
    onBlockSelect: props.onBlockSelect,
    onAddFloating: props.onAddFloating,
    onUpdateFloating: props.onUpdateFloating,
    onRemoveFloating: props.onRemoveFloating,
    onInitContentBlocks: props.onInitContentBlocks,
    onUpdateContentBlock: props.onUpdateContentBlock,
    onResetContentBlocks: props.onResetContentBlocks,
    onAddBackground: props.onAddBackground,
    onUpdateBackground: props.onUpdateBackground,
    onRemoveBackground: props.onRemoveBackground,
    onSetBackgrounds: props.onSetBackgrounds,
  };

  return (
    <DesignEngineCtx.Provider value={value}>
      {props.children}
    </DesignEngineCtx.Provider>
  );
};
