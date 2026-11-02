// Tiny JSON-file store. One file keeps the project runnable with zero dependencies,
// which matters because the assessor must be able to reproduce the tests.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

export class AssignmentStore {
  /**
   * @param {string} filePath path to the JSON data file
   */
  constructor(filePath) {
    this.filePath = filePath;
    this.items = [];
  }

  async load() {
    try {
      const raw = await readFile(this.filePath, 'utf8');
      const parsed = JSON.parse(raw);
      this.items = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.items = [];
        await this.persist();
        return;
      }
      throw error;
    }
  }

  async persist() {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(this.items, null, 2), 'utf8');
  }

  all() {
    return [...this.items];
  }

  find(id) {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async create(value) {
    const timestamp = new Date().toISOString();
    const record = { id: randomUUID(), ...value, createdAt: timestamp, updatedAt: timestamp };
    this.items.push(record);
    await this.persist();
    return record;
  }

  async update(id, changes) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const updated = { ...this.items[index], ...changes, id, updatedAt: new Date().toISOString() };
    this.items[index] = updated;
    await this.persist();
    return updated;
  }

  async remove(id) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    await this.persist();
    return true;
  }
}
