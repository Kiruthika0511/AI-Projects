import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import JobCard from './JobCard';
import { Plus, ArrowUpDown } from 'lucide-react';

export default function KanbanColumn({
  column,
  jobs,
  onAddJob,
  onEditJob,
  onDeleteJob,
  sortOrder,
  onToggleSort,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', column },
  });

  const jobIds = jobs.map((j) => j.id);

  return (
    <div
      className={`flex flex-col rounded-xl min-w-[270px] w-[290px] max-w-[310px] flex-shrink-0 transition-theme col-accent-${column.id}`}
      style={{
        backgroundColor: 'var(--bg-column)',
        border: '1px solid var(--border-color)',
      }}
      id={`column-${column.id}`}
    >
      {/* Column Header */}
      <div className="px-3.5 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Colored dot */}
            <div className={`w-2 h-2 rounded-full dot-${column.id}`} />
            <h2
              className="font-bold text-[11px] tracking-wider uppercase"
              style={{ color: 'var(--text-primary)' }}
            >
              {column.title}
            </h2>
            {/* Count badge */}
            <span
              className={`text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center badge-${column.id}`}
            >
              {jobs.length}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={onToggleSort}
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              title={`Sort by date (${sortOrder === 'newest' ? 'oldest first' : 'newest first'})`}
              id={`sort-${column.id}`}
            >
              <ArrowUpDown size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Droppable card area */}
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto column-scroll px-2.5 pb-2 space-y-2 min-h-[100px] transition-colors duration-200 ${
          isOver ? 'ring-2 ring-inset ring-primary-400/30 rounded-b-xl bg-primary-50/30 dark:bg-primary-500/5' : ''
        }`}
      >
        <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={onEditJob}
              onDelete={onDeleteJob}
            />
          ))}
        </SortableContext>
      </div>

      {/* Bottom "+ Add" button */}
      <div className="px-2.5 pb-2.5 pt-1">
        <button
          onClick={() => onAddJob(column.id)}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          id={`add-to-${column.id}`}
        >
          <Plus size={13} />
          Add
        </button>
      </div>
    </div>
  );
}
