import { IDocCategory } from "../types";

const CATEGORIES: IDocCategory[] = [
  {
    title: "Getting Started",
    slug: "getting-started",
    pages: [
      {
        title: "Introduction",
        slug: "introduction",
      },
      {
        title: "Principles",
        slug: "principles",
      },
      {
        title: "Usage",
        slug: "usage",
      },
      {
        title: "Flow Features",
        slug: "flow-features",
      },
    ],
  },
  {
    title: "Configuration",
    slug: "configuration",
    pages: [
      {
        title: "Robots settings",
        slug: "robots-settings",
      },
      {
        title: "Robot Name",
        slug: "robot-name",
      },
      {
        title: "Log Level",
        slug: "log-level",
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
      {
        title: "Dom",
        slug: "dom",
      },
    ],
  },
];

export default CATEGORIES;
