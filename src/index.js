import os from "os";
import { App } from "./app.js";

const greeting = (username) => {
  console.log(`Welcome to the File manager, ${username}!`);
};

const goodbye = (username) => {
  console.log(`Thank you for using File manager, ${username}, goodbye!`);
};

let username = "user";
const args = process.argv.slice(2);
const lastarg = args[args.length - 1];

if (lastarg && lastarg.includes("--username=")) {
  username = lastarg.replace("--username=", "").trim() || "Some user";
}

greeting(username);
process.on("exit", () => goodbye(username));
const app = new App(os.homedir());
await app.start();
