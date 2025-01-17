export interface INavItem {
  key: string;
  title: string;
}

export interface INavPage extends INavItem {
  path: string;
}

export interface INavCategory extends INavItem {
  pages: INavPage[];
}
