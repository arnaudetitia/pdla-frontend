import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Question, QuestionVo } from '../../../../model/question.model';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of, tap } from 'rxjs';
import { GestionQuestionComponent } from '../gestion-question.component';
import { QuestionService } from '../../../../services/question.service';

@Component({
  selector: 'app-add-edit-question-dialog.component',
  imports: [MatDialogModule, MatDialogTitle, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './add-edit-question-dialog.component.html',
  styleUrl: './add-edit-question-dialog.component.scss',
})
export class AddEditQuestionDialogComponent {
  readonly dialogRef = inject(MatDialogRef<GestionQuestionComponent>);
  questionForm: FormGroup;

  data = inject<{ action: 'add' | 'edit'; question?: Question }>(MAT_DIALOG_DATA);

  musicFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
  ) {
    this.questionForm = this.formBuilder.group({
      question: [this.data.question?.question || '', Validators.required],
      annee: [this.data.question?.annee || '', Validators.required],
      image: [this.data.question?.image || '', Validators.required],
      musique: this.data.question?.musique || '',
    });
  }

  onFileSelected($event: Event) {
    const input = $event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileName = file.name.replace('.mp3', '');
      this.questionForm.patchValue({
        musique: fileName,
      });
      this.musicFile = file;
    }
  }

  addEditQuestion() {
    const questionEdited: QuestionVo = {
      question: this.questionForm.get('question')?.value,
      annee: this.questionForm.get('annee')?.value,
      image: this.questionForm.get('image')?.value,
      musique: this.questionForm.get('musique')?.value,
    };

    const addEditObservable = this.data.question
      ? this.questionService.editQuestion(this.data.question.id, questionEdited, this.musicFile)
      : this.questionService.insertQuestion(questionEdited, this.musicFile);

    addEditObservable
      .pipe(
        tap((questionsUpdated) => {
          this.dialogRef.close(questionsUpdated);
        }),
        catchError((error) => {
          console.log(error);
          return of();
        }),
      )
      .subscribe();
  }
}
