import React, { ChangeEvent } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  disabled: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, selectedFile, disabled }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        alert('Please upload a valid PDF file.');
      }
    }
  };

  return (
    <div className="w-full">
      <label 
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors
        ${disabled 
          ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
          : 'bg-white border-blue-300 hover:bg-blue-50 hover:border-blue-500'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {selectedFile ? (
            <>
              <FileText className="w-12 h-12 text-blue-500 mb-3" />
              <p className="mb-2 text-sm text-gray-700 font-medium">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p className="text-xs text-blue-500 mt-2 hover:underline">Click to change file</p>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <p className="mb-2 text-sm text-gray-600">
                <span className="font-semibold">Click to upload PDF</span>
              </p>
              <p className="text-xs text-gray-500">PDF files only (Max 500 pages recommended)</p>
            </>
          )}
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
};