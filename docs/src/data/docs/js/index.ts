import { IDocCategory } from "../types";

const CATEGORIES: IDocCategory[] = [
  {
    title: "Getting Started",
    slug: "getting-started",
    pages: [
      {
        title: "Introduction",
        slug: "",
        fullPath: "/docs/js",
      },
      {
        title: "Installation",
        slug: "installation",
      },
      {
        title: "Usage",
        slug: "usage",
      },
    ],
  },
  {
    title: "Core",
    slug: "core",
    pages: [
      {
        title: "Factory",
        slug: "factory",
      },
      {
        title: "Robot",
        slug: "robot",
      },
      {
        title: "Flow",
        slug: "flow",
      },
      {
        title: "State",
        slug: "state",
      },
    ],
  },
  {
    title: "Modules",
    slug: "modules",
    pages: [
      {
        title: "Logs",
        slug: "logs",
      },
      {
        title: "Token",
        slug: "token",
      },
      {
        title: "Parallel",
        slug: "parallel",
      },
    ],
  },
];

export default CATEGORIES;
