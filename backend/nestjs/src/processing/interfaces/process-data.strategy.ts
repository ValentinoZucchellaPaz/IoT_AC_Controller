export interface ProcessDataStrategy<I, O> {
  readonly name: string;
  process(input: I, output: O);
}
