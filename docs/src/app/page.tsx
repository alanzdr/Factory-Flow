import React from "react";

import Home from "@/layouts/Home";
import { getMetadata } from "@/utils/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    return getMetadata("page", {
      title: `Create automated workflows`,
      description:
        "Factory Flow is a library designed to streamline the creation of automated robotic workflows. It is designed to be simple to use and to scale to any numbers of workflows.",
      path: `/docs`,
    });
  } catch {
    return {};
  }
}

const Page: React.FC = () => {
  return <Home />;
};

export default Page;
