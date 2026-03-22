import { useState, useEffect } from 'react';
import type { Assessment, Athlete } from '../../types';

interface Props {
  assessment: Assessment;
  athlete?: Athlete;
  onSave: (sectionId: string, data: any) => Promise<void>;
  onNext: () => void;
  onPrev: () => void;
  isBaseline: boolean;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1.5px solid #D1D5DB',
  fontSize: 15,
  outline: 'none',
  minHeight: 44,
  background: 'white',
  boxSizing: 'border-box',
  color: '#111827',
};

function calculateAge(dob: string) {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export function Step1PatientInfo({ assessment, athlete, onSave, onNext }: Props) {
  const existing = assessment.sections.patientInfo || {};
  const [form, setForm] = useState({
    name: existing.name || athlete?.name || '',
    dateOfBirth: existing.dateOfBirth || athlete?.dateOfBirth || '',
    age: existing.age || (athlete?.dateOfBirth ? String(calculateAge(athlete.dateOfBirth)) : ''),
    sex: existing.sex || '',
    sport: existing.sport || athlete?.sport || '',
    team: existing.team || athlete?.team || '',
    position: existing.position || athlete?.position || '',
    dominantHand: existing.dominantHand || '',
    yearsOfEducation: existing.yearsOfEducation || '',
    examinerName: existing.examinerName || assessment.completedBy || '',
    examDate: existing.examDate || new Date().toISOString().split('T')[0],
    timeOfExam: existing.timeOfExam || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    incidentDate: existing.incidentDate || '',
    incidentTime: existing.incidentTime || '',
    mechanism: existing.mechanism || '',
    previousConcussions: existing.previousConcussions || '',
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSave('patientInfo', form);
    }, 500);
    return () => clearTimeout(timeout);
  }, [form]); // eslint-disable-line

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div style={{ padding: 16 }}>
      <Section title="Athlete Details">
        <Field label="Full Name *">
          <input type="text" value={form.name} onChange={set('name')} style={inputStyle} />
        </Field>
        <Field label="Date of Birth">
          <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} style={inputStyle} />
        </Field>
        <Field label="Age">
          <input type="number" value={form.age} onChange={set('age')} style={inputStyle} placeholder="Years" />
        </Field>
        <Field label="Sex">
          <select value={form.sex} onChange={set('sex')} style={inputStyle}>
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </Field>
        <Field label="Dominant Hand">
          <select value={form.dominantHand} onChange={set('dominantHand')} style={inputStyle}>
            <option value="">Select...</option>
            <option value="Right">Right</option>
            <option value="Left">Left</option>
            <option value="Ambidextrous">Ambidextrous</option>
          </select>
        </Field>
        <Field label="Years of Education">
          <input type="number" value={form.yearsOfEducation} onChange={set('yearsOfEducation')} style={inputStyle} placeholder="e.g. 12" />
        </Field>
      </Section>

      <Section title="Sport / Team">
        <Field label="Sport">
          <input type="text" value={form.sport} onChange={set('sport')} style={inputStyle} />
        </Field>
        <Field label="Team">
          <input type="text" value={form.team} onChange={set('team')} style={inputStyle} />
        </Field>
        <Field label="Position">
          <input type="text" value={form.position} onChange={set('position')} style={inputStyle} />
        </Field>
      </Section>

      <Section title="Examiner">
        <Field label="Examiner Name">
          <input type="text" value={form.examinerName} onChange={set('examinerName')} style={inputStyle} />
        </Field>
        <Field label="Exam Date">
          <input type="date" value={form.examDate} onChange={set('examDate')} style={inputStyle} />
        </Field>
        <Field label="Time of Exam">
          <input type="time" value={form.timeOfExam} onChange={set('timeOfExam')} style={inputStyle} />
        </Field>
      </Section>

      <Section title="Previous Concussion History">
        <Field label="Number of previous concussions">
          <input type="number" value={form.previousConcussions} onChange={set('previousConcussions')} style={inputStyle} placeholder="0" min="0" />
        </Field>
      </Section>

      {!form.name.includes('(baseline)') && (
        <Section title="Incident Details">
          <Field label="Date of incident">
            <input type="date" value={form.incidentDate} onChange={set('incidentDate')} style={inputStyle} />
          </Field>
          <Field label="Time of incident">
            <input type="time" value={form.incidentTime} onChange={set('incidentTime')} style={inputStyle} />
          </Field>
          <Field label="Mechanism of injury">
            <textarea
              value={form.mechanism}
              onChange={set('mechanism')}
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
              placeholder="Describe how the incident occurred..."
            />
          </Field>
        </Section>
      )}

      <button
        onClick={onNext}
        style={{ width: '100%', background: '#0D5C63', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 8, minHeight: 52 }}
      >
        Next: {form.name ? 'Observed Signs' : 'Continue'}
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: '#0D5C63' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}
