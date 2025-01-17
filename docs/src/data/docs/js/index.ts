import { IDocCategory } from "../types";

const CATEGORIES: IDocCategory[] = [
  {
    title: "Getting Started",
    slug: "getting-started",
    pages: [
      {
        title: "Installation",
        slug: "installation",
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
        title: "Robot Customization",
        slug: "robot-customization",
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
    ],
  },
];

export default CATEGORIES;
