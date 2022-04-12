import { resolveHomePath } from "./utils";

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
});
