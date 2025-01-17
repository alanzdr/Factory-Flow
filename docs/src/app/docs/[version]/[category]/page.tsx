import { redirectToBestMatchPage } from "@/data/docs";

const Page = async ({
  params,
}: {
  params: Promise<{ version: string; category: string }>;
}) => {
  const { version, category } = await params;
  redirectToBestMatchPage({
    version,
    category,
  });
};

export default Page;
