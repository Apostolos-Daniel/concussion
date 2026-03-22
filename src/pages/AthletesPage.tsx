import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAthletes, addAthlete } from '../hooks/useAthletes';
import { AthleteCard } from '../components/AthleteCard';

const SPORTS = ['American Football', 'Australian Football', 'Baseball', 'Basketball', 'Boxing', 'Cricket', 'Cycling', 'Field Hockey', 'Ice Hockey', 'Lacrosse', 'MMA', 'Rugby League', 'Rugby Union', 'Soccer', 'Softball', 'Swimming', 'Tennis', 'Volleyball', 'Wrestling', 'Other'];

export function AthletesPage() {
  const athletes = useAthletes();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', dateOfBirth: '', sport: '', team: '', position: '' });
  const [saving, setSaving] = useState(false);

  const filtered = (athletes || []).filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.sport.toLowerCase().includes(search.toLowerCase()) ||
    a.team.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.name || !form.dateOfBirth || !form.sport) return;
    setSaving(true);
    const a = await addAthlete(form);
    setSaving(false);
    setShowAdd(false);
    setForm({ name: '', dateOfBirth: '', sport: '', team: '', position: '' });
    navigate(`/athletes/${a.id}`);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 64 }}>
      {/* Header */}
      <div style={{ background: '#0D5C63', padding: '16px 16px 12px', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 10 }}>Athletes</h1>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search athletes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              borderRadius: 10,
              border: 'none',
              fontSize: 15,
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              outline: 'none',
              minHeight: 44,
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {athletes === undefined ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#6B7280' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
            <div style={{ fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              {search ? 'No athletes found' : 'No athletes yet'}
            </div>
            <div style={{ fontSize: 14, color: '#6B7280' }}>
              {search ? 'Try a different search' : 'Tap + to add your first athlete'}
            </div>
          </div>
        ) : (
          filtered.map(a => <AthleteCard key={a.id} athlete={a} />)
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        style={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#0D5C63',
          border: 'none',
          color: 'white',
          fontSize: 28,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(13,92,99,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}
        aria-label="Add athlete"
      >
        +
      </button>

      {/* Add modal */}
      {showAdd && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200,
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{
            background: 'white', borderRadius: '20px 20px 0 0', width: '100%',
            maxHeight: '90vh', overflowY: 'auto', padding: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Add Athlete</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#6B7280', minHeight: 44, minWidth: 44 }}>✕</button>
            </div>
            <FieldGroup>
              <Field label="Full Name *">
                <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. John Smith" style={inputStyle} />
              </Field>
              <Field label="Date of Birth *">
                <input type="date" value={form.dateOfBirth} onChange={e => setForm(f => ({...f, dateOfBirth: e.target.value}))} style={inputStyle} />
              </Field>
              <Field label="Sport *">
                <select value={form.sport} onChange={e => setForm(f => ({...f, sport: e.target.value}))} style={inputStyle}>
                  <option value="">Select sport...</option>
                  {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Team">
                <input type="text" value={form.team} onChange={e => setForm(f => ({...f, team: e.target.value}))} placeholder="e.g. Tigers U18" style={inputStyle} />
              </Field>
              <Field label="Position">
                <input type="text" value={form.position} onChange={e => setForm(f => ({...f, position: e.target.value}))} placeholder="e.g. Quarterback" style={inputStyle} />
              </Field>
            </FieldGroup>
            <button
              onClick={handleSave}
              disabled={!form.name || !form.dateOfBirth || !form.sport || saving}
              style={{
                width: '100%', background: '#0D5C63', color: 'white', border: 'none',
                borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 16,
                cursor: 'pointer', marginTop: 16, minHeight: 52,
                opacity: (!form.name || !form.dateOfBirth || !form.sport) ? 0.5 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save Athlete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1.5px solid #D1D5DB',
  fontSize: 15,
  outline: 'none',
  minHeight: 44,
  background: 'white',
  boxSizing: 'border-box',
  color: '#111827',
};
