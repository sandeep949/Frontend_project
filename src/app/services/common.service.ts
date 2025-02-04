import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
public url:string="http://localhost:9090/";
  constructor(public http:HttpClient) { }

  // public post(body:any,url:any){
  //   return this.http.post(this.url+url,body);
  // }
  // public getAuthHeaders(): HttpHeaders {
  //   const token = localStorage.getItem('token');
  //   return new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });
  // }
  public post<T>(body: any, endpoint: string): Observable<T> {
    return this.http.post<T>(`${this.url}${endpoint}`, body);
  }
  public get(url:any,body?:any,): Observable<any>{
    return this.http.get(this.url+url,body);
  }

  public delete(url: any, body?: any): Observable<any> {
    return this.http.request('delete', this.url + url, {
      body: body,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token if required
      }),
    });
  }

   public put<T>(body: any, endpoint: string): Observable<T> {
    return this.http.put<T>(`${this.url}/${endpoint}`, body);
  }
  public returnToken():String{
    return localStorage.getItem("token");
  }
  public extractToken(){
    let token:any = JSON.parse(atob(this.returnToken().split('.')[1]));
    return token;
  }
  
  
  }

  

  

  