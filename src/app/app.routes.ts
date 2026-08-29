import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { GestionQuestionComponent } from './components/admin/gestion-question/gestion-question.component';
import { GestionPartieComponent } from './components/admin/gestion-partie/gestion-partie.component';
import { PartieComponent } from './components/partie/partie.component';
import { homepageGuard } from './guards/homepage.guard';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent, canActivate: [homepageGuard] },
  { path: '403', component: ForbiddenComponent },
  { path: 'partie', canActivate: [homepageGuard], component: PartieComponent },
  {
    path: 'admin',
    canActivate: [homepageGuard],
    children: [
      { path: 'question', component: GestionQuestionComponent },
      { path: 'partie', component: GestionPartieComponent },
    ],
  },
];
