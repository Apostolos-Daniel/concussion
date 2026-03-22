import { useParams, useNavigate } from 'react-router-dom';
import { useAssessment } from '../hooks/useAssessments';
import { useAthlete } from '../hooks/useAthletes';
import { generatePDF } from '../utils/pdfGenerator';

export function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const assessment = useAssessment(id!);
  const athlete = useAthlete(assessment?.athleteId || '');

  if (assessment === undefined) {
    return <div style={{ padding: 32, textAlign: 'center', color: '#6B7280' }}>Loading...</div>;
  }
  if (!assessment) {
    return <div style={{ padding: 32, textAlign: 'center', color: '#6B7280' }}>Assessment not found.</div>;
  }

  const handleExport = () => {
    if (!athlete) return;
    generatePDF(assessment, athlete);
  };

  const s = assessment.sections;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 64 }}>
      {/* Header */}
      <div style={{ background: '#0D5C63', padding: '16px 16px 20px' }}>
        <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: 14, padding: 0, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12, minHeight: 44 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          History
        </button>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'white' }}>
          {athlete?.name || 'Assessment'}
        </h1>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
          {assessment.type === 'baseline' ? 'Baseline' : 'Post-Incident'} · {new Date(assessment.date).toLocaleDateString()}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {/* Status */}
        <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 2 }}>Status</div>
              <div style={{ fontWeight: 700, color: assessment.status === 'complete' ? '#16A34A' : '#D97706' }}>
                {assessment.status === 'complete' ? 'Complete' : 'In Progress'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 2 }}>Completed By</div>
              <div style={{ fontWeight: 600, color: '#111827' }}>{assessment.completedBy}</div>
            </div>
          </div>
        </div>

        {/* Resume or export */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {assessment.status !== 'complete' && (
            <button
              onClick={() => navigate(`/assess/${assessment.id}`)}
              style={{ flex: 1, background: '#0D5C63', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, fontSize: 15, cursor: 'pointer', minHeight: 48 }}
            >
              Resume Assessment
            </button>
          )}
          {assessment.status === 'complete' && (
            <button
              onClick={handleExport}
              style={{ flex: 1, background: '#0D5C63', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, fontSize: 15, cursor: 'pointer', minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export PDF
            </button>
          )}
        </div>

        {/* Section summaries */}
        <SectionCard title="Patient Info" data={s.patientInfo} />
        {s.observedSigns && <SectionCard title="Observed Signs" data={s.observedSigns} />}
        {s.redFlags && <SectionCard title="Red Flags" data={s.redFlags} />}
        {s.maddocks && <SectionCard title="Maddocks Questions" data={s.maddocks} />}
        {s.symptoms && <SectionCard title="Symptom Evaluation" data={s.symptoms} />}
        {s.cognitive && <SectionCard title="Cognitive Screening" data={s.cognitive} />}
        {s.neurological && <SectionCard title="Neurological Screen" data={s.neurological} />}
        {s.tandemGait && <SectionCard title="Tandem Gait" data={s.tandemGait} />}
        {s.bess && <SectionCard title="BESS" data={s.bess} />}
        {s.delayedRecall && <SectionCard title="Delayed Recall" data={s.delayedRecall} />}
        {s.decision && <SectionCard title="Final Decision" data={s.decision} />}
      </div>
    </div>
  );
}

function SectionCard({ title, data }: { title: string; data: any }) {
  if (!data) return null;
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: '#0D5C63' }}>{title}</h3>
      <pre style={{ margin: 0, fontSize: 12, color: '#374151', whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.6 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
