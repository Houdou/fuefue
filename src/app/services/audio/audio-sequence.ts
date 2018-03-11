export class FueAudioSequence {
	public name: string;
	public gain: number;
	public data: Array<number>;

	constructor(public sampleRate: number, data?: Array<number>) {
		this.gain = 0.0;
		this.data = new Array<number>();

		if (data !== undefined) {
			for(var i = 0; i < data.length; ++i) {
				this.data.push(data[i]);
			}
		}
	}

	public GetGain(start?: number, len?: number) {
		// default parameter
		if (start === undefined) start = 0;
		if (len === undefined) len = this.data.length - start;

		// requirement check
		if (start < 0 || start > this.data.length)
			throw "start parameter is invalid.";
		if (len < 0 || len + start > this.data.length)
			throw "end parameter is invalid.";

		let result = 0.0;
		for(let i = start; i < start + len; ++i) {
			// the amplitude could be positive or negative
			var absValue = Math.abs(this.data[i]);
			result = Math.max(result, absValue);
		}

		this.gain = result;
		return result;
	}

}