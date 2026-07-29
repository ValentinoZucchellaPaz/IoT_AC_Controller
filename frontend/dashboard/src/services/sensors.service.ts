/**
 * This is the only file allowed to call fetch() for sensor-related API access.
 *
 * Uses `process.env.NEXT_PUBLIC_API_URL` from the monorepo root `.env` (see root `.env.example`).
 *
 * Students must implement:
 * - `getLatestReadings()` — fetch recent readings for the dashboard
 * - `getReadingsBySensor(sensorId)` — filter readings for one sensor
 * - `getAlerts()` — fetch alert payloads for widgets
 */

export {};

import { SensorResponseDTO, HistoryResponseDTO } from "../types/sensor.types";

export const SensorsService = {
  async setDesiredTemperature(
    deviceId: string,
    temperature: number,
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch("/api/devices/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        device_id: deviceId,
        desired_temperature: temperature,
      }),
    });
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return response.json();
  },

  async getLatestReading(): Promise<SensorResponseDTO> {
    try {
      // ruting relativo en next.config.ts
      const response = await fetch("/api/data/last", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data: SensorResponseDTO = await response.json();
      return data;
    } catch (error) {
      console.error("SensorsService -> getLatestReading falló:", error);
      throw error;
    }
  },

  async getHistory(period: string = "1d"): Promise<HistoryResponseDTO> {
    try {
      // Le pegamos al endpoint configurado en data.controller.ts -> @Get('/history/:period')
      const url = `/api/data/history/${period}`; // ruting relativo en next.config.ts
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (!response.ok)
        throw new Error(
          `Error HTTP: ${response.status} al pedir el historial.`,
        );
      const data: HistoryResponseDTO = await response.json();
      return data;
    } catch (error) {
      console.error("SensorsService -> getHistory falló:", error);
      throw error;
    }
  },
};
