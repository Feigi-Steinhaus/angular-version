import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/enviroments/environment';
import Swal from 'sweetalert2';
import { TaskService } from './task.service';

declare var gapi: any;
declare var google: any;

@Injectable({
  providedIn: 'root'
})

export class GoogleAuthService {
  private CLIENT_ID = environment.CLIENT_ID;
  private API_KEY = environment.API_KEY;
  private DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
  private SCOPES = "https://www.googleapis.com/auth/calendar";

  private tokenClient: any;
  private gapiInited = false;
  private gisInited = false;

  constructor(private ngZone: NgZone, private taskService: TaskService) {
    this.loadGapi();
    this.loadGis();
  }

  private loadGapi() {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => this.gapiLoaded();
    document.body.appendChild(script);
  }

  private loadGis() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => this.gisLoaded();
    document.body.appendChild(script);
  }

  private gapiLoaded() {
    gapi.load('client', () => {
      this.ngZone.run(() => {
        this.initializeGapiClient();
      });
    });
  }

  private async initializeGapiClient() {
    await gapi.client.init({
      apiKey: this.API_KEY,
      discoveryDocs: [this.DISCOVERY_DOC],
    });
    this.gapiInited = true;
  }

  private gisLoaded() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: '',
    });
    this.gisInited = true;
  }

  private reinitializeGapi() {
    gapi.client.init({
      apiKey: this.API_KEY,
      discoveryDocs: [this.DISCOVERY_DOC],
    }).then(() => {
      this.gapiInited = true;
    });
  }

  public createGoogleEvent(eventDetails: any, taskId: number) {
    if (!this.gapiInited || !this.gisInited) {
      console.error("GAPI or GIS not initialized");
      this.reinitializeGapi();
      return;
    }
    this.tokenClient.callback = async (resp: any) => {
      if (resp.error !== undefined) {
        console.error("Error during token request", resp.error);
        throw resp;
      }
      await this.scheduleEvent(eventDetails, taskId);
    };
    try {
      if (gapi.client.getToken() === null) {
        this.tokenClient.requestAccessToken({ prompt: "consent" });
      } else {
        this.tokenClient.requestAccessToken({ prompt: "" });
      }
    } catch (error) {
      console.error("Error requesting access token", error);
    }
    console.log('Token request initiated');
  }

  private async scheduleEvent(eventDetails: any, taskId: number) {
    const event = {
      summary: eventDetails.nameT,
      location: "",
      description: eventDetails.description,
      start: {
        dateTime: eventDetails.startTime,
        timeZone: "Asia/Jerusalem",
      },
      end: {
        dateTime: eventDetails.startTime,
        timeZone: "Asia/Jerusalem",
      },
      attendees: [{ email: eventDetails.email }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };
    const request = gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });
    request.execute((event: any) => {
      console.log("event created: ", event);
      this.taskService.updateGoogleId(taskId, event.id).subscribe((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      })
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "המשימה נשמרה",
        html: `
        לצפיה בלוח המשימות
    <a href="${event.htmlLink}" target="_blank" autofocus>לחץ כאן</a> `,
        showConfirmButton: false,
        timer: 3000
      });
    });
  }

  public updateGoogleEvent(eventDetails: any, googleId: string) {
    if (!this.gapiInited || !this.gisInited) {
      console.error("GAPI or GIS not initialized");
      this.reinitializeGapi();
      return;
    }
    this.tokenClient.callback = async (resp: any) => {
      if (resp.error !== undefined) {
        console.error("Error during token request", resp.error);
        throw resp;
      }
      await this.scheduleUpdateEvent(eventDetails, googleId);
    };
    try {
      if (gapi.client.getToken() === null) {
        this.tokenClient.requestAccessToken({ prompt: "consent" });
      } else {
        this.tokenClient.requestAccessToken({ prompt: "" });
      }
    } catch (error) {
      console.error("Error requesting access token", error);
    }
    console.log('Token request initiated');
  }

  private async scheduleUpdateEvent(eventDetails: any, googleId: string) {
    const event = {
      summary: eventDetails.nameT,
      location: "",
      description: eventDetails.description,
      start: {
        dateTime: eventDetails.startTime,
        timeZone: "Asia/Jerusalem",
      },
      end: {
        dateTime: eventDetails.startTime,
        timeZone: "Asia/Jerusalem",
      },
      attendees: [{ email: eventDetails.email }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };
    const request = gapi.client.calendar.events.update({
      calendarId: "primary",
      eventId: googleId,
      resource: event,
    });
    request.execute((event: any) => {
      console.log("event updated: ", event);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "המשימה עודכנה",
        html: `
        לצפיה בלוח המשימות
    <a href="${event.htmlLink}" target="_blank" autofocus>לחץ כאן</a> `,
        showConfirmButton: false,
        timer: 3000
      });
    });
  }

  // 
  public deleteGoogleEvent(googleId: string) {
    console.log("delete google event: ", googleId);

    if (!this.gapiInited || !this.gisInited) {
      console.error("GAPI or GIS not initialized");
      this.reinitializeGapi();
      return;
    }
    this.tokenClient.callback = async (resp: any) => {
      if (resp.error !== undefined) {
        console.error("Error during token request", resp.error);
        throw resp;
      }
      await this.scheduleDeleteEvent(googleId);
    };
    try {
      console.log("try");

      if (gapi.client.getToken() === null) {
        this.tokenClient.requestAccessToken({ prompt: "consent" });
      } else {
        this.tokenClient.requestAccessToken({ prompt: "" });
      }
    } catch (error) {
      console.error("Error requesting access token", error);
    }
    console.log('Token request initiated');
  }

  private async scheduleDeleteEvent(googleId: string) {
    console.log("scheduleDeleteEvent", googleId);

    const request = gapi.client.calendar.events.delete({
      calendarId: "primary",
      eventId: googleId,
    });
    console.log("request", request);

    request.execute((event: any) => {
      console.log("event updated: ", event);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "המשימה נמחקה",
        html: `
        לצפיה בלוח המשימות
    <a href="${event.htmlLink}" target="_blank" autofocus>לחץ כאן</a> `,
        showConfirmButton: false,
        timer: 3000
      });
    });
  }
  // 
}