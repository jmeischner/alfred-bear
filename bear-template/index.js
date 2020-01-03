const alfy = require("alfy");
const fs = require("fs");
const path = require("path");
const yaml = require("yaml");

// Todo: use alfred-notifier to show updates

function resolveHome(filepath) {
  if (filepath[0] === "~") {
    return path.join(process.env.HOME, filepath.slice(1));
  }
  return filepath;
}

let templates = alfy.cache.get("templates");

if (!(templates && templates.length > 0)) {
  const indexPath = resolveHome(process.env.bearTemplateIndex);
  const templateDir = path.dirname(indexPath);
  const indexFile = fs.readFileSync(indexPath, "utf8");
  const index = yaml.parse(indexFile);
  templates = index.templates.map(element => {
    const filepath = path.join(templateDir, element.file);
    const newWindow = element.newWindow ? "yes" : "no";
    const script = element.script ? path.join(templateDir, element.script) : "";
    const variables = element.var ? JSON.stringify(element.var) : '""';
    const question = element.question ? element.question : "";
    return {
      title: element.title,
      arg: `${filepath}^${script}^${newWindow}^${variables}^${question}`
    };
  });

  alfy.cache.set("templates", templates, 7000);
}

items = alfy.inputMatches(templates, "title");

alfy.output(items);
