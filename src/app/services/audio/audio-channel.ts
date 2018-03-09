import { WaveformGenerator } from './wave-generator';
import { FueAudioSequence } from './audio-sequence';

export class FueChannel {
	// This function object represent a single channel
	public sampleRate: number = 0;
	public title: string;
	// Visually it is the waveform display of the audio sequence data of this channel
	constructor(elementContext) {
		this.elementContext = elementContext;
		this.elementContext.channel = this;

		// References to the elements
		this.audioController = undefined; // The <audiocontroller> this channel is attached to
		this.audioSequenceReference = undefined; // The audio sequence data this channel stores

		// Data points used for drawing the waveform display
		this.visualizationData = [];
		// Scan for attributes during the creation
		if((typeof this.elementContext.attributes.title !== undefined) && this.elementContext.attributes.title !== null) {
			this.title = this.elementContext.attributes.title.value;
		}
	}
	
	// Assign a new audio sequence data to this channel
	this.setAudioSequence = function setAudioSequence(newAudioSequenceReference) {
		this.audioSequenceReference = newAudioSequenceReference;
		this.updateVisualizationData();
	};


	// Find the minimum and maximum values in a given time frame
	this.getPeakInFrame = function getPeakInFrame(from, to, data) {
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
	};

	// Convert from samples to seconds
	this.getSampleToSeconds = function getSampleToSeconds(sampleIndex) {
		return sampleIndex / this.sampleRate;
	};

	// Convert from seconds to samples
	this.getSecondsToSample = function getSecondsToSample(seconds) {
		return seconds * this.sampleRate;
	};

	// Generate a new waveform according to the parameters
	this.generateWaveform = function generateWaveform() {
		// Gather the basic parameters
		var selectedWaveType = currentWaveformType;
		var freq = parseInt($("#waveform-frequency").val());
		var stereoPosition = parseFloat($("#waveform-position").val());

		// Adjust the maximum amplitude of this channel
		var amp = 1.0;
		if(this.title === "Left Channel") {
			amp *= (1 - stereoPosition);
		} else {
			amp *= stereoPosition;
		}

		// Show the information of what is being generated in the console
		console.log(this.title + ": Generating waveform of type '" + selectedWaveType + "' with frequency " + freq + "Hz and amplitude " + amp);

		// Generate the audio samples data
		var newWaveformAudioSequence = WaveformGenerator.GenerateWaveform(selectedWaveType, freq, amp, duration);

		// Create a AudioSequence object with the audio samples data
		var newAudioSequenceReference = new FueAudioSequence(this.sampleRate, newWaveformAudioSequence);

		// Attach the newly created AudioSequence to this channel
		this.setAudioSequence(newAudioSequenceReference);
	};

}