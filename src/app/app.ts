import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { tap } from 'rxjs';
import { HealthService } from './services/health.service';
import { HealthStore } from './stores/health.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  pingInterval: any;

  constructor(
    private healthService: HealthService,
    private healthStore: HealthStore,
  ) {}

  ngOnInit(): void {
    this.pingBackend();

    this.pingInterval = setInterval(
      () => {
        this.pingBackend();
      },
      10 * 60 * 1000,
    );
  }

  pingBackend() {
    this.healthService
      .pingBackend()
      .pipe(
        tap(() => {
          this.healthStore.setBackendAwake();
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
  }
}
