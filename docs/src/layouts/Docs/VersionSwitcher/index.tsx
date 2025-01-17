"use client";

import * as React from "react";
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { INavItem } from "@/types/nav";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { redirectToBestMatchAction } from "@/data/docs/action";

interface Props {
  currentVersion: string;
  versions: INavItem[];
}

const VersionSwitcher: React.FC<Props> = ({ currentVersion, versions }) => {
  const selectedVersion = useMemo(
    () => versions.find((version) => version.key === currentVersion),
    [currentVersion, versions]
  );

  const pathName = usePathname();

  const onChangeVersion = useCallback(
    async (version: string) => {
      console.log(pathName.split("/").slice(2));

      const [_version, _category, _slug] = pathName.split("/").slice(2);
      if (_version === version) return;

      await redirectToBestMatchAction({
        category: _category,
        page: _slug,
        version,
      });
    },
    [pathName]
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Documentation</span>
                <span className="">{selectedVersion?.title}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {versions.map((version) => (
              <DropdownMenuItem
                key={version.key}
                onSelect={() => {
                  void onChangeVersion(version.key);
                }}
              >
                {version.title}{" "}
                {version.key === selectedVersion?.key && (
                  <Check className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default VersionSwitcher;
