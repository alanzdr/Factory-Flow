import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      id="docs"
      className="grid grid-cols-4 gap-5"
      style={{ width: "90%", maxWidth: "1080" }}
    >
      <nav className="flex flex-col gap-2">
        <Link href="/docs/getting-started" className="hover:text-red-400">
          Getting Started
        </Link>
        <Link
          href="/docs/getting-started/principles"
          className="hover:text-red-400"
        >
          Principles
        </Link>
      </nav>
      <div className="col-span-3 flex flex-col gap-2">{children}</div>
    </main>
  );
}
