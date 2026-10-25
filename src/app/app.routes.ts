import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { GestionQuestionComponent } from './components/admin/gestion-question/gestion-question.component';
import { GestionPartieComponent } from './components/admin/gestion-partie/gestion-partie.component';
import { PartieComponent } from './components/partie/partie.component';
import { homepageGuard } from './guards/homepage.guard';
import { LoginAdminComponent } from './components/login-admin/login-admin.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent, canActivate: [homepageGuard] },
  { path: 'login', component: LoginAdminComponent },
  { path: 'partie', component: PartieComponent },
  {
    path: 'admin',
    canActivate: [homepageGuard],
    children: [
      { path: 'question', component: GestionQuestionComponent },
      { path: 'partie', component: GestionPartieComponent },
    ],
  },
];
