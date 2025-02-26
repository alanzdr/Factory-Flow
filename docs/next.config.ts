import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { all } from "lowlight";
import withSvgr from "next-plugin-svgr";
import withPlugins from "next-compose-plugins";

const nextConfig: NextConfig = {
  cleanDistDir: true,
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ["md", "mdx", "tsx", "ts", "jsx", "js"],
  env: {
    siteUrl: process.env.SITE_URL || "http://localhost:3000",
    buildTime: new Date().toISOString(),
  },

  /* config options here */
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      remarkGfm,
      remarkFrontmatter,
      [remarkMdxFrontmatter, { name: "metadata" }],
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
      [rehypeHighlight, { detect: true, languages: all }],
    ],
  },
});

const configsPluggins = [
  [
    withSvgr,
    {
      fileLoader: true,
      svgrOptions: {
        titleProp: true,
        icon: true,
      },
    },
  ],
  [withMDX, {}],
];

export default withPlugins(configsPluggins, nextConfig);
