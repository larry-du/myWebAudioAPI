const soundBox = document.querySelector('.sound-box');
const volumeBar = document.querySelector('.volume');
const volumeText = document.querySelector('.volume-text');
const timeBar = document.querySelector('.time');
const timeText = document.querySelector('.time-text');
const detuneBar = document.querySelector('.detune');
const detuneText = document.querySelector('.detune-text');
let volumeControl = tuneVolume();
let durationTimeControl = setDurationTime();
let detuneControl = detune();
const frequency = [
    { id: "do", freq: 261.6 },
    { id: "re", freq: 293.7 },
    { id: "mi", freq: 329.6 },
    { id: "fa", freq: 349.2 },
    { id: "so", freq: 392 },
    { id: "la", freq: 440 },
    { id: "si", freq: 493.9 },
    { id: "hi-do", freq: 523.2 }
];

(function render() {
    soundBox.innerHTML = frequency.map(scale => createButton(scale)).join('');
})();

function createButton(scale) {
    return `
    <button class="sound"
    id="${scale.id}">${scale.id}</button>
    `
};

function playSound(event) {
    const index = frequency.findIndex(data => data.id === event.target.id);
    synthesizer(frequency[index].freq);
}

function tuneVolume() {
    let volume = 0;
    return {
        tune(data) {
            volume = data;
        },
        getValue() {
            return volume
        }
    }
}

function setDurationTime() {
    let playTime = 0.5;
    return {
        tune(data) {
            playTime = data;
        },
        getValue() {
            return playTime
        }
    }
}

function detune() {
    let detune = 0;
    return {
        tune(data) {
            detune = data;
        },
        getValue() {
            return detune
        }
    }
}

function synthesizer(freq) {
    const AudioContext = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = AudioContext.createOscillator();//振盪器
    const gainNode = AudioContext.createGain();//增益
    oscillator.connect(gainNode);

    oscillator.type = 'sine'; // 正弦波
    oscillator.frequency.value = freq;
    oscillator.detune.value = freq * detuneControl.getValue();// 解諧
    gainNode.gain.value = volumeControl.getValue(); // 音量

    oscillator.start();
    oscillator.stop(durationTimeControl.getValue());

    gainNode.connect(AudioContext.destination);
    oscillator.connect(AudioContext.destination);
}

frequency.forEach(sound => {
    const button = document.querySelector(`#${sound.id}`);
    button.addEventListener('click', (event) => playSound(event));
})

volumeBar.addEventListener('change', (event) => {
    volumeControl.tune(event.target.value);
    volumeText.innerText = `Volume : ${volumeControl.getValue()}`;
})

timeBar.addEventListener('change', (event) => {
    durationTimeControl.tune(event.target.value)
    timeText.innerText = `Play Time : ${durationTimeControl.getValue()}`;
})

detuneBar.addEventListener('change', (event) => {
    detuneControl.tune(event.target.value)
    detuneText.innerText = `detune : ${detuneControl.getValue()}`;
})
