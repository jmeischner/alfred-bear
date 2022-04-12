export class BearTemplateError {
  constructor(private text: string) {}

  public toString(): string {
    return `There is an error: ${this.text}`;
  }
}
