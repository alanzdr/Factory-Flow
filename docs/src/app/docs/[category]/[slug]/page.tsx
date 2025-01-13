import { loadDoc } from "@/docs";

const Page = async ({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) => {
  const { category, slug } = await params;

  const DocLayout = await loadDoc(category, slug);

  return <DocLayout />;
};

export default Page;
