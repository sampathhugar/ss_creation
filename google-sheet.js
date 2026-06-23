/* ============================================================
   GOOGLE SHEET SUBMISSION
   ------------------------------------------------------------
   Sends the enquiry form data to the Google Sheet using the
   Web App URL configured in google-sheet-config.js.

   This file does NOT contain any credentials — edit
   google-sheet-config.js to change the destination sheet.
   ============================================================ */

/**
 * Sends the enquiry data to the configured Google Sheet.
 *
 * @param {Object} data - key/value pairs collected from the form.
 * @returns {Promise<void>} resolves when the request was sent.
 */
async function saveEnquiryToGoogleSheet(data) {
    // Make sure the config file is loaded and a real URL was set.
    if (typeof GOOGLE_SHEET_CONFIG === 'undefined' || !GOOGLE_SHEET_CONFIG.webAppUrl) {
        throw new Error('Google Sheet is not configured. Set webAppUrl in google-sheet-config.js');
    }

    const url = GOOGLE_SHEET_CONFIG.webAppUrl;

    if (url.indexOf('PASTE_YOUR_WEB_APP_URL_HERE') !== -1) {
        throw new Error('Google Sheet Web App URL has not been set in google-sheet-config.js');
    }

    // Build a FormData payload. Using FormData keeps the request a
    // "simple" CORS request, so the browser does not block it and
    // Google Apps Script can read every field from e.parameter.
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
    });

    // Apps Script Web Apps do not return CORS headers, so we use
    // mode: 'no-cors'. The request still reaches the sheet; we just
    // cannot read the response body (which is fine here).
    await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    });
}
