import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Image } from '../gallery.component';

@Component({
  selector: 'app-dialog-image-detail',
  templateUrl: './dialog-image-detail.component.html',
  styleUrls: ['./dialog-image-detail.component.css']
})
export class DialogImageDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogImageDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Image) { }

  ngOnInit() {
  }

  /**
   * Open image on viewer.
   */
  public showOnViewer(image: Image): void {
    const w: any = window;
    w.PhotoViewer.show(image.src, image.name);
  }

  /**
   * Close the dialog.
   */
  public onNoClick(): void {
    this.dialogRef.close();
  }
}
