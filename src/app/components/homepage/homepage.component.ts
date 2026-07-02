import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { LobbyPartieComponent } from './lobby-partie.component/lobby-partie.component';
import { PartieStore } from '../../stores/partie.store';
import { tap } from 'rxjs';
import { EquipeStore } from '../../stores/equipe.store';

@Component({
  selector: 'app-homepage.component',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  lobbyPartieDialog = inject(MatDialog);

  constructor(
    private partieStore: PartieStore,
    private equipeStore: EquipeStore,
    private router: Router,
  ) {}

  openLobby() {
    const dialogRef = this.lobbyPartieDialog.open(LobbyPartieComponent, {
      width: '75vw',
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((partieData) => {
          this.partieStore.setIdCurrentPartie(partieData.idPartie);
          this.equipeStore.initScores(partieData.equipes);
          this.router.navigate(['partie']);
        }),
      )
      .subscribe();
  }
}
