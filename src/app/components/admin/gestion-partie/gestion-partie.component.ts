import { Component, OnInit, signal } from '@angular/core';
import { BoutonRetourComponent } from '../../../shared/bouton-retour/bouton-retour.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Partie } from '../../../model/partie.model';
import { PartieService } from '../../../services/partie.service';
import { tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'gestion-partie.component',
  imports: [BoutonRetourComponent, MatTableModule, MatIconModule],
  templateUrl: './gestion-partie.component.html',
  styleUrl: './gestion-partie.component.scss',
})
export class GestionPartieComponent implements OnInit {
  allParties = signal(new MatTableDataSource<Partie>([]));

  displayedColumns = ['nomPartie', 'questions'];

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
}
