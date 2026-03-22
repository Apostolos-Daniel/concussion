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

const RED_FLAGS = [
  'Neck pain or tenderness',
  'Double vision',
  'Weakness or tingling/burning in arms or legs',
  'Severe or increasing headache',
  'Seizure or convulsion',
  'Loss of consciousness',
  'Deteriorating conscious state',
  'Vomiting',
  'Increasingly restless, agitated or combative',
];

export function Step3RedFlags({ assessment, onSave, onNext, onPrev }: Props) {
  const existing = assessment.sections.redFlags || {};
  const [flags, setFlags] = useState<Record<string, boolean>>(existing.flags || {});
  const [emergencyContacted, setEmergencyContacted] = useState(existing.emergencyContacted || false);

  const anyFlag = Object.values(flags).some(Boolean);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSave('redFlags', { flags, emergencyContacted });
    }, 500);
    return () => clearTimeout(timeout);
  }, [flags, emergencyContacted]); // eslint-disable-line

  return (
    <div style={{ padding: 16 }}>
      {/* Emergency banner */}
      <div
        style={{
          background: anyFlag ? '#DC2626' : '#F9FAFB',
          border: `2px solid ${anyFlag ? '#B91C1C' : '#E5E7EB'}`,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          transition: 'all 300ms ease',
        }}
      >
        {anyFlag ? (
          <>
            <div style={{ fontWeight: 800, fontSize: 18, color: 'white', marginBottom: 6 }}>
              🚨 EMERGENCY — CALL 000 / 911
            </div>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, marginBottom: 10 }}>
              One or more red flags are present. This athlete requires immediate emergency medical attention.
              DO NOT move the athlete if spinal injury is suspected.
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white', fontWeight: 600, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={emergencyContacted}
                onChange={e => setEmergencyContacted(e.target.checked)}
                style={{ width: 22, height: 22, accentColor: 'white' }}
              />
              Emergency services have been contacted
            </label>
          </>
        ) : (
          <div style={{ color: '#6B7280', fontSize: 14, textAlign: 'center' }}>
            No red flags currently selected. Check any that apply below.
          </div>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#DC2626' }}>Red Flag Symptoms</h3>
        <p style={{ margin: '0 0 14px', fontSize: 14, color: '#6B7280' }}>
          If ANY red flag is present, activate emergency services immediately.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {RED_FLAGS.map(flag => (
            <label
              key={flag}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px',
                borderRadius: 8,
                background: flags[flag] ? '#FEE2E2' : '#F9FAFB',
                border: `1px solid ${flags[flag] ? '#FCA5A5' : '#E5E7EB'}`,
                cursor: 'pointer',
                minHeight: 48,
              }}
            >
              <input
                type="checkbox"
                checked={!!flags[flag]}
                onChange={e => setFlags(f => ({ ...f, [flag]: e.target.checked }))}
                style={{ width: 20, height: 20, marginTop: 2, accentColor: '#DC2626', cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ fontSize: 15, color: flags[flag] ? '#DC2626' : '#374151', fontWeight: flags[flag] ? 600 : 400, lineHeight: 1.4 }}>
                {flag}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onPrev} style={{ flex: 1, background: 'white', color: '#374151', border: '1.5px solid #D1D5DB', borderRadius: 12, padding: '14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', minHeight: 52 }}>
          Back
        </button>
        <button onClick={onNext} style={{ flex: 2, background: '#0D5C63', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 16, cursor: 'pointer', minHeight: 52 }}>
          Next: Maddocks
        </button>
      </div>
    </div>
  );
}
