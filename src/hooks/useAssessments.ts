import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { Assessment } from '../types';

export function useAssessments(athleteId?: string) {
  return useLiveQuery(
    () =>
      athleteId
        ? db.assessments.where('athleteId').equals(athleteId).sortBy('date')
        : db.assessments.orderBy('date').reverse().toArray(),
    [athleteId]
  );
}

export function useAssessment(id: string) {
  return useLiveQuery(() => db.assessments.get(id), [id]);
}

export async function createAssessment(
  data: Omit<Assessment, 'id' | 'sections' | 'status'>
): Promise<Assessment> {
  const assessment: Assessment = {
    ...data,
    id: crypto.randomUUID(),
    sections: {},
    status: 'in-progress',
  };
  await db.assessments.add(assessment);
  return assessment;
}

export async function updateAssessmentSection(
  id: string,
  sectionId: string,
  data: any
) {
  const assessment = await db.assessments.get(id);
  if (!assessment) return;
  await db.assessments.update(id, {
    sections: { ...assessment.sections, [sectionId]: data },
  });
}

export async function updateAssessment(id: string, updates: Partial<Assessment>) {
  await db.assessments.update(id, updates);
}
