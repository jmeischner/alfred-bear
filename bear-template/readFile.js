const fs = require('fs');
const Handlebars = require('handlebars')

const templatePath = process.env.template;
const fileContent = fs.readFileSync(templatePath, 'utf8');
const template = Handlebars.compile(fileContent);

const scriptPath = process.env.script;
const data = scriptPath ? require(scriptPath) : {};

console.log(template(data));