import { notFound } from "next/navigation";
import React from "react";

import CATEGORIES from "./categories";
import { INavCategory } from "@/types/nav";
import { IDocData, IDocMetadata } from "./types";

async function loadDocComponent(
  category: string,
  page: string
): Promise<{
  Layout: React.ComponentType<unknown>;
  metadata: IDocMetadata;
}> {
  try {
    const markdown = await import(`./${category}/${page}.mdx`);

    if (!markdown || !markdown.default) {
      throw new Error(`Cannot find component for ${category}/${page}`);
    }

    return {
      Layout: markdown.default,
      metadata: markdown.metadata,
    };
  } catch {
    notFound();
  }
}

export function getDocsNavigation(): INavCategory[] {
  return CATEGORIES.map((category) => ({
    key: category.slug,
    title: category.title,
    pages: category.pages.map((page) => ({
      key: `${category.slug}-${page.slug}`,
      title: page.title,
      path: `/docs/${category.slug}/${page.slug}`,
    })),
  }));
}

export async function getDocsData(
  categorySlug: string,
  pageSlug: string
): Promise<IDocData> {
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) {
    throw new Error(`Cannot find category with slug ${categorySlug}`);
  }

  const page = category.pages.find((p) => p.slug === pageSlug);

  if (!page) {
    throw new Error(`Cannot find page with slug ${pageSlug}`);
  }

  const { Layout, metadata } = await loadDocComponent(categorySlug, pageSlug);

  return {
    page,
    category,
    Layout,
    metadata,
  };
}
