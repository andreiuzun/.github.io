import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';

export interface Product {
    ean: string;
    name: string;
    defaultQty: number;
    defaultUnit: string;
}

export interface InventoryItem {
    id: string;
    ean: string;
    name: string;
    qty: number;
    unit: string;
    expiryDate?: string; // ISO date string YYYY-MM-DD
    addedAt: string; // ISO datetime string
}

interface FridgeDB extends DBSchema {
    products: {
        key: string;
        value: Product;
    };
    inventory: {
        key: string;
        value: InventoryItem;
        indexes: { 'by-expiry': string; 'by-added': string };
    };
}

const DB_NAME = 'fridge_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<FridgeDB>>;

export const getDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<FridgeDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('products')) {
                    db.createObjectStore('products', { keyPath: 'ean' });
                }
                if (!db.objectStoreNames.contains('inventory')) {
                    const inventoryStore = db.createObjectStore('inventory', { keyPath: 'id' });
                    inventoryStore.createIndex('by-expiry', 'expiryDate');
                    inventoryStore.createIndex('by-added', 'addedAt');
                }
            },
        });
    }
    return dbPromise;
};

export const getProduct = async (ean: string) => {
    const db = await getDB();
    return db.get('products', ean);
};

export const saveProduct = async (product: Product) => {
    const db = await getDB();
    return db.put('products', product);
};

export const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'addedAt'>) => {
    const db = await getDB();
    const newItem: InventoryItem = {
        ...item,
        id: uuidv4(),
        addedAt: new Date().toISOString(),
    };
    await db.add('inventory', newItem);
    return newItem;
};

export const updateInventoryItem = async (item: InventoryItem) => {
    const db = await getDB();
    return db.put('inventory', item);
};

export const deleteInventoryItem = async (id: string) => {
    const db = await getDB();
    return db.delete('inventory', id);
};

export const getInventoryItem = async (id: string) => {
    const db = await getDB();
    return db.get('inventory', id);
};

export const getAllInventoryItems = async () => {
    const db = await getDB();
    return db.getAll('inventory');
};
