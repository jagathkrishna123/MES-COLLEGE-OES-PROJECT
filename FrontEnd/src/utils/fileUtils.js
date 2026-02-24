/**
 * Utility functions for file handling in the exam evaluation system
 */

/**
 * Convert a File object to a Base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 encoded string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * Convert a Base64 string back to a Blob URL
 * @param {string} base64String - The Base64 encoded string (data:image/jpeg;base64,... or data:application/pdf;base64,...)
 * @returns {string} - Blob URL that can be used in src attributes
 */
export function base64ToBlobUrl(base64) {
  if (!base64) return undefined;

  try {
    // 1️⃣ Remove data URL prefix if present
    const cleanedBase64 = base64.includes(",") ? base64.split(",")[1] : base64;

    // 2️⃣ Remove all whitespace/newlines
    const normalizedBase64 = cleanedBase64.replace(/\s/g, "");

    // 3️⃣ Decode Base64 safely
    const byteCharacters = atob(normalizedBase64);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    // 4️⃣ Infer MIME type from prefix if exists, fallback to generic
    let mimeType = "application/octet-stream";
    if (base64.startsWith("data:")) {
      const match = base64.match(/^data:(.*?);base64,/);
      if (match && match[1]) mimeType = match[1];
    }

    const blob = new Blob([byteArray], { type: mimeType });

    return URL.createObjectURL(blob);
  } catch (err) {
    console.error("Error converting base64 to blob URL:", err);
    return undefined;
  }
}


/**
 * Safely revoke blob URLs to prevent memory leaks
 * @param {...string} urls - Blob URLs to revoke
 */
export const revokeBlobUrls = (...urls) => {
  urls.forEach(url => {
    if (url && url.startsWith('blob:') && url !== 'blob:') {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.warn('Failed to revoke blob URL:', error);
      }
    }
  });
};

/**
 * Check if a string is a valid Base64 data URL
 * @param {string} str - String to check
 * @returns {boolean} - True if it's a valid Base64 data URL
 */
export const isBase64DataUrl = (str) => {
  return str && typeof str === 'string' && str.startsWith('data:') && str.includes('base64,');
};

/**
 * Get MIME type from Base64 data URL
 * @param {string} base64String - Base64 data URL
 * @returns {string|null} - MIME type or null if invalid
 */
export const getMimeTypeFromBase64 = (base64String) => {
  if (!isBase64DataUrl(base64String)) {
    return null;
  }
  try {
    const mimeInfo = base64String.split(',')[0];
    return mimeInfo.split(':')[1].split(';')[0];
  } catch (error) {
    return null;
  }
};