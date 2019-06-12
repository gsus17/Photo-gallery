import { Component } from '@angular/core';
import { AppServiceService } from './app-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'upload-image-firebase-research';

  public isLoading: boolean = false;

  constructor(private appServiceService: AppServiceService) {

  }

  public takePicture() {
    console.log(`${AppComponent.name}::takePicture`);

    const nav: any = navigator;
    const destinationType: any = nav.camera.DestinationType;

    // Take picture using device camera and retrieve image as base64-encoded string
    nav.camera.getPicture(this.onPhotoDataSuccess.bind(this), this.onFail.bind(this), {
      quality: 50,
      allowEdit: false,
      destinationType: destinationType.DATA_URL
    });
  }

  private onPhotoDataSuccess(imageData): void {
    console.log(`${AppComponent.name}::onPhotoDataSuccess`);

    this.postPicture(imageData);
  }

  private onFail(message) {
    console.log(`${AppComponent.name}::onFail`);

    alert('Failed because: ' + message);
  }

  private postPicture(imageURI: string) {
    console.log(`${AppComponent.name}::postPicture`);

    this.isLoading = true;

    this.appServiceService.upload(imageURI).toPromise()
      .then((success) => {
        console.log(`${AppComponent.name}::then %o`, success);
      })
      .catch((error) => {
        console.log(`${AppComponent.name}::catch %o`, error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
