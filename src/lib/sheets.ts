export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbztF0BPq4D4_NCBtuDVavppLbxqwfrIY0Oho_ZjkZzQUxZDNobMbkgQqHcd7oA6ftwy/exec';

export const syncToGoogleSheet = async (action: 'add' | 'delete' | 'update' | 'schedule' | 'delete_interview' | 'add_form' | 'delete_form', data: any) => {
  try {
    const payload: Record<string, string> = {
      action,
      ...data
    };

    // Convert payload to URL-encoded string so Apps Script can read it via e.parameter
    const formBody = Object.keys(payload)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key] || ''))
      .join('&');

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody
    });
    
    console.log(`Successfully queued sync to Google Sheets for action: ${action}`);
  } catch (err) {
    console.error('Error syncing to Google Sheet:', err);
  }
};
