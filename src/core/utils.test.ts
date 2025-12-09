import { resolveHomePath, checkIfTemplateIndexExists } from "./utils";
import fs from "fs";
import { BearTemplateError } from "./Error";

describe("The utils package", () => {
  const OLD_ENV = process.env;

  const createFakeStats = (isFile: boolean) => ({
    isFile: jest.fn().mockReturnValue(isFile),
  });

  beforeEach(() => {
    jest.resetModules(); // clears require cache
    jest.restoreAllMocks(); // stellt Originalimplementierungen wieder her
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

  test("should return resolved path if there is an index file at given position", async () => {
    process.env.HOME = "/my-home";

    jest.spyOn(fs, "stat").mockImplementationOnce((_path, callback) => {
      const stats = createFakeStats(true);
      // @ts-ignore – Callback-Typen sind uns hier egal
      callback(null, stats);
    });

    const homepath = await checkIfTemplateIndexExists("~/test");
    expect(homepath).toBe("/my-home/test");
  });

  test("should throw an error if file is not at given path", async () => {
    process.env.HOME = "/my-home";

    jest.spyOn(fs, "stat").mockImplementationOnce((_path, callback) => {
      // @ts-ignore – Error-Objekt ist für den Test egal, Hauptsache truthy
      callback(true, null);
    });

    await expect(checkIfTemplateIndexExists("~/test")).rejects.toEqual(
      new BearTemplateError(
        "Cannot read your bearTemplateIndex (index.yml) file at /my-home/test"
      )
    );
  });

  test("should throw an error if path exists but is not a file", async () => {
    process.env.HOME = "/my-home";

    jest.spyOn(fs, "stat").mockImplementationOnce((_path, callback) => {
      const stats = createFakeStats(false);
      // @ts-ignore
      callback(null, stats);
    });

    await expect(checkIfTemplateIndexExists("~/test")).rejects.toEqual(
      new BearTemplateError(
        "Cannot read your bearTemplateIndex (index.yml) file at /my-home/test"
      )
    );
  });
});
