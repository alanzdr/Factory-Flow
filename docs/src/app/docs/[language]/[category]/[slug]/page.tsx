import { Metadata } from "next";

import { getDocsData, redirectToBestMatchPage } from "@/data/docs";
import { getLanguages } from "@/data/docs";
import DocsWrapper from "@/layouts/Docs/Wrapper";
import { getMetadata } from "@/utils/seo";

interface Params {
  language: string;
  category: string;
  slug: string;
}

export async function generateStaticParams() {
  const versions = getLanguages();
  return versions.flatMap((version) =>
    version.categories.flatMap((category) =>
      category.pages.map((page) => ({
        version: version.slug,
        category: category.slug,
        slug: page.slug,
      }))
    )
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  try {
    const { category, slug, language } = await params;
    const doc = await getDocsData(language, category, slug);

    return getMetadata("docs", {
      title: `${doc.category.title}: ${doc.metadata.title} - ${doc.language.title}`,
      description: doc.metadata.description,
      path: `/docs/${doc.language.slug}/${doc.category.slug}/${doc.page.slug}`,
    });
  } catch {
    return {};
  }
}

const Page = async ({ params }: { params: Promise<Params> }) => {
  const { category, language, slug } = await params;
  try {
    const doc = await getDocsData(language, category, slug);

    return (
      <DocsWrapper
        title={doc.metadata.title}
        description={doc.metadata.description}
        parent={{
          key: doc.category.slug,
          title: doc.category.title,
          path: `/docs/${doc.language.slug}/${doc.category.slug}`,
        }}
      >
        <doc.Layout />
      </DocsWrapper>
    );
  } catch {
    redirectToBestMatchPage({
      language,
      category,
      page: slug,
    });
  }
};

export default Page;
