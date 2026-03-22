import { useState } from 'react';
import { useAssessments } from '../hooks/useAssessments';
import { useAthletes } from '../hooks/useAthletes';
import { AssessmentCard } from '../components/AssessmentCard';

export function HistoryPage() {
  const assessments = useAssessments();
  const athletes = useAthletes();
  const [filterAthlete, setFilterAthlete] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'baseline' | 'post-incident'>('all');

  const filtered = (assessments || []).filter(a => {
    if (filterAthlete && a.athleteId !== filterAthlete) return false;
    if (filterType !== 'all' && a.type !== filterType) return false;
    return true;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 64 }}>
      {/* Header */}
      <div style={{ background: '#0D5C63', padding: '16px 16px 12px', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 700, color: 'white' }}>History</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={filterAthlete}
            onChange={e => setFilterAthlete(e.target.value)}
            style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: 'none', fontSize: 14, background: 'rgba(255,255,255,0.15)', color: 'white', outline: 'none', minHeight: 44 }}
          >
            <option value="">All Athletes</option>
            {(athletes || []).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
            style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: 'none', fontSize: 14, background: 'rgba(255,255,255,0.15)', color: 'white', outline: 'none', minHeight: 44 }}
          >
            <option value="all">All Types</option>
            <option value="baseline">Baseline</option>
            <option value="post-incident">Post-Incident</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {!assessments ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#6B7280' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <div style={{ fontWeight: 600, color: '#374151', marginBottom: 6 }}>No assessments found</div>
            <div style={{ fontSize: 14, color: '#6B7280' }}>Start a new assessment from the Assess tab</div>
          </div>
        ) : (
          filtered.map(a => <AssessmentCard key={a.id} assessment={a} />)
        )}
      </div>
    </div>
  );
}
