function doPost(e) {
  // If no parameters, ignore
  if (!e || !e.parameter) {
    return ContentService.createTextOutput(JSON.stringify({'status': 'ignored'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var appSheet = sheet.getSheetByName('Applications');
  var intSheet = sheet.getSheetByName('Interview');
  var shortSheet = sheet.getSheetByName('Shortlist');
  
  var action = e.parameter.action;
  var id = e.parameter.id;
  
  try {
    // ==========================================
    // ACTION: ADD (New Application)
    // ==========================================
    if (action === 'add') {
      if (appSheet) {
        var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
        
        // Capitalize status to match Data Validation (e.g. 'new' -> 'New')
        var rawStatus = e.parameter.status || 'New';
        var safeStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
        
        appSheet.appendRow([
          e.parameter.name || '',
          e.parameter.position || '',
          today,
          safeStatus,
          e.parameter.resumeLink || '',
          '', // Default action (blank to avoid data validation errors)
          id
        ]);
      }
      return ContentService.createTextOutput(JSON.stringify({'status': 'success'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // ==========================================
    // ACTION: UPDATE (Shortlisted)
    // ==========================================
    else if (action === 'update') {
      if (appSheet) {
        var data = appSheet.getDataRange().getValues();
        var isShortlisted = e.parameter.isShortlisted === 'true';
        var candidateRowData = null;
        
        for (var i = 1; i < data.length; i++) {
          if (data[i].indexOf(id) !== -1) {
            
            // CAUTION: Data Validation forces exact matches!
            var statusValue = isShortlisted ? 'Under Review' : 'New';
            var actionValue = isShortlisted ? 'Shortlisted' : '';
            
            // Update Applications tab
            appSheet.getRange(i + 1, 6).setValue(actionValue); 
            appSheet.getRange(i + 1, 4).setValue(statusValue); 
            
            // Capture the updated data for the Shortlist tab
            candidateRowData = [
              data[i][0], // Name
              data[i][1], // Position
              data[i][2], // Application Date
              statusValue, // Status
              data[i][4], // Resume
              actionValue, // Actions
              id          // ID
            ];
            break;
          }
        }
        
        // Sync with the Shortlist tab!
        if (shortSheet) {
           // 1. Remove them from the Shortlist tab if they are already there
           var shortData = shortSheet.getDataRange().getValues();
           for (var j = shortData.length - 1; j >= 0; j--) {
             if (shortData[j].indexOf(id) !== -1) {
               shortSheet.deleteRow(j + 1);
             }
           }
           
           // 2. If they are shortlisted, add them fresh to the bottom of the Shortlist sheet
           if (isShortlisted && candidateRowData) {
             shortSheet.appendRow(candidateRowData);
           }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({'status': 'updated'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // ==========================================
    // ACTION: SCHEDULE (Interview)
    // ==========================================
    else if (action === 'schedule') {
      if (intSheet && appSheet) {
        var candidateName = "Unknown";
        var resumeLink = "";
        
        // Look up candidate name and resume from Applications sheet
        var appData = appSheet.getDataRange().getValues();
        for (var i = 1; i < appData.length; i++) {
          if (appData[i].indexOf(id) !== -1) {
            candidateName = appData[i][0]; 
            resumeLink = appData[i][4];    
            break;
          }
        }
        
        var scheduleText = (e.parameter.scheduleDate || '') + "\n" + (e.parameter.scheduleTime || '');
        var detailsText = (e.parameter.scheduleType || '') + "\n" + (e.parameter.stage || '');
        
        intSheet.appendRow([
          candidateName,
          scheduleText,
          detailsText,
          resumeLink,
          'Scheduled',
          '',       
          id           
        ]);
      }
      return ContentService.createTextOutput(JSON.stringify({'status': 'scheduled'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // ==========================================
    // ACTION: DELETE (From all sheets)
    // ==========================================
    else if (action === 'delete') {
      var sheetsToSearch = ['Applications', 'Interview', 'Shortlist', 'Staff Profile']; 
      
      for (var s = 0; s < sheetsToSearch.length; s++) {
        var currentSheet = sheet.getSheetByName(sheetsToSearch[s]);
        
        if (currentSheet) {
          var data = currentSheet.getDataRange().getValues();
          for (var i = data.length - 1; i >= 0; i--) {
            if (data[i].indexOf(id) !== -1) {
              currentSheet.deleteRow(i + 1);
            }
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({'status': 'deleted'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ==========================================
    // ACTION: DELETE INTERVIEW (Only from Interview sheet)
    // ==========================================
    else if (action === 'delete_interview') {
      if (intSheet) {
        var data = intSheet.getDataRange().getValues();
        for (var i = data.length - 1; i >= 0; i--) {
          if (data[i].indexOf(id) !== -1) {
            intSheet.deleteRow(i + 1);
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({'status': 'deleted_interview'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    else {
      return ContentService.createTextOutput(JSON.stringify({'status': 'unknown_action'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({'status': 'error', 'message': error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
