/**
 * PDF Extraction Helpers
 * Utilities for extracting pages from PDF files, matching legacy loadFrontImage functionality
 */

/**
 * Convert File to base64 string
 * @param file - The file to convert
 * @returns Promise that resolves to base64 string
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Extract a specific page from a PDF file and return as base64 image
 * This matches the legacy loadFrontImage functionality from ChequeEditForm.js
 *
 * @param pdfFile - The PDF file to extract from
 * @param pageIndex - The 0-based index of the page to extract (ImageIndex from QR result)
 * @param extractPdfPageMutation - RTK Query mutation function for PDF extraction
 * @returns Promise that resolves to base64 image data URL or null if failed
 */
export const extractPdfPageAsImage = async (
  pdfFile: File,
  pageIndex: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extractPdfPageMutation: any, // RTK Query mutation trigger
): Promise<string | null> => {
  try {
    // Convert PDF file to base64
    const base64File = await convertFileToBase64(pdfFile);

    // Call the extract PDF page service - RTK Query returns unwrapped result
    const response = await extractPdfPageMutation({
      base64File,
      pageIndex,
    }).unwrap();

    // Check for successful response
    if (response && response.File && !response.ErrorMessage) {
      // Return as data URL for image display
      return `data:image/jpeg;base64,${response.File}`;
    } else {
      console.error('PDF extraction failed:', response?.ErrorMessage || 'Unknown error');
      return null;
    }
  } catch (error) {
    console.error('Error extracting PDF page:', error);
    return null;
  }
};

/**
 * Check if a file is a PDF
 * @param file - The file to check
 * @returns boolean indicating if the file is a PDF
 */
export const isPdfFile = (file: File | null): boolean => {
  return file !== null && file.type === 'application/pdf';
};

/**
 * Get display name for extracted image
 * @param originalFileName - Original PDF file name
 * @param pageIndex - Page index that was extracted
 * @returns Formatted display name
 */
export const getExtractedImageDisplayName = (originalFileName: string, pageIndex: number): string => {
  const nameWithoutExtension = originalFileName.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExtension}_page_${pageIndex + 1}.jpg`;
};
