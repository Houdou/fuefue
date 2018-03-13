export class BeatMesh<T> {
	// flattened stroage
	private grid: Array<T>;

	constructor(public Rows: number, public Columns: number, initialValue: T) {
		let grid = new Array<T>(Rows * Columns);
		grid.forEach(u => u = initialValue);
	}

	public Clone(cloneFunction: (value: T, i: number, arr: Array<T>) => T): Array<T> {
		return this.grid.map(cloneFunction);
	}

	public GetColumn(idx: number): Array<T> {
		return this.grid.filter((v, i) => i % this.Columns == idx);
	}

	public Reset(value: T): void {
		this.grid.fill(value);
	}

	public FillColumn(idx: number, value: T): BeatMesh<T> {
		if(idx > 0 && idx < this.Columns)
			this.grid.forEach((v, i, arr) => {
				if(i % this.Columns == idx) {
					arr[i] = value;
				}
			});
		else
			console.warn("Index out of range");
		
		return this;
	}

	public FillRow(idx: number, value: T): BeatMesh<T> {
		if(idx > 0 && idx < this.Rows)
			this.grid.fill(value, idx * this.Columns, (idx+1) * this.Columns);
		else
			console.warn("Index out of range");
		
		return this;
	}

	public Mark(x: number, y: number, value: T): boolean {
		if(y < 0 || x < 0 || x >= this.Columns || y >= this.Rows) console.warn("Index out of border");
		let changed = this.grid[y * this.Columns + x] != value;
		this.grid[y * this.Columns + x] = value;
		return changed;
	}

	public Map(x: number, y: number, MapFunction: (x: number, y: number, i: number, arr: Array<T>) => T): BeatMesh<T> {
		for(let v = 0; v < this.Rows; ++v) {
			for(let u = 0; u < this.Columns; ++u) {
				this.grid[v * this.Columns + u] = MapFunction(u, v, v * this.Columns + u, this.grid);
			}
		}
		return this;
	}
}