import Handlebars from "handlebars";
import fs from "fs";
import { Template } from "./BearTemplateIndex.js";
import { BearTemplateError } from "./Error.js";

interface TemplateData {
  readonly variables?: Template["var"];
  readonly answer?: string;
}

type Script = (data: TemplateData) => Promise<Record<string, string>>;

export class CompiledTemplate {
  private _variables: TemplateData["variables"];
  private _answer: { answer: TemplateData["answer"] } | undefined;
  private _script: Record<string, string> | undefined;

  constructor(private templatePath: string) {}

  /**
   * Gets the variables in the form
   * ```json
   * {
   *   "var": Record<string,string>
   * }
   * ```
   * */
  set variables(vars: string | undefined) {
    if (vars) this._variables = JSON.parse(vars).var;
  }

  set answer(answer: string | undefined) {
    this._answer = answer ? { answer: answer } : undefined;
  }

  async executeScript(scriptPath?: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const { default: script }: { default: Script } = scriptPath
          ? await import(scriptPath)
          : { default: async () => ({}) };

        const preScriptData = { ...this._variables, ...this._answer };
        this._script = await script(preScriptData);
        resolve();
      } catch (e: any) {
        reject(
          new BearTemplateError(`Could not load script file **${scriptPath}**`)
        );
      }
    });
  }

  async compile(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const data = this.data;
      try {
        const template = this.getCompiledTemplate();
        resolve(template(data));
      } catch (e: any) {
        reject(e);
      }
    });
  }

  get data() {
    return { ...this._script, ...this._variables, ...this._answer };
  }

  private getCompiledTemplate(): HandlebarsTemplateDelegate {
    try {
      const fileContent = fs.readFileSync(this.templatePath, "utf8");
      return Handlebars.compile(fileContent);
    } catch (e: any) {
      throw new BearTemplateError(
        `Template file **${this.templatePath}** could not be found`
      );
    }
  }
}
