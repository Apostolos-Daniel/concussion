import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { Athlete } from '../types';

export function useAthletes() {
  return useLiveQuery(() => db.athletes.orderBy('name').toArray(), []);
}

export function useAthlete(id: string) {
  return useLiveQuery(() => db.athletes.get(id), [id]);
}

export async function addAthlete(athlete: Omit<Athlete, 'id' | 'createdAt'>) {
  const id = crypto.randomUUID();
  const newAthlete: Athlete = {
    ...athlete,
    id,
    createdAt: new Date().toISOString(),
  };
  await db.athletes.add(newAthlete);
  return newAthlete;
}

export async function updateAthlete(id: string, updates: Partial<Athlete>) {
  await db.athletes.update(id, updates);
}

export async function deleteAthlete(id: string) {
  await db.athletes.delete(id);
  await db.assessments.where('athleteId').equals(id).delete();
}
