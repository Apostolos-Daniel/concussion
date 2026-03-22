import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAthlete, updateAthlete, deleteAthlete } from '../hooks/useAthletes';
import { useAssessments } from '../hooks/useAssessments';
import { AssessmentCard } from '../components/AssessmentCard';

function calculateAge(dob: string) {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
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

const SPORTS = ['American Football', 'Australian Football', 'Baseball', 'Basketball', 'Boxing', 'Cricket', 'Cycling', 'Field Hockey', 'Ice Hockey', 'Lacrosse', 'MMA', 'Rugby League', 'Rugby Union', 'Soccer', 'Softball', 'Swimming', 'Tennis', 'Volleyball', 'Wrestling', 'Other'];

export function AthleteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const athlete = useAthlete(id!);
  const assessments = useAssessments(id);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  if (athlete === undefined) {
    return <div style={{ padding: 32, textAlign: 'center', color: '#6B7280' }}>Loading...</div>;
  }
  if (!athlete) {
    return <div style={{ padding: 32, textAlign: 'center', color: '#6B7280' }}>Athlete not found.</div>;
  }

  const startEdit = () => {
    setForm({ name: athlete.name, dateOfBirth: athlete.dateOfBirth, sport: athlete.sport, team: athlete.team, position: athlete.position || '' });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.dateOfBirth || !form.sport) return;
    setSaving(true);
    await updateAthlete(athlete.id, form);
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteAthlete(athlete.id);
    navigate('/athletes');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 64 }}>
      {/* Header */}
      <div style={{ background: '#0D5C63', padding: '16px 16px 20px' }}>
        <button onClick={() => navigate('/athletes')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: 14, padding: 0, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12, minHeight: 44 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Athletes
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 22 }}>
            {athlete.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'white' }}>{athlete.name}</h1>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
              Age {calculateAge(athlete.dateOfBirth)} · {athlete.sport}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Profile card */}
        <div style={{ background: 'white', margin: 16, borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Profile</h3>
            <button onClick={editing ? handleSave : startEdit} style={{ background: editing ? '#0D5C63' : 'transparent', color: editing ? 'white' : '#0D5C63', border: editing ? 'none' : '1.5px solid #0D5C63', borderRadius: 8, padding: '6px 14px', fontWeight: 600, cursor: 'pointer', fontSize: 14, minHeight: 36 }}>
              {editing ? (saving ? 'Saving...' : 'Save') : 'Edit'}
            </button>
          </div>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm((f: any) => ({...f, name: e.target.value}))} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Date of Birth</label>
                <input type="date" value={form.dateOfBirth} onChange={e => setForm((f: any) => ({...f, dateOfBirth: e.target.value}))} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Sport</label>
                <select value={form.sport} onChange={e => setForm((f: any) => ({...f, sport: e.target.value}))} style={inputStyle}>
                  {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Team</label>
                <input type="text" value={form.team} onChange={e => setForm((f: any) => ({...f, team: e.target.value}))} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Position</label>
                <input type="text" value={form.position} onChange={e => setForm((f: any) => ({...f, position: e.target.value}))} style={inputStyle} />
              </div>
              <button onClick={() => setEditing(false)} style={{ color: '#6B7280', background: 'none', border: '1px solid #D1D5DB', borderRadius: 8, padding: '8px', cursor: 'pointer', minHeight: 44 }}>Cancel</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <InfoRow label="Date of Birth" value={new Date(athlete.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
              <InfoRow label="Age" value={`${calculateAge(athlete.dateOfBirth)} years`} />
              <InfoRow label="Sport" value={athlete.sport} />
              {athlete.team && <InfoRow label="Team" value={athlete.team} />}
              {athlete.position && <InfoRow label="Position" value={athlete.position} />}
            </div>
          )}
        </div>

        {/* Quick assess button */}
        <div style={{ padding: '0 16px 16px' }}>
          <button
            onClick={() => navigate(`/assess?athleteId=${athlete.id}`)}
            style={{
              width: '100%', background: '#0D5C63', color: 'white', border: 'none',
              borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 16,
              cursor: 'pointer', minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Start Assessment
          </button>
        </div>

        {/* Assessments */}
        <div style={{ background: 'white', margin: '0 16px 16px', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #F3F4F6' }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Assessment History ({(assessments || []).length})</h3>
          </div>
          {!assessments || assessments.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#6B7280', fontSize: 14 }}>No assessments yet</div>
          ) : (
            assessments.slice().reverse().map(a => <AssessmentCard key={a.id} assessment={a} showAthlete={false} />)
          )}
        </div>

        {/* Danger zone */}
        <div style={{ padding: '0 16px 32px' }}>
          <button
            onClick={() => setShowDelete(true)}
            style={{ width: '100%', background: 'white', color: '#DC2626', border: '1.5px solid #DC2626', borderRadius: 12, padding: '12px', fontWeight: 600, cursor: 'pointer', fontSize: 15, minHeight: 48 }}
          >
            Delete Athlete
          </button>
        </div>
      </div>

      {/* Delete confirm */}
      {showDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 380 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>Delete {athlete.name}?</h3>
            <p style={{ margin: '0 0 20px', color: '#6B7280', fontSize: 15 }}>This will permanently delete the athlete and all their assessments. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowDelete(false)} style={{ flex: 1, background: 'white', border: '1px solid #D1D5DB', borderRadius: 10, padding: '12px', fontWeight: 600, cursor: 'pointer', minHeight: 48 }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, background: '#DC2626', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 600, cursor: 'pointer', minHeight: 48 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F9FAFB', paddingBottom: 8 }}>
      <span style={{ fontSize: 14, color: '#6B7280' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{value}</span>
    </div>
  );
}
