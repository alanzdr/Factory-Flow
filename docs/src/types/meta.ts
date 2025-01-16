declare module "data/meta.json" {
  export type IDataType = "page" | "docs";

  export interface IPageMetaData {
    title: string;
    description: string;
  }

  export interface IPageMeta {
    title: string;
    description?: string;
    path: string;
  }

  export interface IMetaAuthor {
    name: string;
    url: string;
  }

  export interface IMeta {
    siteName: string;
    siteDescription: string;
    author: IMetaAuthor;
    themeColor: string;
    generator: Record<IDataType, IPageMetaData>;
  }

  const meta: IMeta;
  export default meta;
}
