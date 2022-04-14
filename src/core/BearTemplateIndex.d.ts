export interface Template {
  readonly title: string;
  readonly file: string;
  readonly script?: string;
  readonly newWindow?: boolean;
  readonly var?: Record<string, string>;
  readonly question?: string;
}

export interface BearTemplateIndex {
  readonly templates: Template[];
}
