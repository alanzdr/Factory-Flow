import DocsWrapper from "@/layouts/Docs/Layout";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DocsWrapper>{children}</DocsWrapper>;
}
