import path from "path";
import { createInterface } from "readline/promises";
import { brotli, files, hash, nwd, sysInfo } from "./commands/index.js";
import { getDirFromPath, isPathToFile, parseInput } from "./helpers.js";
import { MESSAGES } from "./messages.js";

export class App {
  constructor(startDir) {
    this._currentPath = startDir;
  }

  _resolvePath(p) {
    return path.resolve(this._currentPath, p);
  }

  async up() {
    const pathToUpperDir = this._resolvePath("..");
    this._currentPath = await nwd.cd(pathToUpperDir);
  }

  async cd([rawPathToDir]) {
    const pathToDir = this._resolvePath(rawPathToDir);
    this._currentPath = await nwd.cd(pathToDir);
  }

  async ls() {
    await nwd.ls(this._currentPath);
  }

  async cat([catPathToFile]) {
    const pathToFile = this._resolvePath(catPathToFile);
    await files.cat(pathToFile);
  }

  async add([addNewFileName]) {
    const newFileName = this._resolvePath(addNewFileName);
    await files.add(newFileName);
  }

  async rn([rnPathToFile, rnNewPathToFile]) {
    const pathToFile = this._resolvePath(rnPathToFile);
    const dir = getDirFromPath(pathToFile);
    const newPathToFile = path.resolve(dir, rnNewPathToFile);
    await files.rn(pathToFile, newPathToFile);
  }

  async cp([cpPathToOldFile, cpPathToNewFile]) {
    const pathToOldFile = this._resolvePath(cpPathToOldFile);
    const pathToNewFile = this._resolvePath(cpPathToNewFile);
    await files.cp(pathToOldFile, pathToNewFile);
  }

  async mv([mvPathToOldFile, mvPathToNewFile]) {
    const pathToOldFile = this._resolvePath(mvPathToOldFile);
    const pathToNewFile = this._resolvePath(mvPathToNewFile);
    await files.mv(pathToOldFile, pathToNewFile);
  }

  async rm([rmPathtoFile]) {
    const pathToFile = this._resolvePath(rmPathtoFile);
    await files.rm(pathToFile);
  }

  os([osArgs]) {
    sysInfo(osArgs);
  }

  async hash([hashPathToFile]) {
    const pathToFile = this._resolvePath(hashPathToFile);
    await hash(pathToFile);
  }

  async compress([cpsPathToSrc, cpsPathToDest]) {
    const pathToSrc = this._resolvePath(cpsPathToSrc);
    const pathToDest = this._resolvePath(cpsPathToDest);
    await brotli.compress(pathToSrc, pathToDest);
  }

  async decompress([dcpsPathToSrc, dcpsPathToDest]) {
    const pathToSrc = this._resolvePath(dcpsPathToSrc);
    const pathToDest = this._resolvePath(dcpsPathToDest);
    await brotli.decompress(pathToSrc, pathToDest);
  }

  [".exit"]() {
    process.exit();
  }

  validate(command, args) {
    switch (command) {
      case "up":
      case "ls":
      case ".exit":
        return true;

      case "cd":
      case "cat":
      case "rm":
      case "os":
      case "hash":
      case "cat":
        if (args[0]) {
          return true;
        }

      case "mv":
      case "cp":
      case "compress":
      case "decompress":
        if (args[0] && args[1]) {
          return true;
        }

      case "add":
        if (args[0] && isPathToFile(args[0])) {
          return true;
        }

      case "rn":
        if (args[0] && args[1] && isPathToFile(args[1])) {
          return true;
        }

      default:
        return false;
    }
  }

  async start() {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    while (true) {
      const input = await rl.question(
        `You are currently in ${this._currentPath}\n`
      );
      const [command, ...args] = parseInput(input);
      if (this.validate(command, args)) {
        try {
          await this[command](args);
          console.log(MESSAGES.operationSuccessful);
          rm;
        } catch (err) {
          // console.log(err);
          console.log(MESSAGES.operationFailed);
        }
      } else {
        console.log(MESSAGES.invalidInput);
      }
    }
  }
}
