import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FueControlComponent } from './pages/control/control.component';
import { FuePlaybackComponent } from './pages/control/playback.component';
import { FueDrawingComponent } from './pages/drawing/drawing.component';

import { FueAudioService } from './services/audio/audio.service';

@NgModule({
	declarations: [
		AppComponent,
		FueControlComponent,
		FueDrawingComponent,
		FuePlaybackComponent
	],
	imports: [
		BrowserModule
	],
	providers: [
		FueAudioService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
