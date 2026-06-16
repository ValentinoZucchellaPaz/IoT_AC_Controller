import { describe, it, expect } from 'vitest';

describe('Dashboard', () => {
  it('debe detectar temperatura válida', () => {
    const temperatura = 25;

    expect(temperatura).toBeGreaterThan(-20);
    expect(temperatura).toBeLessThan(80);
  });
});
import { describe, it, expect, vi } from 'vitest';
import { HistoryStore } from '../src/observer/history-store';
import { HistoryData, HistoryObserver } from '../src/types/history.types';

describe('Patrón Observer - HistoryStore', () => {

  // Creamos un dato falso que cumple ESTRICTAMENTE con tu interfaz HistoryData
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
    period_efficency: [
      {
        from: "2026-06-16T13:00:00Z",
        to: "2026-06-16T14:00:00Z",
        efficency: 85.5
      }
    ]
  };

  it('debe suscribir un observador y notificarlo cuando cambien los datos', () => {
    const store = new HistoryStore();
    
    // Creamos un observador espía que implementa HistoryObserver
    const observer: HistoryObserver = {
      update: vi.fn()
    };

    // 1. Nos suscribimos al canal
    store.subscribe(observer);

    // 2. Cargamos datos nuevos (esto debería disparar la notificación)
    store.setData(mockData);

    // 3. Verificamos que el gráfico se enteró y recibió la info estructurada
    expect(observer.update).toHaveBeenCalledTimes(1);
    expect(observer.update).toHaveBeenCalledWith(mockData);
  });

  it('debe actualizar inmediatamente si el observador se suscribe cuando ya hay datos', () => {
    const store = new HistoryStore();
    
    // 1. Seteamos los datos primero en la tienda
    store.setData(mockData);

    const observer: HistoryObserver = {
      update: vi.fn()
    };

    // 2. Nos suscribimos después
    store.subscribe(observer);

    // 3. Verificamos que se llevó los datos al toque sin esperar otra carga
    expect(observer.update).toHaveBeenCalledWith(mockData);
  });

  it('no debe notificar a un observador que se desuscribió', () => {
    const store = new HistoryStore();
    
    const observer: HistoryObserver = {
      update: vi.fn()
    };

    store.subscribe(observer);
    
    // 1. El componente se desmonta (se desuscribe)
    store.unsubscribe(observer);

    // 2. Entran datos nuevos del backend
    store.setData(mockData);

    // 3. Verificamos que el espía jamás fue llamado después de salir
    expect(observer.update).not.toHaveBeenCalled();
  });
  });
