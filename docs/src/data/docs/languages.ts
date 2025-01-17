import { ILanguage } from "./types";

import javascriptCategories from "./js";
import pythonCategories from "./python";
import rustCategories from "./rust";

const LANGUAGES: ILanguage[] = [
  {
    title: "Javascript",
    slug: "js",
    categories: javascriptCategories,
  },
  {
    title: "Python",
    slug: "python",
    categories: pythonCategories,
  },
  {
    title: "RUST",
    slug: "rust",
    categories: rustCategories,
  },
];

export default LANGUAGES;
