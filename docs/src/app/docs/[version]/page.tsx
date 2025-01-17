import { redirectToBestMatchPage } from "@/data/docs";

const Page = async ({ params }: { params: Promise<{ version: string }> }) => {
  const { version } = await params;
  await redirectToBestMatchPage({
    version,
  });
};

export default Page;
