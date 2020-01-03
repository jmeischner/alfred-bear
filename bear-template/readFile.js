const fs = require('fs');
const Handlebars = require('handlebars')
const _ = require('lodash');
// const alfy = require('alfy');

const templatePath = process.env.template;
const fileContent = fs.readFileSync(templatePath, 'utf8');
const template = Handlebars.compile(fileContent);

const scriptPath = process.env.script;
const scriptData = scriptPath ? require(scriptPath) : {};

const variables = JSON.parse(process.env.variables);
const answer = process.env.answer ? {question: process.env.answer} : '';

let data = variables.var ? _.merge(scriptData, variables.var) : scriptData;
data = answer ? _.merge(data, answer) : data;

console.log(template(data));