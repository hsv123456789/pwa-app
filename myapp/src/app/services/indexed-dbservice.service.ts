// src/app/services/indexed-db.service.ts
import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MyDB extends DBSchema {
  authStore: {
    key: string;
    value: {
      id: string;
      value: any;
    };
  };
  orderStore: {
    key: number;
    value: {
      id?: number;
      city: string;
      restaurant: string;
      diet: string;
      order: any[];
      totalPrice: number;
      timestamp: string;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private dbPromise: Promise<IDBPDatabase<MyDB>>;

  constructor() {
    this.dbPromise = openDB<MyDB>('myAppDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('authStore')) {
          db.createObjectStore('authStore', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('orderStore')) {
          db.createObjectStore('orderStore', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }

  async setAuthItem(key: string, value: any) {
    const db = await this.dbPromise;
    await db.put('authStore', { id: key, value });
  }

  async getAuthItem(key: string) {
    const db = await this.dbPromise;
    const item = await db.get('authStore', key);
    return item ? item.value : undefined;
  }

  async saveOrder(order: Omit<MyDB['orderStore']['value'], 'id'>) {
    const db = await this.dbPromise;
    return await db.add('orderStore', order);
  }

  async getAllOrders() {
    const db = await this.dbPromise;
    return await db.getAll('orderStore');
  }
}