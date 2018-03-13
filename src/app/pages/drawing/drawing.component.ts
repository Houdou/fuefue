import { Component, OnInit, ViewChild, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';
import { BeatMesh } from '../../models/beat-mesh';


import * as createjs from 'createjs-module';

export class BeatCell {
	public IsEnabled: boolean = false;

	constructor(public x: number, public y: number) {

	}


}

@Component({
	selector: 'fue-drawing',
	templateUrl: './drawing.component.html',
	styleUrls: ['./drawing.component.css']
})
export class FueDrawingComponent implements OnInit {
	@ViewChild("canvas")
	private canvasRef: ElementRef;

	public canvas: HTMLCanvasElement;
	private stage: createjs.Stage;

	public handleUpload: boolean = true;
	private imageLoaded: boolean = false;

	private mesh: BeatMesh<BeatCell>;

	private _scale : number = 1;
	public get scale() : number {
		return this._scale;
	}
	public set scale(v : number) {
		this._scale = v;
		this.stage.scaleX = this.stage.scaleY = v;
	}

	private _pixelScale : number;
	public get pixelScale() : number {
		return this._pixelScale;
	}
	public set pixelScale(v : number) {
		this._pixelScale = v;
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
		let smallSize = Math.min(this.canvas.parentElement.offsetHeight, this.canvas.parentElement.offsetWidth) + 80;
		this.pixelScale = Math.floor(Math.log2(smallSize));
		this.canvas.width = this.canvas.height = 2**this.pixelScale + 80;
		this.stage.x = this.canvas.width / 2;
		this.stage.y = this.canvas.height / 2;
		this.stage.scaleX = this.stage.scaleY = 2**(this.pixelScale-8)+.5;

		this.progressBar.graphics.clear().beginFill('#D0D0D0').dr(0, 1, this.canvas.width, 3);

		if(this.imageLoaded) {
			let w = this.bmp.image.width, h = this.bmp.image.height;
			if(w > this.canvas.width || h > this.canvas.height) {
				let sW = this.canvas.width / w, sH = this.canvas.height / h;
				this.scale = Math.min(sW, sH, 1);
			}
		}
		this.canvas.getContext('2d').imageSmoothingEnabled = false;
		this.stage.update();
	}

	ngAfterViewInit() {
		this.canvas = this.canvasRef.nativeElement;
		this.setupCanvas();
		this.createBeatMesh();
	}

	private setupCanvas(): void {
		this.stage = new createjs.Stage(this.canvas);
		this.stage.autoClear = true;
		this.stage.snapToPixelEnabled = true;
		this.stage.snapToPixel = false;
		this.stage.enableMouseOver();
		this.uiContainer = new createjs.Container();
		this.progressBar = new createjs.Shape();
		this.progressBar.scaleX = 0;
		this.uiContainer.addChild(this.progressBar);
		this.stage.addChild(this.uiContainer);
		this.stage.setChildIndex(this.uiContainer, this.stage.numChildren);

		this.onResize();
	}

	private createBeatMesh(length: number = 16): void {
		let padding = 3;
		let spacing = 2;
		let cellSize = 8;
		let cellRadius = 2.5;

		let c = new createjs.Container();
		let bg = new createjs.Shape();
		let bgSize = (cellSize + spacing) * length - spacing + 2 * padding;
		bg.graphics.beginFill('#666666').drawRoundRect(0, 0, bgSize, bgSize, 1.5);
		c.addChild(bg);

		for(let v = 0; v < length; v++) {
			for(let u = 0; u < length; u++) {
				let cell = new createjs.Shape();
				// TODO: Create model
				// TOOD: Bind events
				if(Math.random() < 0.8)
					cell.graphics.f('#888888').drawRoundRectComplex(0, 0, cellSize, cellSize, cellRadius, 0, cellRadius, 0);
				else
					cell.graphics.f('#FBEF98').drawRoundRectComplex(0, 0, cellSize, cellSize, cellRadius, 0, cellRadius, 0);
				cell.x = padding + (cellSize + spacing) * u;
				cell.y = padding + (cellSize + spacing) * v;
				c.addChild(cell);
			}
		}
		c.cache(0, 0, bgSize, bgSize);
		c.regX = c.regY = bgSize / 2;
		this.stage.scaleX = this.stage.scaleY = 2**(this.pixelScale-8)+.5;

		this.stage.addChild(c);
		setTimeout(() => {
			this.stage.update();
		});
	}
}
