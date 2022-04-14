import path from "path";
import { stat } from "fs";
import { BearTemplateError } from "./Error.js";

export function resolveHomePath(filepath: string) {
  if (filepath[0] === "~" && process.env.HOME) {
    return path.join(process.env.HOME, filepath.slice(1));
  }
  return filepath;
}

export async function checkIfTemplateIndexExists(
  pathToIndex: string
): Promise<string> {
  const indexPath = resolveHomePath(pathToIndex);

  return new Promise((resolve, _reject) => {
    stat(indexPath, (err, stats) => {
      if (err || !stats.isFile())
        throw new BearTemplateError(
          `Cannot read your bearTemplateIndex (index.yml) file at ${indexPath}`
        );
      return resolve(indexPath);
    });
  });
}
