import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, take, tap } from 'rxjs';
import { EquipeService } from '../services/equipe.service';
import { ResultatManche } from '../model/resultat-manches.model';

@Injectable({
  providedIn: 'root',
})
export class EquipeStore {
  resultatsManchesEquipesSubject = new BehaviorSubject<Map<string, ResultatManche[]>>(new Map());
  resultatsManchesEquipes$ = this.resultatsManchesEquipesSubject.asObservable();

  constructor(private equipeService: EquipeService) {}

  initScores(equipes: string[]) {
    const initialResultatsEquipes = new Map();
    equipes.forEach((equipe) => {
      initialResultatsEquipes.set(equipe, Array(10).fill(null));
    });
    this.resultatsManchesEquipesSubject.next(initialResultatsEquipes);
  }

  setScore(points: number, ecart: number) {
    combineLatest([this.equipeService.getEquipeEnJeu(), this.resultatsManchesEquipes$])
      .pipe(
        take(1),
        tap(([equipeEnJeu, resultatMap]) => {
          const previousScoresEquipe = resultatMap.get(equipeEnJeu);
          if (previousScoresEquipe) {
            const indexToFill = previousScoresEquipe.findIndex(
              (previoiusScore) => previoiusScore === null,
            );
            if (indexToFill !== -1) {
              let newScoresEquipe = [...previousScoresEquipe];
              newScoresEquipe[indexToFill] = { points, ecart };
              const newMap = new Map(resultatMap);
              newMap.set(equipeEnJeu, newScoresEquipe);
              this.resultatsManchesEquipesSubject.next(newMap);
            }
          }
        }),
      )
      .subscribe();
  }
}
