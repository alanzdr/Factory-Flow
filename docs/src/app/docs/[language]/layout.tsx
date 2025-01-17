import DocsWrapper from "@/layouts/Docs/Layout";

import { getLanguagesNavigation, getLanguage } from "@/data/docs";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}>) {
  const { language: slug } = await params;

  const language = getLanguage(slug);
  const languageNavigations = getLanguagesNavigation();

  return (
    <DocsWrapper language={language} languageNavigations={languageNavigations}>
      {children}
    </DocsWrapper>
  );
}
