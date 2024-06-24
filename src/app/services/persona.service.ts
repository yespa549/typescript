import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Persona } from '../interfaces/persona';

@Injectable({
  providedIn: 'root'
})

export class PersonaService {
  private myAppUrl: string; 
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/personas/'
   }

   getPersonas(): Observable<Persona[]> {
    // return this.http.get(this.myAppUrl + this.myApiUrl); //otra forma de concatenar
    return this.http.get<Persona[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  deletePersona(id: number): Observable<void> {
    //return this.http.delete<void>(this.myAppUrl + this.myApiUrl+ this(id));
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  } 

  addPersona(persona: Persona): Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, persona);
  }

}
