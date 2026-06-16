/* eslint-disable */
import { CurrentTempStatsStrategy } from './current-temp-stats.strategy';

describe('CurrentTempStatsStrategy', () => {
  it('should calculate min, max and average temperature', () => {
    const strategy = new CurrentTempStatsStrategy();

    const input = {
      current_temperature: [20, 25, 30],
    } as any;

    const output = {} as any;

    strategy.process(input, output);

    expect(output.min_temperature).toBe(20);
    expect(output.max_temperature).toBe(30);
    expect(output.avg_temperature).toBe(25);
  });
});
