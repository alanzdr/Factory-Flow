import { Metadata } from "next";

import { getDocsData, redirectToBestMatchPage } from "@/data/docs";
import DocsCategories from "@/data/docs/js";
import DocsWrapper from "@/layouts/Docs/Wrapper";
import { getMetadata } from "@/utils/seo";

interface Params {
  version: string;
  category: string;
  slug: string;
}

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
  params: Promise<Params>;
}): Promise<Metadata> {
  try {
    const { category, slug, version } = await params;
    const doc = await getDocsData(version, category, slug);

    return getMetadata("docs", {
      title: `${doc.category.title}: ${doc.metadata.title}`,
      description: doc.metadata.description,
      path: `/docs/${doc.category.slug}/${doc.page.slug}`,
    });
  } catch {
    return {};
  }
}

const Page = async ({ params }: { params: Promise<Params> }) => {
  const { category, version, slug } = await params;
  try {
    const doc = await getDocsData(version, category, slug);

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
  } catch {
    redirectToBestMatchPage({
      version,
      category,
      page: slug,
    });
  }
};

export default Page;
