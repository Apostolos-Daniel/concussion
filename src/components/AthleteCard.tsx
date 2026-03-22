import { useNavigate } from 'react-router-dom';
import type { Athlete } from '../types';

interface AthleteCardProps {
  athlete: Athlete;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function AthleteCard({ athlete }: AthleteCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/athletes/${athlete.id}`)}
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
      <div style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: '#0D5C63',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 700,
        fontSize: 16,
        flexShrink: 0,
      }}>
        {getInitials(athlete.name)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 16, color: '#111827', marginBottom: 2 }}>
          {athlete.name}
        </div>
        <div style={{ fontSize: 13, color: '#6B7280' }}>
          {athlete.sport}{athlete.team ? ` · ${athlete.team}` : ''}{athlete.position ? ` · ${athlete.position}` : ''}
        </div>
      </div>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  );
}
