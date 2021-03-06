export enum TuneType {
	Piko = 0,
	Koro = 1,
	Poko = 2,
	Piro = 3
}

export class Tune {
	//piko - Triangular wave with large sustain
	//koro - Pulse wave with large sustain
	//poko - Triangualr wave with small sustain
	//piro - Pulse wave with small sustain

	constructor() {

	}
}

export class FreqHelper {
	static NoteFreq(note: number) {
		return 440.0 * 2**((note - 69)/12);
	}
}