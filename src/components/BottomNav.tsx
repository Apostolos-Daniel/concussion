import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  {
    path: '/athletes',
    label: 'Athletes',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#0D5C63' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    path: '/assess',
    label: 'Assess',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#0D5C63' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    path: '/history',
    label: 'History',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#0D5C63' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    path: '/assessors',
    label: 'Assessors',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#0D5C63' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
        <line x1="19" y1="8" x2="19" y2="14"/>
        <line x1="22" y1="11" x2="16" y2="11"/>
      </svg>
    ),
  },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/athletes') return location.pathname.startsWith('/athletes');
    if (path === '/assess') return location.pathname.startsWith('/assess');
    if (path === '/history') return location.pathname.startsWith('/history');
    if (path === '/assessors') return location.pathname.startsWith('/assessors');
    return false;
  };

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 64,
      background: 'white',
      borderTop: '1px solid #E5E7EB',
      display: 'flex',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.map(tab => {
        const active = isActive(tab.path);
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              gap: 2,
              minHeight: 64,
            }}
            aria-label={tab.label}
          >
            {tab.icon(active)}
            <span style={{
              fontSize: 11,
              fontWeight: active ? 600 : 400,
              color: active ? '#0D5C63' : '#9CA3AF',
              letterSpacing: 0.3,
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
