// ═══════════════════════════════════════════════════════════════════
//  SIMPLICITY AIR – Google Apps Script Web App (v6)
//
//  CHANGES in v6:
//  - Improved error handling on update action
//  - Explicit flush after writes to ensure they commit
//  - Better logging for debugging
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
      message: 'Simplicity Air Apps Script v6 running',
      sheet: ss.getName(),
      tabs: ss.getSheets().map(function(s){ return s.getName(); })
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var ss      = SpreadsheetApp.getActiveSpreadsheet();
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
      if (sheet.getName() === 'Usage Log') {
        sheet.insertRowBefore(3);
        sheet.getRange(3, 1, 1, payload.values[0].length)
             .setValues(payload.values);
      } else {
        sheet.appendRow(payload.values[0]);
      }
      SpreadsheetApp.flush();
      result = { ok: true, action: 'append' };
    }

    else if (payload.action === 'update') {
      var updateTarget = getSheetAndRange(payload.range);
      var range = updateTarget.sheet.getRange(updateTarget.a1Range);
      range.setValues(payload.values);
      SpreadsheetApp.flush();
      result = { ok: true, action: 'update', range: payload.range };
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
