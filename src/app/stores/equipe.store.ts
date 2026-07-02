import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EquipeStore {
  indexEquipeInPlaySubject = new BehaviorSubject<number>(0);
  inedxEquipeInPlay = this.indexEquipeInPlaySubject.asObservable();

  scoresEquipesSubject = new BehaviorSubject<Map<string, number | null[]>>(new Map());
  scoresEquipes$ = this.scoresEquipesSubject.asObservable();

  initScores(equipes: string[]) {
    const initialScoresEquipes = new Map();
    equipes.forEach((equipe) => {
      initialScoresEquipes.set(equipe, Array(10).fill(null));
    });
    this.scoresEquipesSubject.next(initialScoresEquipes);
  }
}
