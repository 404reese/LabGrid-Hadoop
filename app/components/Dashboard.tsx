'use client';

import { useState, useEffect, useCallback } from 'react';
import { YarnApp, JobsApiResponse } from '@/app/types';
import SummaryCards from './SummaryCards';
import JobTable from './JobTable';
import JobDetailsModal from './JobDetailsModal';
import Sidebar from './Sidebar';

export default function Dashboard() {
  const [apps, setApps] = useState<YarnApp[]>([]);
  const [filteredApps, setFilteredApps] = useState<YarnApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);
  const [selectedApp, setSelectedApp] = useState<YarnApp | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  // Tab State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Job Table Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');

  const fetchJobs = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const res = await fetch('/api/jobs');
      if (!res.ok) throw new Error('Network response was not ok');
      const data: JobsApiResponse = await res.json();
      
      setApps(data.apps);
      setIsMockData(data.isMockData);
      
      if (data.error && !data.isMockData) {
         setError(data.error);
      } else {
         setError(null);
      }
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to fetch jobs', err);
      setError('An error occurred while communicating with the server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    fetchJobs();
    const intervalId = setInterval(() => {
      fetchJobs(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchJobs]);

  // Handle filtering for Job Table
  useEffect(() => {
    let result = apps;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        app => 
          app.id.toLowerCase().includes(q) || 
          app.user.toLowerCase().includes(q) || 
          app.name.toLowerCase().includes(q)
      );
    }
    
    if (stateFilter !== 'ALL') {
      result = result.filter(app => app.state === stateFilter || app.finalStatus === stateFilter);
    }
    
    setFilteredApps(result);
  }, [apps, searchQuery, stateFilter]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <SummaryCards apps={apps} />
            <div className="mt-8">
              <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">Recent Jobs Overview</h2>
              <JobTable 
                apps={apps.slice(0, 5)} 
                onRowClick={(app) => setSelectedApp(app)} 
              />
            </div>
          </>
        );
      case 'jobtable':
        return (
          <>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 mb-4">
              <div className="w-full md:w-1/3">
                <input 
                  type="text" 
                  placeholder="Search by ID, Name, User..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />
              </div>
              <div className="w-full md:w-auto flex items-center gap-2">
                <label className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">State:</label>
                <select 
                  value={stateFilter} 
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-500"
                >
                  <option value="ALL">All States</option>
                  <option value="RUNNING">Running</option>
                  <option value="FINISHED">Finished / Succeeded</option>
                  <option value="FAILED">Failed</option>
                  <option value="KILLED">Killed</option>
                </select>
              </div>
            </div>

            <JobTable 
              apps={filteredApps} 
              onRowClick={(app) => setSelectedApp(app)} 
            />
          </>
        );
      case 'machines':
        return (
          <div className="flex items-center justify-center h-64 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
            <p className="text-neutral-500 dark:text-neutral-400">Machine monitoring metrics coming soon.</p>
          </div>
        );
      case 'resources':
        return (
          <div className="flex items-center justify-center h-64 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
            <p className="text-neutral-500 dark:text-neutral-400">Cluster resource usage and allocation charts coming soon.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-100 dark:bg-neutral-950 font-sans">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Mock Data Banner */}
          {isMockData && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg p-3 text-sm text-yellow-800 dark:text-yellow-400 flex items-center justify-center">
              <span className="font-semibold mr-2">Using Mock Data:</span> Could not connect to the remote Hadoop YARN cluster.
            </div>
          )}

          {/* Global Error Banner */}
          {error && !isMockData && (
             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-3 text-sm text-red-800 dark:text-red-400 flex items-center justify-center">
              <span className="font-semibold mr-2">Error:</span> {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white capitalize">
                {activeTab.replace('table', ' Table')}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Last refresh: {lastRefreshed.toLocaleTimeString()}
              </span>
              <button 
                onClick={() => fetchJobs(false)} 
                disabled={isLoading}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900 text-sm font-medium rounded transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Refreshing...' : 'Refresh Now'}
              </button>
            </div>
          </div>

          <div className="py-2">
            {renderTabContent()}
          </div>

          <JobDetailsModal 
            app={selectedApp} 
            onClose={() => setSelectedApp(null)} 
          />
          
        </div>
      </div>
    </div>
  );
}
