
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var appSheet = sheet.getSheetByName('Applications');
  var intSheet = sheet.getSheetByName('Interview');
  
  if (!e || !e.parameter) return ContentService.createTextOutput(JSON.stringify({'status': 'ignored'})).setMimeType(ContentService.MimeType.JSON);
  
  var action = e.parameter.action;
  var id = e.parameter.id;
  
  if (action === 'delete') {
    // Delete from Applications tab (Assuming ID is in Column A or last column, usually column A or a hidden column)
    if (appSheet) {
      var data = appSheet.getDataRange().getValues();
      for (var i = data.length - 1; i >= 0; i--) {
        // Look for ID in the row (check all columns just to be safe)
        if (data[i].indexOf(id) !== -1) {
          appSheet.deleteRow(i + 1);
        }
      }
    }
    
    // Delete from Interview tab
    if (intSheet) {
      var intData = intSheet.getDataRange().getValues();
      for (var i = intData.length - 1; i >= 0; i--) {
        // Look for ID in the row (column G is index 6, but we check all to be safe)
        if (intData[i].indexOf(id) !== -1) {
          intSheet.deleteRow(i + 1);
        }
      }
    }
    return ContentService.createTextOutput(JSON.stringify({'status': 'deleted'})).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Other actions omitted because I don't know their exact logic, 
  // so maybe I shouldn't overwrite their entire script!
}
