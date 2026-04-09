import { YarnApp } from '@/app/types';
import JobRow from './JobRow';

interface JobTableProps {
  apps: YarnApp[];
  onRowClick: (app: YarnApp) => void;
}

export default function JobTable({ apps, onRowClick }: JobTableProps) {
  if (!apps || apps.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <p className="text-neutral-500 dark:text-neutral-400">No jobs found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Job ID</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">State</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Progress</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Started</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Duration</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(app => (
              <JobRow key={app.id} app={app} onClick={onRowClick} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
