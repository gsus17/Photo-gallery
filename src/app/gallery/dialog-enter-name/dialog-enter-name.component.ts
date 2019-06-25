import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-enter-name',
  templateUrl: './dialog-enter-name.component.html',
  styleUrls: ['./dialog-enter-name.component.css']
})
export class DialogEnterNameComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogEnterNameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  /**
   * Close the dialog.
   */
  public onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  name: string;
}
