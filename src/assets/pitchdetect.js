var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

let recorder, mic, soundFile, fft, audioContext, amplitude;
const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

const keyRatio = 0.58;
const scalege= ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let currentNote = '';


function setup() {
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);
  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);
}


function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {
    if (frequency && parseFloat(pitch.results.confidence) > 0.825) {
      console.log(pitch.results.confidence);
      let midiNum = freqToMidi(frequency);
      currentNote = scalege[midiNum % 12];
      console.log(currentNote);
    }
    getPitch();
  })
}

function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext , mic.stream, modelLoaded);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


