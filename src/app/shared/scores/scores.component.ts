import { Component, OnInit, signal } from '@angular/core';
import { EquipeStore } from '../../stores/equipe.store';
import { tap } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

interface ScoreRow {
  equipe: string;
  scores: (number | null)[];
  total: number;
}

@Component({
  selector: 'scores-table',
  imports: [MatTableModule],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.scss',
})
export class ScoresComponent implements OnInit {
  scores = signal(new MatTableDataSource<ScoreRow>([]));

  indexMancheArray = Array.from({ length: 10 }, (_, i) => i);

  displayedColumns = [
    'nomEquipe',
    ...this.indexMancheArray.map((index) => `manche-${index + 1}`),
    'total',
  ];
  constructor(private equipeStore: EquipeStore) {}

  ngOnInit(): void {
    this.equipeStore.scoresEquipes$
      .pipe(
        tap((scoresEquipes) => {
          const rows = Array.from(scoresEquipes).map(([equipe, scores]) => ({
            equipe,
            scores,
            total: scores.reduce((acc: number, score) => {
              if (score) {
                return acc + score;
              }
              return acc;
            }, 0),
          }));
          this.scores().data = rows;
        }),
      )
      .subscribe();
  }
}
