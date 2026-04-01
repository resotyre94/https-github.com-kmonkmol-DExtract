import React from 'react';
import { ExtractedData } from '../types';
import { AlertCircle } from 'lucide-react';

interface DataPreviewProps {
  data: ExtractedData[];
}

export const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
  const successItems = data.filter(d => d.status === 'success');
  const errorItems = data.filter(d => d.status === 'error');

  if (data.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-400">
        Waiting for data...
      </div>
    );
  }

  // Determine headers from the first successful item
  const headers = successItems.length > 0 && successItems[0].data
    ? Object.keys(successItems[0].data) 
    : [];

  return (
    <div className="space-y-6">
      {/* Error Log */}
      {errorItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-red-800 font-semibold">
            <AlertCircle className="w-5 h-5" />
            <h4>Errors ({errorItems.length})</h4>
          </div>
          <div className="max-h-32 overflow-y-auto text-sm text-red-700 space-y-1">
            {errorItems.map((item) => (
              <div key={item.page} className="flex gap-2">
                <span className="font-medium w-20">Page {item.page}:</span>
                <span>{item.errorMessage || 'Unknown error'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Extraction Preview</h3>
          <span className="text-xs text-gray-500">{successItems.length} records found</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Page</th>
                {headers.map(header => (
                  <th key={header} className="px-6 py-3 font-medium">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {successItems.slice(0, 10).map((item, idx) => (
                <tr key={`${item.page}-${idx}`} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{item.page}</td>
                  {headers.map(header => (
                    <td key={`${item.page}-${header}`} className="px-6 py-3 text-gray-600">
                      {item.data[header]?.toString() || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {successItems.length > 10 && (
            <div className="p-3 text-center text-xs text-gray-500 bg-gray-50 border-t">
              Showing first 10 records. Export to Excel to see all {successItems.length} records.
            </div>
          )}
          {successItems.length === 0 && errorItems.length === 0 && (
             <div className="p-8 text-center text-gray-500">No data extracted yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};