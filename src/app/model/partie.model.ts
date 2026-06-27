import { Question } from './question.model';

export interface Partie {
  id: number;
  nomPartie: string;
  listeQuestions: Question[];
}
