import { notFound, redirect } from "next/navigation";
import React from "react";

import { INavCategory, INavItem } from "@/types/nav";
import { BestMatchProps, IDocData, IDocMetadata, IVersion } from "./types";
import VERSIONS from "./versions";

async function loadDocComponent(
  version: string,
  category: string,
  page: string
): Promise<{
  Layout: React.ComponentType<unknown>;
  metadata: IDocMetadata;
}> {
  try {
    const markdown = await import(`./${version}/${category}/${page}.mdx`);

    if (!markdown || !markdown.default) {
      throw new Error(`Cannot find component for ${category}/${page}`);
    }

    return {
      Layout: markdown.default,
      metadata: markdown.metadata,
    };
  } catch {
    throw new Error(`Cannot find component for ${category}/${page}`);
  }
}

export function getVersion(slug: string): IVersion {
  const version = VERSIONS.find((v) => v.slug === slug);
  if (!version) {
    notFound();
  }
  return version;
}

export function getVersionsNavigation(): INavItem[] {
  return VERSIONS.map((version) => ({
    key: version.slug,
    title: version.title,
  }));
}

export function getVersionDocsNavigation(version: IVersion): INavCategory[] {
  return version.categories.map((category) => ({
    key: category.slug,
    title: category.title,
    pages: category.pages.map((page) => ({
      key: `${category.slug}-${page.slug}`,
      title: page.title,
      path: `/docs/${version.slug}/${category.slug}/${page.slug}`,
    })),
  }));
}

export async function getDocsData(
  versionSlug: string,
  categorySlug: string,
  pageSlug: string
): Promise<IDocData> {
  const version = VERSIONS.find((v) => v.slug === versionSlug);

  if (!version) {
    throw new Error(`Cannot find version with slug ${versionSlug}`);
  }

  const category = version.categories.find((c) => c.slug === categorySlug);
  if (!category) {
    throw new Error(`Cannot find category with slug ${categorySlug}`);
  }

  const page = category.pages.find((p) => p.slug === pageSlug);

  if (!page) {
    throw new Error(`Cannot find page with slug ${pageSlug}`);
  }

  const { Layout, metadata } = await loadDocComponent(
    versionSlug,
    categorySlug,
    pageSlug
  );

  return {
    page,
    category,
    Layout,
    metadata,
  };
}

export function getBestMatchPath(match: BestMatchProps) {
  let version = match.version
    ? VERSIONS.find((v) => v.slug === match.version)
    : null;

  if (!version) {
    version = VERSIONS[0];
  }

  let category = match.category
    ? version.categories.find((c) => c.slug === match.category)
    : null;

  if (!category) {
    category = version.categories[0];
  }

  let page = match.page
    ? category.pages.find((p) => p.slug === match.page)
    : null;

  if (!page) {
    page = category.pages[0];
  }

  return `/docs/${version.slug}/${category.slug}/${page.slug}`;
}

export function redirectToBestMatchPage(match: BestMatchProps) {
  const path = getBestMatchPath(match);
  redirect(path);
}
