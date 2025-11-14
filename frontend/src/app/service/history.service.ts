import { Injectable } from '@angular/core';

export interface ConversionRecord {
  id: string;
  timestamp: number;
  dateUsed?: string; // historical date user picked (YYYY-MM-DD)
  base: string;
  target: string;
  amount: number;
  result: number;
  rate: number;
}

@Injectable({
  providedIn: 'root'   // ✔ makes service globally available
})
export class HistoryService {
  private key = 'currency_conversion_history_v1';
  load(): ConversionRecord[] {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  save(record: ConversionRecord) {
    const items = this.load();
    items.unshift(record); // newest first
    localStorage.setItem(this.key, JSON.stringify(items.slice(0, 200))); // limit entries
  }
  clear() {
    localStorage.removeItem(this.key);
  }
}
