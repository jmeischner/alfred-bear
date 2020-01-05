const alfy = require("alfy");
const fs = require("fs");
const path = require("path");
const yaml = require("yaml");

function resolveHome(filepath) {
  if (filepath[0] === "~") {
    return path.join(process.env.HOME, filepath.slice(1));
  }
  return filepath;
}

function getIndex(pathToIndex) {
  const indexFile = fs.readFileSync(pathToIndex, "utf8");
  return yaml.parse(indexFile);
}

function createSubtitle(element) {
  const newWindowSubtitle = element.newWindow ? "Opens new Window" : "";
  const questionSubtitle = element.question ? "Asks Question" : "";

  if (newWindowSubtitle && questionSubtitle) {
    return `${newWindowSubtitle} and ${questionSubtitle}`;
  } else {
    return `${newWindowSubtitle}${questionSubtitle}`;
  }
}

function getTemplates(pathToIndex) {
  const indexPath = resolveHome(pathToIndex);
  const templateDir = path.dirname(indexPath);
  const index = getIndex(indexPath);

  return index.templates.map(element => {
    const filepath = path.join(templateDir, element.file);
    const newWindow = element.newWindow ? "yes" : "no";
    const script = element.script ? path.join(templateDir, element.script) : "";
    const variables = element.var ? JSON.stringify(element.var) : '""';
    const question = element.question ? element.question : "";

    const subtitle = createSubtitle(element);

    return {
      title: element.title,
      subtitle: subtitle,
      arg: `${filepath}^${script}^${newWindow}^${variables}^${question}`
    };
  });
}

const pathToIndex = process.env.bearTemplateIndex;
const templates = getTemplates(pathToIndex);
const items = alfy.inputMatches(templates, "title");
alfy.output(items);
