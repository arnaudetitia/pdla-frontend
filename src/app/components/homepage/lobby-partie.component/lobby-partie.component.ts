import { Component, inject, OnInit, signal } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Partie } from '../../../model/partie.model';
import { PartieService } from '../../../services/partie.service';
import { catchError, of, tap } from 'rxjs';
import { PartieStore } from '../../../stores/partie.store';
import { EquipeService } from '../../../services/equipe.service';
import { Router } from '@angular/router';
import { HomepageComponent } from '../homepage.component';

@Component({
  selector: 'app-lobby-partie.component',
  imports: [
    MatDialogTitle,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
  ],
  templateUrl: './lobby-partie.component.html',
  styleUrl: './lobby-partie.component.scss',
})
export class LobbyPartieComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<HomepageComponent>);

  partieALancerForm: FormGroup;

  allParties = signal<Partie[]>([]);

  constructor(
    private formbuilder: FormBuilder,
    private partieService: PartieService,
    private equipeService: EquipeService,
  ) {
    this.partieALancerForm = this.formbuilder.group({
      nomEquipeA: ['', [Validators.required]],
      nomEquipeB: ['', [Validators.required]],
      idPartie: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.partieService
      .getAllParties()
      .pipe(
        tap((parties) => {
          this.allParties.set(parties);
        }),
      )
      .subscribe();
  }

  lancerPartie() {
    const equipes = [
      this.partieALancerForm.get('nomEquipeA')?.value,
      this.partieALancerForm.get('nomEquipeB')?.value,
    ];
    this.equipeService
      .recordEquipes(equipes)
      .pipe(
        tap(() => {
          const idPartie = this.partieALancerForm.get('idPartie')?.value;
          this.dialogRef.close({ idPartie, equipes });
        }),
        catchError((error) => {
          console.log(error);
          return of();
        }),
      )
      .subscribe();
  }
}
