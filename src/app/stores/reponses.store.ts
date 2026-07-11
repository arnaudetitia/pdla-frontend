import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DEFAULT_MARGE, Marge } from '../model/marge.model';

@Injectable({
  providedIn: 'root',
})
export class ReponsesStore {
  anneeSubject = new BehaviorSubject<number>(0);
  annee$ = this.anneeSubject.asObservable();
  margeSubject = new BehaviorSubject<Marge>(DEFAULT_MARGE);
  marge$ = this.margeSubject.asObservable();

  setReponse(reponse: { annee: number; marge: Marge }) {
    if (reponse.annee) {
      this.anneeSubject.next(reponse.annee);
    }
    if (reponse.marge) {
      this.margeSubject.next(reponse.marge);
    }
  }
}
