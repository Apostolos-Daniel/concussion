import { useNavigate } from 'react-router-dom';
import type { Assessment } from '../types';
import { useAthlete } from '../hooks/useAthletes';

interface AssessmentCardProps {
  assessment: Assessment;
  showAthlete?: boolean;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function AssessmentCard({ assessment, showAthlete = true }: AssessmentCardProps) {
  const navigate = useNavigate();
  const athlete = useAthlete(assessment.athleteId);

  const typeBadge = assessment.type === 'baseline'
    ? { label: 'Baseline', bg: '#DBEAFE', color: '#1D4ED8' }
    : { label: 'Post-Incident', bg: '#FEE2E2', color: '#DC2626' };

  const statusBadge = assessment.status === 'complete'
    ? { label: 'Complete', bg: '#DCFCE7', color: '#16A34A' }
    : { label: 'In Progress', bg: '#FEF3C7', color: '#D97706' };

  return (
    <button
      onClick={() => navigate(`/history/${assessment.id}`)}
      style={{
        width: '100%',
        background: 'white',
        border: 'none',
        borderBottom: '1px solid #F3F4F6',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        textAlign: 'left',
        minHeight: 72,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {showAthlete && athlete && (
          <div style={{ fontWeight: 600, fontSize: 15, color: '#111827', marginBottom: 4 }}>
            {athlete.name}
          </div>
        )}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 12, background: typeBadge.bg, color: typeBadge.color }}>
            {typeBadge.label}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 12, background: statusBadge.bg, color: statusBadge.color }}>
            {statusBadge.label}
          </span>
        </div>
        <div style={{ fontSize: 13, color: '#6B7280' }}>
          {formatDate(assessment.date)} · By {assessment.completedBy}
        </div>
      </div>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  );
}
