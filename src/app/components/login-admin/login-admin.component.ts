import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { EtatPartieKeys } from '../../model/enums/etat-partie.enum';
import { HealthStore } from '../../stores/health.store';

@Component({
  selector: 'app-login-admin',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.scss',
})
export class LoginAdminComponent implements OnInit {
  adminMdpForm: FormGroup;

  backendAwake = signal<boolean>(false);

  error = signal<string | null>(null);

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private healthStore: HealthStore,
    private router: Router,
  ) {
    this.adminMdpForm = this.formBuilder.group({
      adminMdp: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.healthStore.backendAwake$
      .pipe(
        tap(() => {
          this.backendAwake.set(true);
        }),
      )
      .subscribe();
  }

  goToHomepage() {
    const formMdp = this.adminMdpForm.get('adminMdp')?.value || '';
    this.error.set(null);
    this.adminService
      .checkAdmin(formMdp)
      .pipe(
        tap(() => {
          localStorage.setItem(EtatPartieKeys.ALREADY_LOGGED, 'true');
          localStorage.setItem(
            EtatPartieKeys.EXPIRATION_DATE,
            moment().add(1, 'week').toISOString(),
          );
          this.router.navigate(['']);
        }),
        catchError((error) => {
          this.error.set(error.error.error);
          return of();
        }),
      )
      .subscribe();
  }
}
