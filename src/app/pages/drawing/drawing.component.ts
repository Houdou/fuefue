import { Component, OnInit, ViewChild, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';
import { BeatMesh } from '../../models/beat-mesh';


import * as createjs from 'createjs-module';

export class BeatCell {
	private _IsEnabled : boolean = false;
	public get IsEnabled() : boolean {
		return this._IsEnabled;
	}
	public set IsEnabled(v : boolean) {
		if(v) {
			if(this.OnActived != null) {
				this.OnActived(this);
			}
			this.draw(this.ActivedColor);
		} else {
			if(this.OnDisabled != null) {
				this.OnDisabled(this);
			}
			this.draw(this.DisabledColor);
		}
		this._IsEnabled = v;
	}

	public ActivedColor: string = '#FBEF98';
	public DisabledColor: string = '#888888';

	private cellSize: number;
	private cellRadius: number;

	public OnDisabled: (cell: BeatCell) => void = null;
	public OnActived: (cell: BeatCell) => void = null;
	public OnClick: (evt: MouseEvent) => void = null;

	constructor(public x: number, public y: number, public cell: createjs.Shape, size: number, radius: number) {
		this.cellSize = size;
		this.cellRadius = radius;

		if(cell != null) {
			this.cell.on('click', (evt: MouseEvent) => {
				this.handleClick(evt);
			});
			this.draw(this.DisabledColor);
		}
	}

	private handleClick(evt: MouseEvent): void {
		if(this.OnClick != null) {
			this.OnClick(evt);
		}
	}

	private draw(color): void {
		this.cell.graphics.clear().f(color)
			.drawRoundRectComplex(0, 0, this.cellSize, this.cellSize, this.cellRadius, 0, this.cellRadius, 0);
		this.cell.cache(0, 0, this.cellSize, this.cellSize);
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

	private imageContext: CanvasRenderingContext2D;

	private uiContainer: createjs.Container;
	private progressBar: createjs.Shape;

	private mesh: BeatMesh<BeatCell>;

	@HostListener('window:resize')
	onResize() {
		let smallSize = Math.min(this.canvas.parentElement.offsetHeight, this.canvas.parentElement.offsetWidth) + 80;
		this.pixelScale = Math.floor(Math.log2(smallSize));
		this.canvas.width = this.canvas.height = 2**this.pixelScale + 80;
		this.stage.x = this.canvas.width / 2;
		this.stage.y = this.canvas.height / 2;
		this.stage.scaleX = this.stage.scaleY = 2**(this.pixelScale-8)+.5;

		this.progressBar.graphics.clear().beginFill('#D0D0D0').dr(0, 1, this.canvas.width, 3);

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
		let size = 8;
		let radius = 2.5;

		let c = new createjs.Container();
		let bg = new createjs.Shape();
		let bgSize = (size + spacing) * length - spacing + 2 * padding;
		bg.graphics.beginFill('#666666').drawRoundRect(0, 0, bgSize, bgSize, 1.5);
		c.addChild(bg);

		this.mesh = new BeatMesh<BeatCell>(length, length, null);

		this.mesh.Map((u, v, idx, mesh) => {
			let shape = new createjs.Shape();
			let cell = new BeatCell(u, v, shape, size, radius);
			cell.ActivedColor = '#FBEF98';
			cell.DisabledColor = '#888888';

			cell.OnClick = (evt: MouseEvent) => {
				cell.IsEnabled = !cell.IsEnabled;
				this.stage.update();
				console.log(u, v);

				// console.log(this.mesh.GetColumn(u).map(cell => cell.IsEnabled));
			}

			// DEBUG
			// cell.IsEnabled = Math.random() > 0.8;

			shape.x = padding + (size + spacing) * u;
			shape.y = padding + (size + spacing) * v;
			c.addChild(shape);
			return cell;
		});

		// for(let v = 0; v < length; v++) {
		// 	for(let u = 0; u < length; u++) {
		// 		let cell = new createjs.Shape();
		// 		// TODO: Create model
		// 		// TOOD: Bind events
		// 		if(Math.random() < 0.8)
		// 			cell.graphics.f('#888888').drawRoundRectComplex(0, 0, size, size, radius, 0, radius, 0);
		// 		else
		// 			cell.graphics.f('#FBEF98').drawRoundRectComplex(0, 0, size, size, radius, 0, radius, 0);
		// 		cell.x = padding + (size + spacing) * u;
		// 		cell.y = padding + (size + spacing) * v;
		// 		c.addChild(cell);
		// 	}
		// }
		c.regX = c.regY = bgSize / 2;
		this.stage.scaleX = this.stage.scaleY = 2**(this.pixelScale-8)+.5;

		this.stage.addChild(c);
		setTimeout(() => {
			this.stage.update();
		});
	}
}

