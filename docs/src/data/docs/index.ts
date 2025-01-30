import { notFound, redirect } from "next/navigation";
import React from "react";

import { INavCategory, INavItem } from "@/types/nav";
import { BestMatchProps, IDocData, IDocMetadata, ILanguage } from "./types";
import LANGUAGES from "./languages";

async function loadDocComponent(
  language: string,
  category: string,
  page: string
): Promise<{
  Layout: React.ComponentType<unknown>;
  metadata: IDocMetadata;
}> {
  try {
    const markdown = await import(`./${language}/${category}/${page}.mdx`);

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

export function getLanguage(slug: string): ILanguage {
  const version = LANGUAGES.find((v) => v.slug === slug);
  if (!version) {
    notFound();
  }
  return version;
}

export function getLanguages(): ILanguage[] {
  return LANGUAGES;
}

export function getLanguagesNavigation(): INavItem[] {
  return LANGUAGES.map((version) => ({
    key: version.slug,
    title: version.title,
  }));
}

export function getLanguageDocsNavigation(version: ILanguage): INavCategory[] {
  return version.categories.map((category) => ({
    key: category.slug,
    title: category.title,
    pages: category.pages.map((page) => ({
      key: `${category.slug}-${page.slug}`,
      title: page.title,
      path:
        page.fullPath || `/docs/${version.slug}/${category.slug}/${page.slug}`,
    })),
  }));
}

export async function getMainDocData(name: string) {
  try {
    const markdown = await import(`./main/${name}.mdx`);

    if (!markdown || !markdown.default) {
      throw new Error(`Cannot find component for ${name}`);
    }

    return {
      Layout: markdown.default,
      metadata: markdown.metadata,
    };
  } catch {
    throw new Error(`Cannot find component for ${name}`);
  }
}

export async function getDocsData(
  languageSlug: string,
  categorySlug: string,
  pageSlug: string
): Promise<IDocData> {
  const language = LANGUAGES.find((v) => v.slug === languageSlug);

  if (!language) {
    throw new Error(`Cannot find version with slug ${languageSlug}`);
  }

  const category = language.categories.find((c) => c.slug === categorySlug);
  if (!category) {
    throw new Error(`Cannot find category with slug ${categorySlug}`);
  }

  const page = category.pages.find((p) => p.slug === pageSlug);

  if (!page) {
    throw new Error(`Cannot find page with slug ${pageSlug}`);
  }

  const { Layout, metadata } = await loadDocComponent(
    languageSlug,
    categorySlug,
    pageSlug
  );

  return {
    language,
    page,
    category,
    Layout,
    metadata,
  };
}

export function getBestMatchPath(match: BestMatchProps) {
  let language = match.language
    ? LANGUAGES.find((v) => v.slug === match.language)
    : null;

  if (!language) {
    language = LANGUAGES[0];
  }

  if (!match.category && !match.page) {
    return `/docs/${language.slug}`;
  }

  let category = match.category
    ? language.categories.find((c) => c.slug === match.category)
    : null;

  if (!category) {
    category = language.categories[0];
  }

  let page = match.page
    ? category.pages.find((p) => p.slug === match.page)
    : null;

  if (!page) {
    page = category.pages[0];
  }

  if (page.fullPath) {
    return page.fullPath;
  }

  return `/docs/${language.slug}/${category.slug}/${page.slug}`;
}

export function redirectToBestMatchPage(match: BestMatchProps) {
  const path = getBestMatchPath(match);
  console.log(path);
  redirect(path);
}
