import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import type { Assessor } from '../types';

export function useAssessors() {
  return useLiveQuery(() => db.assessors.orderBy('name').toArray(), []);
}

export function useAssessor(id: string) {
  return useLiveQuery(() => db.assessors.get(id), [id]);
}

export async function addAssessor(assessor: Omit<Assessor, 'id' | 'createdAt'>) {
  const id = crypto.randomUUID();
  const newAssessor: Assessor = {
    ...assessor,
    id,
    createdAt: new Date().toISOString(),
  };
  await db.assessors.add(newAssessor);
  return newAssessor;
}

export async function updateAssessor(id: string, updates: Partial<Assessor>) {
  await db.assessors.update(id, updates);
}

export async function deleteAssessor(id: string) {
  await db.assessors.delete(id);
}
