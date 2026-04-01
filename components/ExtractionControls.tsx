import React from 'react';
import { PageSelection } from '../types';
import { Settings, FileSpreadsheet } from 'lucide-react';

interface ExtractionControlsProps {
  fields: string;
  setFields: (val: string) => void;
  pageSelection: PageSelection;
  setPageSelection: (val: PageSelection) => void;
  totalPages: number;
  disabled: boolean;
}

export const ExtractionControls: React.FC<ExtractionControlsProps> = ({
  fields,
  setFields,
  pageSelection,
  setPageSelection,
  totalPages,
  disabled
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-800">Configuration</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fields to Extract
        </label>
        <div className="relative">
          <textarea
            value={fields}
            onChange={(e) => setFields(e.target.value)}
            disabled={disabled}
            placeholder="e.g. Invoice Number, Date, Total Amount, Vendor Name"
            className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none disabled:bg-gray-50"
          />
          <div className="absolute top-3 right-3">
             <div className="group relative flex justify-center">
                 <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                   Describe the exact fields you want the AI to look for in the red square areas.
                 </div>
                 <AlertCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
             </div>
          </div>
        </div>
        <p className="mt-1.5 text-xs text-gray-500">
          Describe the data points marked in your reference images (red squares).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Selection
          </label>
          <select
            value={pageSelection}
            onChange={(e) => setPageSelection(e.target.value as PageSelection)}
            disabled={disabled}
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value={PageSelection.ALL}>All Pages (1-{totalPages})</option>
            <option value={PageSelection.ODD}>Odd Pages Only (1, 3, 5...)</option>
            <option value={PageSelection.EVEN}>Even Pages Only (2, 4, 6...)</option>
          </select>
        </div>
        
        <div className="flex items-end">
           <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-xs w-full">
              <strong>Tip:</strong> Select "Even Pages Only" if your data appears on every second page starting from page 2.
           </div>
        </div>
      </div>
    </div>
  );
};

const AlertCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
)
