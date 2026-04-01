import React, { useState, useEffect, useRef } from 'react';
import { loadPdf, renderPageToImage } from './services/pdfUtils';
import { extractDataFromImage } from './services/gemini';
import { exportToExcel } from './services/excel';
import { FileUploader } from './components/FileUploader';
import { ExtractionControls } from './components/ExtractionControls';
import { ProcessingStatus } from './components/ProcessingStatus';
import { DataPreview } from './components/DataPreview';
import { ExtractedData, PageSelection, ProcessingStats } from './types';
import { FileDown, Play, RotateCcw, Zap } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  
  const [fields, setFields] = useState<string>('Invoice Number, Date, Total Amount');
  const [pageSelection, setPageSelection] = useState<PageSelection>(PageSelection.EVEN);
  
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentProcessingPage, setCurrentProcessingPage] = useState<number | null>(null);
  const [shouldStop, setShouldStop] = useState<boolean>(false);

  // Derived Stats
  const stats: ProcessingStats = {
    total: extractedData.length + (totalPages > 0 && isProcessing ? (totalPages - extractedData.length) : 0), // Estimate based on selection
    processed: extractedData.length,
    success: extractedData.filter(d => d.status === 'success').length,
    failed: extractedData.filter(d => d.status === 'error').length,
  };

  // Adjust total stats based on selection
  const getTargetPages = () => {
    const pages: number[] = [];
    if (!totalPages) return pages;
    
    for (let i = 1; i <= totalPages; i++) {
      if (pageSelection === PageSelection.ALL) {
        pages.push(i);
      } else if (pageSelection === PageSelection.ODD && i % 2 !== 0) {
        pages.push(i);
      } else if (pageSelection === PageSelection.EVEN && i % 2 === 0) {
        pages.push(i);
      }
    }
    return pages;
  };
  
  const targetPages = getTargetPages();

  // Reset when file changes
  const handleFileSelect = async (selectedFile: File) => {
    try {
      setFile(selectedFile);
      const doc = await loadPdf(selectedFile);
      setPdfDoc(doc);
      setTotalPages(doc.numPages);
      setExtractedData([]);
      setIsProcessing(false);
      setShouldStop(false);
    } catch (error) {
      console.error("Error loading PDF", error);
      alert("Failed to load PDF. Please try another file.");
    }
  };

  const handleStart = async () => {
    if (!pdfDoc || !file) return;
    
    setIsProcessing(true);
    setShouldStop(false);
    setExtractedData([]); // Clear previous results

    const pagesToProcess = getTargetPages();
    
    for (const pageNum of pagesToProcess) {
      if (shouldStop) break; // Check stop flag
      
      // Real-time stop check using a ref would be better but state works with async loop if updated
      // However, inside the loop, the 'shouldStop' state variable value is closed over.
      // We will use a functional check or a ref if needed, but for simplicity here:
      // We won't strictly support "Pause" inside the loop easily without refs. 
      // Let's implement a simple ref for the stop flag.
      
      setCurrentProcessingPage(pageNum);

      try {
        const imageBase64 = await renderPageToImage(pdfDoc, pageNum);
        const data = await extractDataFromImage(imageBase64, fields);
        
        setExtractedData(prev => [...prev, {
          page: pageNum,
          data: data,
          status: 'success'
        }]);
      } catch (error: any) {
        setExtractedData(prev => [...prev, {
          page: pageNum,
          data: {},
          status: 'error',
          errorMessage: error.message || "Extraction failed"
        }]);
      }
      
      // Small delay to be gentle on browser and API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsProcessing(false);
    setCurrentProcessingPage(null);
  };
  
  // Use a ref for the stop signal to be accessible inside the async loop
  const stopRef = useRef(false);
  
  const handleStartRef = async () => {
     if (!pdfDoc || !file) return;
     
     setIsProcessing(true);
     stopRef.current = false;
     setExtractedData([]);

     const pagesToProcess = getTargetPages();

     for (const pageNum of pagesToProcess) {
       if (stopRef.current) break;
       
       setCurrentProcessingPage(pageNum);
       
       try {
         // Retry logic could be added here
         const imageBase64 = await renderPageToImage(pdfDoc, pageNum);
         const data = await extractDataFromImage(imageBase64, fields);
         
         // Only add if not empty or null
         setExtractedData(prev => [...prev, {
           page: pageNum,
           data: data,
           status: 'success'
         }]);
       } catch (error: any) {
         setExtractedData(prev => [...prev, {
           page: pageNum,
           data: {},
           status: 'error',
           errorMessage: error.message || "Unknown error"
         }]);
       }
       
       // Rate limiting buffer: 1 second delay
       await new Promise(resolve => setTimeout(resolve, 1000));
     }
     
     setIsProcessing(false);
     setCurrentProcessingPage(null);
  };

  const handleStop = () => {
    stopRef.current = true;
    setIsProcessing(false);
  };

  const handleExport = () => {
    exportToExcel(extractedData);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">DocuExtract AI</h1>
          </div>
          <div className="flex items-center gap-4">
             {extractedData.length > 0 && !isProcessing && (
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  <FileDown className="w-4 h-4" />
                  Export Excel
                </button>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-8">
           <h2 className="text-3xl font-bold text-gray-900 mb-3">PDF Data Extraction</h2>
           <p className="text-gray-600">
             Upload your document, define the fields, and let Gemini AI extract structured data from every page automatically.
           </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <FileUploader 
              onFileSelect={handleFileSelect} 
              selectedFile={file}
              disabled={isProcessing}
            />
            
            <ExtractionControls 
              fields={fields}
              setFields={setFields}
              pageSelection={pageSelection}
              setPageSelection={setPageSelection}
              totalPages={totalPages}
              disabled={isProcessing || !file}
            />

            {/* Action Buttons */}
            {file && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                {!isProcessing ? (
                  <button
                    onClick={handleStartRef}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    <Play className="w-5 h-5" />
                    Start Extraction
                  </button>
                ) : (
                  <button
                    onClick={handleStop}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Stop Processing
                  </button>
                )}
                
                <div className="mt-4 text-xs text-center text-gray-500">
                   Processing will handle {targetPages.length} pages.
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 space-y-6">
            <ProcessingStatus 
              stats={{
                total: targetPages.length,
                processed: extractedData.length,
                success: extractedData.filter(d => d.status === 'success').length,
                failed: extractedData.filter(d => d.status === 'error').length
              }}
              isProcessing={isProcessing}
              currentPage={currentProcessingPage}
            />
            
            <DataPreview data={extractedData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;