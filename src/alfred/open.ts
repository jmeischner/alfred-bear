import alfy from "alfy";
import { BearNote } from "../core/BearNote.js";

try {
  const note = new BearNote();
  note.newWindow = process.env.newWindow;
  note.text = process.env.template;

  note.open();
} catch (e: any) {
  alfy.log(`${e}`);
}
