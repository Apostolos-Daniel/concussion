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

const BESS_CONDITIONS = [
  { id: 'firm_double', label: 'Double Leg Stance', surface: 'Firm Surface', description: 'Both feet together, hands on hips, eyes closed', maxErrors: 10 },
  { id: 'firm_single', label: 'Single Leg Stance', surface: 'Firm Surface', description: 'Non-dominant foot, other leg at 20-30° hip/knee flexion, hands on hips, eyes closed', maxErrors: 10 },
  { id: 'firm_tandem', label: 'Tandem Stance', surface: 'Firm Surface', description: 'Non-dominant foot behind dominant, heel to toe, hands on hips, eyes closed', maxErrors: 10 },
  { id: 'foam_double', label: 'Double Leg Stance', surface: 'Foam Surface', description: 'Both feet together on foam, hands on hips, eyes closed', maxErrors: 10 },
  { id: 'foam_single', label: 'Single Leg Stance', surface: 'Foam Surface', description: 'Non-dominant foot on foam, hands on hips, eyes closed', maxErrors: 10 },
  { id: 'foam_tandem', label: 'Tandem Stance', surface: 'Foam Surface', description: 'Non-dominant foot behind dominant on foam, hands on hips, eyes closed', maxErrors: 10 },
];

const ERROR_TYPES = [
  'Lifting hands off hips',
  'Opening eyes',
  'Step, stumble or fall',
  'Moving hip into > 30° flexion or abduction',
  'Lifting forefoot or heel',
  'Remaining out of test position > 5 seconds',
];

export function Step9BESS({ assessment, onSave, onNext, onPrev }: Props) {
  const existing = assessment.sections.bess || {};
  const [errors, setErrors] = useState<Record<string, number>>(existing.errors || {});
  const [notes, setNotes] = useState(existing.notes || '');
  const [currentCondition, setCurrentCondition] = useState(0);

  const totalErrors = BESS_CONDITIONS.reduce((acc, c) => acc + (errors[c.id] || 0), 0);
  const bessScore = 60 - totalErrors; // BESS score = 60 - total errors (max 60)

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSave('bess', { errors, totalErrors, bessScore, notes });
    }, 500);
    return () => clearTimeout(timeout);
  }, [errors, notes]); // eslint-disable-line

  return (
    <div style={{ padding: 16 }}>
      {/* Instructions */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700, color: '#0D5C63' }}>BESS Instructions</h3>
        <p style={{ margin: '0 0 8px', fontSize: 14, color: '#374151' }}>Balance Error Scoring System (BESS)</p>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#374151', lineHeight: 1.8 }}>
          <li>Each stance: 20 seconds, eyes closed, hands on hips</li>
          <li>Count errors (max 10 per condition)</li>
          <li>Lower score = worse balance</li>
          <li>Maximum possible score: 60</li>
        </ul>
      </div>

      {/* Error types reference */}
      <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10, padding: 12, marginBottom: 14 }}>
        <div style={{ fontWeight: 700, color: '#D97706', marginBottom: 8, fontSize: 14 }}>Error Types to Count:</div>
        {ERROR_TYPES.map((e, i) => (
          <div key={i} style={{ fontSize: 13, color: '#78350F', marginBottom: 3 }}>• {e}</div>
        ))}
      </div>

      {/* Tab selector for conditions */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
        {BESS_CONDITIONS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setCurrentCondition(i)}
            style={{
              flexShrink: 0,
              padding: '6px 12px',
              borderRadius: 8,
              border: '1.5px solid',
              borderColor: currentCondition === i ? '#0D5C63' : '#D1D5DB',
              background: currentCondition === i ? '#0D5C63' : 'white',
              color: currentCondition === i ? 'white' : '#6B7280',
              fontWeight: 600, cursor: 'pointer', fontSize: 13, minHeight: 40,
              whiteSpace: 'nowrap',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Current condition */}
      {BESS_CONDITIONS.map((c, i) => (
        <div key={c.id} style={{ display: currentCondition === i ? 'block' : 'none' }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, background: i < 3 ? '#DBEAFE' : '#FEF9C3', color: i < 3 ? '#1D4ED8' : '#78350F', padding: '2px 8px', borderRadius: 6 }}>
                {c.surface}
              </span>
            </div>
            <h3 style={{ margin: '8px 0 6px', fontSize: 17, fontWeight: 700, color: '#111827' }}>{c.label}</h3>
            <p style={{ margin: '0 0 14px', fontSize: 14, color: '#6B7280', lineHeight: 1.5 }}>{c.description}</p>

            <Timer durationSeconds={20} label="20 second test timer" />

            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
                Number of errors (0–10):
              </label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <button
                    key={n}
                    onClick={() => setErrors(e => ({ ...e, [c.id]: n }))}
                    style={{
                      width: 44, height: 44, borderRadius: 10, border: '1.5px solid',
                      borderColor: (errors[c.id] ?? -1) === n ? '#0D5C63' : '#D1D5DB',
                      background: (errors[c.id] ?? -1) === n ? '#0D5C63' : 'white',
                      color: (errors[c.id] ?? -1) === n ? 'white' : '#374151',
                      fontWeight: 700, cursor: 'pointer', fontSize: 16,
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            {i > 0 && (
              <button onClick={() => setCurrentCondition(i - 1)} style={{ flex: 1, background: 'white', color: '#374151', border: '1.5px solid #D1D5DB', borderRadius: 10, padding: '12px', fontWeight: 600, cursor: 'pointer', minHeight: 48 }}>
                ← Prev
              </button>
            )}
            {i < BESS_CONDITIONS.length - 1 && (
              <button onClick={() => setCurrentCondition(i + 1)} style={{ flex: 1, background: '#F0FDFA', color: '#0D5C63', border: '1.5px solid #0D5C63', borderRadius: 10, padding: '12px', fontWeight: 700, cursor: 'pointer', minHeight: 48 }}>
                Next Condition →
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Summary */}
      <div style={{ background: bessScore >= 50 ? '#DCFCE7' : bessScore >= 40 ? '#FEF3C7' : '#FEE2E2', borderRadius: 12, padding: 16, marginBottom: 16, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: bessScore >= 50 ? '#16A34A' : bessScore >= 40 ? '#D97706' : '#DC2626' }}>{bessScore}</div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>BESS Score (max 60)</div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#374151' }}>{totalErrors}</div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>Total Errors</div>
          </div>
        </div>
        {bessScore < 50 && (
          <div style={{ marginTop: 10, fontSize: 14, fontWeight: 600, color: bessScore >= 40 ? '#D97706' : '#DC2626' }}>
            {bessScore < 40 ? 'Significant balance deficits' : 'Moderate balance deficits'} — consider clinical review
          </div>
        )}
      </div>

      {/* Notes */}
      <div style={{ background: 'white', borderRadius: 10, padding: 14, marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #D1D5DB', fontSize: 14, outline: 'none', minHeight: 70, resize: 'vertical', boxSizing: 'border-box' }}
          placeholder="Balance observations..."
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onPrev} style={{ flex: 1, background: 'white', color: '#374151', border: '1.5px solid #D1D5DB', borderRadius: 12, padding: '14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', minHeight: 52 }}>
          Back
        </button>
        <button onClick={onNext} style={{ flex: 2, background: '#0D5C63', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 16, cursor: 'pointer', minHeight: 52 }}>
          Next: Delayed Recall
        </button>
      </div>
    </div>
  );
}
