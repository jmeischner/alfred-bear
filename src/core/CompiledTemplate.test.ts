import { CompiledTemplate } from "./CompiledTemplate";

describe("executeScript", () => {
  afterEach(() => {
    jest.resetModules();
  });

  test("should return an empty object when no scriptPath is given", async () => {
    const template = new CompiledTemplate("");
    await template.executeScript();
    expect(template.data).toEqual({});
  });

  test("should set script data to the object returned from script", async () => {
    const template = new CompiledTemplate("");
    // 📝 path needs to exist otherwise jest throws an error
    jest.mock("./BearNote.ts", () => () => ({
      scriptData: "my-dynamic-data",
    }));
    await template.executeScript("./BearNote.ts");
    expect(template.data).toEqual({ scriptData: "my-dynamic-data" });
  });

  test("should get the answer and variables data as input", async () => {
    const template = new CompiledTemplate("");
    template.variables = '{"var": { "a": "y" }}';
    template.answer = "es";
    // 📝 path needs to exist otherwise jest throws an error
    jest.mock("./BearNote.ts", () => (data: any) => ({
      scriptData: data.a + data.answer,
    }));
    await template.executeScript("./BearNote.ts");
    expect(template.data).toEqual({
      a: "y",
      answer: "es",
      scriptData: "yes",
    });
  });
});
