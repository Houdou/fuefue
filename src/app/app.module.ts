import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FueControlComponent } from './control/control.component';
import { FueDrawingComponent } from './drawing/drawing.component';


@NgModule({
  declarations: [
    AppComponent,
    FueControlComponent,
    FueDrawingComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
