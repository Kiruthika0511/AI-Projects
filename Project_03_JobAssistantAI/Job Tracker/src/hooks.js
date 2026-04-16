import { useState, useEffect, useCallback } from 'react';
import { getAllJobs, addJob, updateJob, deleteJob, exportAllData, importData } from './db';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadJobs = useCallback(async () => {
    try {
      const allJobs = await getAllJobs();
      setJobs(allJobs);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleAddJob = useCallback(async (jobData) => {
    const newJob = await addJob(jobData);
    setJobs((prev) => [...prev, newJob]);
    return newJob;
  }, []);

  const handleUpdateJob = useCallback(async (jobData) => {
    const updated = await updateJob(jobData);
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    return updated;
  }, []);

  const handleDeleteJob = useCallback(async (id) => {
    await deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }, []);

  const handleMoveJob = useCallback(async (jobId, newStatus) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job && job.status !== newStatus) {
      const updated = await updateJob({ ...job, status: newStatus });
      setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    }
  }, [jobs]);

  const handleExport = useCallback(async () => {
    const data = await exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback(async (file) => {
    const text = await file.text();
    const imported = await importData(text);
    await loadJobs();
    return imported;
  }, [loadJobs]);

  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      job.company?.toLowerCase().includes(q) ||
      job.role?.toLowerCase().includes(q) ||
      job.resume?.toLowerCase().includes(q)
    );
  });

  const resumeNames = [...new Set(jobs.map((j) => j.resume).filter(Boolean))];

  return {
    jobs: filteredJobs,
    allJobs: jobs,
    loading,
    searchQuery,
    setSearchQuery,
    resumeNames,
    addJob: handleAddJob,
    updateJob: handleUpdateJob,
    deleteJob: handleDeleteJob,
    moveJob: handleMoveJob,
    exportData: handleExport,
    importData: handleImport,
  };
}

export function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('job-tracker-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('job-tracker-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleTheme = useCallback(() => setDark((d) => !d), []);

  return { dark, toggleTheme };
}
