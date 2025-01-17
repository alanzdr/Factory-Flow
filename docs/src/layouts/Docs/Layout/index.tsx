import { AppSidebar } from "@/layouts/Docs/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getVersionDocsNavigation } from "@/data/docs";

import React from "react";
import { IVersion } from "@/data/docs/types";
import { INavItem } from "@/types/nav";

interface Props {
  versionsNavigations: INavItem[];
  version: IVersion;
}

const DocsLayout: React.FC<React.PropsWithChildren<Props>> = async ({
  children,
  version,
  versionsNavigations,
}) => {
  const categoriesNav = getVersionDocsNavigation(version);

  return (
    <SidebarProvider>
      <AppSidebar
        nav={categoriesNav}
        versions={versionsNavigations}
        currentVersion={version.slug}
      />
      {children}
    </SidebarProvider>
  );
};

export default DocsLayout;
