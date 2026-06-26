import { Question } from './question.model';

export interface Partie {
  id: string;
  nomPartie: string;
  listeQuestions: Question[];
}
