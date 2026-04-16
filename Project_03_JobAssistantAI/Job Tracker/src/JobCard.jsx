import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getDaysSince, formatDate } from './constants';
import {
  Linkedin,
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
  ExternalLink,
} from 'lucide-react';

// Simple hash for consistent resume pill color
function getResumeColor(name) {
  const colors = [
    { bg: '#dcfce7', text: '#16a34a' },
    { bg: '#dbeafe', text: '#2563eb' },
    { bg: '#fef9c3', text: '#ca8a04' },
    { bg: '#fce7f3', text: '#db2777' },
    { bg: '#e0e7ff', text: '#4f46e5' },
    { bg: '#ccfbf1', text: '#0d9488' },
    { bg: '#fee2e2', text: '#dc2626' },
    { bg: '#f3e8ff', text: '#9333ea' },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function JobCard({ job, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job.id,
    data: { type: 'job', job },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const daysSince = getDaysSince(job.dateApplied);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const resumeColor = job.resume ? getResumeColor(job.resume) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`status-${job.status} relative rounded-lg cursor-grab active:cursor-grabbing animate-fade-in transition-theme`}
      {...attributes}
      {...listeners}
      id={`job-card-${job.id}`}
      role="button"
      tabIndex={0}
      aria-label={`${job.company} - ${job.role}`}
      onDoubleClick={() => onEdit(job)}
      title="Double-click to edit"
    >
      {/* Card background */}
      <div
        className="absolute inset-0 rounded-lg border transition-theme"
        style={{
          backgroundColor: 'var(--bg-card)',
          boxShadow: 'var(--shadow-card)',
          borderColor: 'var(--border-card)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-3.5 py-3">
        {/* Top row: icon + name + kebab */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            {/* Portal/LinkedIn icon */}
            {job.linkedinUrl ? (
              <a
                href={job.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="flex-shrink-0 w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center mt-0.5 hover:bg-blue-700 transition-colors"
                title="Open LinkedIn job posting"
                id={`linkedin-link-${job.id}`}
              >
                <Linkedin size={13} className="text-white" />
              </a>
            ) : (
              <div
                className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center mt-0.5"
                style={{ backgroundColor: 'var(--bg-app)' }}
              >
                <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                  {job.company?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3
                className="font-semibold text-[13px] leading-tight truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {job.company}
              </h3>
              <p
                className="text-xs mt-0.5 truncate"
                style={{ color: 'var(--text-secondary)' }}
              >
                {job.role}
              </p>
            </div>
          </div>

          {/* Kebab menu */}
          <div className="kebab-menu flex-shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              title="More options"
              id={`menu-${job.id}`}
            >
              <MoreVertical size={14} />
            </button>

            {menuOpen && (
              <div
                className="kebab-dropdown animate-scale-in"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onEdit(job);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  id={`edit-job-${job.id}`}
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDelete(job);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"
                  id={`delete-job-${job.id}`}
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mt-2.5">
          {job.resume && (
            <span
              className="resume-pill"
              style={{
                backgroundColor: resumeColor?.bg,
                color: resumeColor?.text,
              }}
            >
              {job.resume}
            </span>
          )}
          {job.dateApplied && (
            <span
              className="inline-flex items-center gap-1 text-[11px]"
              style={{ color: 'var(--text-muted)' }}
            >
              <Calendar size={10} />
              {formatDate(job.dateApplied)}
            </span>
          )}
        </div>

        {/* Salary if present */}
        {job.salaryRange && (
          <p
            className="text-[11px] mt-1.5 font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            {job.salaryRange}
          </p>
        )}
      </div>
    </div>
  );
}
