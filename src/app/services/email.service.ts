import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  URL = API_URL;
  // URL = 'https://localhost:7006'; //LocalURL
  sendEmailURL = `${this.URL}/api/Email/sendEmail`;

  constructor(private http: HttpClient) {}
  sendEmail(to: any, subject: any, emailBody: any) {
    console.log('come to dubaiiiiiii habiibiiiiiiiiiiiiii');
    console.log(to, subject, emailBody);

    const emailRequest = {
      To: to,
      Subject: subject,
      Body: emailBody,
    };
    return this.http.post(this.sendEmailURL, emailRequest);
  }
}
