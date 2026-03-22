interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);

  return (
    <div style={{ background: 'white', padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: '#6B7280' }}>
        <span>{label || `Step ${current} of ${total}`}</span>
        <span style={{ fontWeight: 600, color: '#0D5C63' }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: '#0D5C63',
            borderRadius: 3,
            transition: 'width 300ms ease',
          }}
        />
      </div>
    </div>
  );
}
