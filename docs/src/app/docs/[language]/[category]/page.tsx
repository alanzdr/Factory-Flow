import { redirectToBestMatchPage } from "@/data/docs";

const Page = async ({
  params,
}: {
  params: Promise<{ language: string; category: string }>;
}) => {
  const { language, category } = await params;
  redirectToBestMatchPage({
    language,
    category,
  });
};

export default Page;
