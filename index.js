const soundBox = document.querySelector('.sound-box');
const volumeBar = document.querySelector('.volume');
const volumeText = document.querySelector('.volume-text')
const timeBar = document.querySelector('.time');
const timeText = document.querySelector('.time-text')
let volume = 0;
let playTime = 0.5;
const frequency = [
    { id: "do", freq: 261.6 },
    { id: "re", freq: 293.7 },
    { id: "mi", freq: 329.6 },
    { id: "fa", freq: 349.2 },
    { id: "so", freq: 392 },
    { id: "la", freq: 440 },
    { id: "si", freq: 493.9 },
    { id: "hi-do", freq: 523.3 }
];

(function render() {
    soundBox.innerHTML = frequency.map(scale => createButton(scale)).join('')
})();

function createButton(scale) {
    return `
    <button class="sound"
    id="${scale.id}">${scale.id}</button>
    `
};

function play(event) {
    const index = frequency.findIndex(data => data.id === event.target.id);
    synthesizer(frequency[index].freq);
}

function synthesizer(freq) {
    const multiple = 2;
    const AudioContext = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = AudioContext.createOscillator();//振盪器
    const gainNode = AudioContext.createGain();//增益
    oscillator.connect(gainNode);

    oscillator.type = 'sine'; // 正弦波
    oscillator.frequency.value = freq;
    oscillator.detune.value = freq / multiple;// 解諧
    gainNode.gain.value = volume; // 音量

    oscillator.start();
    oscillator.stop(playTime);

    gainNode.connect(AudioContext.destination);
    oscillator.connect(AudioContext.destination);
}

frequency.forEach(sound => {
    const button = document.querySelector(`#${sound.id}`)
    button.addEventListener('click', (event) => play(event))
})

volumeBar.addEventListener('change', (e) => {
    volume = e.target.value
    volumeText.innerText = `Volume : ${volume}`
})
timeBar.addEventListener('change', (e) => {
    playTime = e.target.value
    timeText.innerText = `Play Time : ${playTime}`
})
