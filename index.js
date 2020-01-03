const alfy = require('alfy');
const fs = require('fs');
const path = require('path');

// Todo: use alfred-notifier

function resolveHome(filepath) {
    if (filepath[0] === '~') {
        return path.join(process.env.HOME, filepath.slice(1));
    }
    return filepath;
}

const templateDir = resolveHome(process.env.bearTemplateDirectory);
let templates = fs.readdirSync(templateDir);

items = alfy
    .inputMatches(templates)
    .map(element => ({
        title: path.basename(element, path.extname(element)),
        arg: path.join(templateDir, element)
    }));

alfy.output(items);