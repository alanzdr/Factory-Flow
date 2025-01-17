import { Metadata } from "next";

import { getLanguages, getMainDocData } from "@/data/docs";
import DocsWrapper from "@/layouts/Docs/Wrapper";
import { getMetadata } from "@/utils/seo";

const INTRODUCTION_FILE = "introduction";

export async function generateStaticParams() {
  const versions = getLanguages();
  return versions.map((version) => ({
    version: version.slug,
  }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getMainDocData(INTRODUCTION_FILE);

  try {
    return getMetadata("docs", {
      title: `${metadata.title}`,
      description: metadata.description,
      path: `/docs`,
    });
  } catch {
    return {};
  }
}

const Page = async () => {
  const { Layout, metadata } = await getMainDocData(INTRODUCTION_FILE);

  return (
    <DocsWrapper title={metadata.title} description={metadata.description}>
      <Layout />
    </DocsWrapper>
  );
};

export default Page;
