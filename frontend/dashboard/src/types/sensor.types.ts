import { HistoryData } from "./history.types";

export interface SensorData {
  device_id: string;
  ac_state: boolean;
  desired_temperature: number;
  min_temperature: number;
  max_temperature: number;
  avg_temperature: number;
  current_humidity: number;
  ts_end: string;
}

export interface ConnectivityData {
  status: boolean;
  ts_end: string;
}

export interface SensorResponseDTO {
  success: boolean;
  message: string;
  data: {
    sensor: SensorData;
    connectivity: ConnectivityData;
  };
  timestamp: string;
}

export interface HistoryResponseDTO {
  success: boolean;
  message: string;
  timestamp: string;
  total: number;
  data: HistoryData;
}
export type HistoryPeriod = "1h" | "6h" | "12h" | "1d" | "3d" | "7d";
