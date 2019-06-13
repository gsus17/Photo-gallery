import { Component, OnInit } from '@angular/core';
import { AppServiceService } from '../app-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'Upload-image-firebase-research';
  public isLoading: boolean;
  public imageList: Image[];

  constructor(
    private appServiceService: AppServiceService,
    private snackBar: MatSnackBar) {
    this.isLoading = false;
    this.imageList = [];
  }

  ngOnInit() {
  }

  /**
   * Take a picture process.
   */
  public takePicture() {
    console.log(`${HomeComponent.name}::takePicture`);
    this.isLoading = true;

    const nav: any = navigator;
    const destinationType: any = nav.camera.DestinationType;

    // Se usa una promesa ya que se pierde el scope y no actualiza el dom angular.
    const promise = new Promise((resolve, reject) => {
      // Take picture using device camera and retrieve image as base64-encoded string
      nav.camera.getPicture(
        (imageData) => {
          resolve(imageData);
        },
        (message) => {
          reject(message);
        }, {
          quality: 50,
          allowEdit: false,
          destinationType: destinationType.DATA_URL
        });
    });

    promise
      .then((imageData: string) => {
        this.postPicture(imageData);
      })
      .catch((message) => {
        console.log(`${HomeComponent.name}::onFail message %o`, message);
      });
  }

  /**
   * Upload the imaga to firebase.
   */
  private postPicture(imageData: string) {
    console.log(`${HomeComponent.name}::postPicture`);

    this.appServiceService.$upload(imageData)
      .toPromise()
      .then((response) => {
        console.log(`${HomeComponent.name}::then %o`, response);
        this.openSnackBar('Success', null);

        this.renderImage(imageData, response);
        this.printUrl(response);
      })
      .catch((error) => {
        console.log(`${HomeComponent.name}::catch %o`, error);
        this.openSnackBar('Error', null);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  /**
   * Show the url download.
   */
  private printUrl(success) {
    success.ref.getDownloadURL()
      .then((s) => {
        console.log(`${HomeComponent.name}::then %o`, s);
      });
  }

  /**
   * Insert the image to local list to render.
   */
  private renderImage(imageData, response) {
    console.log(`${HomeComponent.name}::renderImage`);

    const imageToRender: Image = {
      name: '',
      src: `data:image/jpeg;base64,${imageData}`
    };

    this.imageList.push(imageToRender);
    console.log(`${HomeComponent.name}::renderImage imageList %o`, this.imageList);
  }

  /**
   * Show the message sucess or fail.
   */
  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 50,
    });
  }
}

export interface Image {
  name: string;
  src: string;
}
