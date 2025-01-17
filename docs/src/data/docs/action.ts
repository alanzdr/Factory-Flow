"use server";

import { BestMatchProps } from "./types";

import { redirectToBestMatchPage } from "./";
import { cookies } from "next/headers";

export async function redirectToBestMatchAction(match: BestMatchProps) {
  if (match.language) {
    const userCookies = await cookies();
    console.log("set", match.language);
    userCookies.set("SELECTED_LANGUAGE", match.language);
  }

  redirectToBestMatchPage(match);
}
