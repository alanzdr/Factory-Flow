import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const HomeHero: React.FC = () => {
  return (
    <section
      className="py-20 min-h-svh container flex items-center justify-center"
      style={{
        minHeight: "calc(100svh - 4rem)",
      }}
    >
      <div
        style={{
          maxWidth: 800,
        }}
        className="flex flex-col items-center text-center gap-8"
      >
        <h1 className="text-6xl md:text-7xl">
          Easily creation of
          <br />
          <span className="text-primary">Automated Workflows</span>
        </h1>
        <p style={{ maxWidth: 600 }} className="text-lg text-pretty">
          Factory Flow is a library designed to streamline the creation of
          automated robotic workflows. It is designed to be simple to use and to
          scale to any numbers of workflows.
        </p>
        <div className="flex items-center gap-5">
          <Button asChild>
            <Link href="/docs/js">Get Started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link
              href="https://github.com/alanzdr/Factory-Flow"
              target="_blank"
            >
              <Github />
              Github
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
