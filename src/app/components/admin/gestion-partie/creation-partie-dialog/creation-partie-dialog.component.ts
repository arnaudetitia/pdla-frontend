import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { QuestionService } from '../../../../services/question.service';
import { catchError, of, tap } from 'rxjs';
import { Question } from '../../../../model/question.model';
import { PartieService } from '../../../../services/partie.service';
import { GestionPartieComponent } from '../gestion-partie.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-creation-partie-dialog.component',
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './creation-partie-dialog.component.html',
  styleUrl: './creation-partie-dialog.component.scss',
})
export class CreationPartieDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<GestionPartieComponent>);
  snackBar = inject(MatSnackBar);

  partieForm: FormGroup;

  allQuestions = signal<Question[]>([]);
  nbQuestionsSelected = signal<number>(0);

  canMassAjoutBeClicked = computed(() => {
    return ![0, 20].includes(this.nbQuestionsSelected());
  });

  nbMaxQuestionSelected = computed(() => {
    return this.nbQuestionsSelected() === 20;
  });

  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
    private partieService: PartieService,
  ) {
    this.partieForm = this.formBuilder.group({
      nomPartie: ['', [Validators.required]],
      listeQuestions: [[]],
    });
  }

  ngOnInit() {
    this.questionService
      .getAllQuestion()
      .pipe(
        tap((questions) => {
          this.allQuestions.set(questions);
        }),
      )
      .subscribe();
  }

  ajouterQuestions() {
    const listeIndex = this.partieForm.get('listeQuestions')?.value;
    const maxIndex = listeIndex[listeIndex.length - 1];
    const otherQuestionsIndex = this.allQuestions()
      .filter((question) => question.id > maxIndex)
      .map((question) => question.id)
      .slice(0, 20 - this.nbQuestionsSelected());
    this.partieForm.patchValue({ listeQuestions: [...listeIndex, ...otherQuestionsIndex] });
    this.updateEtatSelection(this.partieForm.get('listeQuestions'));
  }

  updateEtatSelection($event: any) {
    this.nbQuestionsSelected.set($event.value.length);
  }

  creerPartie() {
    const partieToCreate = {
      nomPartie: this.partieForm.get('nomPartie')?.value,
      idsQuestions: this.partieForm.get('listeQuestions')?.value,
    };

    this.partieService
      .createPartie(partieToCreate)
      .pipe(
        tap((questions) => {
          this.dialogRef.close(questions);
        }),
        catchError((error) => {
          return of();
        }),
      )
      .subscribe();
  }
}
