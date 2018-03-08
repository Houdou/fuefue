import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FueControlComponent } from './pages/control/control.component';
import { FueDrawingComponent } from './pages/drawing/drawing.component';

import { FueAudioService } from './services/audio.service';

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
