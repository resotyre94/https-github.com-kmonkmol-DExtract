import React from 'react';
import { ProcessingStats } from '../types';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface ProcessingStatusProps {
  stats: ProcessingStats;
  isProcessing: boolean;
  currentPage: number | null;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ stats, isProcessing, currentPage }) => {
  const percentage = stats.total > 0 ? Math.round((stats.processed / stats.total) * 100) : 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Processing Status</h3>
        {isProcessing && (
          <span className="flex items-center text-blue-600 text-sm font-medium animate-pulse">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Page {currentPage}...
          </span>
        )}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col items-center">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total</span>
          <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1">
             <CheckCircle2 className="w-3 h-3 text-green-600" />
             <span className="text-xs text-green-600 uppercase tracking-wider font-semibold">Success</span>
          </div>
          <span className="text-2xl font-bold text-green-700">{stats.success}</span>
        </div>
        <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex flex-col items-center">
          <div className="flex items-center gap-1 mb-1">
             <XCircle className="w-3 h-3 text-red-600" />
             <span className="text-xs text-red-600 uppercase tracking-wider font-semibold">Failed</span>
          </div>
          <span className="text-2xl font-bold text-red-700">{stats.failed}</span>
        </div>
      </div>
    </div>
  );
};