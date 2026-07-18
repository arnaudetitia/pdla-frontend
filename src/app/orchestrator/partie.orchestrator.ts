import { Injectable } from '@angular/core';
import { EtatQuestion } from '../model/enums/etat-question.enum';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartieOrchestrator {
  etatQuestion = EtatQuestion.START_QUESTION;

  private etatQuestionSource = new Subject<EtatQuestion>();
  etatQuestion$ = this.etatQuestionSource.asObservable();

  passerEtatSuivant() {
    switch (this.etatQuestion) {
      case EtatQuestion.START_QUESTION:
        this.etatQuestion = EtatQuestion.IMAGE_AFFICHEE;
        break;
      case EtatQuestion.IMAGE_AFFICHEE:
        this.etatQuestion = EtatQuestion.QUESTION_AFFICHEE;
        break;
      case EtatQuestion.QUESTION_AFFICHEE:
        this.etatQuestion = EtatQuestion.REPONSE_DONNEE;
        break;
      case EtatQuestion.REPONSE_DONNEE:
        this.etatQuestion = EtatQuestion.REPONSE_REVELEE;
        break;
      case EtatQuestion.REPONSE_REVELEE:
        this.etatQuestion = EtatQuestion.START_QUESTION;
        break;
      default:
        break;
    }
    this.etatQuestionSource.next(this.etatQuestion);
  }
}
