import { useState, useEffect } from 'react';
import type { Assessment, Athlete } from '../../types';
import { Timer } from '../../components/Timer';

interface Props {
  assessment: Assessment;
  athlete?: Athlete;
  onSave: (sectionId: string, data: any) => Promise<void>;
  onNext: () => void;
  onPrev: () => void;
  isBaseline: boolean;
}

export function Step8TandemGait({ assessment, onSave, onNext, onPrev }: Props) {
  const existing = assessment.sections.tandemGait || {};
  const [trials, setTrials] = useState<(number | null)[]>(existing.trials || [null, null, null, null]);
  const [errors, setErrors] = useState<string[]>(existing.errors || ['', '', '', '']);
  const [notes, setNotes] = useState(existing.notes || '');

  const validTrials = trials.filter(t => t !== null) as number[];
  const bestTime = validTrials.length > 0 ? Math.min(...validTrials) : null;
  const avgTime = validTrials.length > 0 ? validTrials.reduce((a, b) => a + b, 0) / validTrials.length : null;

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSave('tandemGait', { trials, errors, bestTime, avgTime, notes });
    }, 500);
    return () => clearTimeout(timeout);
  }, [trials, errors, notes]); // eslint-disable-line

  const setTrial = (i: number, val: string) => {
    const num = val === '' ? null : parseFloat(val);
    setTrials(t => { const u = [...t]; u[i] = num; return u; });
  };

  const setError = (i: number, val: string) => {
    setErrors(e => { const u = [...e]; u[i] = val; return u; });
  };

  return (
    <div style={{ padding: 16 }}>
      {/* Instructions */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700, color: '#0D5C63' }}>Tandem Gait Instructions</h3>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#374151', lineHeight: 1.8 }}>
          <li>Place tape on floor in a straight line (3–5 meters / 10 feet)</li>
          <li>Athlete starts with feet together behind the start line</li>
          <li>Walk heel-to-toe along the line, turn around, walk back</li>
          <li>Keep hands on hips</li>
          <li>Timer starts when first foot lifts from starting position</li>
          <li>Timer stops when both feet return to starting position</li>
          <li>4 trials: 2 with eyes open, 2 with eyes closed (if safe)</li>
        </ol>
      </div>

      {/* 60s timer */}
      <div style={{ marginBottom: 14 }}>
        <Timer
          durationSeconds={60}
          label="60 second trial timer"
        />
      </div>

      {/* Trial inputs */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: '#0D5C63' }}>Trial Times</h3>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ marginBottom: 14, borderBottom: i < 3 ? '1px solid #F3F4F6' : 'none', paddingBottom: i < 3 ? 14 : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: '#374151' }}>Trial {i + 1}</span>
              <span style={{ fontSize: 13, color: '#6B7280' }}>{i < 2 ? 'Eyes Open' : 'Eyes Closed'}</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Time (seconds)</label>
                <input
                  type="number"
                  value={trials[i] ?? ''}
                  onChange={e => setTrial(i, e.target.value)}
                  placeholder="e.g. 12.5"
                  step="0.1"
                  min="0"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #D1D5DB', fontSize: 15, outline: 'none', minHeight: 44, boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Errors</label>
                <input
                  type="text"
                  value={errors[i] || ''}
                  onChange={e => setError(i, e.target.value)}
                  placeholder="Step off, stumble..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #D1D5DB', fontSize: 14, outline: 'none', minHeight: 44, boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {validTrials.length > 0 && (
        <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 10, padding: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0D5C63' }}>{bestTime?.toFixed(1)}s</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Best Time</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0D5C63' }}>{avgTime?.toFixed(1)}s</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Average Time</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0D5C63' }}>{validTrials.length}</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Trials Completed</div>
            </div>
          </div>
          {bestTime !== null && bestTime > 14 && (
            <div style={{ marginTop: 10, fontSize: 14, color: '#DC2626', fontWeight: 600, textAlign: 'center' }}>
              Abnormal gait time (&gt;14s) — consider clinical review
            </div>
          )}
        </div>
      )}

      <div style={{ background: 'white', borderRadius: 10, padding: 14, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #D1D5DB', fontSize: 14, outline: 'none', minHeight: 70, resize: 'vertical', boxSizing: 'border-box' }}
          placeholder="Any observations during the test..."
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onPrev} style={{ flex: 1, background: 'white', color: '#374151', border: '1.5px solid #D1D5DB', borderRadius: 12, padding: '14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', minHeight: 52 }}>
          Back
        </button>
        <button onClick={onNext} style={{ flex: 2, background: '#0D5C63', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 16, cursor: 'pointer', minHeight: 52 }}>
          Next: BESS
        </button>
      </div>
    </div>
  );
}
