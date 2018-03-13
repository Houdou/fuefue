import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'fue-playback',
	templateUrl: './playback.component.html',
	styleUrls: ['./playback.component.css']
})
export class FuePlaybackComponent implements OnInit {
	public isPlaying: boolean = false;

	@Output()
	public OnPlaybackButton: EventEmitter<void> = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	onPlaybackButton(event: MouseEvent): void {
		this.OnPlaybackButton.emit();
		this.isPlaying = !this.isPlaying;
	}

}
