import path from "path";
import { Template } from "../core/BearTemplateIndex.js";

export class AlfredTemplate {
  title: string;
  subtitle: string;
  arg: string;

  private createSubtitle(
    newWindow: boolean | undefined,
    question: boolean | undefined
  ) {
    const newWindowSubtitle = newWindow ? "Opens new Window" : "";
    const questionSubtitle = question ? "Asks Question" : "";

    if (newWindowSubtitle && questionSubtitle) {
      return `${newWindowSubtitle} and ${questionSubtitle}`;
    } else {
      return `${newWindowSubtitle}${questionSubtitle}`;
    }
  }

  constructor(template: Template, templateDir: string) {
    const filepath = path.join(templateDir, template.file);
    const newWindow = template.newWindow ? "yes" : "no";
    const script = template.script
      ? path.join(templateDir, template.script)
      : "";
    const variables = template.var ? JSON.stringify(template.var) : '""';
    const question = template.question ? template.question : "";

    const subtitle = this.createSubtitle(
      template.newWindow,
      !!template.question
    );

    this.title = template.title;
    this.subtitle = subtitle;
    this.arg = `${filepath}^${script}^${newWindow}^${variables}^${question}`;
  }
}
