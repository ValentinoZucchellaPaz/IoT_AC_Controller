import { describe, it, expect, vi } from 'vitest';
import { HistoryStore } from '../src/observer/history-store';
import { HistoryData, HistoryObserver } from '../src/types/history.types';

describe('Patrón Observer - HistoryStore', () => {

  const mockData: HistoryData = {
    samples: [
      {
        id: 1,
        device_id: "ESP32-LAB",
        ac_state: true,
        desired_temperature: 24.0,
        min_temperature: 22.0,
        max_temperature: 26.0,
        avg_temperature: 24.5,
        current_humidity: 50.0,
        ts_end: "2026-06-16T14:30:00Z",
        created_at: "2026-06-16T14:00:00Z"
      }
    ],
    period_efficiency: [
      {
        from: "2026-06-16T13:00:00Z",
        to: "2026-06-16T14:00:00Z",
        efficiency: 85.5
      }
    ]
  };

  it('debe suscribir un observador y notificarlo cuando cambien los datos', () => {
    const store = new HistoryStore();
    const observer: HistoryObserver = { update: vi.fn() };

    store.subscribe(observer);
    store.setData(mockData);

    expect(observer.update).toHaveBeenCalledTimes(1);
    expect(observer.update).toHaveBeenCalledWith(mockData);
  });

  it('debe actualizar inmediatamente si el observador se suscribe cuando ya hay datos', () => {
    const store = new HistoryStore();
    store.setData(mockData);

    const observer: HistoryObserver = { update: vi.fn() };
    store.subscribe(observer);

    expect(observer.update).toHaveBeenCalledWith(mockData);
  });

  it('no debe notificar a un observador que se desuscribió', () => {
    const store = new HistoryStore();
    const observer: HistoryObserver = { update: vi.fn() };

    store.subscribe(observer);
    store.unsubscribe(observer);
    store.setData(mockData);

    expect(observer.update).not.toHaveBeenCalled();
  });

});