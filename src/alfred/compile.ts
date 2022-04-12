import alfy from "alfy";
import { CompiledTemplate } from "../core/CompiledTemplate.js";

const {
  template: templatePath,
  variables,
  answer,
  script: scriptPath,
} = process.env;

if (!templatePath) {
  alfy.error(`There is no path to the chosen template given!`);
} else {
  const template = new CompiledTemplate(templatePath);
  template.variables = variables;
  template.answer = answer;
  await template.executeScript(scriptPath);

  const out = await template.compile();
  console.log(out);
}
