import { BearNote } from "./BearNote";
import { BearTemplateError } from "./Error";
import open from "open";

jest.mock("open");

describe("The BearNote", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  test("can handle the case to open the bear note in a new window", () => {
    const note = new BearNote();
    note.text = "test";
    note.newWindow = "true";
    note.open();
    expect(open).toHaveBeenCalledWith(
      "bear://x-callback-url/create?text=test&new_window=true"
    );
  });

  test("can handle special characters in text", () => {
    const note = new BearNote();
    note.text = "(/ö\\)";
    note.open();
    expect(open).toHaveBeenCalledWith(
      "bear://x-callback-url/create?text=(%2F%C3%B6%5C)"
    );
  });

  test("when no newWindow information was given, it is not appended", () => {
    const note = new BearNote();
    note.text = "test";
    note.open();
    expect(open).toHaveBeenCalledWith(
      expect.not.stringContaining("new_window")
    );
  });

  test("should throw an error when no text is provided", () => {
    const note = new BearNote();
    expect(() => {
      note.text = undefined;
    }).toThrow(BearTemplateError);
  });
});
