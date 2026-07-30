import { EfficiencyAnalyzerStrategy } from './efficiency-analyzer.strategy';
import { EfficiencyEnum } from '../../common/enum/efficiency.enum';
import { ProcessedSensorData } from '../../models/entities/processed-sensor.entity';
import { HistoryReadingsDto } from '../../models/dto/history-readings.dto';

function makeSample(
  overrides: Partial<ProcessedSensorData> & { ts_end: Date },
): ProcessedSensorData {
  const s = new ProcessedSensorData();
  s.id = 0;
  s.device_id = 'ESP32_01';
  s.ac_state = true;
  s.desired_temperature = 22;
  s.min_temperature = 20;
  s.max_temperature = 25;
  s.avg_temperature = 23;
  s.current_humidity = 50;
  s.ts_end = overrides.ts_end;
  s.created_at = new Date();
  Object.assign(s, overrides);
  return s;
}

describe('EfficiencyAnalyzerStrategy', () => {
  let strategy: EfficiencyAnalyzerStrategy;

  beforeEach(() => {
    strategy = new EfficiencyAnalyzerStrategy();
  });

  it('should have correct name', () => {
    expect(strategy.name).toBe('efficiency-analyzer');
  });

  it('should return empty periods for empty input', () => {
    const output = new HistoryReadingsDto();
    strategy.process([], output);
    expect(output.period_efficiency).toEqual([]);
  });

  it('should return LOW_EFFICIENCY when ac_state is always off', () => {
    const t0 = new Date('2026-01-01T00:00:00Z');
    const t1 = new Date('2026-01-01T00:05:00Z');
    const samples = [
      makeSample({ ac_state: false, desired_temperature: 22, ts_end: t0 }),
      makeSample({ ac_state: false, desired_temperature: 22, ts_end: t1 }),
    ];

    const output = new HistoryReadingsDto();
    strategy.process(samples, output);

    expect(output.period_efficiency).toHaveLength(1);
    expect(output.period_efficiency[0].efficiency).toBe(
      EfficiencyEnum.LOW_EFFICIENCY,
    );
  });

  it('should return HIGH_EFFICIENCY when temp reached desired within 10 min', () => {
    const t0 = new Date('2026-01-01T00:00:00Z');
    const t1 = new Date('2026-01-01T00:05:00Z');
    const samples = [
      makeSample({
        ac_state: true,
        desired_temperature: 22,
        avg_temperature: 25,
        ts_end: t0,
      }),
      makeSample({
        ac_state: true,
        desired_temperature: 22,
        avg_temperature: 22,
        ts_end: t1,
      }),
    ];

    const output = new HistoryReadingsDto();
    strategy.process(samples, output);

    expect(output.period_efficiency).toHaveLength(1);
    expect(output.period_efficiency[0].efficiency).toBe(
      EfficiencyEnum.HIGH_EFFICIENCY,
    );
  });

  it('should return MEDIUM_EFFICIENCY when temp reached desired between 10-30 min', () => {
    const t0 = new Date('2026-01-01T00:00:00Z');
    const t1 = new Date('2026-01-01T00:20:00Z');
    const samples = [
      makeSample({
        ac_state: true,
        desired_temperature: 22,
        avg_temperature: 28,
        ts_end: t0,
      }),
      makeSample({
        ac_state: true,
        desired_temperature: 22,
        avg_temperature: 22,
        ts_end: t1,
      }),
    ];

    const output = new HistoryReadingsDto();
    strategy.process(samples, output);

    expect(output.period_efficiency).toHaveLength(1);
    expect(output.period_efficiency[0].efficiency).toBe(
      EfficiencyEnum.MEDIUM_EFFICIENCY,
    );
  });

  it('should return LOW_EFFICIENCY when temp never reaches desired', () => {
    const t0 = new Date('2026-01-01T00:00:00Z');
    const t1 = new Date('2026-01-01T01:00:00Z');
    const samples = [
      makeSample({
        ac_state: true,
        desired_temperature: 22,
        avg_temperature: 28,
        ts_end: t0,
      }),
      makeSample({
        ac_state: true,
        desired_temperature: 22,
        avg_temperature: 27,
        ts_end: t1,
      }),
    ];

    const output = new HistoryReadingsDto();
    strategy.process(samples, output);

    expect(output.period_efficiency).toHaveLength(1);
    expect(output.period_efficiency[0].efficiency).toBe(
      EfficiencyEnum.LOW_EFFICIENCY,
    );
  });

  it('should split periods when desired_temperature changes', () => {
    const t0 = new Date('2026-01-01T00:00:00Z');
    const t1 = new Date('2026-01-01T00:05:00Z');
    const t2 = new Date('2026-01-01T00:10:00Z');
    const t3 = new Date('2026-01-01T00:15:00Z');

    const samples = [
      makeSample({
        desired_temperature: 22,
        ac_state: true,
        avg_temperature: 25,
        ts_end: t0,
      }),
      makeSample({
        desired_temperature: 22,
        ac_state: true,
        avg_temperature: 22,
        ts_end: t1,
      }),
      makeSample({
        desired_temperature: 24,
        ac_state: true,
        avg_temperature: 26,
        ts_end: t2,
      }),
      makeSample({
        desired_temperature: 24,
        ac_state: true,
        avg_temperature: 24,
        ts_end: t3,
      }),
    ];

    const output = new HistoryReadingsDto();
    strategy.process(samples, output);

    expect(output.period_efficiency).toHaveLength(2);
    expect(output.period_efficiency[0].efficiency).toBe(
      EfficiencyEnum.HIGH_EFFICIENCY,
    );
    expect(output.period_efficiency[1].efficiency).toBe(
      EfficiencyEnum.HIGH_EFFICIENCY,
    );
  });

  it('should set output.samples to input', () => {
    const t0 = new Date('2026-01-01T00:00:00Z');
    const samples = [makeSample({ ts_end: t0 })];

    const output = new HistoryReadingsDto();
    strategy.process(samples, output);

    expect(output.samples).toBe(samples);
  });

  it('should handle boundary at exactly 10 minutes as HIGH', () => {
    const t0 = new Date('2026-01-01T00:00:00Z');
    const t1 = new Date('2026-01-01T00:10:00Z');
    const samples = [
      makeSample({
        ac_state: true,
        desired_temperature: 22,
        avg_temperature: 25,
        ts_end: t0,
      }),
      makeSample({
        ac_state: true,
        desired_temperature: 22,
        avg_temperature: 22,
        ts_end: t1,
      }),
    ];

    const output = new HistoryReadingsDto();
    strategy.process(samples, output);

    expect(output.period_efficiency[0].efficiency).toBe(
      EfficiencyEnum.HIGH_EFFICIENCY,
    );
  });

  it('should handle boundary at exactly 30 minutes as MEDIUM', () => {
    const t0 = new Date('2026-01-01T00:00:00Z');
    const t1 = new Date('2026-01-01T00:30:00Z');
    const samples = [
      makeSample({
        ac_state: true,
        desired_temperature: 22,
        avg_temperature: 28,
        ts_end: t0,
      }),
      makeSample({
        ac_state: true,
        desired_temperature: 22,
        avg_temperature: 22,
        ts_end: t1,
      }),
    ];

    const output = new HistoryReadingsDto();
    strategy.process(samples, output);

    expect(output.period_efficiency[0].efficiency).toBe(
      EfficiencyEnum.MEDIUM_EFFICIENCY,
    );
  });
});
