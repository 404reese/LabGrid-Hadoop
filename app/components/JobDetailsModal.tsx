import { YarnApp } from '@/app/types';

interface JobDetailsModalProps {
  app: YarnApp | null;
  onClose: () => void;
}

export default function JobDetailsModal({ app, onClose }: JobDetailsModalProps) {
  if (!app) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Job Details: {app.id}
          </h2>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-1">Name</p>
              <p className="text-neutral-900 dark:text-neutral-200">{app.name}</p>
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-1">User</p>
              <p className="text-neutral-900 dark:text-neutral-200">{app.user}</p>
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-1">Queue</p>
              <p className="text-neutral-900 dark:text-neutral-200">{app.queue}</p>
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-1">Application Type</p>
              <p className="text-neutral-900 dark:text-neutral-200">{app.applicationType}</p>
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-1">State / Final Status</p>
              <p className="text-neutral-900 dark:text-neutral-200">{app.state} / {app.finalStatus}</p>
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-1">Progress</p>
              <p className="text-neutral-900 dark:text-neutral-200">{app.progress}%</p>
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-1">Allocated Memory</p>
              <p className="text-neutral-900 dark:text-neutral-200">{app.allocatedMB} MB</p>
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-1">Allocated VCores</p>
              <p className="text-neutral-900 dark:text-neutral-200">{app.allocatedVCores}</p>
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-1">Running Containers</p>
              <p className="text-neutral-900 dark:text-neutral-200">{app.runningContainers}</p>
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-1">Cluster ID</p>
              <p className="text-neutral-900 dark:text-neutral-200 truncate">{app.clusterId}</p>
            </div>
            <div className="col-span-2 mt-2">
              <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-1">Tracking URL</p>
              <a 
                href={app.trackingUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline truncate block"
              >
                {app.trackingUrl}
              </a>
            </div>
            {app.diagnostics && (
              <div className="col-span-2 mt-2">
                <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-1">Diagnostics</p>
                <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded text-xs whitespace-pre-wrap font-mono border border-red-100 dark:border-red-900/50">
                  {app.diagnostics}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
