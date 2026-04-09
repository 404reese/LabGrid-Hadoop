interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export type TabItem = {
  id: string;
  label: string;
  icon?: string;
};

export const TABS: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'machines', label: 'All Machine on Network' },
  { id: 'jobtable', label: 'Job Table' },
  { id: 'resources', label: 'Source Usage' },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col h-screen">
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          LabGrid
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Hadoop Monitor
        </p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white' 
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/50 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
          v0.1.0 (MVP)
        </div>
      </div>
    </div>
  );
}
