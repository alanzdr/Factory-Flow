import React from "react";

import Link from "next/link";
import ThemeToggle from "./ThemeButton";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="fixed z-50 top-0 left-0 w-full h-16 border-b border-border bg-background/95 backdrop-blur shadow-card supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-full items-center gap-4 md:gap-12">
        <Link aria-label="Home" href="/" className="hover:text-foreground/75">
          <p>Factory</p>
        </Link>
        <div className="ml-auto flex items-center text-foreground gap-1">
          <ThemeToggle
            light="Light"
            system="System"
            dark="Dark"
            label="Theme"
          />
          <Button asChild variant="ghost" size="icon">
            <Link href="/login">
              <Github />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
