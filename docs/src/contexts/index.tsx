"use client";

import React from "react";

import dynamic from "next/dynamic";

const ThemeProvider = dynamic(() => import("./ThemeProvider"), {
  ssr: false,
});

const Contexts: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default Contexts;
