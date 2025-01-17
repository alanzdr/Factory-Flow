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
  currentLanguage: string;
  languages: INavItem[];
}

const VersionSwitcher: React.FC<Props> = ({ currentLanguage, languages }) => {
  const selectedLanguage = useMemo(
    () => languages.find((lang) => lang.key === currentLanguage),
    [currentLanguage, languages]
  );

  const pathName = usePathname();

  const onChangeVersion = useCallback(
    async (language: string) => {
      console.log(pathName.split("/").slice(2));

      const [_lang, _category, _slug] = pathName.split("/").slice(2);
      if (_lang === language) return;

      await redirectToBestMatchAction({
        category: _category,
        page: _slug,
        language,
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
                <span className="">{selectedLanguage?.title}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.key}
                onSelect={() => {
                  void onChangeVersion(lang.key);
                }}
              >
                {lang.title}{" "}
                {lang.key === selectedLanguage?.key && (
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
