export interface INavPage {
  key: string;
  title: string;
  path: string;
}

export interface INavCategory {
  key: string;
  title: string;
  pages: INavPage[];
}
