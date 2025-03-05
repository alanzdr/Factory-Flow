import path from "node:path";
import fs from "node:fs/promises";

export async function getTempFolderPath(subFolder?: string) {
  const dir = path.join(process.cwd(), "tmp", subFolder || "");

  if (!await verifyPath(dir)) {
    await fs.mkdir(dir);
  }

  return dir;
}

export async function verifyPath(path: string) {
  try {
    await fs.access(path);
    return true;
  }
  catch (error) {
    return false;
  }
}