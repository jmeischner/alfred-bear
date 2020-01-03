const fs = require('fs');

const template = process.env.template;

console.log(fs.readFileSync(template, {
    encoding: 'utf8'
}));