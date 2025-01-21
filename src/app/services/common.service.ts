import { HttpClient } from '@angular/common/http';
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
  public post<T>(body: any, endpoint: string): Observable<T> {
    return this.http.post<T>(`${this.url}${endpoint}`, body);
  }
  
   
  
  public get(url:any,body?:any,): Observable<any>{
    return this.http.get(this.url+url,body);
  }

  
}
  