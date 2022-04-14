import { TemplateIndex } from "./TemplateIndex";
import fs, { Stats } from "fs";
import { BearTemplateError } from "./Error";

describe("The TemplateIndex", () => {
  test("should return templates from a yaml BearTemplateIndex file", async () => {
    const workflow = new TemplateIndex("/test/path");
    jest.spyOn(fs, "stat").mockImplementationOnce((_path, callback) => {
      const stats = new Stats();
      stats.isFile = jest.fn().mockReturnValue(true);
      // @ts-ignore
      callback(null, stats);
    });
    jest.spyOn(fs, "readFile").mockImplementation(
      // @ts-ignore
      (_path: any, _encoding: string, callback: any) => {
        // @ts-ignore
        callback(
          null,
          ` templates:
  - title: Daily Log
    file: "daily log/Daily Log.md"
    script: "daily log/script.js"
    newWindow: false
    var:
      DATE_FORMAT: "ddd., DD MMM. YYYY"

`
        );
      }
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
    jest.spyOn(fs, "stat").mockImplementationOnce((_path, callback) => {
      const stats = new Stats();
      stats.isFile = jest.fn().mockReturnValue(true);
      // @ts-ignore
      callback(null, stats);
    });
    jest.spyOn(fs, "readFile").mockImplementation(
      // @ts-ignore
      (_path: any, _encoding: string, callback: any) => {
        // @ts-ignore
        callback(
          null,
          ` templates:
  - title: Daily Log
    script: "daily log/script.js"
    newWindow: false
    var:
      DATE_FORMAT: "ddd., DD MMM. YYYY"

`
        );
      }
    );
    expect(workflow.init()).rejects.toEqual(
      new BearTemplateError(
        'At least one of your templates has no "file" property'
      )
    );
  });
});
