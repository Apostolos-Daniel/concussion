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

const NEURO_CHECKS = [
  {
    category: 'Upper Limb',
    items: [
      { id: 'sensation_upper', label: 'Sensation normal – upper limbs' },
      { id: 'coordination_upper', label: 'Coordination normal – upper limbs (finger-nose test)' },
    ],
  },
  {
    category: 'Lower Limb',
    items: [
      { id: 'sensation_lower', label: 'Sensation normal – lower limbs' },
      { id: 'coordination_lower', label: 'Coordination normal – lower limbs (heel-shin test)' },
    ],
  },
  {
    category: 'Eyes / Vision',
    items: [
      { id: 'pupils_equal', label: 'Pupils equal and reactive to light' },
      { id: 'eye_movement', label: 'Eye movements normal (no nystagmus)' },
    ],
  },
  {
    category: 'Balance',
    items: [
      { id: 'romberg', label: 'Romberg test – eyes closed, feet together (normal)' },
      { id: 'tandem_stance', label: 'Tandem stance (non-dominant foot behind dominant) – normal' },
    ],
  },
  {
    category: 'Hearing / Speech',
    items: [
      { id: 'speech', label: 'Speech normal (no slurring)' },
      { id: 'facial', label: 'Facial symmetry normal' },
    ],
  },
];

export function Step7NeurologicalScreen({ assessment, onSave, onNext, onPrev }: Props) {
  const existing = assessment.sections.neurological || {};
  const [checks, setChecks] = useState<Record<string, 'normal' | 'abnormal' | null>>(existing.checks || {});
  const [notes, setNotes] = useState(existing.notes || '');

  const allItems = NEURO_CHECKS.flatMap(c => c.items);
  const normalCount = allItems.filter(item => checks[item.id] === 'normal').length;
  const abnormalCount = allItems.filter(item => checks[item.id] === 'abnormal').length;

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSave('neurological', { checks, notes, normalCount, abnormalCount });
    }, 500);
    return () => clearTimeout(timeout);
  }, [checks, notes]); // eslint-disable-line

  const toggle = (id: string, value: 'normal' | 'abnormal') => {
    setChecks(c => ({ ...c, [id]: c[id] === value ? null : value }));
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: '#0D5C63' }}>
          Complete a brief neurological examination. Mark each item as Normal or Abnormal.
          Any abnormal findings require immediate referral to a physician.
        </div>
      </div>

      {abnormalCount > 0 && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 10, padding: 14, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: '#DC2626', marginBottom: 4 }}>
            {abnormalCount} Abnormal Finding{abnormalCount > 1 ? 's' : ''}
          </div>
          <div style={{ fontSize: 14, color: '#991B1B' }}>
            Abnormal neurological findings require immediate physician referral.
          </div>
        </div>
      )}

      {NEURO_CHECKS.map(category => (
        <div key={category.category} style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#374151' }}>{category.category}</h4>
          {category.items.map(item => (
            <div key={item.id} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 14, color: '#374151', marginBottom: 6, lineHeight: 1.4 }}>{item.label}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => toggle(item.id, 'normal')}
                  style={{
                    flex: 1, padding: '8px', borderRadius: 8, border: '1.5px solid',
                    borderColor: checks[item.id] === 'normal' ? '#16A34A' : '#D1D5DB',
                    background: checks[item.id] === 'normal' ? '#DCFCE7' : 'white',
                    color: checks[item.id] === 'normal' ? '#16A34A' : '#6B7280',
                    fontWeight: 600, cursor: 'pointer', fontSize: 14, minHeight: 40,
                  }}
                >
                  ✓ Normal
                </button>
                <button
                  onClick={() => toggle(item.id, 'abnormal')}
                  style={{
                    flex: 1, padding: '8px', borderRadius: 8, border: '1.5px solid',
                    borderColor: checks[item.id] === 'abnormal' ? '#DC2626' : '#D1D5DB',
                    background: checks[item.id] === 'abnormal' ? '#FEE2E2' : 'white',
                    color: checks[item.id] === 'abnormal' ? '#DC2626' : '#6B7280',
                    fontWeight: 600, cursor: 'pointer', fontSize: 14, minHeight: 40,
                  }}
                >
                  ✗ Abnormal
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Notes */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: '#374151' }}>Clinical Notes</h4>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #D1D5DB', fontSize: 14, outline: 'none', minHeight: 80, resize: 'vertical', boxSizing: 'border-box' }}
          placeholder="Additional neurological findings or observations..."
        />
      </div>

      {/* Summary */}
      <div style={{ background: '#F3F4F6', borderRadius: 10, padding: 14, marginBottom: 16, display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#16A34A' }}>{normalCount}</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Normal</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#DC2626' }}>{abnormalCount}</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Abnormal</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#6B7280' }}>{allItems.length - normalCount - abnormalCount}</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Not Assessed</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onPrev} style={{ flex: 1, background: 'white', color: '#374151', border: '1.5px solid #D1D5DB', borderRadius: 12, padding: '14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', minHeight: 52 }}>
          Back
        </button>
        <button onClick={onNext} style={{ flex: 2, background: '#0D5C63', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 16, cursor: 'pointer', minHeight: 52 }}>
          Next: Tandem Gait
        </button>
      </div>
    </div>
  );
}
