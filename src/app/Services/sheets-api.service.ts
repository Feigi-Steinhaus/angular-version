import { Injectable } from '@angular/core';
declare const gapi: any;
declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class SheetsApiService {
  CLIENT_ID =
    '592088999303-njnsom6mvdcn0kpesi2ibtlhmblcfcda.apps.googleusercontent.com';
  API_KEY = 'AIzaSyAe4wCi-LL97X_H7fhfaYnB_0cPqfdYVNU';
  DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
  SCOPES =
    'https://www.googleapis.com/auth/spreadsheets.readonly  https://www.googleapis.com/auth/drive.readonly';

  tokenClient: any;
  gapiInited = false;
  gisInited = false;

  //טעינת הגאפי והגיס-----------------------------------

  constructor() {
    this.loadGapi();
    this.loadGis();
  }

  loadGapi(): void {
    console.log('loadGapi');
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => this.gapiLoaded();
    document.body.appendChild(script);
  }

  gapiLoaded() {
    console.log('gapiLoaded');
    gapi.load('client', this.initializeGapiClient());
    // this.initializeGapiClient();
  }

  initializeGapiClient(): void {
    console.log('initializeGapiClient');

    gapi.load('client', () => {
      gapi.client
      .init({
        apiKey: 'AIzaSyDOZG1f7ZQw8STwuNSiQp9PFt3Ifgw4cco',
        discoveryDocs: [
          'https://sheets.googleapis.com/$discovery/rest?version=v4',
        ],
      })
      .then(() => {
        this.gapiInited = true;
        this.maybeEnableButtons();
        console.log('after all');
        //קריאה לhandle
        //this.handleAuthClick();
      });
    });
  }
  loadGis(): void {
    console.log('loadGis');
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => this.gisLoaded();
    document.body.appendChild(script);
  }

  gisLoaded(): void {
    console.log('gisLoaded');

    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id:
        '895790776909-f2qsj48b8ra3uvpm0bjnobioilrh2fev.apps.googleusercontent.com',
      scope:
        'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
      callback: 'http://localhost:4200',
    });
    this.gisInited = true;
    //this.maybeEnableButtons();
  }

  maybeEnableButtons(): void {
    console.log('maybeEnableButtons');

    if (this.gapiInited) {
      console.log('gapiInited is true');
    } else {
      console.log('gapiInited is false');
    }

    if (this.gisInited) {
      console.log('gisInited is true');
    } else {
      console.log('gisInited is false');
    }

    if (this.gapiInited && this.gisInited) {
      const spreadSheetBtn = document.getElementById('spreadSheetBtn');
      if (spreadSheetBtn) {
        console.log('spreadSheetBtn visible');
        spreadSheetBtn.style.visibility = 'visible';
      } else {
        console.log('spreadSheetBtn not found');
      }
    }
  }
  //---------------------------Auth-כניסה ויציאה מוסלשת---

  async handleAuthClick(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tokenClient.callback = async (resp: any) => {
        if (resp.error !== undefined) {
          reject(resp);
        } else {
          resolve();
        }
      };

      if (gapi.client.getToken() === null) {
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        this.tokenClient.requestAccessToken({ prompt: '' });
      }
    });
  }

  // handleSignoutClick(): void {
  //   const token = gapi.client.getToken();
  //   if (token !== null) {
  //     google.accounts.oauth2.revoke(token.access_token);
  //     gapi.client.setToken('');
  //     const content = document.getElementById('content');
  //     if (content) {
  //       content.innerText = '';
  //     }
  //     const authorizeButton = document.getElementById('authorize_button');
  //     if (authorizeButton) {
  //       authorizeButton.innerText = 'Authorize';
  //     }
  //     const signoutButton = document.getElementById('signout_button');
  //     if (signoutButton) {
  //       signoutButton.style.visibility = 'hidden';
  //     }
  //   }
  // }

  //----------------------------- גוגל שיטס
  //פונקציות עזר
  //לפני הכל- בדיקה שגאפי קיים
  checkInitGapi(): boolean {
    if (!gapi || !gapi.client) {
      console.error('gapi client not loaded.');
      return false;
    }
    return true;
  }
  //אחרי הכל- ניווט לגול שיטס
  navigationToTheSheet(spreadsheetId: string) {
    // sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    console.log('View the new spreadsheet at:', spreadsheetUrl);
    // Open the URL in a new tab
    window.open(spreadsheetUrl, '_blank');
  }
  //בדיקה שהטוקן תקין
  checkTokenValidity(): boolean {
    const token = gapi.client.getToken();
    if (token) {
      const now = new Date().getTime();
      const expiresAt = new Date(token.expires_at).getTime();
      return now < expiresAt;
    }
    return false;
  }

  //קבלת כל גלינות השיטס שיש לי
  SHEETS_MIME_TYPE = 'application/vnd.google-apps.spreadsheet';

  async listGoogleSheets(): Promise<{ name: string; id: string }[]> {
    try {
      // Ensure GAPI is loaded
      if (!gapi || !gapi.client) {
        console.log('GAPI client not loaded.');
        throw new Error('GAPI client not loaded.');
      }

      // Ensure the Google Drive API is initialized
      await gapi.client.load('drive', 'v3');

      const response = await gapi.client.drive.files.list({
        q: `mimeType='${this.SHEETS_MIME_TYPE}' and trashed=false`,
        fields: 'files(id, name)',
      });

      const files = response.result.files;
      if (!files || files.length === 0) {
        console.log('No Google Sheets found.');
        return [];
      }

      const googleSheets = files.map((file: any) => ({
        name: file.name,
        id: file.id,
      }));

      return googleSheets;
    } catch (error) {
      console.error('Error listing Google Sheets:', error);
      return [];
    }
  }

  //קבלת כל הגיליונות של גוגל שיטס אחד
  async getSheetNames(spreadsheetId: string): Promise<string[]> {
    try {
      const response = await gapi.client.sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
      });

      const sheets = response.result.sheets;
      if (!sheets) {
        console.error('No sheets found.');
        return [];
      }

      const sheetNames = sheets.map((sheet: any) => sheet.properties.title);
      return sheetNames;
    } catch (error) {
      console.error('Error getting sheet names:', error);
      return [];
    }
  }

  //גוגל שיטס- הפונקציות שנקראות מהטבלה
  //הוספת נתונים לגוגל שיטס חדש
  async addDataToNewSheet(
    data: string[][],
    spreadsheetId: string
  ): Promise<void> {
    try {
      const request = {
        spreadsheetId: spreadsheetId,
        range: 'A1',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          majorDimension: 'ROWS',
          values: data,
        },
      };
      const response = await gapi.client.sheets.spreadsheets.values.append(
        request
      );
      console.log('Data added to sheet:', JSON.stringify(response, null, 2));
    } catch (err) {
      console.error('Error creating spreadsheet or adding data:', err);
    }
  }
  //יצירת גוגל שיטס חדש
  async createNewSpreadSheet(sheetTitle: string): Promise<string> {
    try {
      const createResponse = await gapi.client.sheets.spreadsheets.create({
        properties: {
          title: sheetTitle + new Date().toISOString(),
        },
      });
      const spreadsheetId = createResponse.result.spreadsheetId;
      console.log('Created new spreadsheet with ID:', spreadsheetId);
      return spreadsheetId;
    } catch (error) {
      return '';
    }
  }
  //גוגל שיטס חדש והכנסת הנתונים אליו
  async ExportDataToNewSheet(data: string[][], title: string): Promise<void> {
    if (!this.checkTokenValidity()) {
      if (this.checkInitGapi()) {
        const spreadsheetId = await this.createNewSpreadSheet(title);
        await this.addDataToNewSheet(data, spreadsheetId);
        this.navigationToTheSheet(spreadsheetId);
      }
    }
  }

  // async ExportDataToExistSheet(
  //   data: string[][],
  //   spreadsheetId: string
  // ): Promise<void> {
  //   if (this.checkInitGapi()) {
  //     (await this.listGoogleSheets()).forEach((g) =>
  //       console.log(`id: ${g.id}, name: ${g.name}`)
  //     );
  //     const nameSheets: string[] = await this.getSheetNames(spreadsheetId);
  //     this.addDataToExistSheet(data, spreadsheetId, nameSheets[0]);
  //     this.navigationToTheSheet(spreadsheetId);
  //   }
  // }

  //קבלת כל הגוגל שיטס
  async handleAuthClicGetAllSheets(): Promise<string[]> {
    this.tokenClient.callback = async (resp: any) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      if (this.checkInitGapi()) {
        return await this.listGoogleSheets();
      }
      return ['', ''];
    };
    if (gapi.client.getToken() === null) {
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      this.tokenClient.requestAccessToken({ prompt: '' });
    }
    return ['', ''];
  }

  //הוספת גיליון לאותו גוגל שיטס קיים והכנסית המידע לתוכו
  async addSheetToExistingSpreadsheet(
    data: any[][],
    spreadsheetId: string,
    sheetTitle: string
  ): Promise<string> {
    if (!this.checkTokenValidity()) {
      await this.handleAuthClicGetAllSheets();
    }
    const requests = [
      {
        addSheet: {
          properties: {
            title: sheetTitle,
          },
        },
      },
    ];

    const batchUpdateRequest = {
      spreadsheetId: spreadsheetId,
      resource: {
        requests: requests,
      },
    };

    try {
      const response = await gapi.client.sheets.spreadsheets.batchUpdate(
        batchUpdateRequest
      );

      const newSheetId = response.result.replies[0].addSheet.properties.sheetId;

      const appendRequest = {
        spreadsheetId: spreadsheetId,
        range: `${sheetTitle}!A1:Z`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'OVERWRITE',
        resource: {
          values: data,
        },
      };

      const appendResponse =
        await gapi.client.sheets.spreadsheets.values.append(appendRequest);
      const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0`;
      window.open(spreadsheetUrl, '_blank'); // פתיחת הגיליון בחלון חדש
      return response.result.replies[0].addSheet.properties.sheetId;
    } catch (error) {
      console.error('Error adding sheet:', error);
      return 'erorr!';
    }
  }
  //הוספת מידע לגיליון קיים
  async ExportDataToExistSheet(
    data: string[][],
    spreadsheetId: string
  ): Promise<void> {
    if (this.checkInitGapi()) {
      (await this.listGoogleSheets()).forEach(g=> console.log(`id: ${g.id}, name: ${g.name}`));
      const nameSheets: string[] = await this.getSheetNames(spreadsheetId);
      this.addDataToExistSheet(data, spreadsheetId, nameSheets[0]);
      this.navigationToTheSheet(spreadsheetId);
    }
  }

  //הוספת נתונים לגיליון גם אם קיימים בו כבר נתונים
  async addDataToExistSheet(
    data: any[][],
    spreadsheetId: string,
    sheetName: string
  ) {
    
    try {
      // Step 1: קבלת הנתונים הקיימים בגיליון
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!A:Z`, // תחום מספיק רחב כדי לכלול את כל הנתונים בגיליון
        includeValuesInResponse: false //לא לכלול את הכותרות או הנתונים שכבר קיימים בטבלה
      });
  
      // Step 2: חישוב השורה הפנויה הראשונה
      const numRows = response.result.values
        ? response.result.values.length + 1 // הוספת 1 לאורך כדי להתחיל אחרי השורה האחרונה
        : 1; // אם אין נתונים, התחל מהשורה הראשונה
  
      // Step 3: הוספת הנתונים אחרי השורה האחרונה המאוישת
      const request = {
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!A${numRows}`, // התחל מהשורה הראשונה אחרי הסוף המאויש
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: data,
        },
      };
    }
    catch(erorr){
      console.log("error: ", erorr);
    }
  } 
}
