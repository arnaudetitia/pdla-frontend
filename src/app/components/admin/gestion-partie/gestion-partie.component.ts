import { Component, inject, OnInit, signal } from '@angular/core';
import { BoutonRetourComponent } from '../../../shared/bouton-retour/bouton-retour.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Partie } from '../../../model/partie.model';
import { PartieService } from '../../../services/partie.service';
import { tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CreationPartieDialogComponent } from './creation-partie-dialog/creation-partie-dialog.component';

@Component({
  selector: 'gestion-partie.component',
  imports: [BoutonRetourComponent, MatButtonModule, MatTableModule, MatIconModule],
  templateUrl: './gestion-partie.component.html',
  styleUrl: './gestion-partie.component.scss',
})
export class GestionPartieComponent implements OnInit {
  allParties = signal(new MatTableDataSource<Partie>([]));

  displayedColumns = ['nomPartie', 'questions'];

  openAddPartieDialog = inject(MatDialog);

  constructor(private partieService: PartieService) {}

  ngOnInit(): void {
    this.partieService
      .getAllParties()
      .pipe(
        tap((parties) => {
          this.allParties().data = parties;
        }),
      )
      .subscribe();
  }

  openCreationPartieDialog() {
    const dialogRef = this.openAddPartieDialog.open(CreationPartieDialogComponent, {
      width: '75vw',
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((questions) => {
          if (questions) {
            this.allParties().data = questions;
          }
        }),
      )
      .subscribe();
  }
}
