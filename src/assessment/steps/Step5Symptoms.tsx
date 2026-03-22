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

const SYMPTOMS = [
  { id: 'headache', label: 'Headache' },
  { id: 'headPressure', label: '"Pressure in head"' },
  { id: 'neckPain', label: 'Neck Pain' },
  { id: 'nauseaVomiting', label: 'Nausea or vomiting' },
  { id: 'dizziness', label: 'Dizziness' },
  { id: 'blurredVision', label: 'Blurred vision' },
  { id: 'balanceProblems', label: 'Balance problems' },
  { id: 'sensitivityLight', label: 'Sensitivity to light' },
  { id: 'sensitivityNoise', label: 'Sensitivity to noise' },
  { id: 'feelingSlowed', label: 'Feeling slowed down' },
  { id: 'feelingFog', label: '"Feeling like in a fog"' },
  { id: 'dontFeelRight', label: '"Don\'t feel right"' },
  { id: 'concentrationDiff', label: 'Difficulty concentrating' },
  { id: 'memoryDiff', label: 'Difficulty remembering' },
  { id: 'fatigue', label: 'Fatigue or low energy' },
  { id: 'confusion', label: 'Confusion' },
  { id: 'drowsiness', label: 'Drowsiness' },
  { id: 'troubleSleeping', label: 'Trouble falling asleep' },
  { id: 'moreEmotional', label: 'More emotional' },
  { id: 'irritability', label: 'Irritability' },
  { id: 'sadness', label: 'Sadness' },
  { id: 'nervous', label: 'Nervous or anxious' },
];

const LABELS = ['None', '1', '2', '3', '4', '5', 'Severe'];

export function Step5Symptoms({ assessment, onSave, onNext, onPrev, isBaseline }: Props) {
  const existing = assessment.sections.symptoms || {};
  const [scores, setScores] = useState<Record<string, number>>(existing.scores || {});
  const [onField, setOnField] = useState<boolean>(existing.onField ?? false);

  const totalScore = SYMPTOMS.reduce((acc, s) => acc + (scores[s.id] || 0), 0);
  const symptomsPresent = SYMPTOMS.filter(s => (scores[s.id] || 0) > 0).length;

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSave('symptoms', { scores, totalScore, symptomsPresent, onField });
    }, 500);
    return () => clearTimeout(timeout);
  }, [scores, onField]); // eslint-disable-line

  return (
    <div style={{ padding: 16 }}>
      {!isBaseline && (
        <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10, padding: 12, marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={onField} onChange={e => setOnField(e.target.checked)} style={{ width: 20, height: 20, accentColor: '#D97706' }} />
            <span style={{ fontWeight: 600, color: '#92400E', fontSize: 14 }}>This is an on-field assessment (sideline)</span>
          </label>
        </div>
      )}

      <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: '#0D5C63' }}>
          Rate each symptom on a scale from <strong>0 (none)</strong> to <strong>6 (severe)</strong>. Base ratings on how you feel <strong>right now</strong>.
        </div>
      </div>

      {SYMPTOMS.map(sym => (
        <div key={sym.id} style={{ background: 'white', borderRadius: 10, padding: '12px 14px', marginBottom: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: '#111827' }}>{sym.label}</span>
            <span style={{
              fontSize: 16, fontWeight: 800,
              color: (scores[sym.id] || 0) === 0 ? '#9CA3AF' : (scores[sym.id] || 0) <= 2 ? '#0D5C63' : (scores[sym.id] || 0) <= 4 ? '#D97706' : '#DC2626',
              minWidth: 28, textAlign: 'right',
            }}>
              {scores[sym.id] || 0}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={6}
            value={scores[sym.id] || 0}
            onChange={e => setScores(s => ({ ...s, [sym.id]: Number(e.target.value) }))}
            style={{
              width: '100%',
              accentColor: (scores[sym.id] || 0) === 0 ? '#9CA3AF' : (scores[sym.id] || 0) <= 2 ? '#0D5C63' : (scores[sym.id] || 0) <= 4 ? '#D97706' : '#DC2626',
            } as React.CSSProperties}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            {LABELS.map((l, i) => (
              <span key={i} style={{ fontSize: 10, color: '#9CA3AF', textAlign: 'center', flex: 1 }}>{l}</span>
            ))}
          </div>
        </div>
      ))}

      {/* Score summary */}
      <div style={{ background: totalScore > 0 ? '#FEE2E2' : '#DCFCE7', borderRadius: 12, padding: 16, marginBottom: 16, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: totalScore > 0 ? '#DC2626' : '#16A34A' }}>{symptomsPresent}</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Symptoms Present</div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: totalScore > 0 ? '#DC2626' : '#16A34A' }}>{totalScore}</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Total Score (max 132)</div>
          </div>
        </div>
        {totalScore > 0 && (
          <div style={{ marginTop: 8, fontSize: 14, color: '#991B1B', fontWeight: 600 }}>
            Symptoms present — clinical assessment required
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onPrev} style={{ flex: 1, background: 'white', color: '#374151', border: '1.5px solid #D1D5DB', borderRadius: 12, padding: '14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', minHeight: 52 }}>
          Back
        </button>
        <button onClick={onNext} style={{ flex: 2, background: '#0D5C63', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 16, cursor: 'pointer', minHeight: 52 }}>
          Next: Cognitive
        </button>
      </div>
    </div>
  );
}
