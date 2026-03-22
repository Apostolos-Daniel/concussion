export interface Athlete {
  id: string;
  name: string;
  dateOfBirth: string;
  sport: string;
  team: string;
  position?: string;
  createdAt: string;
}

export interface Assessment {
  id: string;
  athleteId: string;
  type: 'baseline' | 'post-incident';
  date: string;
  completedBy: string;
  sections: Record<string, any>;
  status: 'in-progress' | 'complete';
  baselineAssessmentId?: string;
}
