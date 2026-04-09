import { NextResponse } from 'next/server';
import { JobsApiResponse, YarnApp } from '@/app/types';

const generateMockData = (): YarnApp[] => {
  const states: YarnApp['state'][] = ['RUNNING', 'FINISHED', 'FAILED', 'ACCEPTED', 'KILLED'];
  const finalStatuses: YarnApp['finalStatus'][] = ['UNDEFINED', 'SUCCEEDED', 'FAILED', 'KILLED'];
  const users = ['hadoop', 'spark', 'hive', 'airflow', 'root'];
  const names = ['ETL_Daily', 'Log_Aggregation', 'User_Stats', 'Data_Cleaning', 'ML_Training_Pipeline'];

  const apps: YarnApp[] = [];
  const now = Date.now();

  for (let i = 0; i < 20; i++) {
    const isFinished = Math.random() > 0.3;
    const state = isFinished ? states[Math.floor(Math.random() * 4) + 1] : 'RUNNING';
    
    // Ensure final status makes sense with state
    let finalStatus: YarnApp['finalStatus'] = 'UNDEFINED';
    if (state === 'FINISHED') finalStatus = 'SUCCEEDED';
    else if (state === 'FAILED') finalStatus = 'FAILED';
    else if (state === 'KILLED') finalStatus = 'KILLED';

    const startedTime = now - Math.floor(Math.random() * 86400000); // within last 24h
    const elapsedTime = isFinished ? Math.floor(Math.random() * 3600000) : now - startedTime;
    const progress = state === 'RUNNING' ? Math.floor(Math.random() * 100) : (finalStatus === 'SUCCEEDED' ? 100 : Math.floor(Math.random() * 100));

    apps.push({
      id: `application_16${Math.floor(Math.random() * 10000000000)}_${Math.floor(Math.random() * 10000)}`,
      user: users[Math.floor(Math.random() * users.length)],
      name: `${names[Math.floor(Math.random() * names.length)]}_${i}`,
      queue: 'default',
      state,
      finalStatus,
      progress,
      trackingUI: 'ApplicationMaster',
      trackingUrl: 'http://localhost:8088/proxy/application_mock/',
      diagnostics: state === 'FAILED' ? 'Task failed due to generic error' : '',
      clusterId: '1690000000000',
      applicationType: Math.random() > 0.5 ? 'SPARK' : 'MAPREDUCE',
      applicationTags: '',
      startedTime,
      finishedTime: isFinished ? startedTime + elapsedTime : 0,
      elapsedTime,
      amContainerLogs: 'http://localhost:8042/node/containerlogs/container_mock',
      amHostHttpAddress: 'localhost:8042',
      allocatedMB: Math.floor(Math.random() * 10240),
      allocatedVCores: Math.floor(Math.random() * 8) + 1,
      runningContainers: state === 'RUNNING' ? Math.floor(Math.random() * 20) + 1 : 0,
      memorySeconds: Math.floor(Math.random() * 1000000),
      vcoreSeconds: Math.floor(Math.random() * 100000),
    });
  }

  // Sort by startedTime descending
  return apps.sort((a, b) => b.startedTime - a.startedTime);
};

export async function GET() {
  const masterUrl = process.env.NEXT_PUBLIC_MASTER_URL || process.env.MASTER_URL || 'http://localhost:8088';
  let isMockData = false;
  let apps: YarnApp[] = [];
  let errorMsg: string | undefined;

  try {
    const response = await fetch(`${masterUrl}/ws/v1/cluster/apps`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // 5 seconds timeout logic would ideally use AbortController here, 
      // Next.js handles fetch options differently sometimes but we'll use a signal
      signal: AbortSignal.timeout(5000),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`YARN API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // YARN returns { apps: { app: [ ... ] } } or { apps: null } if empty
    if (data && data.apps && data.apps.app) {
      apps = data.apps.app;
    } else {
      apps = [];
    }
  } catch (err: unknown) {
    console.error('Failed to fetch from YARN API, falling back to mock data:', err);
    isMockData = true;
    apps = generateMockData();
    errorMsg = err instanceof Error ? err.message : 'Unknown error occurred connecting to YARN cluster';
  }

  const responsePayload: JobsApiResponse = {
    apps,
    isMockData,
    ...(errorMsg && { error: errorMsg })
  };

  return NextResponse.json(responsePayload);
}
