import urlencode from "urlencode";
import open from "open";
import { BearTemplateError } from "./Error.js";

const BEAR_CREATE_NOTE = "bear://x-callback-url/create?";

export class BearNote {
  private _text: string | undefined;
  private _newWindow: string | undefined;

  constructor() {}

  set text(text: string | undefined) {
    if (!text) throw new BearTemplateError(`No template content was given.`);
    else this._text = `text=${urlencode(text)}`;
  }

  set newWindow(newWindow: string | undefined) {
    if (!!newWindow) this._newWindow = `&new_window=true`;
  }

  open(): void {
    if (this._text) {
      open(`${BEAR_CREATE_NOTE}${this._text}${this._newWindow}`);
    } else {
      throw new BearTemplateError(`No template content was given.`);
    }
  }
}
