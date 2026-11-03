// Is file mein SQLite database connection initialize aur manage kiya jata hai.
// Node.js ke native `node:sqlite` DatabaseSync module ka use hota hai.
// Foreign key constraints, Write-Ahead Logging (WAL), aur atomic database transactions yahan set hote hain.

import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import ENV from './env.js';

// Singleton instance taaki pure backend mein ek hi active database connection share ho
let dbInstance = null;

// Database connection initialize karta hai aur connection object return karta hai
export const getDatabase = (customPath = null) => {
  // Agar database already connected hai toh wahi instance use karte hain
  if (dbInstance && !customPath) return dbInstance;

  const dbPath = customPath || ENV.DATABASE_PATH;

  // Agar in-memory database nahi hai, toh check karte hain ki data folder exist karta hai ya nahi
  if (dbPath !== ':memory:') {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const db = new DatabaseSync(dbPath);

  // Foreign keys enable karte hain taaki orphan records na banein (e.g. bina user ke profile)
  db.exec('PRAGMA foreign_keys = ON;');
  // WAL mode fast read/write concurrency provide karta hai
  db.exec('PRAGMA journal_mode = WAL;');

  // Atomic transactions helper:
  // Iska fayda ye hai ki agar koi bhi step fail ho, toh database rollback ho jata hai aur corrupted state nahi banti
  db.transaction = (fn) => {
    return (...args) => {
      db.exec('BEGIN IMMEDIATE;');
      try {
        const result = fn(...args);
        db.exec('COMMIT;');
        return result;
      } catch (err) {
        db.exec('ROLLBACK;');
        throw err;
      }
    };
  };

  if (!customPath) {
    dbInstance = db;
  }

  return db;
};

export const db = getDatabase();
export default db;
