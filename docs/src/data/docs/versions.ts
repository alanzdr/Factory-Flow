import { IVersion } from "./types";

import javascriptCategories from "./js";
import pythonCategories from "./python";
import rustCategories from "./rust";

const VERSIONS: IVersion[] = [
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

export default VERSIONS;
