import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';

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
}
