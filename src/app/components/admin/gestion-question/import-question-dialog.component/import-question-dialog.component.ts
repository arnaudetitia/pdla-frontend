import { Component, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { QuestionService } from '../../../../services/question.service';
import { tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GestionQuestionComponent } from '../gestion-question.component';
import { ImportError } from '../../../../model/import-errors.model';
import { Question } from '../../../../model/question.model';

@Component({
  selector: 'app-import-question-dialog.component',
  imports: [CommonModule, MatDialogModule, MatDialogTitle, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './import-question-dialog.component.html',
  styleUrl: './import-question-dialog.component.scss',
})
export class ImportQuestionDialogComponent {
  readonly dialogRef = inject(MatDialogRef<GestionQuestionComponent>);

  csvFileContent = signal<string | ArrayBuffer | null>(null);
  isChecking = signal<boolean>(false);
  checkDone = signal<boolean>(false);
  errorsImport = signal<ImportError[]>([]);
  fileName = signal<string>('');

  constructor(private questionService: QuestionService) {}

  onFileSelected($event: Event) {
    this.checkDone.set(false);
    const input = $event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName.set(file.name);

      const reader = new FileReader();
      reader.onload = () => {
        this.csvFileContent.set(reader.result);
      };
      reader.readAsText(file, 'ISO-8859-1');
    }
  }

  checkImportQuestion() {
    this.isChecking.set(true);
    this.questionService
      .checkImportQuestions(this.csvFileContent())
      .pipe(
        tap((reponse: { erreurs: ImportError[]; questions: Question[] }) => {
          console.log('coucou');
          this.isChecking.set(false);
          this.checkDone.set(true);
          this.errorsImport.set(reponse.erreurs);
        }),
      )
      .subscribe();
  }

  importQuestions() {
    this.isChecking.set(true);
    this.questionService
      .importQuestions(this.csvFileContent())
      .pipe(
        tap((reponse: { erreurs: ImportError[]; questions: Question[] }) => {
          this.isChecking.set(false);
          if (reponse.erreurs.length) {
            this.errorsImport.set(reponse.erreurs);
          } else {
            this.dialogRef.close(reponse.questions);
          }
        }),
      )
      .subscribe();
  }
}
