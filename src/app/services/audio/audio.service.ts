import { Injectable, OnInit } from '@angular/core';

import { FueAudioPlayback } from './audio-playback';

@Injectable()
export class FueAudioService implements OnInit {
	private playback: FueAudioPlayback;
	
	constructor() {
		
	}

	ngOnInit() {
		this.playback = new FueAudioPlayback();
	}
}