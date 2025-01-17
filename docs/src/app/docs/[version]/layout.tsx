import DocsWrapper from "@/layouts/Docs/Layout";

import { getVersionsNavigation, getVersion } from "@/data/docs";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ version: string }>;
}>) {
  const { version: slug } = await params;

  const version = getVersion(slug);
  const versionsNavigations = getVersionsNavigation();

  return (
    <DocsWrapper version={version} versionsNavigations={versionsNavigations}>
      {children}
    </DocsWrapper>
  );
}
