import { create } from 'zustand'

interface GeneratedContent {
  type: string;
  content: string;
  isGenerating?: boolean;
  isEditing?: boolean;
}

interface ContentStore {
  generatedContents: GeneratedContent[];
  selectedArticle: any | null;
  setGeneratedContents: (contents: GeneratedContent[] | ((prev: GeneratedContent[]) => GeneratedContent[])) => void;
  setSelectedArticle: (article: any | null | ((prev: any | null) => any | null)) => void;
  clearStore: () => void;
}

export const useContentStore = create<ContentStore>((set) => ({
  generatedContents: [],
  selectedArticle: null,
  setGeneratedContents: (contents) => set((state) => ({
    generatedContents: typeof contents === 'function' ? contents(state.generatedContents) : contents
  })),
  setSelectedArticle: (article) => set((state) => ({
    selectedArticle: typeof article === 'function' ? article(state.selectedArticle) : article
  })),
  clearStore: () => set({ generatedContents: [], selectedArticle: null }),
}))
