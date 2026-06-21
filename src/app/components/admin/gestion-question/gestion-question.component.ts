import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BoutonRetourComponent } from '../../../shared/bouton-retour/bouton-retour.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Question } from '../../../model/question.model';
import { QuestionService } from '../../../services/question.service';
import { tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddEditQuestionDialogComponent } from './add-edit-question-dialog/add-edit-question-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { ImportQuestionDialogComponent } from './import-question-dialog.component/import-question-dialog.component';
import { FiltrageQuestionComponent } from './filtrage-question/filtrage-question.component';
import { FiltreQuestionType } from '../../../model/enums/filtre-type.enum';

@Component({
  selector: 'app-gestion-question.component',
  imports: [
    BoutonRetourComponent,
    FiltrageQuestionComponent,
    MatMenuModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './gestion-question.component.html',
  styleUrl: './gestion-question.component.scss',
})
export class GestionQuestionComponent implements OnInit {
  readonly YEAR_MIN = 1950;
  readonly YEAR_MAX = new Date().getUTCFullYear();
  allQuestions = signal(new MatTableDataSource<Question>([]));

  displayedColumns = ['question', 'annee', 'image', 'musique', 'action'];

  nomExtraitEnEcoute = signal<string>('');
  extraitEnEcoute: HTMLAudioElement | null = null;

  openAddEditQuestionDialog = inject(MatDialog);
  openImportDialog = inject(MatDialog);

  filterTexte = signal<string>('');
  filtreAnnee = signal<{ borneMin: number; borneMax: number }>({
    borneMin: this.YEAR_MIN,
    borneMax: this.YEAR_MAX,
  });

  filtre = computed(() => {
    return {
      texte: this.filterTexte(),
      annees: this.filtreAnnee(),
    };
  });

  constructor(private questionService: QuestionService) {
    this.allQuestions().filterPredicate = (question: Question, filtre: string) => {
      const filtreParsed = JSON.parse(filtre);
      let questionContainsTexte = true;
      const textFilter = filtreParsed.texte;
      if (textFilter) {
        questionContainsTexte = question.question
          .toLocaleLowerCase()
          .includes(textFilter.toLocaleLowerCase());
      }
      const anneeFilter = filtreParsed.annees;
      const questionAnneesInBornes =
        anneeFilter.borneMin <= question.annee && question.annee <= anneeFilter.borneMax;
      return questionContainsTexte && questionAnneesInBornes;
    };
    this.allQuestions().filter = JSON.stringify(this.filtre());
  }

  ngOnInit(): void {
    this.questionService
      .getAllQuestion()
      .pipe(
        tap((questions) => {
          this.allQuestions().data = questions;
        }),
      )
      .subscribe();
  }

  playExtrait(extraitName: string) {
    this.nomExtraitEnEcoute.set(extraitName);
    this.extraitEnEcoute = new Audio(`/assets/extraits/${this.nomExtraitEnEcoute()}.mp3`);
    this.extraitEnEcoute.play();
    this.extraitEnEcoute.onended = () => {
      this.nomExtraitEnEcoute.set('');
      this.extraitEnEcoute = null;
    };
  }

  arreterExtrait() {
    if (this.extraitEnEcoute) {
      this.extraitEnEcoute.pause();
      this.extraitEnEcoute.currentTime = 0;
      this.nomExtraitEnEcoute.set('');
      this.extraitEnEcoute = null;
    }
  }

  openAddDialog() {
    const dialogRef = this.openAddEditQuestionDialog.open(AddEditQuestionDialogComponent, {
      data: {
        action: 'add',
      },
      width: '75vw',
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((questionListUpdated) => {
          if (questionListUpdated) {
            this.allQuestions().data = questionListUpdated;
          }
        }),
      )
      .subscribe();
  }

  openEditDialog(question: Question) {
    const dialogRef = this.openAddEditQuestionDialog.open(AddEditQuestionDialogComponent, {
      data: {
        action: 'edit',
        question,
      },
      width: '75vw',
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((questionListUpdated) => {
          if (questionListUpdated) {
            this.allQuestions().data = questionListUpdated;
          }
        }),
      )
      .subscribe();
  }

  openImportQuestionsDialog() {
    const dialogRef = this.openImportDialog.open(ImportQuestionDialogComponent, {
      width: '75vw',
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((questionListUpdated) => {
          if (questionListUpdated) {
            this.allQuestions().data = questionListUpdated;
          }
        }),
      )
      .subscribe();
  }

  updateFiltre(filtre: {
    typeFiltre: FiltreQuestionType;
    value: string | { borneMin: number; borneMax: number } | null;
  }) {
    this.filterTexte.set('');
    this.filtreAnnee.set({ borneMin: this.YEAR_MIN, borneMax: this.YEAR_MAX });
    switch (filtre.typeFiltre) {
      case FiltreQuestionType.TEXTE:
        this.filterTexte.set(filtre.value as string);
        break;
      case FiltreQuestionType.ANNEE:
        this.filtreAnnee.set(filtre.value as any);
        break;
    }
    this.allQuestions().filter = JSON.stringify(this.filtre());
  }
}
