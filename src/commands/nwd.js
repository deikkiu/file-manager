import fs from "fs/promises";
import { checkIsNotFile } from "../helpers.js";

export const cd = async (pathToDir) => {
  await checkIsNotFile(pathToDir);
  return pathToDir;
};

export const ls = async (currentPath) => {
  const dirList = await fs.readdir(currentPath, { withFileTypes: true });
  const sortedDirList = dirList
    .sort((a, b) => a.isFile() - b.isFile())
    .filter((item) => !item.isSymbolicLink());
  const result = sortedDirList.map((el) => ({
    Name: el.name,
    Type: el.isFile() ? "file" : "directory",
  }));
  console.table(result);
};
