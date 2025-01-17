import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const userCookies = await cookies();

  const version = userCookies.get("SELECTED_LANGUAGE")?.value || "js";

  console.log("redirecting to", version);

  redirect(`/docs/${version}`);
};

export default Page;
