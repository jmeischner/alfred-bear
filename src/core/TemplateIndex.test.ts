import { TemplateIndex } from "./TemplateIndex";
import fs from "fs";
import { BearTemplateError } from "./Error";

describe("The TemplateIndex", () => {
  const createFakeStats = (isFile: boolean): fs.Stats =>
    ({
      isFile: jest.fn().mockReturnValue(isFile),
    } as unknown as fs.Stats);

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  const mockStatAsFile = (isFile: boolean) => {
    jest.spyOn(fs, "stat").mockImplementation(
      ((
        path: fs.PathLike | number,
        options: any,
        callback?: any
      ) => {
        const cb = typeof options === "function" ? options : callback;
        cb(null, createFakeStats(isFile));
      }) as unknown as typeof fs.stat
    );
  };

  const mockReadFileWithContent = (content: string) => {
    jest.spyOn(fs, "readFile").mockImplementation(
      ((
        path: fs.PathLike | number,
        options: any,
        callback?: any
      ) => {
        const cb = typeof options === "function" ? options : callback;
        cb(null, content);
      }) as unknown as typeof fs.readFile
    );
  };

  test("should return templates from a yaml BearTemplateIndex file", async () => {
    const workflow = new TemplateIndex("/test/path");

    mockStatAsFile(true);

    mockReadFileWithContent(
      ` templates:
  - title: Daily Log
    file: "daily log/Daily Log.md"
    script: "daily log/script.js"
    newWindow: false
    var:
      DATE_FORMAT: "ddd., DD MMM. YYYY"

`
    );

    await workflow.init();

    expect(workflow.templates).toStrictEqual([
      {
        title: "Daily Log",
        file: "daily log/Daily Log.md",
        script: "daily log/script.js",
        newWindow: false,
        var: {
          DATE_FORMAT: "ddd., DD MMM. YYYY",
        },
      },
    ]);
  });

  test("should throw an error if mandatory `file` property of at least one template is not given", async () => {
    const workflow = new TemplateIndex("/test/path");

    mockStatAsFile(true);

    mockReadFileWithContent(
      ` templates:
  - title: Daily Log
    script: "daily log/script.js"
    newWindow: false
    var:
      DATE_FORMAT: "ddd., DD MMM. YYYY"

`
    );

    await expect(workflow.init()).rejects.toEqual(
      new BearTemplateError(
        'At least one of your templates has no "file" property'
      )
    );
  });
});
