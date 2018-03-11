import { TuneType } from '../../models/tune';

import { FueAudioSequence } from './audio-sequence';
import { FueTrack } from './audio-track';

import { WaveformGenerator } from './wave-generator';

export class FueChannel {
	// This function object represent a single channel
	public title: string;

	private elementContext: HTMLElement;
	public controller: FueTrack;
	public audioSequenceReference: FueAudioSequence;

	// Visually it is the waveform display of the audio sequence data of this channel
	constructor(elementContext: HTMLElement, public sampleRate: number = 44100) {
		this.elementContext = elementContext;
		// this.elementContext.channel = this;

		// References to the elements
		this.controller = undefined; // The <audiocontroller> this channel is attached to
		this.audioSequenceReference = undefined; // The audio sequence data this channel stores

		// Data points used for drawing the waveform display
		// this.visualizationData = [];
		// Scan for attributes during the creation
		if((typeof this.elementContext.attributes['title'] !== undefined) && this.elementContext.attributes['title'] !== null) {
			this.title = this.elementContext.attributes['title'].value;
		}
	}
	
	// Assign a new audio sequence data to this channel
	public SetAudioSequence(newAudioSequenceReference): void {
		this.audioSequenceReference = newAudioSequenceReference;
		// this.updateVisualizationData();
	}


	// Find the minimum and maximum values in a given time frame
	public GetPeakInFrame(from, to, data): any {
		var fromRounded = Math.round(from); // This should be integer
		var toRounded = Math.round(to); // This should be integer
		var min = 1.0; // Set a high enough value for the minimum
		var max = -1.0; // Set a low enough value for the maximum

		if(fromRounded < 0 || toRounded > data.length) debugger;

		for(var i = fromRounded; i < toRounded; ++i) {
			var sample = data[i];
			max = (sample > max) ? sample : max;
			min = (sample < min) ? sample : min;
		}

		return { min : min, max : max };
	}

	// Convert from samples to seconds
	public GetSampleToSeconds(sampleIndex) {
		return sampleIndex / this.sampleRate;
	}

	// Convert from seconds to samples
	public GetSecondsToSample(seconds): number {
		return seconds * this.sampleRate;
	}

	// Generate a new waveform according to the parameters
	public GenerateWaveform(type: TuneType, freq: number, stereoPosition: number, duration: number, sampleRate: number) {
		// Gather the basic parameters
		// var selectedWaveType = type;
		// var freq = parseInt($("#waveform-frequency").val());
		// var stereoPosition = parseFloat($("#waveform-position").val());

		// Adjust the maximum amplitude of this channel
		let amp = 1.0;
		if(this.title === "Left") {
			amp *= (1 - stereoPosition);
		} else {
			amp *= stereoPosition;
		}

		// Show the information of what is being generated in the console
		console.log(`${this.title}: Generating waveform ${duration}s of type ${type} with frequency ${freq}Hz and amplitude ${amp}`)
		// console.log(this.title + ": Generating waveform of type '" + type + "' with frequency " + freq + "Hz and amplitude " + amp);

		// Generate the audio samples data
		let newWaveformAudioSequence = WaveformGenerator.GenerateWaveform(type, freq, amp, duration, sampleRate);

		// Create a AudioSequence object with the audio samples data
		let newAudioSequenceReference = new FueAudioSequence(this.sampleRate, newWaveformAudioSequence);

		// Attach the newly created AudioSequence to this channel
		this.SetAudioSequence(newAudioSequenceReference);
	};

}