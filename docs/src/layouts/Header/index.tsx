import React from "react";

import Link from "next/link";
import ThemeToggle from "./ThemeButton";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ReactComponent as Logo } from "@/assets/logo.svg";

const Header: React.FC = () => {
  return (
    <header className="sticky z-50 top-0 left-0 w-full h-16 border-b border-border bg-background/95 backdrop-blur shadow-card supports-[backdrop-filter]:bg-background/60">
      <div className="pl-2 pr-4 flex h-full items-center gap-4 md:gap-12">
        <Button asChild variant="ghost" size={"sm"}>
          <Link
            aria-label="Home"
            href="/"
            className="inline-flex items-center gap-2"
          >
            <Logo width={40} height={29} className="!w-6 !h-auto" />
            <p className="uppercase ">Factory Flow</p>
          </Link>
        </Button>
        <div className="ml-auto flex items-center text-foreground gap-1">
          <ThemeToggle
            light="Light"
            system="System"
            dark="Dark"
            label="Theme"
          />
          <Button asChild variant="ghost" size="icon">
            <Link
              href="https://github.com/alanzdr/Factory-Flow"
              target="_blank"
            >
              <Github />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
