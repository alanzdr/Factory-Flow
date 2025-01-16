export interface IDocMetadata {
  title: string;
  description: string;
}

export interface IDocData {
  page: IDocPage;
  category: IDocCategory;
  Layout: React.ComponentType<unknown>;
  metadata: IDocMetadata;
}

export interface IDocPage {
  title: string;
  slug: string;
}

export interface IDocCategory {
  title: string;
  slug: string;
  pages: IDocPage[];
}
