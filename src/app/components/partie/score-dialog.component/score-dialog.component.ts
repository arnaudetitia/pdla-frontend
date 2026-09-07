import { Component, inject } from '@angular/core';
import { ScoresComponent } from '../../../shared/scores/scores.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'score-dialog',
  imports: [MatDialogModule, MatDialogTitle, ScoresComponent],
  templateUrl: './score-dialog.component.html',
  styleUrl: './score-dialog.component.scss',
})
export class ScoreDialogComponent {
  data = inject<{ nbQuestions: number }>(MAT_DIALOG_DATA);
}
