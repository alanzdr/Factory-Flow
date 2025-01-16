"use client";

import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
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
import { INavCategory } from "@/types/nav";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props extends React.ComponentProps<typeof Sidebar> {
  versions: string[];
  nav: INavCategory[];
}

export function AppSidebar({ versions, nav, ...props }: Props) {
  const pathName = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher versions={versions} defaultVersion={versions[0]} />
        <SearchForm />
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
