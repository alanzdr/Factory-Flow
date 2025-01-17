export interface IDocMetadata {
  title: string;
  description: string;
}

export interface IDocData {
  language: ILanguage;
  page: IDocPage;
  category: IDocCategory;
  Layout: React.ComponentType<unknown>;
  metadata: IDocMetadata;
}

export interface IDocPage {
  title: string;
  slug: string;
  fullPath?: string;
}

export interface IDocCategory {
  title: string;
  slug: string;
  pages: IDocPage[];
}

export interface ILanguage {
  slug: string;
  title: string;
  categories: IDocCategory[];
}

export interface BestMatchProps {
  language?: string;
  category?: string;
  page?: string;
}
