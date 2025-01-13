import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // webpack: function (config) {
  //   config.module.rules.push({ test: /\.mdx$/, use: "raw-loader" });
  //   return config;
  // },
  /* config options here */
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
