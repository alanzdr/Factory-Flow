import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

import React from "react";
import { INavPage } from "@/types/nav";
import Link from "next/link";

interface Props extends React.PropsWithChildren {
  title: string;
  description?: string;
  parent?: INavPage;
}

const DocsWrapper: React.FC<Props> = ({
  title,
  description,
  parent,
  children,
}) => {
  return (
    <SidebarInset>
      <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {parent && (
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href={parent.path}>{parent.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div id="docs" className="flex flex-col gap-4 py-10 container-small">
        <div className="pb-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        <Separator />
        {children}
      </div>
    </SidebarInset>
  );
};

export default DocsWrapper;
