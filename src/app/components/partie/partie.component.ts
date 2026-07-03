import { Component, computed, HostListener, OnInit, signal } from '@angular/core';
import { PartieService } from '../../services/partie.service';
import { PartieStore } from '../../stores/partie.store';
import { switchMap, tap } from 'rxjs';
import { Question } from '../../model/question.model';
import { PartieOrchestrator } from '../../orchestrator/partie.orchestrator';
import { EtatQuestion } from '../../model/enums/etat-question.enum';
import { MusicPlayer } from '../../utils/music-player.util';
import { CodeTouches } from '../../model/enums/codes-touches.enum';

@Component({
  selector: 'app-partie.component',
  imports: [],
  templateUrl: './partie.component.html',
  styleUrl: './partie.component.scss',
})
export class PartieComponent implements OnInit {
  readonly spacebarCode = 'Space';
  EtatQuestion = EtatQuestion;

  listeQuestions = signal<Question[]>([]);
  indexCuurentQuestion = signal(1);

  currentQuestion = computed(() => {
    return this.listeQuestions()[this.indexCuurentQuestion() - 1];
  });

  currentEtatQuestion = signal<EtatQuestion>(EtatQuestion.START_QUESTION);

  constructor(
    private partieStore: PartieStore,
    private partieService: PartieService,
    private partieOrchestrator: PartieOrchestrator,
  ) {}

  ngOnInit() {
    this.partieStore.idCurrentPartie$
      .pipe(
        switchMap((idPartie) => {
          return this.partieService.getPartieById(1);
        }),
        tap((questions) => {
          this.listeQuestions.set(questions);
        }),
      )
      .subscribe();
    this.partieOrchestrator.etatQuestion$
      .pipe(
        tap((newEtatQuestion) => {
          this.currentEtatQuestion.set(newEtatQuestion);
          switch (this.currentEtatQuestion()) {
            case EtatQuestion.START_QUESTION:
              this.indexCuurentQuestion.update((prev) => prev + 1);
              break;
            case EtatQuestion.IMAGE_AFFICHEE:
              MusicPlayer.playMusic(this.currentQuestion().musique);
              break;
            default:
              break;
          }
        }),
      )
      .subscribe();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyEvent(event$: KeyboardEvent) {
    switch (event$.code) {
      case CodeTouches.ESPACE:
        if (this.currentEtatQuestion() !== EtatQuestion.QUESTION_AFFICHEE) {
          this.partieOrchestrator.passerEtatSuivant();
        }
        break;
      case CodeTouches.PLAY_MUSIC_AGAIN:
        MusicPlayer.playMusic(this.currentQuestion().musique);
        break;
      case CodeTouches.SUIVANT:
        if (this.currentEtatQuestion() === EtatQuestion.QUESTION_AFFICHEE) {
          this.partieOrchestrator.passerEtatSuivant();
        }
        break;
      default:
        break;
    }
  }
}
