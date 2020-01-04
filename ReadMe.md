# Alfred Bear Workflow

This workflow should help to use templates in combination with the [bear](https://bear.app) app.

## Installation
```bash
npm install --global alfred-bear
```

## How to
The idea is that there is a bear template directoy [default: *~/.bear-templates*] with an template index [default: *index.yml*] and depending on the complexity of the possible templates either directories per template or simple markdown files.

```plaintext
- ~/.bear-templates
'- index.yml
'- weekly-review
 '- template.md
 '- script.js
'- jira-ticket
' ...
```

### The Index
the `index.yml` has the following form

```yml
templates:
  - title: "Weekly Review"
    file: "weekly-review/template.md"
    script: "weekly-review/script.js"
    newWindow: true
    var:
      myFirstVar: "Hello "
      mySecond: "World!"
    question: "Any Subtitle?"
  - ...
```

#### title
The title is shown in the template list to chose from.
![Alfred Template Title](https://github.com/jmeischner/alfred-bear/blob/master/img/title.png?raw=true)

#### file
Path to the template markdown file.
This file can contain 2 different styles of placeholder.

1. Normal Alfred [Dynamic Placeholder](https://www.alfredapp.com/help/workflows/advanced/placeholders/)
2. Placeholders with double curly braces `{{myPlaceholder}}` which follow the [Handlebars](https://handlebarsjs.com/guide/) syntax. These Placeholders could come from the `script` or `var` option.

#### script [optional]
Path to a *node.js* module file.
This module has to export an object, whose properties are placeholder keys.

```js
// script.js
function greet() {
  return "Hello World"; 
}

module.exports = {
  myPlaceholder: greet()
}
```

These modules can use -- besides standard node.js library -- the following npm modules

- lodash

#### newWindow [optional]
Should the new note opened in a separate window?

#### var [optional]
List of static placeholders for the template (e.g. APIToken)

#### question [optional]
Sets a question to the workflow which asks for an additional placeholder value. To use the answer of this question in the template the placeholder key is `{{question}}`.
![Alfred Template Question](https://github.com/jmeischner/alfred-bear/blob/master/img/question.png?raw=true)