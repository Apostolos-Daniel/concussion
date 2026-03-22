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

const ORIENTATION_QUESTIONS = [
  { id: 'date', question: 'What is the date today?' },
  { id: 'month', question: 'What month is it?' },
  { id: 'year', question: 'What year is it?' },
  { id: 'dayOfWeek', question: 'What day of the week is it?' },
  { id: 'time', question: 'What time is it right now? (within 1 hour)' },
];

const WORD_LISTS = [
  ['Elbow', 'Apple', 'Carpet', 'Saddle', 'Bubble'],
  ['Candle', 'Sugar', 'Sandwich', 'Wagon', 'Finger'],
  ['Baby', 'Monkey', 'Perfume', 'Sunset', 'Iron'],
];

const DIGIT_SEQUENCES_FORWARD = [
  '4-9-3',
  '6-2-9',
  '3-8-1-4',
  '3-2-7-9',
  '6-2-9-7-1',
  '1-5-2-8-6',
  '7-1-8-4-6-2',
  '5-3-9-1-4-8',
];

const DIGIT_SEQUENCES_BACKWARD = [
  '1-4',
  '6-2',
  '5-2-6',
  '4-1-5',
  '1-7-9-5',
  '4-9-6-8',
  '6-8-3-7-2',
  '4-8-5-2-7',
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function Step6CognitiveScreening({ assessment, onSave, onNext, onPrev }: Props) {
  const existing = assessment.sections.cognitive || {};
  const [orientation, setOrientation] = useState<Record<string, boolean | null>>(existing.orientation || {});
  const [wordListIndex, setWordListIndex] = useState(existing.wordListIndex ?? 0);
  const [immediateMemory, setImmediateMemory] = useState<Record<string, boolean[]>>(existing.immediateMemory || {});
  const [digitForward, setDigitForward] = useState<Record<string, boolean | null>>(existing.digitForward || {});
  const [digitBackward, setDigitBackward] = useState<Record<string, boolean | null>>(existing.digitBackward || {});
  const [monthsBackward, setMonthsBackward] = useState(existing.monthsBackward || '');
  const [monthsScore, setMonthsScore] = useState<number | null>(existing.monthsScore ?? null);
  const [delayedRecallMarker, setDelayedRecallMarker] = useState(existing.delayedRecallMarker || false);
  const [_monthsTimerDone, setMonthsTimerDone] = useState(false);

  const words = WORD_LISTS[wordListIndex];

  // Orientation score
  const orientScore = Object.values(orientation).filter(v => v === true).length;

  // Immediate memory scores per trial
  const imScores = [0, 1, 2].map(trial => {
    const trialData = immediateMemory[`trial${trial}`] || [];
    return trialData.filter(Boolean).length;
  });
  const imTotal = imScores.reduce((a, b) => a + b, 0);

  // Digit span scores
  const fwdPassed = DIGIT_SEQUENCES_FORWARD.filter((_, i) => digitForward[`f${i}`] === true).length;
  const bwdPassed = DIGIT_SEQUENCES_BACKWARD.filter((_, i) => digitBackward[`b${i}`] === true).length;

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSave('cognitive', {
        orientation, orientScore,
        wordListIndex, words,
        immediateMemory, imScores, imTotal,
        digitForward, digitBackward,
        digitFwdScore: fwdPassed, digitBwdScore: bwdPassed,
        monthsBackward, monthsScore,
        delayedRecallMarker,
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [orientation, immediateMemory, digitForward, digitBackward, monthsBackward, monthsScore, delayedRecallMarker, wordListIndex]); // eslint-disable-line


  const toggleImmediate = (trial: number, wordIdx: number) => {
    setImmediateMemory(im => {
      const key = `trial${trial}`;
      const current = im[key] || new Array(5).fill(null);
      const updated = [...current];
      updated[wordIdx] = !updated[wordIdx];
      return { ...im, [key]: updated };
    });
  };

  return (
    <div style={{ padding: 16 }}>
      {/* Word list selector */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700, color: '#0D5C63' }}>Word List Selection</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          {WORD_LISTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setWordListIndex(i)}
              style={{
                flex: 1, padding: '10px', borderRadius: 8,
                background: wordListIndex === i ? '#0D5C63' : 'white',
                color: wordListIndex === i ? 'white' : '#374151',
                border: `1.5px solid ${wordListIndex === i ? '#0D5C63' : '#D1D5DB'}`,
                fontWeight: 600, cursor: 'pointer', minHeight: 44, fontSize: 14,
              }}
            >
              List {i + 1}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {words.map(w => (
            <span key={w} style={{ background: '#F0FDFA', color: '#0D5C63', padding: '4px 10px', borderRadius: 6, fontSize: 14, fontWeight: 600 }}>{w}</span>
          ))}
        </div>
      </div>

      {/* Orientation */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0D5C63' }}>Orientation</h3>
          <span style={{ fontSize: 16, fontWeight: 800, color: orientScore < 5 ? '#DC2626' : '#16A34A' }}>{orientScore}/5</span>
        </div>
        {ORIENTATION_QUESTIONS.map(q => (
          <div key={q.id} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 14, color: '#374151', marginBottom: 6 }}>{q.question}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setOrientation(o => ({...o, [q.id]: true}))} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1.5px solid', borderColor: orientation[q.id] === true ? '#16A34A' : '#D1D5DB', background: orientation[q.id] === true ? '#DCFCE7' : 'white', color: orientation[q.id] === true ? '#16A34A' : '#6B7280', fontWeight: 600, cursor: 'pointer', minHeight: 40 }}>✓ Correct</button>
              <button onClick={() => setOrientation(o => ({...o, [q.id]: false}))} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1.5px solid', borderColor: orientation[q.id] === false ? '#DC2626' : '#D1D5DB', background: orientation[q.id] === false ? '#FEE2E2' : 'white', color: orientation[q.id] === false ? '#DC2626' : '#6B7280', fontWeight: 600, cursor: 'pointer', minHeight: 40 }}>✗ Incorrect</button>
            </div>
          </div>
        ))}
      </div>

      {/* Immediate Memory - 3 trials */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0D5C63' }}>Immediate Memory (3 Trials)</h3>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0D5C63' }}>{imTotal}/15</span>
        </div>
        <p style={{ margin: '0 0 12px', fontSize: 13, color: '#6B7280' }}>
          Read 5 words. Ask athlete to recall. Repeat for 3 trials. Check each word recalled.
        </p>
        {[0, 1, 2].map(trial => (
          <div key={trial} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#374151' }}>Trial {trial + 1}</span>
              <span style={{ fontWeight: 700, color: '#0D5C63' }}>{imScores[trial]}/5</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {words.map((word, wi) => {
                const recalled = (immediateMemory[`trial${trial}`] || [])[wi];
                return (
                  <button
                    key={wi}
                    onClick={() => toggleImmediate(trial, wi)}
                    style={{
                      padding: '6px 12px', borderRadius: 8,
                      background: recalled ? '#DCFCE7' : '#F9FAFB',
                      color: recalled ? '#16A34A' : '#6B7280',
                      border: `1.5px solid ${recalled ? '#86EFAC' : '#E5E7EB'}`,
                      cursor: 'pointer', fontWeight: 600, fontSize: 13, minHeight: 36,
                    }}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Digit Span Forward */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0D5C63' }}>Digit Span – Forward</h3>
          <span style={{ fontWeight: 700, color: '#0D5C63' }}>{fwdPassed}</span>
        </div>
        <p style={{ margin: '0 0 10px', fontSize: 13, color: '#6B7280' }}>Read digits at 1 per second. Stop after 2 consecutive fails.</p>
        {DIGIT_SEQUENCES_FORWARD.map((seq, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 600, flex: 1, color: '#374151' }}>{seq}</span>
            <button onClick={() => setDigitForward(d => ({...d, [`f${i}`]: true}))} style={{ padding: '6px 10px', borderRadius: 6, border: '1.5px solid', borderColor: digitForward[`f${i}`] === true ? '#16A34A' : '#D1D5DB', background: digitForward[`f${i}`] === true ? '#DCFCE7' : 'white', color: digitForward[`f${i}`] === true ? '#16A34A' : '#6B7280', fontWeight: 600, cursor: 'pointer', fontSize: 13, minHeight: 36 }}>✓</button>
            <button onClick={() => setDigitForward(d => ({...d, [`f${i}`]: false}))} style={{ padding: '6px 10px', borderRadius: 6, border: '1.5px solid', borderColor: digitForward[`f${i}`] === false ? '#DC2626' : '#D1D5DB', background: digitForward[`f${i}`] === false ? '#FEE2E2' : 'white', color: digitForward[`f${i}`] === false ? '#DC2626' : '#6B7280', fontWeight: 600, cursor: 'pointer', fontSize: 13, minHeight: 36 }}>✗</button>
          </div>
        ))}
      </div>

      {/* Digit Span Backward */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0D5C63' }}>Digit Span – Backward</h3>
          <span style={{ fontWeight: 700, color: '#0D5C63' }}>{bwdPassed}</span>
        </div>
        <p style={{ margin: '0 0 10px', fontSize: 13, color: '#6B7280' }}>Read digits, athlete repeats in reverse. Stop after 2 consecutive fails.</p>
        {DIGIT_SEQUENCES_BACKWARD.map((seq, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 600, flex: 1, color: '#374151' }}>{seq}</span>
            <button onClick={() => setDigitBackward(d => ({...d, [`b${i}`]: true}))} style={{ padding: '6px 10px', borderRadius: 6, border: '1.5px solid', borderColor: digitBackward[`b${i}`] === true ? '#16A34A' : '#D1D5DB', background: digitBackward[`b${i}`] === true ? '#DCFCE7' : 'white', color: digitBackward[`b${i}`] === true ? '#16A34A' : '#6B7280', fontWeight: 600, cursor: 'pointer', fontSize: 13, minHeight: 36 }}>✓</button>
            <button onClick={() => setDigitBackward(d => ({...d, [`b${i}`]: false}))} style={{ padding: '6px 10px', borderRadius: 6, border: '1.5px solid', borderColor: digitBackward[`b${i}`] === false ? '#DC2626' : '#D1D5DB', background: digitBackward[`b${i}`] === false ? '#FEE2E2' : 'white', color: digitBackward[`b${i}`] === false ? '#DC2626' : '#6B7280', fontWeight: 600, cursor: 'pointer', fontSize: 13, minHeight: 36 }}>✗</button>
          </div>
        ))}
      </div>

      {/* Months Backward */}
      <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: '#0D5C63' }}>Months in Reverse Order</h3>
        <p style={{ margin: '0 0 12px', fontSize: 13, color: '#6B7280' }}>Ask athlete to say the months in reverse order. Time them for 30 seconds.</p>
        <Timer
          durationSeconds={30}
          label="30 second timer"
          onComplete={() => setMonthsTimerDone(true)}
        />
        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Months athlete said (in order they said them)</label>
          <input
            type="text"
            value={monthsBackward}
            onChange={e => setMonthsBackward(e.target.value)}
            placeholder="e.g. December, November, October..."
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #D1D5DB', fontSize: 14, outline: 'none', minHeight: 44, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Score (number of correct months in sequence)</label>
          <input
            type="number"
            value={monthsScore ?? ''}
            onChange={e => setMonthsScore(e.target.value === '' ? null : Number(e.target.value))}
            min={0} max={12}
            placeholder="0–12"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #D1D5DB', fontSize: 15, outline: 'none', minHeight: 44, boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Delayed Recall Marker */}
      <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10, padding: 14, marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={delayedRecallMarker}
            onChange={e => setDelayedRecallMarker(e.target.checked)}
            style={{ width: 20, height: 20, marginTop: 2, accentColor: '#D97706' }}
          />
          <div>
            <div style={{ fontWeight: 700, color: '#92400E', fontSize: 15 }}>Delayed Recall Marker Set</div>
            <div style={{ fontSize: 13, color: '#78350F', marginTop: 2 }}>
              Check this after reading the word list to athlete. The delayed recall (Step 10) should be done in 15–20 minutes.
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {MONTHS.map((m, i) => (
                <span key={i} style={{ fontSize: 11, background: '#FEF9C3', padding: '2px 6px', borderRadius: 4, color: '#78350F' }}>{m}</span>
              ))}
            </div>
          </div>
        </label>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onPrev} style={{ flex: 1, background: 'white', color: '#374151', border: '1.5px solid #D1D5DB', borderRadius: 12, padding: '14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', minHeight: 52 }}>
          Back
        </button>
        <button onClick={onNext} style={{ flex: 2, background: '#0D5C63', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 16, cursor: 'pointer', minHeight: 52 }}>
          Next: Neurological
        </button>
      </div>
    </div>
  );
}
