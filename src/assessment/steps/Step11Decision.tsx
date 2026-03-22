import { useState, useEffect } from 'react';
import { useAssessment } from '../../hooks/useAssessments';
import type { Assessment, Athlete } from '../../types';

interface Props {
  assessment: Assessment;
  athlete?: Athlete;
  onSave: (sectionId: string, data: any) => Promise<void>;
  onNext: () => void;
  onPrev: () => void;
  isBaseline: boolean;
  onComplete: () => void;
}

export function Step11Decision({ assessment, onSave, onPrev, isBaseline, onComplete }: Props) {
  const existing = assessment.sections.decision || {};
  const [diagnosis, setDiagnosis] = useState(existing.diagnosis || '');
  const [recommendations, setRecommendations] = useState(existing.recommendations || '');
  const [followUp, setFollowUp] = useState(existing.followUp || '');
  const [clearForReturn, setClearForReturn] = useState<boolean | null>(existing.clearForReturn ?? null);
  const [notes] = useState(existing.notes || '');
  const [completing, setCompleting] = useState(false);

  const baselineAssessment = useAssessment(assessment.baselineAssessmentId || '');

  // Compute summary scores from sections
  const s = assessment.sections;
  const symptomScore = s.symptoms?.totalScore ?? null;
  const symptomCount = s.symptoms?.symptomsPresent ?? null;
  const orientScore = s.cognitive?.orientScore ?? null;
  const imTotal = s.cognitive?.imTotal ?? null;
  const monthsScore = s.cognitive?.monthsScore ?? null;
  const delayedRecall = s.delayedRecall?.score ?? null;
  const bessScore = s.bess?.bessScore ?? null;
  const bestGaitTime = s.tandemGait?.bestTime ?? null;
  const maddocksScore = s.maddocks?.score ?? null;
  const hasRedFlags = s.redFlags ? Object.values(s.redFlags.flags || {}).some(Boolean) : false;
  const hasObservedSigns = s.observedSigns ? Object.values(s.observedSigns.signs || {}).some(Boolean) : false;

  // Baseline comparison
  const bs = baselineAssessment?.sections;

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSave('decision', { diagnosis, recommendations, followUp, clearForReturn, notes });
    }, 500);
    return () => clearTimeout(timeout);
  }, [diagnosis, recommendations, followUp, clearForReturn, notes]); // eslint-disable-line

  const handleComplete = async () => {
    setCompleting(true);
    await onSave('decision', { diagnosis, recommendations, followUp, clearForReturn, notes });
    onComplete();
  };

  return (
    <div style={{ padding: 16 }}>
      {/* Summary scores */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: '#0D5C63' }}>Assessment Summary</h3>
        {!isBaseline && hasRedFlags && (
          <div style={{ background: '#DC2626', color: 'white', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontWeight: 700, fontSize: 14 }}>
            ⚠ RED FLAGS PRESENT — Emergency referral indicated
          </div>
        )}
        {!isBaseline && hasObservedSigns && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontWeight: 600, fontSize: 14 }}>
            Observable signs of concussion noted
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {!isBaseline && maddocksScore !== null && (
            <ScoreRow label="Maddocks Score" value={`${maddocksScore}/5`} normal={maddocksScore === 5} />
          )}
          {symptomScore !== null && (
            <ScoreRow label="Symptom Total" value={`${symptomScore} (${symptomCount} symptoms)`} normal={symptomScore === 0} />
          )}
          {orientScore !== null && (
            <ScoreRow label="Orientation" value={`${orientScore}/5`} normal={orientScore === 5} />
          )}
          {imTotal !== null && (
            <ScoreRow label="Immediate Memory" value={`${imTotal}/15`} normal={imTotal >= 13} />
          )}
          {monthsScore !== null && (
            <ScoreRow label="Months Backward" value={`${monthsScore}/12`} normal={monthsScore >= 10} />
          )}
          {delayedRecall !== null && (
            <ScoreRow label="Delayed Recall" value={`${delayedRecall}/5`} normal={delayedRecall >= 4} />
          )}
          {bessScore !== null && (
            <ScoreRow label="BESS Score" value={`${bessScore}/60`} normal={bessScore >= 50} />
          )}
          {bestGaitTime !== null && (
            <ScoreRow label="Tandem Gait (best)" value={`${bestGaitTime?.toFixed(1)}s`} normal={bestGaitTime <= 14} />
          )}
        </div>
      </div>

      {/* Baseline comparison table */}
      {!isBaseline && baselineAssessment && bs && (
        <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflowX: 'auto' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: '#0D5C63' }}>
            Comparison with Baseline ({new Date(baselineAssessment.date).toLocaleDateString()})
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 6px', borderBottom: '2px solid #E5E7EB', color: '#6B7280', fontWeight: 600 }}>Measure</th>
                <th style={{ textAlign: 'center', padding: '8px 6px', borderBottom: '2px solid #E5E7EB', color: '#6B7280', fontWeight: 600 }}>Baseline</th>
                <th style={{ textAlign: 'center', padding: '8px 6px', borderBottom: '2px solid #E5E7EB', color: '#6B7280', fontWeight: 600 }}>Now</th>
                <th style={{ textAlign: 'center', padding: '8px 6px', borderBottom: '2px solid #E5E7EB', color: '#6B7280', fontWeight: 600 }}>Change</th>
              </tr>
            </thead>
            <tbody>
              <CompareRow
                label="Symptom Score"
                baseline={bs.symptoms?.totalScore ?? null}
                current={s.symptoms?.totalScore ?? null}
                higherIsBetter={false}
              />
              <CompareRow
                label="Orientation"
                baseline={bs.cognitive?.orientScore ?? null}
                current={s.cognitive?.orientScore ?? null}
                higherIsBetter={true}
              />
              <CompareRow
                label="Immediate Memory"
                baseline={bs.cognitive?.imTotal ?? null}
                current={s.cognitive?.imTotal ?? null}
                higherIsBetter={true}
              />
              <CompareRow
                label="Delayed Recall"
                baseline={bs.delayedRecall?.score ?? null}
                current={s.delayedRecall?.score ?? null}
                higherIsBetter={true}
              />
              <CompareRow
                label="BESS Score"
                baseline={bs.bess?.bessScore ?? null}
                current={s.bess?.bessScore ?? null}
                higherIsBetter={true}
              />
              <CompareRow
                label="Tandem Gait (best)"
                baseline={bs.tandemGait?.bestTime ?? null}
                current={s.tandemGait?.bestTime ?? null}
                higherIsBetter={false}
                unit="s"
              />
            </tbody>
          </table>
        </div>
      )}

      {/* Clinical decision */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: '#0D5C63' }}>Clinical Decision</h3>

        {!isBaseline && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Clear for Return to Play?</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setClearForReturn(false)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid',
                  borderColor: clearForReturn === false ? '#DC2626' : '#D1D5DB',
                  background: clearForReturn === false ? '#FEE2E2' : 'white',
                  color: clearForReturn === false ? '#DC2626' : '#6B7280',
                  fontWeight: 700, cursor: 'pointer', fontSize: 15, minHeight: 48,
                }}
              >
                No – Remove
              </button>
              <button
                onClick={() => setClearForReturn(true)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid',
                  borderColor: clearForReturn === true ? '#16A34A' : '#D1D5DB',
                  background: clearForReturn === true ? '#DCFCE7' : 'white',
                  color: clearForReturn === true ? '#16A34A' : '#6B7280',
                  fontWeight: 700, cursor: 'pointer', fontSize: 15, minHeight: 48,
                }}
              >
                Cleared
              </button>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            {isBaseline ? 'Baseline Notes' : 'Clinical Impression / Diagnosis'}
          </label>
          <textarea
            value={diagnosis}
            onChange={e => setDiagnosis(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #D1D5DB', fontSize: 14, outline: 'none', minHeight: 80, resize: 'vertical', boxSizing: 'border-box' }}
            placeholder={isBaseline ? 'Baseline assessment notes...' : 'e.g. Suspected concussion – remove from play...'}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Recommendations</label>
          <textarea
            value={recommendations}
            onChange={e => setRecommendations(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #D1D5DB', fontSize: 14, outline: 'none', minHeight: 80, resize: 'vertical', boxSizing: 'border-box' }}
            placeholder="Return-to-play protocol, medical referral, monitoring instructions..."
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Follow-up Plan</label>
          <textarea
            value={followUp}
            onChange={e => setFollowUp(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #D1D5DB', fontSize: 14, outline: 'none', minHeight: 60, resize: 'vertical', boxSizing: 'border-box' }}
            placeholder="When and with whom to follow up..."
          />
        </div>
      </div>

      {/* Complete button */}
      <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 10, padding: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: '#0D5C63', marginBottom: 8 }}>
          Once you complete the assessment, it will be saved and you can export a PDF report.
        </div>
        <button
          onClick={handleComplete}
          disabled={completing}
          style={{
            width: '100%', background: '#0D5C63', color: 'white', border: 'none',
            borderRadius: 12, padding: '16px', fontWeight: 800, fontSize: 17,
            cursor: 'pointer', minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {completing ? 'Completing...' : '✓ Complete Assessment'}
        </button>
      </div>

      <button onClick={onPrev} style={{ width: '100%', background: 'white', color: '#374151', border: '1.5px solid #D1D5DB', borderRadius: 12, padding: '14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', minHeight: 52 }}>
        Back
      </button>
    </div>
  );
}

function ScoreRow({ label, value, normal }: { label: string; value: string; normal: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
      <span style={{ fontSize: 14, color: '#374151' }}>{label}</span>
      <span style={{
        fontSize: 14, fontWeight: 700,
        color: normal ? '#16A34A' : '#DC2626',
        background: normal ? '#DCFCE7' : '#FEE2E2',
        padding: '2px 8px', borderRadius: 6,
      }}>
        {value}
      </span>
    </div>
  );
}

function CompareRow({
  label,
  baseline,
  current,
  higherIsBetter,
  unit = '',
}: {
  label: string;
  baseline: number | null;
  current: number | null;
  higherIsBetter: boolean;
  unit?: string;
}) {
  if (baseline === null && current === null) return null;
  const diff = baseline !== null && current !== null ? current - baseline : null;
  const improved = diff !== null ? (higherIsBetter ? diff >= 0 : diff <= 0) : null;

  return (
    <tr>
      <td style={{ padding: '8px 6px', borderBottom: '1px solid #F3F4F6', color: '#374151', fontWeight: 500 }}>{label}</td>
      <td style={{ padding: '8px 6px', borderBottom: '1px solid #F3F4F6', textAlign: 'center', color: '#6B7280' }}>
        {baseline !== null ? `${typeof baseline === 'number' && !Number.isInteger(baseline) ? baseline.toFixed(1) : baseline}${unit}` : '–'}
      </td>
      <td style={{ padding: '8px 6px', borderBottom: '1px solid #F3F4F6', textAlign: 'center', fontWeight: 600, color: '#111827' }}>
        {current !== null ? `${typeof current === 'number' && !Number.isInteger(current) ? current.toFixed(1) : current}${unit}` : '–'}
      </td>
      <td style={{ padding: '8px 6px', borderBottom: '1px solid #F3F4F6', textAlign: 'center' }}>
        {diff !== null && (
          <span style={{
            fontSize: 13, fontWeight: 700,
            color: improved ? '#16A34A' : '#DC2626',
          }}>
            {diff > 0 ? '+' : ''}{typeof diff === 'number' && !Number.isInteger(diff) ? diff.toFixed(1) : diff}{unit}
          </span>
        )}
      </td>
    </tr>
  );
}
