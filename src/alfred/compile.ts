import { CompiledTemplate } from "../core/CompiledTemplate.js";

try {
  const {
    template: templatePath,
    variables,
    answer,
    script: scriptPath,
  } = process.env;

  if (!templatePath) {
    console.log("::There is no path to the template given::");
  } else {
    const template = new CompiledTemplate(templatePath);
    template.variables = variables;
    template.answer = answer;
    await template.executeScript(scriptPath);

    const out = await template.compile();
    console.log(out);
  }
} catch (e: any) {
  console.log(`${e}`);
}
