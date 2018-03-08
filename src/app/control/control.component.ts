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

	constructor() { }

	ngOnInit() {
	}

}
