const signedBorders = [0, 0xFF - 0x80, 0xFFFF - 0x8000, 0xFFFFFFFFF - 0x80000000];

import { BinaryReader, BinaryWriter } from '../binary-helper';
import { FueAudioSequence } from './audio-sequence';

export class FueWaveTrack {
	// This function object read and write WAV format file
	// public sampleRate: number = 0;
	public audioSequences: Array<FueAudioSequence>;
	public gain: number = 0.0;
	public channels: number = 0;
	public samplesPerChannel: number = 0;

	constructor(public sampleRate: number = 0) {
		this.audioSequences = [];
	}

	public fromAudioSequences(sequences): void {
		if (sequences.length === 0) return;

		var sampleRateCheck = sequences[0].sampleRate;
		var lengthCheck = sequences[0].data.length;

		for (var i = 1; i < sequences.length; ++i) {
			if (sequences[i].sampleRate != sampleRateCheck || sequences[i].data.length != lengthCheck) {
				throw "The input sequences must have the same length and sampling rate";
			}
		}

		this.sampleRate = sampleRateCheck;
		this.audioSequences = sequences;
	};

	public ToBlobUrlAsync(encoding, asyncMethod, host): string {
		var encodedWave = this.EncodeWaveFile();

		var blob = new Blob([encodedWave], {type: encoding});

		if (asyncMethod !== undefined) {
			var fileReader = new FileReader();
			fileReader.onloadend = function(e) {
				asyncMethod(fileReader.result, host);
			};
			fileReader.readAsDataURL(blob);
		} else {
			return window.URL.createObjectURL(blob);
		}
	};

	public DecodeWaveFile(data): void {
		var reader = new BinaryReader(data);

		var waveChunkID = reader.ReadString(4);
		var waveChunkSize = reader.ReadUInt32();
		var waveFormat = reader.ReadString(4);
		reader.GotoString("fmt ");
		var waveSubchunk1ID = reader.ReadString(4);
		var waveSubchunk1Size = reader.ReadUInt32();
		var waveAudioFormat = reader.ReadUInt16();
		var waveNumChannels = this.channels = reader.ReadUInt16();
		var waveSampleRate = this.sampleRate = reader.ReadUInt32();
		var waveByteRate = reader.ReadUInt32();
		var waveBlockAlign = reader.ReadUInt16();
		var waveBitsPerSample = reader.ReadUInt16();
		// Goto the data block, sometimes there are blocks like cue before
		reader.GotoString("data");
		var waveSubchunk2ID = reader.ReadString(4);
		var waveSubchunk2Size = reader.ReadUInt32();

		var samplesPerChannel = this.samplesPerChannel = waveSubchunk2Size / waveBlockAlign;

		// prepare channels
		var channelNames = ["Left Channel", "Right Channel"];
		for (var i = 0; i < waveNumChannels; ++i) {
			this.audioSequences.push(new FueAudioSequence(this.sampleRate));
			this.audioSequences[i].name = channelNames[i];
		}

		// fill channels
		var signBorderId = waveBitsPerSample / 8;
		var signedBorder = signedBorders[signBorderId];

		this.gain = 0.0;
		var getValue = (waveBitsPerSample == 8) ? reader.ReadUInt8 : (waveBitsPerSample == 16) ? reader.ReadInt16 : reader.ReadInt32;
		for (var i = 0; i < samplesPerChannel; ++i) {
			for (var channelId = 0; channelId < waveNumChannels; ++channelId) {
				var value = Math.min(1.0, Math.max(-1.0, getValue())); // cut off beyond the border
				// Convert into a spectrum from -1.0 to 1.0
				// Note that 8bit values are always unsigned, therefore another converting scheme is used
				var floatValue = this.convertIntToFloat(value, waveBitsPerSample, signedBorder);
				this.audioSequences[channelId].data.push(floatValue);
			}
		}

		for (var channelId = 0; channelId < waveNumChannels; ++channelId) {
			this.audioSequences[channelId].gain = this.audioSequences[channelId].GetGain();
		}
	};

	private convertIntToFloat(value, waveBitsPerSample, signedBorder) {
		return (waveBitsPerSample == 8) ? (value == 0) ? -1.0 : value / signedBorder - 1.0 : (value == 0) ? 0 : value / signedBorder;
	}

	private convertFloatToInt(value, waveBitsPerSample, signedBorder) {
		return (waveBitsPerSample == 8) ? (value + 1.0) * signedBorder : value * signedBorder;
	}

	public EncodeWaveFile(): Uint8Array {
		// prepare variables for encoding
		var waveChunkID = "RIFF";
		var waveFormat = "WAVE";
		var waveSubchunk1ID = "fmt ";
		var waveSubchunk1Size = 16;
		var waveAudioFormat = 1;
		var waveNumChannels = this.audioSequences.length;
		var waveSampleRate = this.sampleRate;
		var waveBitsPerSample = 16; // Attention! Order
		var waveByteRate = waveSampleRate * waveNumChannels * waveBitsPerSample / 8;
		var waveBlockAlign = waveNumChannels * waveBitsPerSample / 8;
		var waveBitsPerSample = 16;
		var waveSamplesPerChannel = this.audioSequences[0].data.length;
		var waveSubchunk2ID = "data";
		var waveSubchunk2Size = waveSamplesPerChannel * waveBlockAlign;
		var waveChunkSize = waveSubchunk2Size + 36; // 36 are the bytes from waveFormat till waveSubchunk2Size
		var totalSize = waveChunkSize + 8;

		// actual writing
		var writer = new BinaryWriter(totalSize);
		writer.WriteString(waveChunkID);
		writer.WriteUInt32(waveChunkSize);
		writer.WriteString(waveFormat);

		writer.WriteString(waveSubchunk1ID);
		writer.WriteUInt32(waveSubchunk1Size);
		writer.WriteUInt16(waveAudioFormat);
		writer.WriteUInt16(waveNumChannels);
		writer.WriteUInt32(waveSampleRate);
		writer.WriteUInt32(waveByteRate);
		writer.WriteUInt16(waveBlockAlign);
		writer.WriteUInt16(waveBitsPerSample);

		writer.WriteString(waveSubchunk2ID);
		writer.WriteUInt32(waveSubchunk2Size);

		var signBorderId = waveBitsPerSample / 8;
		var signedBorder = signedBorders[signBorderId];

		for(var i = 0; i < waveSamplesPerChannel; ++i) {
			for (var channelId = 0; channelId < waveNumChannels; ++channelId) {
				writer.WriteInt16(this.convertFloatToInt(this.audioSequences[channelId].data[i], waveBitsPerSample, signedBorder));
			}
		}

		return writer.data;
	}
}