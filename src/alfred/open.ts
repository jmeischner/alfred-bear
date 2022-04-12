import { BearNote } from "../core/BearNote.js";

const note = new BearNote();
note.newWindow = process.env.newWindow;
note.text = process.env.template;

note.open();
