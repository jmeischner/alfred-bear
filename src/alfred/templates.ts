import alfy from "alfy";
import path from "path";
import { Workflow } from "../core/Workflow.js";
import { AlfredTemplate } from "./AlfredTemplate.js";

if (!process.env.bearTemplateIndex) {
  alfy.error(`'pathToIndex' is not set in the workflow variables.`);
} else {
  try {
    const workflow = new Workflow(process.env.bearTemplateIndex);
    await workflow.init();
    const templateDir = path.dirname(process.env.bearTemplateIndex);
    const templates = workflow.mapTemplates((template) => {
      return new AlfredTemplate(template, templateDir);
    });
    if (templates) {
      const items = alfy.inputMatches(templates, "title");
      alfy.output(items);
    } else {
      alfy.error(`No Templates found`);
    }
  } catch (e: any) {
    alfy.error(e);
  }
}
