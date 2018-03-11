import { Component, ViewChild } from '@angular/core';

import { TuneType } from './models/tune';

import { FueDrawingComponent } from './pages/drawing/drawing.component';

import { FueAudioService } from './services/audio/audio.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = '「ふぇ」';

	@ViewChild(FueDrawingComponent)
	private drawing: FueDrawingComponent;

	constructor(private audio: FueAudioService) {

	}

	private HandleMenu(event: any): void {
		console.log(event.name);

		switch (event.name) {
			case 'Playback':

			default:
				break;
		}
	}

	ngAfterViewInit() {
		this.CreateTrack(this.drawing.canvas, TuneType.Poko);
	}

	public CreateTrack(canvasRef: HTMLCanvasElement, type: TuneType = TuneType.Piko): void {
		this.audio.CreateNewTrack(canvasRef, type);
	}
}
