import { Component, inject, OnInit, signal } from '@angular/core';
import { BoutonRetourComponent } from '../../../shared/bouton-retour/bouton-retour.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Question } from '../../../model/question.model';
import { QuestionService } from '../../../services/question.service';
import { tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddEditQuestionDialogComponent } from './add-edit-question-dialog/add-edit-question-dialog.component';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-gestion-question.component',
  imports: [BoutonRetourComponent, MatMenuModule, MatTableModule, MatIconModule],
  templateUrl: './gestion-question.component.html',
  styleUrl: './gestion-question.component.scss',
})
export class GestionQuestionComponent implements OnInit {
  allQuestions = signal(new MatTableDataSource<Question>([]));

  displayedColumns = ['question', 'annee', 'image', 'musique', 'action'];

  nomExtraitEnEcoute = signal<string>('');
  extraitEnEcoute: HTMLAudioElement | null = null;

  openAddEditQuestionDialog = inject(MatDialog);

  constructor(private questionService: QuestionService) {}

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
}
