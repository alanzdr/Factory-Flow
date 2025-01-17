"use client";

import * as React from "react";

// import { SearchForm } from "@/layouts/Docs/SearchForm";
import VersionSwitcher from "@/layouts/Docs/VersionSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { INavCategory, INavItem } from "@/types/nav";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props extends React.ComponentProps<typeof Sidebar> {
  currentLanguage: string;
  languages: INavItem[];
  nav: INavCategory[];
}

export function AppSidebar({
  languages,
  currentLanguage,
  nav,
  ...props
}: Props) {
  const pathName = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          languages={languages}
          currentLanguage={currentLanguage}
        />
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent>
        {nav.map((navCategory) => (
          <SidebarGroup key={navCategory.key}>
            <SidebarGroupLabel>{navCategory.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navCategory.pages.map((navPage) => (
                  <SidebarMenuItem key={navPage.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={navPage.path === pathName}
                    >
                      <Link href={navPage.path}>{navPage.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
