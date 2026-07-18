import { Component, Input, OnInit, signal } from '@angular/core';
import { EquipeStore } from '../../stores/equipe.store';
import { tap } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ResultatManche } from '../../model/resultat-manches.model';

interface ScoreRow {
  equipe: string;
  resultatsManches: ResultatManche[];
  total: number;
  ecartTotal: number;
}

@Component({
  selector: 'scores-table',
  imports: [MatTableModule],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.scss',
})
export class ScoresComponent implements OnInit {
  @Input() afficherVainqueur: boolean = false;

  scores = signal(new MatTableDataSource<ScoreRow>([]));

  indexMancheArray = Array.from({ length: 10 }, (_, i) => i);

  displayedColumns = [
    'nomEquipe',
    ...this.indexMancheArray.map((index) => `manche-${index + 1}`),
    'total',
  ];

  equipeGagnante: string = '';
  egalitePoints: boolean = false;

  constructor(private equipeStore: EquipeStore) {}

  ngOnInit(): void {
    this.equipeStore.resultatsManchesEquipes$
      .pipe(
        tap((resultatsManchesEquipes) => {
          const rows = Array.from(resultatsManchesEquipes).map(([equipe, resultatsManches]) => ({
            equipe,
            resultatsManches,
            total: resultatsManches.reduce((acc: number, resultat: ResultatManche) => {
              if (resultat) {
                return acc + resultat.points;
              }
              return acc;
            }, 0),
            ecartTotal: resultatsManches.reduce((acc: number, resultat: ResultatManche) => {
              if (resultat) {
                return acc + resultat.ecart;
              }
              return acc;
            }, 0),
          }));
          this.scores().data = rows;

          const maxTotal = Math.max(...rows.map((row) => row.total));
          const meilleurs = rows.filter((row) => row.total === maxTotal);
          this.egalitePoints = meilleurs.length > 1;

          this.equipeGagnante = [...rows].reduce((best, row) => {
            if (
              best.total > row.total ||
              (best.total === row.total && best.ecartTotal < row.ecartTotal)
            )
              return best;
            return row;
          }, rows[0]).equipe;
        }),
      )
      .subscribe();
  }
}
