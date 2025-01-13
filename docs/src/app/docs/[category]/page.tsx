import { loadDoc } from "@/docs";

const Page = async ({ params }: { params: Promise<{ category: string }> }) => {
  const { category } = await params;

  const DocLayout = await loadDoc(category);

  return <DocLayout />;
};

export default Page;
