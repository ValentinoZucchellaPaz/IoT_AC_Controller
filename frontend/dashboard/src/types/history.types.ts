export interface Sample {
  id: number;
  device_id: string;
  ac_state: boolean;
  desired_temperature: number;
  min_temperature: number;
  max_temperature: number;
  avg_temperature: number;
  current_humidity: number;
  ts_end: string;
  created_at: string;
}

export interface PeriodEfficiency {
  from: string;
  to: string;
  efficiency: number;
}

export interface HistoryData {
  samples: Sample[];
  period_efficiency: PeriodEfficiency[];
}

export interface HistoryObserver {
  update(data: HistoryData): void;
}

export type ApiPeriods = "1h" | "6h" | "12h" | "1d" | "3d" | "7d";
