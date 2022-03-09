import urlencode from "urlencode";
import open from "open";

const BEAR_CREATE_NOTE = "bear://x-callback-url/create?";

const template = urlencode(process.env.template);
const text = `text=${template}`;
const new_window = `&new_window=${process.env.newWindow}`;

open(`${BEAR_CREATE_NOTE}${text}${new_window}`);
