import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { ReponsesStore } from '../stores/reponses.store';
import { PartieOrchestrator } from '../orchestrator/partie.orchestrator';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | undefined;

  constructor(
    private reponseStore: ReponsesStore,
    private partieOrchestrator: PartieOrchestrator,
  ) {
    this.socket = io(environment.socketUrl, {
      transports: ['websocket'],
      upgrade: false,
    });

    this.socket.on('update-reponse', (data) => {
      reponseStore.setReponse(data);
    });

    this.socket.on('confirm-reponse', () => {
      this.partieOrchestrator.passerEtatSuivant();
    });
  }
}
