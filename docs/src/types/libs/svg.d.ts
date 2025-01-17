declare module "*.svg" {
  import type { FC, SVGProps } from "react";

  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  const content: string;

  export { ReactComponent };
  export default content;
}

declare module "next-plugin-svgr" {
  const plugin: unknown;
  export default plugin;
}
declare module "next-compose-plugins" {
  import type { NextConfig } from "next";
  const plugin: (plugins: unknown[], config: NextConfig) => unknown;
  export default plugin;
}
