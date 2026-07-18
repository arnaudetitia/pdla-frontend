import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EquipeService {
  constructor(private http: HttpClient) {}

  recordEquipes(equipes: string[]): Observable<void> {
    return this.http.post<void>(environment.apiUrl + '/equipes', {
      equipes: JSON.stringify(equipes),
    });
  }

  changerTour(): Observable<void> {
    return this.http.put<void>(environment.apiUrl + '/equipes/changer-tour', {});
  }

  getEquipeEnJeu(): Observable<string> {
    return this.http.get<string>(environment.apiUrl + '/equipes/en-jeu');
  }
}
