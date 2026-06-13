import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { GestionQuestionComponent } from './components/admin/gestion-question/gestion-question.component/gestion-question.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'admin', children: [{ path: 'question', component: GestionQuestionComponent }] },
];
