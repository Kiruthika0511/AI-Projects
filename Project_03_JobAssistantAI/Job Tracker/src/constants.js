export const COLUMNS = [
  { id: 'wishlist', title: 'Wishlist', icon: '✨', color: '#8b5cf6' },
  { id: 'applied', title: 'Applied', icon: '📬', color: '#3b82f6' },
  { id: 'follow-up', title: 'Follow-up', icon: '📞', color: '#f59e0b' },
  { id: 'interview', title: 'Interview', icon: '🎙️', color: '#10b981' },
  { id: 'offer', title: 'Offer', icon: '🎉', color: '#06b6d4' },
  { id: 'rejected', title: 'Rejected', icon: '❌', color: '#ef4444' },
];

export const DEFAULT_RESUMES = [
  'SDE_Resume_v3',
  'QA_Lead_Resume',
  'Frontend_Resume',
  'Backend_Resume',
  'FullStack_Resume',
];

export function getDaysSince(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function createEmptyJob(status = 'wishlist') {
  return {
    company: '',
    role: '',
    linkedinUrl: '',
    resume: '',
    dateApplied: new Date().toISOString().split('T')[0],
    salaryRange: '',
    notes: '',
    status,
  };
}
