import * as XLSX from 'xlsx';
import { ExtractedData } from '../types';

export const exportToExcel = (data: ExtractedData[], fileName: string = 'extracted_data.xlsx') => {
  // Flatten data for Excel
  const flatData = data
    .filter(item => item.status === 'success')
    .map(item => ({
      Page: item.page,
      ...item.data
    }));

  if (flatData.length === 0) {
    console.warn("No data to export");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(flatData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Extracted Data");
  
  XLSX.writeFile(workbook, fileName);
};