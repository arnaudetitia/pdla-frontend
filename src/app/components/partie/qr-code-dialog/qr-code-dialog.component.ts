import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { QRCodeComponent } from 'angularx-qrcode';
import { PartieComponent } from '../partie.component';

@Component({
  selector: 'app-qr-code-dialog.component',
  imports: [MatDialogModule, MatDialogTitle, QRCodeComponent],
  templateUrl: './qr-code-dialog.component.html',
  styleUrl: './qr-code-dialog.component.scss',
})
export class QrCodeDialogComponent {
  readonly dialogRef = inject(MatDialogRef<PartieComponent>);

  urlRemote = 'https://pdla-remote.onrender.com/';
}
