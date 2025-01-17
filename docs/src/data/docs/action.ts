"use server";

import { BestMatchProps } from "./types";

import { redirectToBestMatchPage } from "./";

export async function redirectToBestMatchAction(match: BestMatchProps) {
  console.log("redirect", match);

  redirectToBestMatchPage(match);
}
