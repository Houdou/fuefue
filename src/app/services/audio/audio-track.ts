import { TuneType } from '../../models/tune';
import { FueChannel } from './audio-channel';
import { FueAudioPlayback } from './audio-playback';
import { FueWaveTrack } from './wave-track';

export class FueTrack {
	// This function object set up the <audiocontroller> element
	private audioPlayback: FueAudioPlayback;

	public listOfChannels: Array<FueChannel>;

	public pan: number = 0.5;

	constructor(private elementContext: HTMLElement, public type: TuneType, public sampleRate: number = 44100) {
		this.elementContext = elementContext; // The context of the hosting element
		// this.elementContext.audioController = this; // Export this
		this.listOfChannels = []; // List of channels of this audio controller
		this.audioPlayback = new FueAudioPlayback(); // Create a new playback handler for this audio controller
		
		// // Export some functions to the HTML element
		// this.elementContext.createChannel = this.createChannel;
		// this.elementContext.removeAllChannels = this.removeAllChannels;
		// this.elementContext.zoomToFit = this.zoomToFit;
		// this.elementContext.zoomToCycles = this.zoomToCycles;
		// this.elementContext.zoomToSeconds = this.zoomToSeconds;
		// this.elementContext.zoom = this.zoom;
		// this.elementContext.play = this.play;
		// this.elementContext.stop = this.stop;
		// this.elementContext.updateDownloadLink = this.updateDownloadLink;
		// this.elementContext.updateDownloadMidiLink = this.updateDownloadMidiLink;
		// this.elementContext.toWave = this.toWave;
		// this.elementContext.generateWaveform = this.generateWaveform;
		// this.elementContext.generateMusicFromMIDI = this.generateMusicFromMIDI;
		// this.elementContext.postprocess = this.postprocess;

		// Disable selection of this element
		this.elementContext.onselectstart = function() { return false; };
	}

	// Check if any channel has used the name already
	public ContainsChannel(name) {
		for(var i = 0; i < this.listOfChannels.length; ++i) {
			if(this.listOfChannels[i].title == name) return true;
		}
		return false;
	};

	// Add a new channel to this audio control
	public AddChannel(channel): void {
		for(var i = 0; i < this.listOfChannels.length; ++i) {
			if(this.listOfChannels[i].title === channel.title) return;
		}
		this.listOfChannels.push(channel);
	};

	// Remove a specific channel from the aduio control
	public RemoveChannel(channel): void {
		for(var i = 0; i < this.listOfChannels.length; ++i) {
			if(this.listOfChannels[i].title === channel.title) {
				this.listOfChannels.splice(i, 1);
			}
		}
	};

	// Create a new channel with specific name
	public CreateChannel(name): FueChannel {
		if(this.ContainsChannel(name) === true) return undefined;

		var channelElement = document.createElement("channel");
		channelElement.title = name;
		this.elementContext.appendChild(channelElement);
		var obj = new FueChannel(channelElement);
		this.AddChannel(obj);
		return obj;
	};

	// Remove all channels that are added to this audio control
	public RemoveAllChannels(): void {
		for(let c in this.listOfChannels) {
			delete this.listOfChannels[c];
		}

		this.listOfChannels = new Array<FueChannel>();
		// for(var i = 0; i < this.elementContext.children.length; ++i) {
		// 	if(this.elementContext.children[i].nodeName.toLowerCase() == "channel") {
		// 		this.audioController.RemoveChannel(this.elementContext.children[i].Channel);
		// 		this.elementContext.removeChild(this.elementContext.children[i]);
		// 		--i;
		// 	}
		// }
	};

	// Play the audio
	public Play(): void {
		// Stop, if any, the currently playing audio
		this.audioPlayback.Stop();

		// Prepare the audio sequences information
		let audioDataRefs = [];
		for(var i = 0; i < this.listOfChannels.length; ++i) {
			audioDataRefs.push(this.listOfChannels[i].audioSequenceReference.data);
		}

		// Pass the audio sequences information to the audio playback handler
		this.audioPlayback.Play(audioDataRefs, this.sampleRate);
	};

	// Stop the aduio playback
	public Stop(): void {
		this.audioPlayback.Stop();
	};

	// Update the download link
	public UpdateDownloadLink(saveLink): string {
		var url = this.ToWave().ToBlobUrlAsync("application/octet-stream");
	// 	$(savelink).attr("href", url);
	// 	var fileName = currentWaveformType + "-" + $("#waveform-frequency").val() + "hz";
	// 	for(i = 1; i <= currentEffects.length; ++i) {
	// 		fileName += "-pp" + i + "-" + currentEffects[i - 1];
	// 	}
	// 	fileName += ".wav"
	// 	$(savelink).attr("download", fileName);
		return url;
	};

	// // Update the download MIDI music link
	// public UpdateDownloadMidiLink(saveMidiLink): void {
	// 	var url = this.ToWave().toBlobUrlAsync("application/octet-stream");
	// 	$(saveMidiLink).attr("href", url);
	// 	var fileName = "midi-music-" + currentWaveformType;
	// 	for(i = 1; i <= currentEffects.length; ++i) {
	// 		fileName += "-pp" + i + "-" + currentEffects[i - 1];
	// 	}
	// 	fileName += ".wav"
	// 	$(saveMidiLink).attr("download", fileName);
	// };

	// Export to WAV format
	public ToWave(): FueWaveTrack {
		var wave = new FueWaveTrack();

		var sequenceList = [];
		for(var i = 0; i < this.listOfChannels.length; ++i) {
			sequenceList.push(this.listOfChannels[i].audioSequenceReference);
		}

		wave.fromAudioSequences(sequenceList);
		return wave;
	};
}