import CATEGORIES from "@/data/docs/categories";
import { notFound, redirect } from "next/navigation";

const Page = async ({ params }: { params: Promise<{ category: string }> }) => {
  const { category: slug } = await params;

  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  redirect(`/docs/${slug}/${category.pages[0].slug}`);
};

export default Page;
