import { resolveHomePath, checkIfTemplateIndexExists } from "./utils";
import fs, { Stats } from "fs";
import { BearTemplateError } from "./Error";

describe("The utils package", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test("should resolveHomePath via env.HOME when path starts with a ~", () => {
    process.env.HOME = "/my-home";
    const homepath = resolveHomePath("~/test");
    expect(homepath).toBe("/my-home/test");
  });

  test("should resolveHomePath without env.HOME when path does not start with a ~", () => {
    process.env.HOME = "/my-home";
    const homepath = resolveHomePath("/test/project");
    expect(homepath).toBe("/test/project");
  });

  test("should returned resolved path if there is an index file at given position", async () => {
    process.env.HOME = "/my-home";
    jest.spyOn(fs, "stat").mockImplementationOnce((_path, callback) => {
      const stats = new Stats();
      stats.isFile = jest.fn().mockReturnValue(true);
      // @ts-ignore
      callback(null, stats);
    });
    const homepath = await checkIfTemplateIndexExists("~/test");
    expect(homepath).toBe("/my-home/test");
  });

  test("should throw an error if file is not at given path", async () => {
    process.env.HOME = "/my-home";
    jest.spyOn(fs, "stat").mockImplementationOnce((_path, callback) => {
      // @ts-ignore
      callback(true, null);
    });
    expect(checkIfTemplateIndexExists("~/test")).rejects.toEqual(
      new BearTemplateError(
        "Cannot read your bearTemplateIndex (index.yml) file at /my-home/test"
      )
    );
  });

  test("should throw an error if path exists but is not a file", async () => {
    process.env.HOME = "/my-home";
    jest.spyOn(fs, "stat").mockImplementationOnce((_path, callback) => {
      const stats = new Stats();
      stats.isFile = jest.fn().mockReturnValue(false);
      // @ts-ignore
      callback(null, stats);
    });
    expect(checkIfTemplateIndexExists("~/test")).rejects.toEqual(
      new BearTemplateError(
        "Cannot read your bearTemplateIndex (index.yml) file at /my-home/test"
      )
    );
  });
});
