const fs = require('fs');
const Handlebars = require('handlebars')

function getCompiledTemplate(templatePath) {
    const fileContent = fs.readFileSync(templatePath, 'utf8');
    return Handlebars.compile(fileContent);
}

async function getTemplateData(variablesVar, answerVar, script) {
    const variables = JSON.parse(variablesVar);
    const answer = answerVar ? {answer: answerVar} : {};
    let data = variables.var ? {...variables.var, ...answer} : answer;
    
    const scriptData = await script(data)
    data = {...data, ...scriptData};

    return data;
}

const { template: templatePath, variables, answer, script: scriptPath} = process.env;
const script = scriptPath ? require(scriptPath) : () => ({});

const template = getCompiledTemplate(templatePath);
const data = await getTemplateData(variables, answer, script);

console.log(template(data));