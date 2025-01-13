import { notFound } from "next/navigation";
import React from "react";

export async function loadDoc(
  category: string,
  url = "index"
): Promise<React.ComponentType<unknown>> {
  try {
    const Component = (await import(`./${category}/${url}.mdx`))
      .default as React.ComponentType<unknown>;

    if (!Component) {
      throw new Error(`Cannot find component for ${category}/${url}`);
    }

    return Component;
  } catch {
    notFound();
  }
}
