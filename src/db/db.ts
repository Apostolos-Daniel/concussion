import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Athlete, Assessment } from '../types';

export class ClearHeadDB extends Dexie {
  athletes!: Table<Athlete>;
  assessments!: Table<Assessment>;

  constructor() {
    super('ClearHeadDB');
    this.version(1).stores({
      athletes: 'id, name, sport, team, createdAt',
      assessments: 'id, athleteId, type, date, status, baselineAssessmentId',
    });
  }
}

export const db = new ClearHeadDB();
