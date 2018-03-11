import { Utils } from './audio-utils';
import { TuneType } from '../../models/tune';

export class WaveformGenerator {
	// This object represent the waveform generator

	// The generateWaveform function takes 4 parameters:
	//     - type, the type of waveform to be generated
	//     - frequency, the frequency of the waveform to be generated
	//     - amp, the maximum amplitude of the waveform to be generated
	//     - duration, the length (in seconds) of the waveform to be generated
	static GenerateWaveform(type: TuneType, frequency: number, amp: number, duration: number, sampleRate: number = 44100): Array<number> {

		//piko - Triangular wave with large sustain
		//koro - Pulse wave with large sustain
		//poko - Triangualr wave with small sustain
		//piro - Pulse wave with small sustain
		switch (type) {
			case TuneType.Piko:
				return this.GenerateSawWaveADSR(frequency, amp, duration, [0.001, 0.03, 0.33, 0.8, 0.64], sampleRate);
			case TuneType.Koro:
				return this.GeneratePulseWaveADSR(frequency, amp, duration, [0.001, 0.03, 0.33, 0.66, 0.64], sampleRate)
			case TuneType.Poko:
				return this.GenerateSawWaveADSR(frequency, amp, duration, [0.001, 0.03, 0.33, 0.66, 0.0], sampleRate);
			case TuneType.Piro:
				return this.GeneratePulseWaveADSR(frequency, amp, duration, [0.001, 0.03, 0.33, 0.8, 0.0], sampleRate)
			default:
				// code...
				break;
		}
	}

	static GenerateSawWaveADSR(frequency: number, amp: number, duration: number, adsr: Array<number>, sampleRate: number = 44100): Array<number> {
		let oneCycle = sampleRate / frequency, oneCycleI = ~~oneCycle;
		let totalSamples = Math.floor(sampleRate * duration); // Number of samples to generate
		let [a, d, s, _, r] = adsr.map(v => ~~(v * totalSamples)), sl = adsr[3];		
		let result = new Array<number>();
		for (let i = 0; i < totalSamples; ++i) {
			let posInCycle = (i % oneCycleI) / oneCycle;
			// let currentTime = i / sampleRate, f = 2.0 * Math.PI * frequency * currentTime;
			result.push((1 - 4 * Math.abs(posInCycle - 0.5)) * amp * Utils.ADSR(i, a, d, s, sl, r));
		}
		return result;

	}

	static GeneratePulseWaveADSR(frequency: number, amp: number, duration: number, adsr: Array<number>, sampleRate: number = 44100): Array<number> {
		let totalSamples = Math.floor(sampleRate * duration); // Number of samples to generate
		let [a, d, s, _, r] = adsr.map(v => ~~(v * totalSamples)), sl = adsr[3];
		let result = new Array<number>();
		for (let i = 0; i < totalSamples; ++i) {
			let currentTime = i / sampleRate, f = 2.0 * Math.PI * frequency * currentTime;
			let v = 1 * Math.sin(f) +
					1/3 * Math.sin(3 * f) + 
					1/5 * Math.sin(5 * f) + 
					1/7 * Math.sin(7 * f) + 
					1/9 * Math.sin(9 * f) + 
					1/11 * Math.sin(11 * f) + 
					1/13 * Math.sin(13 * f) +
					1/15 * Math.sin(15 * f) + 
					1/17 * Math.sin(17 * f) +
					1/19 * Math.sin(19 * f) +
					1/21 * Math.sin(21 * f) +
					1/23 * Math.sin(23 * f) +
					1/25 * Math.sin(25 * f) +
					1/27 * Math.sin(27 * f);
			result.push(v * amp * Utils.ADSR(i, a, d, s, sl, r));
		}
		return result;
	}

	static GenerateSineWaveADSR(frequency: number, amp: number, duration: number, adsr: Array<number>, sampleRate: number = 44100): Array<number> {
		let nyquistFrequency = sampleRate / 2; // Nyquist frequency
		let totalSamples = Math.floor(sampleRate * duration); // Number of samples to generate
		let [a, d, s, _, r] = adsr.map(v => ~~(v * totalSamples)), sl = adsr[3];
		let result = new Array<number>();
		for (let i = 0; i < totalSamples; ++i) {
			let currentTime = i / sampleRate;
			result.push(amp * Math.sin(2.0 * Math.PI * frequency * currentTime) * Utils.ADSR(i, a, d, s, sl, r));
		}
		return result;
	}
}