import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartieStore {
  idCurrentPartieSubject = new BehaviorSubject<number>(0);
  idCurrentPartie$ = this.idCurrentPartieSubject.asObservable();

  setIdCurrentPartie(idPartie: number) {
    this.idCurrentPartieSubject.next(idPartie);
  }
}
