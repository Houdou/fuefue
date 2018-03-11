import { Injectable, OnInit } from '@angular/core';

import { TuneType } from '../../models/tune';

import { FueAudioPlayback } from './audio-playback';
import { FueTrack } from './audio-track';
import { FueChannel } from './audio-channel';

@Injectable()
export class FueAudioService implements OnInit {	
	private tracks: Array<FueTrack>

	private _bpm : number;
	public get bpm() : number {
		return this._bpm;
	}
	public set bpm(v : number) {
		this._bpm = v;
		this._duration = 60 / this.bpm;
	}

	private _duration : number;
	public get duration() : number {
		return this._duration;
	}

	constructor() {
		this.tracks = new Array<FueTrack>();
		this.bpm = 120;
	}

	ngOnInit() {
	}

	public CreateNewTrack(refCanvas: HTMLCanvasElement, type: TuneType): FueTrack {
		let track = new FueTrack(refCanvas, type, 48000);
		track.CreateChannel('Left');
		track.CreateChannel('Right');
		this.tracks.push(track);
		this.GenerateWaveform(); // For testing
		return track;
	}

	public GenerateWaveform(): void {
		this.tracks.forEach(t => {
			t.listOfChannels.forEach(c => {
				c.GenerateWaveform(t.type, 523.25, t.pan, this.duration, 48000);
			})
		})
		setTimeout(() => {
			this.tracks[0].Play();
		}, 1000);
	}

	public Play(): void {

	}

	public Pause(): void {
	}

	public Stop(): void {
		
	}
}