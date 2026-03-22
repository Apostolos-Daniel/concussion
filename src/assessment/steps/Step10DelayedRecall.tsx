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

const WORD_LISTS = [
  ['Elbow', 'Apple', 'Carpet', 'Saddle', 'Bubble'],
  ['Candle', 'Sugar', 'Sandwich', 'Wagon', 'Finger'],
  ['Baby', 'Monkey', 'Perfume', 'Sunset', 'Iron'],
];

export function Step10DelayedRecall({ assessment, onSave, onNext, onPrev }: Props) {
  const existing = assessment.sections.delayedRecall || {};
  const wordListIndex = assessment.sections.cognitive?.wordListIndex ?? 0;
  const words = WORD_LISTS[wordListIndex];

  const [recalled, setRecalled] = useState<Record<string, boolean>>(existing.recalled || {});
  const [mode, setMode] = useState<'free' | 'cued'>(existing.mode || 'free');
  const [freeRecall, setFreeRecall] = useState(existing.freeRecall || '');
  const [elapsedMinutes, setElapsedMinutes] = useState<number | null>(existing.elapsedMinutes ?? null);

  const score = words.filter(w => recalled[w]).length;

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSave('delayedRecall', { recalled, score, mode, freeRecall, elapsedMinutes, words });
    }, 500);
    return () => clearTimeout(timeout);
  }, [recalled, mode, freeRecall, elapsedMinutes]); // eslint-disable-line

  return (
    <div style={{ padding: 16 }}>
      {/* Timing reminder */}
      <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10, padding: 14, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: '#D97706', marginBottom: 4 }}>Timing Requirement</div>
        <div style={{ fontSize: 14, color: '#92400E' }}>
          Delayed recall must be conducted <strong>15–20 minutes</strong> after the immediate memory task (Step 6). This tests the athlete's ability to remember the words without being told them again.
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: '#0D5C63' }}>Elapsed Time</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="number"
            value={elapsedMinutes ?? ''}
            onChange={e => setElapsedMinutes(e.target.value === '' ? null : Number(e.target.value))}
            placeholder="minutes"
            min={0}
            max={60}
            style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1.5px solid #D1D5DB', fontSize: 15, outline: 'none', minHeight: 44, boxSizing: 'border-box' }}
          />
          <span style={{ color: '#6B7280', fontSize: 14, flexShrink: 0 }}>minutes since Step 6</span>
        </div>
        {elapsedMinutes !== null && (elapsedMinutes < 15 || elapsedMinutes > 25) && (
          <div style={{ marginTop: 8, fontSize: 13, color: '#D97706', fontWeight: 600 }}>
            Note: Recommend 15–20 minutes. Current: {elapsedMinutes} minutes.
          </div>
        )}
      </div>

      {/* Recall mode */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: '#0D5C63' }}>Recall Mode</h3>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setMode('free')}
            style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid', borderColor: mode === 'free' ? '#0D5C63' : '#D1D5DB', background: mode === 'free' ? '#F0FDFA' : 'white', color: mode === 'free' ? '#0D5C63' : '#6B7280', fontWeight: 700, cursor: 'pointer', fontSize: 14, minHeight: 44 }}
          >
            Free Recall
          </button>
          <button
            onClick={() => setMode('cued')}
            style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid', borderColor: mode === 'cued' ? '#0D5C63' : '#D1D5DB', background: mode === 'cued' ? '#F0FDFA' : 'white', color: mode === 'cued' ? '#0D5C63' : '#6B7280', fontWeight: 700, cursor: 'pointer', fontSize: 14, minHeight: 44 }}
          >
            Cued Recall
          </button>
        </div>
        {mode === 'free' && (
          <p style={{ margin: '10px 0 0', fontSize: 13, color: '#6B7280' }}>
            Ask: "Tell me all the words from the earlier list you can remember."
          </p>
        )}
        {mode === 'cued' && (
          <p style={{ margin: '10px 0 0', fontSize: 13, color: '#6B7280' }}>
            Provide semantic category cues if athlete can't recall (e.g., "One was a fruit" for Apple).
          </p>
        )}
      </div>

      {/* Free recall input */}
      {mode === 'free' && (
        <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Athlete's free recall response:</label>
          <textarea
            value={freeRecall}
            onChange={e => setFreeRecall(e.target.value)}
            placeholder="Type what the athlete says..."
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #D1D5DB', fontSize: 14, outline: 'none', minHeight: 70, resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>
      )}

      {/* Word scoring */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0D5C63' }}>Score Words Recalled</h3>
          <span style={{ fontSize: 20, fontWeight: 800, color: score >= 4 ? '#16A34A' : score >= 2 ? '#D97706' : '#DC2626' }}>
            {score}/5
          </span>
        </div>
        <p style={{ margin: '0 0 12px', fontSize: 14, color: '#6B7280' }}>
          Word list used in Step 6:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {words.map(word => (
            <label
              key={word}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 10,
                background: recalled[word] ? '#DCFCE7' : '#F9FAFB',
                border: `1.5px solid ${recalled[word] ? '#86EFAC' : '#E5E7EB'}`,
                cursor: 'pointer',
                minHeight: 48,
              }}
            >
              <input
                type="checkbox"
                checked={!!recalled[word]}
                onChange={e => setRecalled(r => ({ ...r, [word]: e.target.checked }))}
                style={{ width: 22, height: 22, accentColor: '#16A34A', cursor: 'pointer' }}
              />
              <span style={{ fontSize: 16, fontWeight: 600, color: recalled[word] ? '#16A34A' : '#374151' }}>
                {word}
              </span>
              {recalled[word] && <span style={{ marginLeft: 'auto', color: '#16A34A', fontSize: 18 }}>✓</span>}
            </label>
          ))}
        </div>
      </div>

      {/* Interpretation */}
      <div style={{
        background: score >= 4 ? '#DCFCE7' : score >= 2 ? '#FEF3C7' : '#FEE2E2',
        borderRadius: 10, padding: 14, marginBottom: 16, textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: score >= 4 ? '#16A34A' : score >= 2 ? '#D97706' : '#DC2626' }}>
          {score}/5
        </div>
        <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Delayed Recall Score</div>
        {score < 4 && (
          <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600, color: score >= 2 ? '#D97706' : '#DC2626' }}>
            {score < 2 ? 'Significant memory deficit' : 'Memory deficit present'} — clinical follow-up required
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onPrev} style={{ flex: 1, background: 'white', color: '#374151', border: '1.5px solid #D1D5DB', borderRadius: 12, padding: '14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', minHeight: 52 }}>
          Back
        </button>
        <button onClick={onNext} style={{ flex: 2, background: '#0D5C63', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 16, cursor: 'pointer', minHeight: 52 }}>
          Next: Decision
        </button>
      </div>
    </div>
  );
}
