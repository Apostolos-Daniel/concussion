export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatTime(dateStr: string): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export function getScoreColor(value: number, max: number, higherIsBetter = true): string {
  const ratio = value / max;
  if (higherIsBetter) {
    if (ratio >= 0.9) return '#16A34A';
    if (ratio >= 0.7) return '#D97706';
    return '#DC2626';
  } else {
    if (ratio <= 0.3) return '#16A34A';
    if (ratio <= 0.6) return '#D97706';
    return '#DC2626';
  }
}
