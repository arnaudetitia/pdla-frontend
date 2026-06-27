import { Component, computed, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FiltreQuestionType } from '../../../../model/enums/filtre-type.enum';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Partie } from '../../../../model/partie.model';
import { PartieService } from '../../../../services/partie.service';
import { tap } from 'rxjs';

@Component({
  selector: 'filtrage-question',
  imports: [MatSelectModule, MatOptionModule, MatInputModule, FormsModule],
  templateUrl: './filtrage-question.component.html',
  styleUrl: './filtrage-question.component.scss',
})
export class FiltrageQuestionComponent implements OnInit {
  @Input() idPartieFromUrl: number | null = null;

  readonly YEAR_MIN = 1950;
  readonly YEAR_MAX = new Date().getUTCFullYear();
  FiltreQuestionType = FiltreQuestionType;
  FiltreQuestionTypeLabels = Object.values(FiltreQuestionType).filter(
    (value) => typeof value === 'string',
  ) as string[];
  borneMin = signal<number>(this.YEAR_MIN);
  borneMax = signal<number>(this.YEAR_MAX);

  anneesMinRange = computed(() => {
    return Array.from({ length: this.borneMax() - this.YEAR_MIN + 1 }, (_, i) => this.YEAR_MIN + i);
  });

  anneesMaxRange = computed(() => {
    return Array.from(
      { length: this.YEAR_MAX - this.borneMin() + 1 },
      (_, i) => this.borneMin() + i,
    );
  });

  allParties = signal<Partie[]>([]);
  selectedPartie = signal<Partie | null>(null);

  currentFiltreType = signal<FiltreQuestionType | null>(null);
  currentFiltreTypeLabel = signal<string | null>(null);
  @Output() onFiltreValueChange = new EventEmitter<{
    typeFiltre: FiltreQuestionType;
    value: string | { borneMin: number; borneMax: number } | number[] | null;
  }>();

  constructor(private partieService: PartieService) {}

  ngOnInit() {
    this.partieService
      .getAllParties()
      .pipe(
        tap((parties) => {
          this.allParties.set(parties);
          if (this.idPartieFromUrl) {
            const partie = this.allParties().find((partie) => partie.id === this.idPartieFromUrl);
            if (partie) {
              this.currentFiltreType.set(FiltreQuestionType.PARTIE);
              this.currentFiltreTypeLabel.set('PARTIE');
              this.selectedPartie.set(partie);
              const idQuestionList = (partie.listeQuestions as any[]).map(
                (question) => question.idQuestion,
              );
              this.onFiltreValueChange.emit({
                typeFiltre: FiltreQuestionType.PARTIE,
                value: idQuestionList,
              });
            }
          }
        }),
      )
      .subscribe();
  }

  registerFilterType(value: string) {
    this.currentFiltreType.set(FiltreQuestionType[value as keyof typeof FiltreQuestionType]);
    this.borneMin.set(this.YEAR_MIN);
    this.borneMax.set(this.YEAR_MAX);
    this.onFiltreValueChange.emit({} as any);
  }

  onFilterValueChange($event: any) {
    switch (this.currentFiltreType()) {
      case FiltreQuestionType.TEXTE:
        this.onFiltreValueChange.emit({
          typeFiltre: FiltreQuestionType.TEXTE,
          value: $event as string,
        });
        break;

      case FiltreQuestionType.ANNEE:
        this.onFiltreValueChange.emit({
          typeFiltre: FiltreQuestionType.ANNEE,
          value: {
            borneMin: this.borneMin(),
            borneMax: this.borneMax(),
          },
        });
        break;

      case FiltreQuestionType.PARTIE: {
        const idQuestionList = ($event.listeQuestions as any[]).map(
          (question) => question.idQuestion,
        );
        this.onFiltreValueChange.emit({
          typeFiltre: FiltreQuestionType.PARTIE,
          value: idQuestionList,
        });
      }
    }
  }
}
