declare module "*.mdx" {
  import React from "react";
  // import { IDocMetadata } from "@/data/docs/types";

  let MDXContent: () => React.ComponentType<unknown>;
  export default MDXContent;
  export const metadata: unknown;
}
