import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {StartUserSession, NewUserSession} from "../types/user-session.type";


export type SUPPORTED_METHODS = 'GET' | 'POST' | 'PUT' | 'DELETE';

@Injectable()
export class ApiClient {
  private endpoint = process.env['APP_API_ENDPOINT']
  private http = inject(HttpClient);

  // internal methods
  private request<T>(method: SUPPORTED_METHODS, url: string, body?: any, additionalHeaders?: HttpHeaders): Promise<T | undefined> {
    return firstValueFrom(this.http.request<T>(
      method,
      url,
      {
        observe: 'body',
        headers: additionalHeaders,
        body: body
      }
    ));
  }

  // public api
  startUserSession(request: StartUserSession): Promise<NewUserSession | undefined> {
    return this.request<NewUserSession>('POST', `${this.endpoint}/lobby`, request);
  }

  endUserSession(session_id: string): Promise<NewUserSession | undefined> {
    return this.request<NewUserSession>('POST', `${this.endpoint}/lobby`, { session_id: session_id });
  }
}
