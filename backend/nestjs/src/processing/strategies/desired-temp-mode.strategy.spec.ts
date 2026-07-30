/* eslint-disable */
import { DesiredTempModeStrategy } from './desired-temp-mode.strategy';

describe('DesiredTempModeStrategy', () => {
  let strategy: DesiredTempModeStrategy;

  beforeEach(() => {
    strategy = new DesiredTempModeStrategy();
  });

  it('should return the most frequent desired temperature', () => {
    const input = { desired_temperature: [22, 22, 24, 22, 25] } as any;
    const output = {} as any;

    strategy.process(input, output);

    expect(output.desired_temperature).toBe(22);
  });

  it('should return first value when all frequencies are equal (tie)', () => {
    const input = { desired_temperature: [21, 22, 23] } as any;
    const output = {} as any;

    strategy.process(input, output);

    expect(output.desired_temperature).toBe(21);
  });

  it('should handle single sample', () => {
    const input = { desired_temperature: [25] } as any;
    const output = {} as any;

    strategy.process(input, output);

    expect(output.desired_temperature).toBe(25);
  });

  it('should handle two values with different frequencies', () => {
    const input = { desired_temperature: [20, 20, 21] } as any;
    const output = {} as any;

    strategy.process(input, output);

    expect(output.desired_temperature).toBe(20);
  });

  it('should have correct name', () => {
    expect(strategy.name).toBe('desired-temperature-mode');
  });
});
