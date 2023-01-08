import { createReadStream, createWriteStream } from "fs";
import fs from "fs/promises";
import { pipeline } from "stream/promises";
import { checkThatExist, checkThatNotExist } from "../helpers.js";
import { MESSAGES } from "../messages.js";

const copyFile = async (pathToOldFile, pathToNewFile) => {
  await checkThatExist(pathToOldFile);
  await checkThatNotExist(pathToNewFile);
  const readable = createReadStream(pathToOldFile);
  const writable = createWriteStream(pathToNewFile);
  await pipeline(readable, writable);
};

const removeFile = async (pathToFile) => {
  await fs.rm(pathToFile);
};

export const cat = async (pathToFile) => {
  await checkThatExist(pathToFile);
  const readable = createReadStream(pathToFile, "utf-8");
  readable.pipe(process.stdout);
  await new Promise((resolve, reject) => {
    readable.on("end", () => resolve());
    readable.on("error", () => reject());
  });
};

export const add = async (newFileName) => {
  await fs.writeFile(newFileName, "", { flag: "wx" });
  console.log(MESSAGES.operationSuccessful);
};

export const rn = async (pathToFile, newPathToFile) => {
  await checkThatNotExist(newPathToFile);
  await fs.rename(pathToFile, newPathToFile);
  console.log(MESSAGES.operationSuccessful);
};

export const cp = async (pathToOldFile, pathToNewFile) => {
  await copyFile(pathToOldFile, pathToNewFile);
  console.log(MESSAGES.operationSuccessful);
};

export const rm = async (pathToFile) => {
  await removeFile(pathToFile);
  console.log(MESSAGES.operationSuccessful);
};

export const mv = async (pathToOldFile, pathToNewFile) => {
  await copyFile(pathToOldFile, pathToNewFile);
  await removeFile(pathToOldFile);
  console.log(MESSAGES.operationSuccessful);
};
