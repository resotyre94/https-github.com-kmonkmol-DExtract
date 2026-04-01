// We access pdfjsLib from the global window object since we loaded it via CDN in index.html
// to avoid complex bundler worker configuration issues in this environment.
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export const loadPdf = async (file: File): Promise<any> => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
  return loadingTask.promise;
};

export const renderPageToImage = async (pdfDoc: any, pageNumber: number, scale = 1.5): Promise<string> => {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  if (!context) throw new Error('Could not get canvas context');

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;

  // Convert to base64 string (remove data:image/png;base64, prefix for API)
  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
  return dataUrl;
};