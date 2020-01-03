const alfy = require('alfy');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

// Todo: use alfred-notifier

function resolveHome(filepath) {
    if (filepath[0] === '~') {
        return path.join(process.env.HOME, filepath.slice(1));
    }
    return filepath;
}

const indexPath = resolveHome(process.env.bearTemplateIndex);
const templateDir = path.dirname(indexPath);
const indexFile = fs.readFileSync(indexPath, 'utf8');
const index = yaml.parse(indexFile);

items = alfy
    .inputMatches(index.templates, 'title')
    .map(element => {
        const filepath = path.join(templateDir, element.file);
        const newWindow = element.newWindow ? 'yes' : 'no';
        const script = element.script ? path.join(templateDir, element.script) : '';
        const variables = element.var ? JSON.stringify(element.var) : '""';
        const question = element.question ? element.question : ''
        return {
            title: element.title,
            arg: `${filepath}^${script}^${newWindow}^${variables}^${question}`
        }
    });

alfy.output(items);