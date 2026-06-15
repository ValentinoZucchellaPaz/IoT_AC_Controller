// observer/history-store.ts

import { HistoryData, HistoryObserver } from "../types/history.types";

export class HistoryStore {
  private observers: HistoryObserver[] = [];
  private data: HistoryData | null = null;

  subscribe(observer: HistoryObserver): void {
    this.observers.push(observer);

    // if there's data, update automatically
    if (this.data) {
      observer.update(this.data);
    }
  }

  unsubscribe(observer: HistoryObserver): void {
    this.observers = this.observers.filter((item) => item !== observer);
  }

  setData(data: HistoryData): void {
    this.data = data;
    this.notify();
  }

  getData(): HistoryData | null {
    return this.data;
  }

  private notify(): void {
    if (!this.data) return;

    this.observers.forEach((observer) => {
      observer.update(this.data!);
    });
  }
}
