import { loadDoc } from "@/data/docs";

const Page = async ({ params }: { params: Promise<{ category: string }> }) => {
  // const { category } = await params;

  // const DocLayout = await loadDoc(category);

  // return <DocLayout />;
  return false;
};

export default Page;
