export interface SlugGateway {
  generate(value: string): Promise<string>;
}
