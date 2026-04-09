import { YarnApp } from '@/app/types';

interface SummaryCardsProps {
  apps: YarnApp[];
}

export default function SummaryCards({ apps }: SummaryCardsProps) {
  const total = apps.length;
  const running = apps.filter(a => a.state === 'RUNNING').length;
  const completed = apps.filter(a => a.finalStatus === 'SUCCEEDED' || a.state === 'FINISHED').length;
  const failed = apps.filter(a => a.finalStatus === 'FAILED' || a.state === 'FAILED').length;

  const cardClass = "p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col justify-center";
  const titleClass = "text-sm font-medium text-neutral-500 dark:text-neutral-400 capitalize";
  const valueClass = "text-3xl font-semibold mt-2 text-neutral-900 dark:text-neutral-100";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className={cardClass}>
        <span className={titleClass}>Total Jobs</span>
        <span className={valueClass}>{total}</span>
      </div>
      <div className={cardClass}>
        <span className={titleClass}>Running</span>
        <span className={`${valueClass} text-green-600 dark:text-green-500`}>{running}</span>
      </div>
      <div className={cardClass}>
        <span className={titleClass}>Completed</span>
        <span className={`${valueClass} text-blue-600 dark:text-blue-500`}>{completed}</span>
      </div>
      <div className={cardClass}>
        <span className={titleClass}>Failed</span>
        <span className={`${valueClass} text-red-600 dark:text-red-500`}>{failed}</span>
      </div>
    </div>
  );
}
