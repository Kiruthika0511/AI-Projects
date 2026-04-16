import { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { COLUMNS } from './constants';
import { useJobs, useTheme } from './hooks';
import Header from './Header';
import KanbanColumn from './KanbanColumn';
import JobFormModal from './JobFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import JobCard from './JobCard';

function App() {
  const {
    jobs,
    allJobs,
    loading,
    searchQuery,
    setSearchQuery,
    resumeNames,
    addJob,
    updateJob,
    deleteJob,
    moveJob,
    exportData,
    importData: importJobData,
  } = useJobs();

  const { dark, toggleTheme } = useTheme();

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('wishlist');

  // Filter state
  const [resumeFilter, setResumeFilter] = useState('');

  // Sort state per column
  const [sortOrders, setSortOrders] = useState(() =>
    COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: 'newest' }), {})
  );

  // Drag state
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // Apply resume filter on top of search
  const filteredJobs = useMemo(() => {
    if (!resumeFilter) return jobs;
    return jobs.filter((j) => j.resume === resumeFilter);
  }, [jobs, resumeFilter]);

  // Group and sort jobs by column
  const columnJobs = useMemo(() => {
    const grouped = {};
    for (const col of COLUMNS) {
      const colJobs = filteredJobs.filter((j) => j.status === col.id);
      colJobs.sort((a, b) => {
        const dateA = new Date(a.dateApplied || a.createdAt);
        const dateB = new Date(b.dateApplied || b.createdAt);
        return sortOrders[col.id] === 'newest' ? dateB - dateA : dateA - dateB;
      });
      grouped[col.id] = colJobs;
    }
    return grouped;
  }, [filteredJobs, sortOrders]);

  const activeJob = activeId ? filteredJobs.find((j) => j.id === activeId) : null;

  // Handlers
  const handleAddJob = useCallback(
    (status = 'wishlist') => {
      setEditingJob(null);
      setDefaultStatus(status);
      setFormOpen(true);
    },
    []
  );

  const handleEditJob = useCallback((job) => {
    setEditingJob(job);
    setDefaultStatus(job.status);
    setFormOpen(true);
  }, []);

  const handleSaveJob = useCallback(
    async (formData) => {
      if (editingJob) {
        await updateJob({ ...editingJob, ...formData });
      } else {
        await addJob({ ...formData, status: formData.status || defaultStatus });
      }
    },
    [editingJob, addJob, updateJob, defaultStatus]
  );

  const handleDeleteRequest = useCallback((job) => {
    setDeleteTarget(job);
  }, []);

  const handleConfirmDelete = useCallback(
    async (id) => {
      await deleteJob(id);
    },
    [deleteJob]
  );

  const handleToggleSort = useCallback((columnId) => {
    setSortOrders((prev) => ({
      ...prev,
      [columnId]: prev[columnId] === 'newest' ? 'oldest' : 'newest',
    }));
  }, []);

  // DnD handlers
  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragOver = useCallback(() => {}, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      const activeJobId = active.id;
      const overId = over.id;

      // Determine the target column
      let targetColumnId = null;

      const overData = over.data?.current;
      if (overData?.type === 'column') {
        targetColumnId = overData.column.id;
      } else if (overData?.type === 'job') {
        targetColumnId = overData.job.status;
      } else {
        const isColumn = COLUMNS.find((c) => c.id === overId);
        if (isColumn) {
          targetColumnId = overId;
        }
      }

      if (targetColumnId) {
        moveJob(activeJobId, targetColumnId);
      }
    },
    [moveJob]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'var(--bg-app)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Loading your jobs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dark={dark}
        onToggleTheme={toggleTheme}
        onExport={exportData}
        onImport={importJobData}
        onAddJob={() => handleAddJob('wishlist')}
        totalJobs={allJobs.length}
        resumeNames={resumeNames}
        resumeFilter={resumeFilter}
        onResumeFilterChange={setResumeFilter}
      />

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <main className="flex-1 overflow-x-auto overflow-y-hidden px-5 py-4">
          <div className="flex gap-4 h-full min-w-max">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                jobs={columnJobs[column.id] || []}
                onAddJob={handleAddJob}
                onEditJob={handleEditJob}
                onDeleteJob={handleDeleteRequest}
                sortOrder={sortOrders[column.id]}
                onToggleSort={() => handleToggleSort(column.id)}
              />
            ))}
          </div>
        </main>

        <DragOverlay>
          {activeJob ? (
            <div className="drag-overlay w-[270px]">
              <JobCard
                job={activeJob}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      <JobFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingJob(null);
        }}
        onSave={handleSaveJob}
        job={editingJob}
        resumeNames={resumeNames}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        job={deleteTarget}
      />
    </div>
  );
}

export default App;
