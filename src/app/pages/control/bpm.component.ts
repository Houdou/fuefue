import { Component, OnInit } from '@angular/core';

import { FueAudioService } from '../../services/audio/audio.service';

@Component({
	selector: 'fue-bpm',
	templateUrl: './bpm.component.html',
	styleUrls: ['./bpm.component.css']
})
export class FueBpmComponent implements OnInit {
	// private bpm: number = 120;
	private _bpm : number = 120;
	public get bpm() : number {
		return this._bpm;
	}
	public set bpm(v : number) {
		if(this._bpm != v)
			this.resetLazyTimer();
		this._bpm = v;
	}

	private lazyUpdateTimer: number;
	private lazyDelay: number = 1000;

	constructor(private audio: FueAudioService) {

	}

	ngOnInit() {
	}

	private resetLazyTimer(): void {
		if(this.lazyUpdateTimer != -1) {
			// console.log("Bpm change delayed");
			window.clearTimeout(this.lazyUpdateTimer);
		}
		this.lazyUpdateTimer = window.setTimeout(() => {
			this.audio.bpm = this.bpm;
			// console.log("Bpm changed");
		}, this.lazyDelay);
	}

	public OnUpdateSlider(evt: any) {
		// console.log(evt);
		this.bpm = +evt.target.value;
	}

	private increaseBPM(evt: MouseEvent) {
		evt.preventDefault();
		this.bpm++;
	}

	private decreaseBPM(evt: MouseEvent) {
		evt.preventDefault();
		this.bpm--;
	}

}
