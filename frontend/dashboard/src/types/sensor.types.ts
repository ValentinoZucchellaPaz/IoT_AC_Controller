/**
 * This file holds all TypeScript interfaces matching the backend API response shapes.
 *
 * - {@link SensorReading} — shape returned by GET /sensors (id, sensorId, temperature, humidity, createdAt)
 * - {@link Alert} — alert payload for the dashboard (sensorId, message, severity, triggeredAt)
 */

import { PeriodEfficiency, Sample } from "./history.types";

export type AlertSeverity = "low" | "medium" | "high";

export interface SensorReading {
  id: number;
  sensorId: string;
  temperature: number;
  humidity: number;
  createdAt: string;
}

export interface Alert {
  sensorId: string;
  message: string;
  severity: AlertSeverity;
  triggeredAt: string;
}

/** Props for chart/widget components — keeps components free of inline type definitions. */

export interface LatestReadingCardProps {
  reading: SensorReading;
}

export interface AlertBadgeProps {
  alert: Alert;
}
//---------

export interface SensorData {
  id: number;
  device_id: string;
  ac_state: boolean;
  desired_temperature: number;
  min_temperature: number;
  max_temperature: number;
  avg_temperature: number;
  ts_end: string;
  created_at: string;
}

export interface SensorResponseDTO {
  success: boolean;
  message: string;
  data: SensorData;
  timestamp: string;
}

export interface HistoryData {
  samples: Sample[];
  period_efficency: PeriodEfficiency[];
}

export interface HistoryResponseDTO {
  success: boolean;
  message: string;
  timestamp: string;
  total: number;
  data: HistoryData;
}
export type HistoryPeriod = "1h" | "6h" | "12h" | "1d" | "3d" | "7d";
