import { AppSidebar } from "@/layouts/Docs/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getLanguageDocsNavigation } from "@/data/docs";

import React from "react";
import { ILanguage } from "@/data/docs/types";
import { INavItem } from "@/types/nav";

interface Props {
  languageNavigations: INavItem[];
  language: ILanguage;
}

const DocsLayout: React.FC<React.PropsWithChildren<Props>> = async ({
  children,
  language,
  languageNavigations,
}) => {
  const categoriesNav = getLanguageDocsNavigation(language);

  return (
    <SidebarProvider>
      <AppSidebar
        nav={categoriesNav}
        languages={languageNavigations}
        currentLanguage={language.slug}
      />
      {children}
    </SidebarProvider>
  );
};

export default DocsLayout;
