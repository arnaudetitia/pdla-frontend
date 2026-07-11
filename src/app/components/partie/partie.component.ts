import { Component, computed, HostListener, OnInit, signal } from '@angular/core';
import { PartieService } from '../../services/partie.service';
import { PartieStore } from '../../stores/partie.store';
import { combineLatest, switchMap, tap } from 'rxjs';
import { Question } from '../../model/question.model';
import { PartieOrchestrator } from '../../orchestrator/partie.orchestrator';
import { EtatQuestion } from '../../model/enums/etat-question.enum';
import { MusicPlayer } from '../../utils/music-player.util';
import { CodeTouches } from '../../model/enums/codes-touches.enum';
import { DEFAULT_MARGE, Marge } from '../../model/marge.model';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';
import { ReponsesStore } from '../../stores/reponses.store';

@Component({
  selector: 'app-partie.component',
  imports: [CommonModule],
  templateUrl: './partie.component.html',
  styleUrl: './partie.component.scss',
})
export class PartieComponent implements OnInit {
  readonly spacebarCode = 'Space';
  readonly MIN_YEAR = 1950;
  readonly MAX_YEAR = new Date().getFullYear();

  EtatQuestion = EtatQuestion;

  listeQuestions = signal<Question[]>([]);
  indexCurentQuestion = signal(1);

  currentQuestion = computed(() => {
    return this.listeQuestions()[this.indexCurentQuestion() - 1];
  });

  currentEtatQuestion = signal<EtatQuestion>(EtatQuestion.START_QUESTION);

  currentAnnee = signal<number>(this.MIN_YEAR);
  currentMarge = signal<Marge>(DEFAULT_MARGE);

  friseRange = Array.from({ length: 11 }, (_, i) => i);

  constructor(
    private partieStore: PartieStore,
    private partieService: PartieService,
    private partieOrchestrator: PartieOrchestrator,
    private reponseStore: ReponsesStore,
    private socketService: SocketService,
  ) {}

  ngOnInit() {
    this.partieStore.idCurrentPartie$
      .pipe(
        switchMap((idPartie) => {
          return this.partieService.getPartieById(idPartie || 1);
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
              this.indexCurentQuestion.update((prev) => prev + 1);
              this.currentAnnee.set(this.MIN_YEAR);
              this.currentMarge.set(DEFAULT_MARGE);
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
    combineLatest([this.reponseStore.annee$, this.reponseStore.marge$])
      .pipe(
        tap(([annee, marge]) => {
          this.currentAnnee.set(annee || this.MIN_YEAR);
          this.currentMarge.set(marge || DEFAULT_MARGE);
        }),
      )
      .subscribe();
  }

  anneeInMarge(annee: number) {
    return (
      Math.abs(annee) <= this.currentMarge().anneesMarge &&
      this.currentAnnee() - annee >= this.MIN_YEAR &&
      this.currentAnnee() - annee <= this.MAX_YEAR
    );
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
        if (this.currentEtatQuestion() === EtatQuestion.REPONSE_REVELEE) {
          this.partieOrchestrator.passerEtatSuivant();
        }
        break;
      default:
        break;
    }
  }
}
