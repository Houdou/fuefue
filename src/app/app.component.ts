import { Component } from '@angular/core';

import { FueAudioService } from './services/audio.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = '「ふぇ」';

	constructor(private audio: FueAudioService) {

	}
}
