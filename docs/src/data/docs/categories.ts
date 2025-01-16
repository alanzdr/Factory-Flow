import { IDocCategory } from "./types";

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
  {
    title: "Flow Features",
    slug: "flow-features",
    pages: [
      {
        title: "Conditional",
        slug: "conditional",
      },
      {
        title: "Do-while loop",
        slug: "do-while-loop",
      },
      {
        title: "Try-Catch",
        slug: "try-catch",
      },
      {
        title: "Stop",
        slug: "stop",
      },
    ],
  },
];

export default CATEGORIES;
