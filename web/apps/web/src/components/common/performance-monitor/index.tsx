import { useRequest } from 'ahooks';
import React from 'react';

interface MonitorData {
  cpu_memory_used: number;
  cpu_memory_total: number;
  gpu_memory_used: number;
  gpu_memory_total: number;
}

async function fetchMonitorData(): Promise<MonitorData> {
  const response = await fetch('/api/tools/monitor_memory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!response.ok) throw new Error('Failed to fetch monitor data');
  return response.json();
}

const MemoryBar = ({ percentage }: { percentage: string }) => {
  const getColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500 text-green-500';
    if (percentage < 80) return 'bg-orange-500 text-orange-500';
    return 'bg-red-500 text-red-500';
  };

  const color = getColor(parseFloat(percentage)).split(' ')[0];
  return (
    <div className="h-0.5 w-full bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-500 ease-in-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default function PerformanceMonitor() {
  const { data } = useRequest(fetchMonitorData, {
    pollingInterval: 3000,
    pollingWhenHidden: false,
  });

  if (!data) return null;

  const formatUsage = (used: number, total: number) => {
    const percentage = ((used / total) * 100).toFixed(1);
    const usedGB = used.toFixed(1);
    const totalGB = total.toFixed(1);
    return { percentage, usedGB, totalGB };
  };

  const getColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500 text-green-500';
    if (percentage < 80) return 'bg-orange-500 text-orange-500';
    return 'bg-red-500 text-red-500';
  };

  const cpuUsage = formatUsage(data.cpu_memory_used, data.cpu_memory_total);
  const gpuUsage = formatUsage(data.gpu_memory_used, data.gpu_memory_total);

  const cpuColor = getColor(parseFloat(cpuUsage.percentage)).split(' ')[1];
  const gpuColor = getColor(parseFloat(gpuUsage.percentage)).split(' ')[1];

  return (
    <div className="text-xs p-1.5 w-28">
      <div className="mb-1">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-gray-500">CPU</span>
          <span className={cpuColor}>{cpuUsage.percentage}%</span>
        </div>
        <MemoryBar percentage={cpuUsage.percentage} />
        <div className="text-gray-500 text-[8px]">
          {cpuUsage.usedGB} / {cpuUsage.totalGB}GB
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-gray-500">GPU</span>
          <span className={gpuColor}>{gpuUsage.percentage}%</span>
        </div>
        <MemoryBar percentage={gpuUsage.percentage} />
        <div className="text-gray-500 text-[8px]">
          {gpuUsage.usedGB} / {gpuUsage.totalGB}GB
        </div>
      </div>
    </div>
  );
}
