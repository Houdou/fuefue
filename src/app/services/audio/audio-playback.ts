export class FueAudioPlayback {
	// Creation of a new audio context
	public audioBufferSize: number = 1024;
	public sampleRate: number = 0;

	public audioContext: AudioContext;

	// The JavaScriptNode is used to modifiy the output buffer
	public javaScriptNode: ScriptProcessorNode;

	/*this.analyserNode = this.audioContext.createAnalyser();
	public analyserNode.minDecibels = -100;
	public analyserNode.maxDecibels = 0;
	public analyserNode.smoothingTimeConstant = 0.0;
	public analyserNode.connect(this.audioContext.destination);*/

	public audioDataRef = undefined;

	// Playback information
	public playStart = 0;
	public playEnd = 0;
	public currentPlayPosition: number = 0;
	public isPlaying: boolean = false;

	// Callback information
	public playbackUpdateInterval: number = 0.0; // in Seconds
	public lastPlaybackUpdate = 0;

	constructor() {
		this.audioContext  = new AudioContext();
		this.javaScriptNode = this.audioContext.createScriptProcessor(this.audioBufferSize, 1, 2);
		this.javaScriptNode.onaudioprocess = (evt) => {
			this.onAudioUpdate(evt);
		};
		// this.javaScriptNode.eventHost = this;
	}	

	private onAudioUpdate(evt: AudioProcessingEvent): void {
		// Return if playback was stopped
		if (this.isPlaying === false) return;

		// Reference to the audio data arrays and audio buffer
		let audioData = this.audioDataRef;
		let leftBuffer = evt.outputBuffer.getChannelData(0);
		let rightBuffer = evt.outputBuffer.getChannelData(1);

		if (audioData.length == 1) { // Mono
			this.copyChannelDataToBuffer(leftBuffer, audioData[0], this.currentPlayPosition, this.audioBufferSize, this.playStart, this.playEnd);
			this.currentPlayPosition = this.copyChannelDataToBuffer(rightBuffer, audioData[0], this.currentPlayPosition, this.audioBufferSize, this.playStart, this.playEnd);
		} else if (audioData.length == 2) { // stereo
			this.copyChannelDataToBuffer(leftBuffer, audioData[0], this.currentPlayPosition, this.audioBufferSize, this.playStart, this.playEnd);
			this.currentPlayPosition = this.copyChannelDataToBuffer(rightBuffer, audioData[1], this.currentPlayPosition, this.audioBufferSize, this.playStart, this.playEnd);
		}

		// The playback is done
		if (this.currentPlayPosition === undefined) {
			this.Stop(); // Stop playing, disconnect buffer
		}
	};

	/**
	 * Copies the audio data to a channel buffer and sets the new play position. If looping is enabled,
	 * the position is set automaticly.
	 */
	private copyChannelDataToBuffer(bufferReference, dataReference, position, len, startPosition, endPosition): number {
		/* In order to enable looping, we should need to split up when the end of the audio data is reached
		 * to begin with the first position. Therefore is a split into two ranges if neccessary
		 */
		var firstSplitStart = position;
		var firstSplitEnd = (position + len > dataReference.length) ? dataReference.length : (position + len > endPosition) ? endPosition : (position + len);
		var firstSplitLen = firstSplitEnd - firstSplitStart;
		var secondSplitStart = (firstSplitLen < bufferReference.length) ? 0 : undefined;
		var secondSplitEnd = (secondSplitStart !== undefined) ? bufferReference.length - firstSplitLen + secondSplitStart : undefined;
		var secondSplitOffset = bufferReference.length - (firstSplitEnd - firstSplitStart);

		if (secondSplitStart === undefined) {
			this.copyIntoBuffer(bufferReference, 0, dataReference, firstSplitStart, firstSplitEnd);
			return firstSplitEnd;
		} else {
			this.copyIntoBuffer(bufferReference, 0, dataReference, firstSplitStart, firstSplitEnd);
			return undefined;
		}
	};

	/**
	 * copies data from an array to the buffer with fast coping methods
	 */
	private copyIntoBuffer(bufferReference, bufferOffset, dataReference, dataOffset, end): void {
		bufferReference.set(dataReference.slice(dataOffset, end), bufferOffset);
	};

	public Play(audioDataRef, sampleRate: number, start?: number, end?: number): void {
		// Check if already playing or no data was given
		if (this.isPlaying || audioDataRef === undefined || audioDataRef.length < 1 || sampleRate === undefined || sampleRate <= 0) {
			return;
		}

		// Update playback variables
		this.audioDataRef = audioDataRef;
		this.sampleRate = sampleRate;
		this.playStart = (start === undefined || start < 0 || start >= audioDataRef[0].length) ? 0 : start;
		this.playEnd = (end === undefined || end - this.audioBufferSize < start || end >= audioDataRef[0].length) ? audioDataRef[0].length : end;
		this.currentPlayPosition = this.playStart;
		this.isPlaying = true;

		this.javaScriptNode.connect(this.audioContext.destination); // Connect the node, play!
	};

	public Stop(): void {
		if (this.isPlaying === false) return; // Not playing audio, nothing to stop

		this.javaScriptNode.disconnect(this.audioContext.destination); // Diconnect the node, stop!

		// Reset all playback information to default
		this.playStart = 0;
		this.playEnd = 0;
		this.currentPlayPosition = 0;
		this.isPlaying = false;
		this.lastPlaybackUpdate = 0;

		// Remove reference to the audio data
		this.audioDataRef = undefined;
		this.sampleRate = 0;
	};
}