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

const SIGNS = [
  'Loss of consciousness',
  'Lying motionless on the playing surface',
  'Slow to get up after a direct or indirect head impact',
  'Unsteady on feet / balance problems',
  'Grabbing / clutching of head',
  'Dazed, blank or vacant look',
  'Visible facial injury in combination with any of the above',
];

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

export function Step2ObservedSigns({ assessment, onSave, onNext, onPrev }: Props) {
  const existing = assessment.sections.observedSigns || {};
  const [signs, setSigns] = useState<Record<string, boolean>>(existing.signs || {});
  const [notes, setNotes] = useState(existing.notes || '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSave('observedSigns', { signs, notes });
    }, 500);
    return () => clearTimeout(timeout);
  }, [signs, notes]); // eslint-disable-line

  const observed = Object.values(signs).filter(Boolean).length;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10, padding: 14, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: '#D97706', marginBottom: 4 }}>Observer Tool</div>
        <div style={{ fontSize: 14, color: '#92400E' }}>
          Note: This section is completed based on direct observation of the athlete at or around the time of injury.
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: '#0D5C63' }}>
          Observed Signs of Concussion
        </h3>
        <p style={{ margin: '0 0 14px', fontSize: 14, color: '#6B7280' }}>
          Check all signs observed. The presence of ANY ONE sign is sufficient to suspect concussion.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SIGNS.map(sign => (
            <label
              key={sign}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px',
                borderRadius: 8,
                background: signs[sign] ? '#FEE2E2' : '#F9FAFB',
                border: `1px solid ${signs[sign] ? '#FCA5A5' : '#E5E7EB'}`,
                cursor: 'pointer',
                marginBottom: 6,
                minHeight: 48,
              }}
            >
              <input
                type="checkbox"
                checked={!!signs[sign]}
                onChange={e => setSigns(s => ({ ...s, [sign]: e.target.checked }))}
                style={{ width: 20, height: 20, marginTop: 2, accentColor: '#DC2626', cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ fontSize: 15, color: signs[sign] ? '#DC2626' : '#374151', fontWeight: signs[sign] ? 600 : 400, lineHeight: 1.4 }}>
                {sign}
              </span>
            </label>
          ))}
        </div>

        {observed > 0 && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 8, padding: 12, marginTop: 12 }}>
            <div style={{ fontWeight: 700, color: '#DC2626' }}>
              {observed} sign{observed > 1 ? 's' : ''} observed — Concussion suspected
            </div>
            <div style={{ fontSize: 13, color: '#991B1B', marginTop: 4 }}>
              Remove athlete from play. Do not leave alone. Refer to healthcare professional.
            </div>
          </div>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: '#0D5C63' }}>Additional Notes</h3>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
          placeholder="Any additional observations..."
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onPrev} style={{ flex: 1, background: 'white', color: '#374151', border: '1.5px solid #D1D5DB', borderRadius: 12, padding: '14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', minHeight: 52 }}>
          Back
        </button>
        <button onClick={onNext} style={{ flex: 2, background: '#0D5C63', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 16, cursor: 'pointer', minHeight: 52 }}>
          Next: Red Flags
        </button>
      </div>
    </div>
  );
}
