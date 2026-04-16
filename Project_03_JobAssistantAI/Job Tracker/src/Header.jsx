import {
  Search,
  Sun,
  Moon,
  Download,
  Upload,
  Plus,
  Zap,
} from 'lucide-react';
import { useRef } from 'react';
import { DEFAULT_RESUMES } from './constants';

export default function Header({
  searchQuery,
  onSearchChange,
  dark,
  onToggleTheme,
  onExport,
  onImport,
  onAddJob,
  totalJobs,
  resumeNames,
  resumeFilter,
  onResumeFilterChange,
}) {
  const fileInputRef = useRef(null);
  const allResumes = [...new Set([...DEFAULT_RESUMES, ...(resumeNames || [])])];

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <header
      className="sticky top-0 z-40 transition-theme"
      style={{
        backgroundColor: 'var(--bg-header)',
        boxShadow: 'var(--shadow-header)',
      }}
      id="app-header"
    >
      {/* Top bar */}
      <div className="px-5 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-sm">
            <Zap size={17} className="text-white" fill="white" />
          </div>
          <h1
            className="text-lg font-bold tracking-tight"
            style={{ color: 'var(--color-primary-600)' }}
          >
            JobTracker<span style={{ color: 'var(--color-primary-400)' }}>AI</span>
          </h1>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onExport}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title="Export data as JSON"
            id="export-button"
          >
            <Download size={16} />
          </button>

          <button
            onClick={handleImportClick}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title="Import JSON backup"
            id="import-button"
          >
            <Upload size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
            id="import-file-input"
          />

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            id="theme-toggle"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={onAddJob}
            className="ml-2 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors shadow-sm"
            id="add-job-button"
          >
            <Plus size={15} />
            Add Job
          </button>
        </div>
      </div>

      {/* Search and filter bar */}
      <div
        className="px-5 pb-3 flex items-center gap-3"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-2xl">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search company or title..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border transition-theme"
            style={{
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
            id="search-input"
          />
        </div>

        {/* Resume filter */}
        <select
          value={resumeFilter}
          onChange={(e) => onResumeFilterChange(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border transition-theme appearance-none cursor-pointer min-w-[140px]"
          style={{
            backgroundColor: 'var(--bg-input)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
          id="filter-resume"
        >
          <option value="">All Resumes</option>
          {allResumes.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
    </header>
  );
}
