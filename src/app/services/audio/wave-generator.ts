import { Utils } from './audio-utils';

export class WaveformGenerator {
	// This object represent the waveform generator

    // The generateWaveform function takes 4 parameters:
    //     - type, the type of waveform to be generated
    //     - frequency, the frequency of the waveform to be generated
    //     - amp, the maximum amplitude of the waveform to be generated
    //     - duration, the length (in seconds) of the waveform to be generated
    static GenerateWaveform(type: string, frequency: number, amp: number, duration: number, sampleRate: number = 44100) {
        var nyquistFrequency = sampleRate / 2; // Nyquist frequency
        var totalSamples = Math.floor(sampleRate * duration); // Number of samples to generate
        var result = []; // The temporary array for storing the generated samples

        return result;
    }
}