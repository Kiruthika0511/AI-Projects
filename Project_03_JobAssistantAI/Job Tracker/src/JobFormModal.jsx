import { useState, useEffect, useRef } from 'react';
import { DEFAULT_RESUMES, COLUMNS } from './constants';
import { X, Save, Briefcase, Building2, Link, FileText, Calendar, DollarSign, StickyNote, Tag } from 'lucide-react';

export default function JobFormModal({ isOpen, onClose, onSave, job, resumeNames }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    linkedinUrl: '',
    resume: '',
    dateApplied: new Date().toISOString().split('T')[0],
    salaryRange: '',
    notes: '',
    status: 'wishlist',
  });
  const [errors, setErrors] = useState({});
  const [customResume, setCustomResume] = useState(false);
  const firstInputRef = useRef(null);

  const allResumes = [...new Set([...DEFAULT_RESUMES, ...resumeNames])];

  useEffect(() => {
    if (isOpen) {
      if (job) {
        setFormData({ ...job });
        const isCustom = job.resume && !allResumes.includes(job.resume);
        setCustomResume(isCustom);
      } else {
        setFormData({
          company: '',
          role: '',
          linkedinUrl: '',
          resume: '',
          dateApplied: new Date().toISOString().split('T')[0],
          salaryRange: '',
          notes: '',
          status: formData.status || 'wishlist',
        });
        setCustomResume(false);
      }
      setErrors({});
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen, job]);

  const validate = () => {
    const newErrors = {};
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.role.trim()) newErrors.role = 'Job title is required';
    if (formData.linkedinUrl && !isValidUrl(formData.linkedinUrl)) {
      newErrors.linkedinUrl = 'Please enter a valid URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--bg-modal-overlay)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
      id="job-form-modal-overlay"
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-card)',
          boxShadow: 'var(--shadow-modal)',
        }}
        id="job-form-modal"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <h2
            className="text-lg font-semibold flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <Briefcase size={18} className="text-primary-500" />
            {job ? 'Edit Job' : 'Add New Job'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            style={{ color: 'var(--text-muted)' }}
            id="close-job-form"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Company */}
          <div>
            <label
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Building2 size={12} />
              Company *
            </label>
            <input
              ref={firstInputRef}
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="e.g., Google, Microsoft..."
              className="w-full px-3 py-2.5 text-sm rounded-lg border transition-theme"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: errors.company ? '#ef4444' : 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              id="input-company"
            />
            {errors.company && (
              <p className="text-xs text-red-500 mt-1">{errors.company}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Briefcase size={12} />
              Job Title / Role *
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              placeholder="e.g., Senior Software Engineer..."
              className="w-full px-3 py-2.5 text-sm rounded-lg border transition-theme"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: errors.role ? '#ef4444' : 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              id="input-role"
            />
            {errors.role && (
              <p className="text-xs text-red-500 mt-1">{errors.role}</p>
            )}
          </div>

          {/* LinkedIn URL */}
          <div>
            <label
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Link size={12} />
              LinkedIn Job URL
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/jobs/..."
              className="w-full px-3 py-2.5 text-sm rounded-lg border transition-theme"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: errors.linkedinUrl ? '#ef4444' : 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              id="input-linkedin"
            />
            {errors.linkedinUrl && (
              <p className="text-xs text-red-500 mt-1">{errors.linkedinUrl}</p>
            )}
          </div>

          {/* Resume + Status row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Resume */}
            <div>
              <label
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                <FileText size={12} />
                Resume
              </label>
              {customResume ? (
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={formData.resume}
                    onChange={(e) => handleChange('resume', e.target.value)}
                    placeholder="Resume name..."
                    className="flex-1 px-3 py-2.5 text-sm rounded-lg border transition-theme"
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    id="input-resume-custom"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCustomResume(false);
                      handleChange('resume', '');
                    }}
                    className="px-2 py-1 text-xs rounded-lg border transition-theme hover:bg-black/5 dark:hover:bg-white/5"
                    style={{
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    List
                  </button>
                </div>
              ) : (
                <div className="flex gap-1">
                  <select
                    value={formData.resume}
                    onChange={(e) => handleChange('resume', e.target.value)}
                    className="flex-1 px-3 py-2.5 text-sm rounded-lg border transition-theme appearance-none"
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                    id="input-resume-select"
                  >
                    <option value="">Select resume...</option>
                    {allResumes.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setCustomResume(true)}
                    className="px-2 py-1 text-xs rounded-lg border transition-theme hover:bg-black/5 dark:hover:bg-white/5"
                    style={{
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)',
                    }}
                    title="Enter custom resume name"
                  >
                    +New
                  </button>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Tag size={12} />
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border transition-theme appearance-none"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                id="input-status"
              >
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.icon} {col.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date + Salary row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Calendar size={12} />
                Date Applied
              </label>
              <input
                type="date"
                value={formData.dateApplied}
                onChange={(e) => handleChange('dateApplied', e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border transition-theme"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                id="input-date"
              />
            </div>
            <div>
              <label
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                <DollarSign size={12} />
                Salary Range
              </label>
              <input
                type="text"
                value={formData.salaryRange}
                onChange={(e) => handleChange('salaryRange', e.target.value)}
                placeholder="e.g., ₹25-30 LPA"
                className="w-full px-3 py-2.5 text-sm rounded-lg border transition-theme"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                id="input-salary"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              <StickyNote size={12} />
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Recruiter name, referral info, interview notes..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm rounded-lg border transition-theme resize-none"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              id="input-notes"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
              id="cancel-job-form"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors flex items-center gap-2 shadow-sm"
              id="save-job-form"
            >
              <Save size={14} />
              {job ? 'Update Job' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
