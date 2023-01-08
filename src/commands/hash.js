import { createHash } from "crypto";
import { createReadStream } from "fs";

export const hash = async (pathToFile) => {
  const hash = createHash("sha256");
  const readable = createReadStream(pathToFile);
  readable.pipe(hash);
  const end = new Promise((resolve, reject) => {
    readable.on("end", () => resolve());
    readable.on("error", () => reject());
  });
  await end;
  console.log(`Hash of ${pathToFile} is: ${hash.digest("hex")}`);
};
