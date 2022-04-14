import { CompiledTemplate } from "./CompiledTemplate";

describe("executeScript", () => {
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
});
