import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'fue-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class FueControlComponent implements OnInit {
	@Input('MenuBarTitle')
	private MenuBarTitle: string;

	@Output()
	public onMenuFunction = new EventEmitter<object>();

	public menuOperable: boolean = true;
	
	constructor() { }

	ngOnInit() {
	}

	private Emit(eventName: string):void {
		let event: any = {};
		event.name = eventName;
		this.onMenuFunction.emit(event);
	}

	public Reset(): void {
		this.menuOperable = false;
		// TODO: Reset menubar status (modes)
	}

}
