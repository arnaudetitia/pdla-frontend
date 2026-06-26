import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { Partie } from '../model/partie.model';

@Injectable({
  providedIn: 'root',
})
export class PartieService {
  constructor(private http: HttpClient) {}

  getAllParties(): Observable<Partie[]> {
    return this.http.get<Partie[]>(environment.apiUrl + '/parties');
  }
}
