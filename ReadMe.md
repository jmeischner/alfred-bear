# Alfred Bear Workflow [![Tests](https://github.com/jmeischner/alfred-bear/actions/workflows/tests.yml/badge.svg)](https://github.com/jmeischner/alfred-bear/actions/workflows/tests.yml)

This workflow should help to use templates in combination with the [bear](https://bear.app) app.

## Installation

```bash
npm install --global alfred-bear
```

## Usage

While creating note templates with static content can be useful, having the possibility to use dynamic placeholder from any source I want is really great.
That's why I built this workflow.

To get an idea how this should work, take a look at an example: the [Jira Ticket](https://github.com/jmeischner/alfred-bear-jira-ticket)

The idea is that there is a _index.yml_ which contains a list of your templates and some optional variables to configure the template behavior.

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

  - title: "Jira Ticket"
    ...
```

#### title

The title is shown in the template list to choose from.
![Alfred Template Title](https://github.com/jmeischner/alfred-bear/blob/master/img/title.png?raw=true)

#### file

Path to the template markdown file.
This file can contain 2 different styles of placeholder.

1. Normal Alfred [Dynamic Placeholder](https://www.alfredapp.com/help/workflows/advanced/placeholders/)
2. Placeholders with double curly braces `{{myPlaceholder}}` which follow the [Handlebars](https://handlebarsjs.com/guide/) syntax. These Placeholders could come from the `script`, `var` or `question` option.

First the _handlebars_ placeholders are replaced in the template and in the second step the dynamic placeholders from _alfred_.

#### script [optional]

Path to a _node.js_ module file. This module has to export an [optional async] function which returns an object, whose properties are placeholder keys.

To use other npm modules in this script, the script has to be a _node module_ by itself.
This means that templates can easily be shared as npm packages or repositories.

```js
// script.js
const rp = require("request-promise");

/**
 * [Async] function which gets the static variables
 * from the var option and the answer from
 * the optional question.
 */
async function greet(variables) {
  const data = await rp(variables.myRestApiEndpoint);
  return {
    myText: data.body,
  };
}

module.exports = greet;
```

#### newWindow [optional]

Should the new note opened in a separate window?

#### var [optional]

List of static placeholders for the template (e.g. APIToken, BaseUrl for REST Call etc.)

#### question [optional]

Sets a question to the workflow which asks for an additional placeholder value. To use the answer of this question in the template or script the placeholder key is `{{answer}}`.
![Alfred Template Question](https://github.com/jmeischner/alfred-bear/blob/master/img/question.png?raw=true)

### The Template Directory

There is a bear template directoy [default: *~/.bear-templates*] -- which can be synced e.g. with a .dotfiles repository, Dropbox, etc.
This directory should contain a template index [default: *index.yml*] and all the necessary files for your templates.

These paths are handled by the `bearTemplateIndex` workflow variable which can be changed in the workflow settings.

A possible template directory can have the following form

```plaintext
- ~/.bear-templates
'-- index.yml
'-- weekly-review
  '-- template.md
  '-- script.js
'-- jira-ticket
  '-- ticket.md
  '-- ticket.js
  '-- package.json
  '-- node_modules
'-- diary.md
' ...
```

## Examples

If someone built a nice basis for a template, feel free to add it to this list and make a PR.

- [Jira Ticket](https://github.com/jmeischner/alfred-bear-jira-ticket)
- [Daily Log](https://github.com/jmeischner/alfred-bear-daily-log)
- [Create OKRs](https://github.com/jmeischner/alfred-bear-okrs)
