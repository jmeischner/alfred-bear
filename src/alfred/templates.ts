import alfy from "alfy";
// @ts-ignore
import alfredNotifier from "alfred-notifier";
import path from "path";
import { TemplateIndex } from "../core/TemplateIndex.js";
import { AlfredTemplate } from "./AlfredTemplate.js";

alfredNotifier();

if (!process.env.bearTemplateIndex) {
  alfy.error(`'pathToIndex' is not set in the workflow variables.`);
} else {
  const workflow = new TemplateIndex(process.env.bearTemplateIndex);
  await workflow.init();
  const templateDir = path.dirname(workflow.indexFile);
  const templates = workflow.mapTemplates((template) => {
    return new AlfredTemplate(template, templateDir);
  });
  if (templates) {
    const items = alfy.inputMatches(templates, "title");
    alfy.output(items);
  } else {
    alfy.error(`No Templates found`);
  }
}
