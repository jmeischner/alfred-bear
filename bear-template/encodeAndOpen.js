const urlencode = require('urlencode');
const open = require('open');

const BEAR_CREATE_NOTE = "bear://x-callback-url/create?"
const template = urlencode(process.env.template);

const text = `text=${template}`
const new_window = `&new_window=yes`

open(`${BEAR_CREATE_NOTE}${text}${new_window}`);