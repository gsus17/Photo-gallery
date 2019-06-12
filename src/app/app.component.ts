import { Component } from '@angular/core';
import { AppServiceService } from './app-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Upload-image-firebase-research';

  public isLoading: boolean = false;

  constructor(
    private appServiceService: AppServiceService,
    private snackBar: MatSnackBar) {

  }

  /**
   * Take a picture process.
   */
  public takePicture() {
    console.log(`${AppComponent.name}::takePicture`);

    const nav: any = navigator;
    const destinationType: any = nav.camera.DestinationType;

    // Take picture using device camera and retrieve image as base64-encoded string
    nav.camera.getPicture(this.onPhotoDataSuccess.bind(this), this.onError.bind(this), {
      quality: 50,
      allowEdit: false,
      destinationType: destinationType.DATA_URL
    });
  }

  /**
   * Get picture sucess.
   */
  private onPhotoDataSuccess(imageData): void {
    console.log(`${AppComponent.name}::onPhotoDataSuccess`);

    this.postPicture(imageData);
  }

  /**
   * Error get picture.
   */
  private onError(message) {
    console.log(`${AppComponent.name}::onFail message %o`, message);
  }

  /**
   * Upload the imaga to firebase.
   */
  private postPicture(imageURI: string) {
    console.log(`${AppComponent.name}::postPicture`);

    this.isLoading = true;
    this.appServiceService.$upload(imageURI)
      .toPromise()
      .then((success) => {
        console.log(`${AppComponent.name}::then %o`, success);
        this.openSnackBar('Success', null);
      })
      .catch((error) => {
        console.log(`${AppComponent.name}::catch %o`, error);
        this.openSnackBar('Error', null);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  /**
   * Show the message sucess or fail.
   */
  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
