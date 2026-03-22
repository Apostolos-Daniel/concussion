import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAthletes } from '../hooks/useAthletes';
import { useAssessments, createAssessment } from '../hooks/useAssessments';
import type { Athlete } from '../types';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function AssessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedAthleteId = searchParams.get('athleteId');

  const athletes = useAthletes();
  const [step, setStep] = useState<'select-athlete' | 'select-type' | 'select-baseline' | 'confirm'>('select-athlete');
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [assessType, setAssessType] = useState<'baseline' | 'post-incident' | null>(null);
  const [baselineId, setBaselineId] = useState<string | null>(null);
  const [completedBy, setCompletedBy] = useState('');
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);

  const athleteAssessments = useAssessments(selectedAthlete?.id);
  const baselineAssessments = (athleteAssessments || []).filter(
    a => a.type === 'baseline' && a.status === 'complete'
  );

  // Auto-select athlete if preselected
  useState(() => {
    if (preselectedAthleteId && athletes) {
      const a = athletes.find(a => a.id === preselectedAthleteId);
      if (a) {
        setSelectedAthlete(a);
        setStep('select-type');
      }
    }
  });

  const filteredAthletes = (athletes || []).filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.sport.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectAthlete = (a: Athlete) => {
    setSelectedAthlete(a);
    setStep('select-type');
  };

  const handleSelectType = (type: 'baseline' | 'post-incident') => {
    setAssessType(type);
    if (type === 'post-incident' && baselineAssessments.length > 0) {
      setStep('select-baseline');
    } else {
      setStep('confirm');
    }
  };

  const handleStart = async () => {
    if (!selectedAthlete || !assessType || !completedBy.trim()) return;
    setCreating(true);
    const a = await createAssessment({
      athleteId: selectedAthlete.id,
      type: assessType,
      date: new Date().toISOString(),
      completedBy: completedBy.trim(),
      ...(baselineId ? { baselineAssessmentId: baselineId } : {}),
    });
    setCreating(false);
    navigate(`/assess/${a.id}`);
  };

  const back = () => {
    if (step === 'select-type') setStep('select-athlete');
    else if (step === 'select-baseline') setStep('select-type');
    else if (step === 'confirm') {
      if (assessType === 'post-incident' && baselineAssessments.length > 0) setStep('select-baseline');
      else setStep('select-type');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 64 }}>
      {/* Header */}
      <div style={{ background: '#0D5C63', padding: '16px 16px 16px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {step !== 'select-athlete' && (
            <button onClick={back} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4, minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
          )}
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'white' }}>
            {step === 'select-athlete' ? 'New Assessment' :
             step === 'select-type' ? 'Assessment Type' :
             step === 'select-baseline' ? 'Select Baseline' :
             'Start Assessment'}
          </h1>
        </div>
        {step === 'select-athlete' && (
          <div style={{ position: 'relative', marginTop: 10 }}>
            <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search athletes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10, border: 'none', fontSize: 15, background: 'rgba(255,255,255,0.15)', color: 'white', outline: 'none', minHeight: 44, boxSizing: 'border-box' }}
            />
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Athlete selection */}
        {step === 'select-athlete' && (
          <div>
            {!athletes ? (
              <div style={{ padding: 32, textAlign: 'center', color: '#6B7280' }}>Loading...</div>
            ) : filteredAthletes.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: '#6B7280' }}>No athletes found. Add athletes first.</div>
              </div>
            ) : filteredAthletes.map(a => (
              <button
                key={a.id}
                onClick={() => handleSelectAthlete(a)}
                style={{ width: '100%', background: 'white', border: 'none', borderBottom: '1px solid #F3F4F6', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', minHeight: 72 }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0D5C63', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {getInitials(a.name)}
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: 16, color: '#111827' }}>{a.name}</div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>{a.sport}{a.team ? ` · ${a.team}` : ''}</div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            ))}
          </div>
        )}

        {/* Type selection */}
        {step === 'select-type' && selectedAthlete && (
          <div style={{ padding: 20 }}>
            <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0D5C63', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
                {getInitials(selectedAthlete.name)}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#0D5C63' }}>{selectedAthlete.name}</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>{selectedAthlete.sport}</div>
              </div>
            </div>

            <h3 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700 }}>Select Assessment Type</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={() => handleSelectType('baseline')}
                style={{
                  background: 'white', border: '2px solid #E5E7EB', borderRadius: 12, padding: 18,
                  textAlign: 'left', cursor: 'pointer', minHeight: 80,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 4 }}>Baseline Assessment</div>
                <div style={{ fontSize: 14, color: '#6B7280' }}>Pre-season reference assessment. No incident has occurred.</div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 12, background: '#DBEAFE', color: '#1D4ED8' }}>Baseline</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectType('post-incident')}
                style={{
                  background: 'white', border: '2px solid #E5E7EB', borderRadius: 12, padding: 18,
                  textAlign: 'left', cursor: 'pointer', minHeight: 80,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 4 }}>Post-Incident Assessment</div>
                <div style={{ fontSize: 14, color: '#6B7280' }}>After a suspected concussive event. Full SCAT 6 protocol.</div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 12, background: '#FEE2E2', color: '#DC2626' }}>Post-Incident</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Baseline selection */}
        {step === 'select-baseline' && (
          <div style={{ padding: 20 }}>
            <p style={{ color: '#6B7280', marginBottom: 20, fontSize: 15 }}>
              Select a baseline assessment to compare with. This helps identify changes from the athlete's normal values.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <button
                onClick={() => { setBaselineId(null); setStep('confirm'); }}
                style={{
                  background: baselineId === null ? '#F0FDFA' : 'white',
                  border: `2px solid ${baselineId === null ? '#0D5C63' : '#E5E7EB'}`,
                  borderRadius: 12, padding: 14, textAlign: 'left', cursor: 'pointer', minHeight: 56,
                }}
              >
                <div style={{ fontWeight: 600, color: '#374151' }}>Skip – No baseline comparison</div>
              </button>
              {baselineAssessments.map(b => (
                <button
                  key={b.id}
                  onClick={() => { setBaselineId(b.id); setStep('confirm'); }}
                  style={{
                    background: baselineId === b.id ? '#F0FDFA' : 'white',
                    border: `2px solid ${baselineId === b.id ? '#0D5C63' : '#E5E7EB'}`,
                    borderRadius: 12, padding: 14, textAlign: 'left', cursor: 'pointer', minHeight: 56,
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#374151' }}>{new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>Completed by {b.completedBy}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Confirm */}
        {step === 'confirm' && selectedAthlete && assessType && (
          <div style={{ padding: 20 }}>
            <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700 }}>Assessment Summary</h3>
              <InfoRow label="Athlete" value={selectedAthlete.name} />
              <InfoRow label="Type" value={assessType === 'baseline' ? 'Baseline' : 'Post-Incident'} />
              <InfoRow label="Date" value={new Date().toLocaleDateString()} />
              {baselineId && <InfoRow label="Baseline" value="Selected" />}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                Completed By *
              </label>
              <input
                type="text"
                placeholder="Clinician / Trainer name"
                value={completedBy}
                onChange={e => setCompletedBy(e.target.value)}
                style={{
                  width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid #D1D5DB',
                  fontSize: 15, outline: 'none', minHeight: 48, boxSizing: 'border-box', color: '#111827',
                }}
              />
            </div>

            {assessType === 'post-incident' && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 10, padding: 14, marginBottom: 20 }}>
                <div style={{ fontWeight: 700, color: '#DC2626', marginBottom: 4 }}>Important Notice</div>
                <div style={{ fontSize: 14, color: '#991B1B' }}>
                  If the athlete shows any signs of emergency (loss of consciousness, seizure, deteriorating condition), call emergency services immediately. Do not proceed with this assessment.
                </div>
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={!completedBy.trim() || creating}
              style={{
                width: '100%', background: '#0D5C63', color: 'white', border: 'none',
                borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 16,
                cursor: 'pointer', minHeight: 52,
                opacity: !completedBy.trim() ? 0.5 : 1,
              }}
            >
              {creating ? 'Starting...' : 'Begin Assessment'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F9FAFB', paddingBottom: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 14, color: '#6B7280' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{value}</span>
    </div>
  );
}
