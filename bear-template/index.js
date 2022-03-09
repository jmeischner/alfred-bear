import alfy from "alfy";
import fs from "fs";
import path from "path";
import yaml from "yaml";

function resolveHome(filepath) {
  if (filepath[0] === "~") {
    return path.join(process.env.HOME, filepath.slice(1));
  }
  return filepath;
}

function checkIfIndexExists(pathToIndex, success) {
  const indexPath = resolveHome(pathToIndex);

  fs.stat(indexPath, (err, stats) => {
    if (err) {
      alfy.error(
        `Cannot read your bearTemplateIndex (index.yml) file at ${indexPath}`
      );
    } else {
      success(indexPath);
    }
  });
}

function getIndex(pathToIndex) {
  const indexFile = fs.readFileSync(pathToIndex, "utf8");
  return yaml.parse(indexFile);
}

function createSubtitle(element) {
  const newWindowSubtitle = element.newWindow ? "Opens new Window" : "";
  const questionSubtitle = element.question ? "Asks Question TEST" : "";

  if (newWindowSubtitle && questionSubtitle) {
    return `${newWindowSubtitle} and ${questionSubtitle}`;
  } else {
    return `${newWindowSubtitle}${questionSubtitle}`;
  }
}

function getTemplates(indexPath) {
  const templateDir = path.dirname(indexPath);
  const index = getIndex(indexPath);

  return index.templates.map((element) => {
    const filepath = path.join(templateDir, element.file);
    const newWindow = element.newWindow ? "yes" : "no";
    const script = element.script ? path.join(templateDir, element.script) : "";
    const variables = element.var ? JSON.stringify(element.var) : '""';
    const question = element.question ? element.question : "";

    const subtitle = createSubtitle(element);

    return {
      title: element.title,
      subtitle: subtitle,
      arg: `${filepath}^${script}^${newWindow}^${variables}^${question}`,
    };
  });
}

const pathToIndex = process.env.bearTemplateIndex;
checkIfIndexExists(pathToIndex, (pathToIndex) => {
  const templates = getTemplates(pathToIndex);
  const items = alfy.inputMatches(templates, "title");
  alfy.output(items);
});
