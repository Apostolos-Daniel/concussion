import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Athlete, Assessment, Assessor } from '../types';

export class ClearHeadDB extends Dexie {
  athletes!: Table<Athlete>;
  assessments!: Table<Assessment>;
  assessors!: Table<Assessor>;

  constructor() {
    super('ClearHeadDB');
    this.version(1).stores({
      athletes: 'id, name, sport, team, createdAt',
      assessments: 'id, athleteId, type, date, status, baselineAssessmentId',
    });
    this.version(2).stores({
      athletes: 'id, name, sport, team, createdAt',
      assessments: 'id, athleteId, type, date, status, baselineAssessmentId',
      assessors: 'id, name, role, createdAt',
    });
  }
}

export const db = new ClearHeadDB();
