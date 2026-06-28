import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { Partie, PartieVo } from '../model/partie.model';

@Injectable({
  providedIn: 'root',
})
export class PartieService {
  constructor(private http: HttpClient) {}

  getAllParties(): Observable<Partie[]> {
    return this.http.get<Partie[]>(environment.apiUrl + '/parties');
  }

  createPartie(partie: PartieVo): Observable<Partie[]> {
    return this.http.post<Partie[]>(environment.apiUrl + '/parties', {
      partie: JSON.stringify(partie),
    });
  }
}
