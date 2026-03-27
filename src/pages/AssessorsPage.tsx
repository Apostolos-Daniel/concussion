import { useState } from 'react';
import { useAssessors, addAssessor, updateAssessor, deleteAssessor } from '../hooks/useAssessors';
import type { Assessor } from '../types';

const ROLES = [
  'Doctor / Physician',
  'Physiotherapist',
  'Athletic Therapist',
  'Sports Trainer',
  'Nurse / Nurse Practitioner',
  'Paramedic / EMT',
  'Coach',
  'Team Manager',
];

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

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 40,
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

type FormState = { name: string; role: string; organization: string; email: string; phone: string };
const emptyForm: FormState = { name: '', role: '', organization: '', email: '', phone: '' };

export function AssessorsPage() {
  const assessors = useAssessors();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [selectedAssessor, setSelectedAssessor] = useState<Assessor | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [editSaving, setEditSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const filtered = (assessors || []).filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase()) ||
    (a.organization || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.name || !form.role) return;
    setSaving(true);
    await addAssessor({
      name: form.name.trim(),
      role: form.role,
      ...(form.organization.trim() ? { organization: form.organization.trim() } : {}),
      ...(form.email.trim() ? { email: form.email.trim() } : {}),
      ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
    });
    setSaving(false);
    setShowAdd(false);
    setForm(emptyForm);
  };

  const openDetail = (a: Assessor) => {
    setSelectedAssessor(a);
    setEditing(false);
  };

  const startEdit = () => {
    if (!selectedAssessor) return;
    setEditForm({
      name: selectedAssessor.name,
      role: selectedAssessor.role,
      organization: selectedAssessor.organization || '',
      email: selectedAssessor.email || '',
      phone: selectedAssessor.phone || '',
    });
    setEditing(true);
  };

  const handleEditSave = async () => {
    if (!selectedAssessor || !editForm.name || !editForm.role) return;
    setEditSaving(true);
    await updateAssessor(selectedAssessor.id, {
      name: editForm.name.trim(),
      role: editForm.role,
      organization: editForm.organization.trim() || undefined,
      email: editForm.email.trim() || undefined,
      phone: editForm.phone.trim() || undefined,
    });
    setEditSaving(false);
    setEditing(false);
    setSelectedAssessor(a => a ? { ...a, ...editForm, name: editForm.name.trim(), organization: editForm.organization.trim() || undefined, email: editForm.email.trim() || undefined, phone: editForm.phone.trim() || undefined } : a);
  };

  const handleDelete = async () => {
    if (!selectedAssessor) return;
    await deleteAssessor(selectedAssessor.id);
    setShowDelete(false);
    setSelectedAssessor(null);
  };

  // Detail panel
  if (selectedAssessor) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 64 }}>
        <div style={{ background: '#0D5C63', padding: '16px 16px 20px' }}>
          <button
            onClick={() => setSelectedAssessor(null)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: 14, padding: 0, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12, minHeight: 44 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Assessors
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 22 }}>
              {getInitials(selectedAssessor.name)}
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'white' }}>{selectedAssessor.name}</h1>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{selectedAssessor.role}</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ background: 'white', margin: 16, borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Profile</h3>
              <button
                onClick={editing ? handleEditSave : startEdit}
                style={{ background: editing ? '#0D5C63' : 'transparent', color: editing ? 'white' : '#0D5C63', border: editing ? 'none' : '1.5px solid #0D5C63', borderRadius: 8, padding: '6px 14px', fontWeight: 600, cursor: 'pointer', fontSize: 14, minHeight: 36 }}
              >
                {editing ? (editSaving ? 'Saving...' : 'Save') : 'Edit'}
              </button>
            </div>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Full Name *</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Designation / Role *</label>
                  <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} style={{ ...selectStyle, color: editForm.role ? '#111827' : '#9CA3AF' }}>
                    <option value="" disabled>Select role</option>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Organization / Club</label>
                  <input type="text" value={editForm.organization} onChange={e => setEditForm(f => ({ ...f, organization: e.target.value }))} placeholder="e.g. City Sports Clinic" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Email</label>
                  <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} placeholder="e.g. dr.smith@clinic.com" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Phone</label>
                  <input type="tel" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} placeholder="e.g. +1 555 000 0000" style={inputStyle} />
                </div>
                <button onClick={() => setEditing(false)} style={{ color: '#6B7280', background: 'none', border: '1px solid #D1D5DB', borderRadius: 8, padding: '8px', cursor: 'pointer', minHeight: 44 }}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <InfoRow label="Role" value={selectedAssessor.role} />
                {selectedAssessor.organization && <InfoRow label="Organization" value={selectedAssessor.organization} />}
                {selectedAssessor.email && <InfoRow label="Email" value={selectedAssessor.email} />}
                {selectedAssessor.phone && <InfoRow label="Phone" value={selectedAssessor.phone} />}
                <InfoRow label="Added" value={new Date(selectedAssessor.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
              </div>
            )}
          </div>

          <div style={{ padding: '0 16px 32px' }}>
            <button
              onClick={() => setShowDelete(true)}
              style={{ width: '100%', background: 'white', color: '#DC2626', border: '1.5px solid #DC2626', borderRadius: 12, padding: '12px', fontWeight: 600, cursor: 'pointer', fontSize: 15, minHeight: 48 }}
            >
              Delete Assessor
            </button>
          </div>
        </div>

        {showDelete && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 380 }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>Delete {selectedAssessor.name}?</h3>
              <p style={{ margin: '0 0 20px', color: '#6B7280', fontSize: 15 }}>This will permanently delete this assessor profile. This cannot be undone.</p>
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

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 64 }}>
      {/* Header */}
      <div style={{ background: '#0D5C63', padding: '16px 16px 12px', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 10 }}>Assessors</h1>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search assessors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10, border: 'none',
              fontSize: 15, background: 'rgba(255,255,255,0.15)', color: 'white', outline: 'none',
              minHeight: 44, boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {assessors === undefined ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#6B7280' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🩺</div>
            <div style={{ fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              {search ? 'No assessors found' : 'No assessor profiles yet'}
            </div>
            <div style={{ fontSize: 14, color: '#6B7280' }}>
              {search ? 'Try a different search' : 'Tap + to add your first assessor profile'}
            </div>
          </div>
        ) : (
          filtered.map(a => (
            <button
              key={a.id}
              onClick={() => openDetail(a)}
              style={{ width: '100%', background: 'white', border: 'none', borderBottom: '1px solid #F3F4F6', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', minHeight: 72 }}
            >
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0D5C63', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                {getInitials(a.name)}
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: '#111827' }}>{a.name}</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>{a.role}{a.organization ? ` · ${a.organization}` : ''}</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        style={{
          position: 'fixed', bottom: 80, right: 20, width: 56, height: 56, borderRadius: '50%',
          background: '#0D5C63', border: 'none', color: 'white', fontSize: 28, cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(13,92,99,0.4)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 50,
        }}
        aria-label="Add assessor"
      >
        +
      </button>

      {/* Add modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: 'white', borderRadius: '20px 20px 0 0', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Add Assessor</h2>
              <button onClick={() => { setShowAdd(false); setForm(emptyForm); }} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#6B7280', minHeight: 44, minWidth: 44 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Full Name *">
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Dr. Jane Smith" style={inputStyle} />
              </Field>
              <Field label="Designation / Role *">
                <select
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  style={{ ...selectStyle, color: form.role ? '#111827' : '#9CA3AF' }}
                >
                  <option value="" disabled>Select role</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Organization / Club">
                <input type="text" value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} placeholder="e.g. City Sports Clinic" style={inputStyle} />
              </Field>
              <Field label="Email">
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="e.g. dr.smith@clinic.com" style={inputStyle} />
              </Field>
              <Field label="Phone">
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="e.g. +1 555 000 0000" style={inputStyle} />
              </Field>
            </div>
            <button
              onClick={handleSave}
              disabled={!form.name || !form.role || saving}
              style={{
                width: '100%', background: '#0D5C63', color: 'white', border: 'none',
                borderRadius: 12, padding: '14px', fontWeight: 700, fontSize: 16,
                cursor: 'pointer', marginTop: 20, minHeight: 52,
                opacity: !form.name || !form.role ? 0.5 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save Assessor'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F9FAFB', paddingBottom: 8 }}>
      <span style={{ fontSize: 14, color: '#6B7280' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}
