const fs = require('fs');
const Handlebars = require('handlebars')
const _ = require('lodash');

const templatePath = process.env.template;
const fileContent = fs.readFileSync(templatePath, 'utf8');
const template = Handlebars.compile(fileContent);

const variables = JSON.parse(process.env.variables);
const answer = process.env.answer ? {answer: process.env.answer} : {};

let data = variables.var ? _.merge(variables.var, answer) : answer;
const scriptPath = process.env.script;
const scriptData = scriptPath ? await require(scriptPath)(data) : {};

data = _.merge(data, scriptData);

console.log(template(data));