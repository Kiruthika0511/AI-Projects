import { openDB } from 'idb';

const DB_NAME = 'JobTrackerDB';
const DB_VERSION = 1;
const STORE_NAME = 'jobs';

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
        });
        store.createIndex('status', 'status');
        store.createIndex('company', 'company');
        store.createIndex('dateApplied', 'dateApplied');
      }
    },
  });
}

export async function getAllJobs() {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function getJobById(id) {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

export async function addJob(job) {
  const db = await getDB();
  const newJob = {
    ...job,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.add(STORE_NAME, newJob);
  return newJob;
}

export async function updateJob(job) {
  const db = await getDB();
  const updatedJob = {
    ...job,
    updatedAt: new Date().toISOString(),
  };
  await db.put(STORE_NAME, updatedJob);
  return updatedJob;
}

export async function deleteJob(id) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function exportAllData() {
  const jobs = await getAllJobs();
  return JSON.stringify(jobs, null, 2);
}

export async function importData(jsonString) {
  const db = await getDB();
  const jobs = JSON.parse(jsonString);
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const job of jobs) {
    await tx.store.put(job);
  }
  await tx.done;
  return jobs;
}
