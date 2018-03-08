import { Component, OnInit, ViewChild, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';

import * as createjs from 'createjs-module';

@Component({
	selector: 'fue-drawing',
	templateUrl: './drawing.component.html',
	styleUrls: ['./drawing.component.css']
})
export class FueDrawingComponent implements OnInit {
	@ViewChild("canvas")
	private canvasRef: ElementRef;

	private canvas: HTMLCanvasElement;
	private stage: createjs.Stage;

	public handleUpload: boolean = true;
	private imageLoaded: boolean = false;

	private _scale : number = 1;
	public get scale() : number {
		return this._scale;
	}
	public set scale(v : number) {
		this._scale = v;
		this.stage.scaleX = this.stage.scaleY = v;
	}

	constructor(private ele: ElementRef) { }

	ngOnInit() {
	}

	private bmp: createjs.Bitmap;
	private imageContext: CanvasRenderingContext2D;

	private uiContainer: createjs.Container;
	private progressBar: createjs.Shape;
	private seeds: Array<createjs.Shape> = new Array<createjs.Shape>();

	@HostListener('window:resize')
	onResize() {    	
		this.canvas.height = this.canvas.offsetHeight;
		this.canvas.width = this.canvas.offsetWidth;
		this.stage.x = this.canvas.width / 2;
		this.stage.y = this.canvas.height / 2;

		this.progressBar.graphics.clear().beginFill('#D0D0D0').dr(0, 1, this.canvas.width, 3);

		if(this.imageLoaded) {
			let w = this.bmp.image.width, h = this.bmp.image.height;
			if(w > this.canvas.width || h > this.canvas.height) {
				let sW = this.canvas.width / w, sH = this.canvas.height / h;
				this.scale = Math.min(sW, sH, 1);
			}
		}

		this.stage.update();
	}

	ngAfterViewInit() {
		this.canvas = this.canvasRef.nativeElement;
		this.setupCanvas();
	}

	private setupCanvas(): void {
		this.canvas.height = this.canvas.offsetHeight;
		this.canvas.width = this.canvas.offsetWidth;
		this.stage = new createjs.Stage(this.canvas);
		this.stage.autoClear = true;
		this.stage.enableMouseOver();
		this.uiContainer = new createjs.Container();

		this.progressBar = new createjs.Shape();
		this.progressBar.graphics.beginFill('#D0D0D0').dr(0, 1, this.canvas.width, 3);
		this.progressBar.scaleX = 0;
		this.uiContainer.addChild(this.progressBar);

		this.stage.addChild(this.uiContainer);
		this.stage.setChildIndex(this.uiContainer, this.stage.numChildren);
		this.stage.update();
	}

	private createBeatMesh(length: number): void {

	}
}
