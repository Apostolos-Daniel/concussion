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

const MADDOCKS_QUESTIONS = [
  {
    id: 'q1',
    question: 'What venue are we at today?',
    hint: 'Name of ground/facility',
  },
  {
    id: 'q2',
    question: 'Which half is it now?',
    hint: '1st, 2nd, 3rd, 4th quarter/half',
  },
  {
    id: 'q3',
    question: 'Who scored last in this match?',
    hint: 'Team or player name',
  },
  {
    id: 'q4',
    question: 'What team did you play last week/game?',
    hint: 'Opponent team name',
  },
  {
    id: 'q5',
    question: 'Did your team win the last game?',
    hint: 'Yes / No',
  },
];

export function Step4MaddocksQuestions({ assessment, onSave, onNext, onPrev }: Props) {
  const existing = assessment.sections.maddocks || {};
  const [answers, setAnswers] = useState<Record<string, { answer: string; correct: boolean | null }>>(
    existing.answers || {}
  );

  const totalCorrect = Object.values(answers).filter(a => a.correct === true).length;
  const totalAnswered = Object.values(answers).filter(a => a.correct !== null).length;

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSave('maddocks', { answers, score: totalCorrect, total: 5 });
    }, 500);
    return () => clearTimeout(timeout);
  }, [answers]); // eslint-disable-line

  const setAnswer = (id: string, answer: string) => {
    setAnswers(a => ({ ...a, [id]: { ...a[id], answer } }));
  };

  const setCorrect = (id: string, correct: boolean | null) => {
    setAnswers(a => ({ ...a, [id]: { ...a[id], correct } }));
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10, padding: 14, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: '#D97706', marginBottom: 4 }}>Maddocks Questions</div>
        <div style={{ fontSize: 14, color: '#92400E' }}>
          Ask each question. These questions have been validated for on-field assessment. Record the athlete's response and mark correct/incorrect.
        </div>
      </div>

      {MADDOCKS_QUESTIONS.map((q, i) => (
        <div key={q.id} style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 13, color: '#0D5C63', fontWeight: 600, marginBottom: 4 }}>Question {i + 1}</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 4 }}>{q.question}</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 10 }}>({q.hint})</div>
          <input
            type="text"
            placeholder="Athlete's response..."
            value={answers[q.id]?.answer || ''}
            onChange={e => setAnswer(q.id, e.target.value)}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #D1D5DB',
              fontSize: 15, outline: 'none', minHeight: 44, boxSizing: 'border-box', color: '#111827', marginBottom: 10,
            }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setCorrect(q.id, true)}
              style={{
                flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid',
                borderColor: answers[q.id]?.correct === true ? '#16A34A' : '#D1D5DB',
                background: answers[q.id]?.correct === true ? '#DCFCE7' : 'white',
                color: answers[q.id]?.correct === true ? '#16A34A' : '#6B7280',
                fontWeight: 700, cursor: 'pointer', fontSize: 15, minHeight: 44,
              }}
            >
              ✓ Correct
            </button>
            <button
              onClick={() => setCorrect(q.id, false)}
              style={{
                flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid',
                borderColor: answers[q.id]?.correct === false ? '#DC2626' : '#D1D5DB',
                background: answers[q.id]?.correct === false ? '#FEE2E2' : 'white',
                color: answers[q.id]?.correct === false ? '#DC2626' : '#6B7280',
                fontWeight: 700, cursor: 'pointer', fontSize: 15, minHeight: 44,
              }}
            >
              ✗ Incorrect
            </button>
          </div>
        </div>
      ))}

      {/* Score summary */}
      <div style={{
        background: totalAnswered === 5 ? (totalCorrect === 5 ? '#DCFCE7' : '#FEE2E2') : '#F3F4F6',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: totalAnswered === 5 ? (totalCorrect === 5 ? '#16A34A' : '#DC2626') : '#6B7280' }}>
          {totalCorrect}/5
        </div>
        <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Maddocks Score</div>
        {totalAnswered === 5 && totalCorrect < 5 && (
          <div style={{ marginTop: 8, fontWeight: 600, color: '#DC2626', fontSize: 14 }}>
            Score below maximum — consider concussion
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onPrev} style={{ flex: 1, background: 'white', color: '#374151', border: '1.5px solid #D1D5DB', borderRadius: 12, padding: '14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', minHeight: 52 }}>
          Back
        </button>
        <button onClick={onNext} style={{ flex: 2, background: '#0D5C63', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 16, cursor: 'pointer', minHeight: 52 }}>
          Next: Symptoms
        </button>
      </div>
    </div>
  );
}
