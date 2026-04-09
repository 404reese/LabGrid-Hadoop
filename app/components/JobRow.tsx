import { YarnApp } from '@/app/types';

interface JobRowProps {
  app: YarnApp;
  onClick: (app: YarnApp) => void;
}

const formatDuration = (ms: number): string => {
  if (!ms || ms <= 0) return '0s';
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

export default function JobRow({ app, onClick }: JobRowProps) {
  const getStatusColor = (state: string, finalStatus: string) => {
    if (state === 'RUNNING') return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
    if (state === 'FAILED' || finalStatus === 'FAILED' || finalStatus === 'KILLED') return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
    if (finalStatus === 'SUCCEEDED' || state === 'FINISHED') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400';
    return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
  };

  const getProgressColor = (state: string, finalStatus: string) => {
    if (state === 'RUNNING') return 'bg-green-500';
    if (state === 'FAILED' || finalStatus === 'FAILED' || finalStatus === 'KILLED') return 'bg-red-500';
    if (finalStatus === 'SUCCEEDED' || state === 'FINISHED') return 'bg-blue-500';
    return 'bg-neutral-500';
  };

  const stateLabel = app.state === 'FINISHED' && app.finalStatus !== 'UNDEFINED' ? app.finalStatus : app.state;

  return (
    <tr 
      onClick={() => onClick(app)}
      className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
    >
      <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-200 uppercase">{app.id.replace('application_', '')}</td>
      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{app.user}</td>
      <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-200 max-w-xs truncate" title={app.name}>{app.name}</td>
      <td className="px-4 py-3 text-sm">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(app.state, app.finalStatus)}`}>
          {stateLabel}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5 max-w-[100px]">
            <div 
              className={`h-1.5 rounded-full ${getProgressColor(app.state, app.finalStatus)}`} 
              style={{ width: `${Math.max(0, Math.min(100, app.progress || 0))}%` }}
            ></div>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 min-w-[2.5rem]">
            {Math.round(app.progress || 0)}%
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
        {new Date(app.startedTime).toLocaleString(undefined, { 
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        })}
      </td>
      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
        {formatDuration(app.elapsedTime)}
      </td>
    </tr>
  );
}
