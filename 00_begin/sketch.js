'use strict';




var fft;
let fft2;
var mic;
var bands = 1024; // resolution of the FFT
var spectrum, spectrum2;
var terrain = [];
var terrain2 = [];
let zoom = 2;
let peak = 80;

let notes = [
  ["A7", "F6", "G6"],
  ["E6", "D6", "E5"],
  ["D5", "F#5", "A5"],
  ["G4", "B5", "D5"],
  ["E6", "G4", "B6"],
  ["C7", "D7", "E7"],
  ["F7", "G7", "A5"]
];

let keynotes = [
  ["C4", "D4", "E4"],
  ["F3", "G3", "A3"],
  ["A4", "C4", "E4"],
  ["B2", "D3", "F#4"],
  ["C3", "E3", "G3"],
  ["F3", "A3", "C3"],
  ["A3", "C3", "E3"],
  ["B3", "D3", "F#2"]
];


var lines = 1;
let duration;
let durationk;
let trigger;
var synth;
let synthkey;
let px = 0;
let notecounter = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);

  fft = new p5.FFT(0.85, bands);
  fft2 = new p5.FFT(0.85, bands);
  // create audion in
  mic = new p5.AudioIn();




  //// start the Audio Input
  mic.start();
  synth = new p5.PolySynth();
  synthkey = new p5.PolySynth();
   // synth.AudioVoice = 16;

  fft.setInput(synth);
  fft2.setInput(synthkey);


  for (let y = 0; y <=lines; y++) {
    terrain[y] = [];
    for (let x = 0; x <= bands; x++) {
      terrain[y][x] = 0;
    }
  }

  for (let y = 0; y <= lines; y++) {
    terrain2[y] = [];
    for (let x = 0; x <= bands; x++) {
      terrain2[y][x] = 0;
    }
  }

}

function draw() {
  background(0 );
  fill(frameCount % 300, 100, 200);
  translate(-width/2,height/2,50);
  var c = color(frameCount % 300, 100, 200);
  stroke(c);

  // translate(-width / 2, 30,0);
  //  rotateX(radians(-60));
 zoom = map(0,mouseY, 0, height, 70);
  // translate(10, 10);
  // rotateZ(radians(rotZ));
  // -translate(0, -600);
  spectrum = fft.analyze();
  spectrum2 = fft2.analyze();

  for (let y = 0; y < terrain2.length; y++) {
    beginShape();
    vertex(10, ((height / lines) * y + 70));
    vertex(30, ((height / lines) * y + 70));
    for (let x = 0; x < spectrum2.length; x++) {
      vertex(map(x, 0, bands / zoom, 20, width*2), (map(terrain2[y][x], 0, 255, 0, -peak)) + ((height / lines) * y + 70));
    }
    vertex(0, ((height / lines) * y + 70));
    endShape();


  }


  for (let y = 0; y < terrain.length; y++) {
    beginShape();
    vertex(10, ((height / lines) * y + 70));
    vertex(10, ((height / lines) * y + 70));
    for (let x = 0; x < spectrum.length; x++) {

      vertex(map(x, 0, bands / zoom, width / 2, width), (map(terrain[y][x], 0, 255, 0, -peak)) + ((height / lines) * y + 70));
    }
    vertex(width / 2, ((height / lines) * y + 70))
    endShape();
  }


  // for (let y = 0; y < terrain.length; y++) {
  for (let y = lines - 1; y >= 0; y--) {
    //for (var i = 0; i < bands; i++) {
    terrain2[0] = spectrum2;
    if (y > 0) {
      if (y < lines) {
        terrain2[y] = terrain2[y - 1];
      }
    }
  }

  for (let y = lines - 1; y >= 0; y--) {
    //for (var i = 0; i < bands; i++) {
    terrain[0] = spectrum;
    if (y > 0) {
      if (y < lines) {
        terrain[y] = terrain[y - 1];
      }
    }
  }
}

function keyPressed() {
  chooseKeyNote();
}

function keyReleased() {
  synthkey.noteRelease();
}

function mousePressed() {
  chooseNote();
}

function mouseReleased() {
  synth.noteRelease();
}

function chooseNote() {
  // synth.noteRelease();
  let chordPicker = floor(random(notes.length));
  // console.log(chordPicker);
  duration = random(0.2, 1.0);

  for (let i = 0; i < 3; i++) {
    synth.noteAttack(notes[chordPicker][i], i * 0.8, 0, duration);
  }
}

function chooseKeyNote() {
  // synth.noteRelease();
  let chordPicker2 = floor(random(keynotes.length));
  // console.log(chordPicker2);
  durationk = random(0.2, 1.0);

  for (let i = 0; i < 3; i++) {
    synthkey.noteAttack(keynotes[chordPicker2][i], i * 0.2, 0, durationk);
  }
}
