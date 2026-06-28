import { Question } from './question.model';

export interface Partie {
  id: number;
  nomPartie: string;
  listeQuestions: Question[];
}

export interface PartieVo {
  nomPartie: string;
  idsQuestions: number[];
}
