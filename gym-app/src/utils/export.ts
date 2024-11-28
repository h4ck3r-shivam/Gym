type CSVData = Record<string, any>[];

export const exportToCSV = (data: CSVData, filename: string): void => {
  // Get headers from first object keys
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV format
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const cell = row[header]?.toString() || '';
        // Escape quotes and wrap in quotes if contains comma
        return cell.includes(',') ? `"${cell.replace(/"/g, '""')}"` : cell;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
