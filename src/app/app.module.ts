import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { NgModule } from "@angular/core";

import { MDBBootstrapModulesPro } from "ng-uikit-pro-standard";
import { MDBSpinningPreloader } from "ng-uikit-pro-standard";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { StepperComponent } from "./stepper/stepper.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import {
  ButtonsModule,
  WavesModule,
  CollapseModule
} from "ng-uikit-pro-standard";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { FileUploaderComponent } from "./file-uploader/file-uploader.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [AppComponent, StepperComponent, FileUploaderComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
    BrowserAnimationsModule,
    DragDropModule,
    ButtonsModule,
    WavesModule,
    CollapseModule,
    MatToolbarModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [MDBSpinningPreloader],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
