// src/app/services/indexed-db.service.ts
import { Injectable } from '@angular/core';
import { openDB } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private dbPromise: Promise<any>;

  constructor() {
    this.dbPromise = openDB('authDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('authStore')) {
          db.createObjectStore('authStore', { keyPath: 'id' });
        }
      },
    });
  }

  async setItem(key: string, value: any) {
    const db = await this.dbPromise;
    await db.put('authStore', { id: key, value });
  }

  async getItem(key: string) {
    const db = await this.dbPromise;
    return await db.get('authStore', key);
  }
}
