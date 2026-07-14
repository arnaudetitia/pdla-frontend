import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, take, tap } from 'rxjs';
import { EquipeService } from '../services/equipe.service';

@Injectable({
  providedIn: 'root',
})
export class EquipeStore {
  scoresEquipesSubject = new BehaviorSubject<Map<string, (number | null)[]>>(new Map());
  scoresEquipes$ = this.scoresEquipesSubject.asObservable();

  constructor(private equipeService: EquipeService) {}

  initScores(equipes: string[]) {
    const initialScoresEquipes = new Map();
    equipes.forEach((equipe) => {
      initialScoresEquipes.set(equipe, Array(10).fill(null));
    });
    this.scoresEquipesSubject.next(initialScoresEquipes);
  }

  setScore(score: number) {
    combineLatest([this.equipeService.getEquipeEnJeu(), this.scoresEquipes$])
      .pipe(
        take(1),
        tap(([equipeEnJeu, scoresMap]) => {
          const previousScoresEquipe = scoresMap.get(equipeEnJeu);
          if (previousScoresEquipe) {
            const indexToFill = previousScoresEquipe.findIndex(
              (previoiusScore) => previoiusScore === null,
            );
            if (indexToFill !== -1) {
              let newScoresEquipe = [...previousScoresEquipe];
              newScoresEquipe[indexToFill] = score;
              const newMap = new Map(scoresMap);
              newMap.set(equipeEnJeu, newScoresEquipe);
              this.scoresEquipesSubject.next(newMap);
            }
          }
        }),
      )
      .subscribe();
  }
}
