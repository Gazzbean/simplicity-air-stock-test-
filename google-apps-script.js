// ═══════════════════════════════════════════════════════════════════
//  SIMPLICITY AIR – Google Apps Script Web App (v5)
//
//  KEY CHANGE in v5:
//  - Usage Log uses insertRow(3) instead of appendRow
//    → New entries go to row 3 (after headers), newest first
//    → App always reads A3:O22 to get the 20 most recent entries
//  - All other writes unchanged
//
//  TO UPDATE:
//  Extensions → Apps Script → paste this → Save →
//  Deploy → Manage deployments → ✏️ → New version → Deploy
// ═══════════════════════════════════════════════════════════════════

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      message: 'Simplicity Air Apps Script v5 running',
      sheet: ss.getName(),
      tabs: ss.getSheets().map(function(s){ return s.getName(); })
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var result;

    function getSheetAndRange(rangeStr) {
      var match = rangeStr.match(/^'?([^'!]+)'?!(.+)$/);
      if (!match) throw new Error('Invalid range: ' + rangeStr);
      var sheetName = match[1].trim();
      var a1Range   = match[2].trim();
      var sheet     = ss.getSheetByName(sheetName);
      if (!sheet) throw new Error('Sheet not found: ' + sheetName);
      return { sheet: sheet, a1Range: a1Range };
    }

    if (payload.action === 'append') {
      var target = getSheetAndRange(payload.range);
      var sheet  = target.sheet;

      // For Usage Log — insert at row 3 so newest entries appear first
      // For all other sheets — use standard appendRow
      if (sheet.getName() === 'Usage Log') {
        sheet.insertRowBefore(3);
        sheet.getRange(3, 1, 1, payload.values[0].length)
             .setValues(payload.values);
        result = { ok: true, action: 'append', method: 'insertRow3' };
      } else {
        sheet.appendRow(payload.values[0]);
        result = { ok: true, action: 'append', method: 'appendRow' };
      }
    }

    else if (payload.action === 'update') {
      var updateTarget = getSheetAndRange(payload.range);
      updateTarget.sheet.getRange(updateTarget.a1Range).setValues(payload.values);
      result = { ok: true, action: 'update' };
    }

    else if (payload.action === 'read') {
      var readTarget = getSheetAndRange(payload.range);
      var values = readTarget.sheet.getRange(readTarget.a1Range).getValues();
      result = { ok: true, action: 'read', values: values };
    }

    else {
      result = { ok: false, error: 'Unknown action: ' + payload.action };
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
