import { Metadata } from "next";

import { getDocsData } from "@/data/docs";
import DocsCategories from "@/data/docs/categories";
import DocsWrapper from "@/layouts/Docs/Wrapper";
import { getMetadata } from "@/utils/seo";

export async function generateStaticParams() {
  return DocsCategories.flatMap((category) => {
    return category.pages.map((page) => {
      return { category: category.slug, slug: page.slug };
    });
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const doc = await getDocsData(category, slug);

  return getMetadata("docs", {
    title: `${doc.category.title}: ${doc.metadata.title}`,
    description: doc.metadata.description,
    path: `/docs/${doc.category.slug}/${doc.page.slug}`,
  });
}

const Page = async ({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) => {
  const { category, slug } = await params;
  const doc = await getDocsData(category, slug);

  return (
    <DocsWrapper
      title={doc.metadata.title}
      description={doc.metadata.description}
      parent={{
        key: doc.category.slug,
        title: doc.category.title,
        path: `/docs/${doc.category.slug}`,
      }}
    >
      <doc.Layout />
    </DocsWrapper>
  );
};

export default Page;
