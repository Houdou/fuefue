import { Injectable } from '@angular/core';

import { FueAudioPlayback } from './audio-playback';

@Injectable()
export class FueAudioService {
	constructor(private playback: FueAudioPlayback) {
		this.playback = new FueAudioPlayback();
	}
}