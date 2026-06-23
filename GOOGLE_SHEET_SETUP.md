# Connecting the Enquiry Form to Google Sheets

The enquiry form on the website saves every submission to a Google Sheet.
Follow these steps once to set it up. Afterwards, you only ever need to edit
**`google-sheet-config.js`** to change the destination.

---

## Step 1 — Create the Google Sheet

1. Go to <https://sheets.google.com> and create a **new blank spreadsheet**.
2. Name it something like `SS Recreation Enquiries`.
3. In **row 1**, add these column headers (exactly, in this order):

   | timestamp | name | phone | email | service | company | groupsize | message |
   |-----------|------|-------|-------|---------|---------|-----------|---------|

   > These match the form field names. The script also auto-creates headers
   > if you skip this, but adding them keeps the columns in a clean order.

---

## Step 2 — Add the Apps Script

1. In the spreadsheet, click **Extensions → Apps Script**.
2. Delete any existing code, then paste the script below.
3. Click the **Save** (💾) icon.

```javascript
// SS Recreation - Enquiry Form -> Google Sheet

// The name of the tab (at the bottom of the spreadsheet) to save enquiries to.
// Change this to the exact tab name you want, then REDEPLOY (see Step 3).
var SHEET_TAB_NAME = 'Sheet1';

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_TAB_NAME);

    // If that tab doesn't exist yet, create it automatically.
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_TAB_NAME);
    }

    var data = e.parameter;

    // The order the values are written to the sheet
    var headers = ['timestamp', 'name', 'phone', 'email', 'service', 'company', 'groupsize', 'message'];

    // If the sheet is empty, add the header row first
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }

    var row = headers.map(function (key) {
      return data[key] || '';
    });

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## Step 3 — Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear ⚙ next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description:** `Enquiry form endpoint`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**  ← important, so the website can post to it.
4. Click **Deploy**.
5. Google will ask you to **authorize** — approve the permissions
   (click *Advanced → Go to project → Allow* if it warns it is unverified).
6. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfyc..../exec`

---

## Step 4 — Paste the URL into the website

1. Open **`google-sheet-config.js`** in this folder.
2. Replace `PASTE_YOUR_WEB_APP_URL_HERE` with the URL you copied:

   ```javascript
   const GOOGLE_SHEET_CONFIG = {
       webAppUrl: "https://script.google.com/macros/s/AKfyc..../exec"
   };
   ```

3. Save the file. **Done!** Submit a test enquiry on the site — a new row
   should appear in your Google Sheet.

---

## Changing which TAB it saves to (same spreadsheet)

The script saves to the tab named in `SHEET_TAB_NAME` at the top of the
Apps Script (default `'Sheet1'`).

1. In the spreadsheet, **Extensions → Apps Script**.
2. Change the value, e.g. `var SHEET_TAB_NAME = 'Enquiries';`
   (use the exact tab name shown at the bottom of the sheet — case-sensitive).
3. **Redeploy:** Deploy → Manage deployments → ✏️ edit → Version: New version → Deploy.

If the tab doesn't exist yet, the script creates it automatically. The Web App
URL stays the same, so `google-sheet-config.js` does **not** need to change.

## Changing to a different SPREADSHEET later

Create a new sheet + deployment, then paste the new `/exec` URL into
`google-sheet-config.js`. No other file needs to change.

## Troubleshooting

- **Nothing appears in the sheet:** confirm "Who has access" is set to
  **Anyone**, and that the URL ends with `/exec` (not `/dev`).
- **You edited the Apps Script:** you must **redeploy** (Deploy → Manage
  deployments → edit → New version) for changes to take effect.
- **Columns are blank/misaligned:** make sure the header names in the sheet
  match the field names listed in Step 1.
