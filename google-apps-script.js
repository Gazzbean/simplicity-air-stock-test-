// ═══════════════════════════════════════════════════════════════════
//  SIMPLICITY AIR – Google Apps Script Web App
//  Deploy this as a Web App to enable write operations from the PWA
//  (Google Sheets API read-only with API key; writes need OAuth or Apps Script)
//
//  How to deploy:
//  1. Open your Google Sheet
//  2. Extensions → Apps Script
//  3. Paste this entire file, replacing any existing code
//  4. Click Deploy → New Deployment → Web App
//  5. Execute as: Me | Who has access: Anyone
//  6. Copy the Web App URL and paste it in the PWA Settings → Script URL field
// ═══════════════════════════════════════════════════════════════════

const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const ss      = SpreadsheetApp.openById(SHEET_ID);
    let result;

    if (payload.action === 'append') {
      const sheet = ss.getRange(payload.range).getSheet();
      sheet.appendRow(payload.values[0]);
      result = { ok: true, action: 'append' };
    }

    if (payload.action === 'update') {
      ss.getRange(payload.range).setValues(payload.values);
      result = { ok: true, action: 'update' };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'Simplicity Air Apps Script running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
