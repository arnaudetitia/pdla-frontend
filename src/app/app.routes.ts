import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { GestionQuestionComponent } from './components/admin/gestion-question/gestion-question.component';
import { GestionPartieComponent } from './components/admin/gestion-partie/gestion-partie.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'admin', children: [{ path: 'question', component: GestionQuestionComponent }] },
  { path: 'admin', children: [{ path: 'partie', component: GestionPartieComponent }] },
];
