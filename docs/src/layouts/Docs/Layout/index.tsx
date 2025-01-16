import { AppSidebar } from "@/layouts/Docs/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getDocsNavigation } from "@/data/docs";

import React from "react";

const DocsLayout: React.FC<React.PropsWithChildren> = async ({ children }) => {
  const categoriesNav = getDocsNavigation();

  return (
    <SidebarProvider>
      <AppSidebar nav={categoriesNav} versions={["1", "2", "3"]} />
      {children}
    </SidebarProvider>
  );
};

export default DocsLayout;
