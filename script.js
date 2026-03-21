const menu = document.getElementById("menu");
const levelsScreen = document.getElementById("levels");
const gameScreen = document.getElementById("gameScreen");

levelsScreen.classList.add("hidden");
gameScreen.classList.add("hidden");

let levelCompletions = [false, false, false, false, false, false, false, false];
let bestTimes = [null, null, null, null, null, null, null, null];

const levelConfigs = [{
    targetPosition: [50, 0],
    initialHeight: 0,
    initialVelocity: 25,
    launchAngle: 0,
    adjustableParameter: "height",
    constraintRange: [0, 100]
}, {
    targetPosition: [30, 0],
    initialHeight: 0,
    initialVelocity: 0,
    launchAngle: 30,
    adjustableParameter: "velocity",
    constraintRange: [0, 100]
}, {
    targetPosition: [50, 0],
    initialHeight: 20,
    initialVelocity: 25,
    launchAngle: 0,
    adjustableParameter: "angle",
    constraintRange: [0, 90]
}, {
    targetPosition: [100, 0],
    initialHeight: 0,
    initialVelocity: 50,
    launchAngle: 0,
    adjustableParameter: "height",
    constraintRange: [0, 100]
}, 
{
    targetPosition: [100, 0],
    initialHeight: 0,
    initialVelocity: 50,
    launchAngle: 0,
    adjustableParameter: "height",
    constraintRange: [0, 100]
}, 
{
    targetPosition: [100, 0],
    initialHeight: 0,
    initialVelocity: 50,
    launchAngle: 0,
    adjustableParameter: "height",
    constraintRange: [0, 100]
}, 
{
    targetPosition: [100, 0],
    initialHeight: 0,
    initialVelocity: 50,
    launchAngle: 0,
    adjustableParameter: "height",
    constraintRange: [0, 100]
}, 
{
    targetPosition: [100, 0],
    initialHeight: 0,
    initialVelocity: 50,
    launchAngle: 0,
    adjustableParameter: "height",
    constraintRange: [0, 100]
}
];

function startGame() {
    menu.classList.add("hidden");
    levels.classList.remove("hidden"); 
    levelsScreen.classList.remove("hidden"); 
}

function saveGame() {
    alert("Save Game");
}

function loadGame() {
    alert("Load Game")
}

function howToPlay(){
    alert("How to Play")
}

function mainMenu(){
    menu.classList.remove("hidden");
    levels.classList.add("hidden"); 
    levelsScreen.classList.add("hidden"); 
    gameScreen.classList.add("hidden");
}

function level(num) {
    levelsScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    currentLevel = num - 1;
    applyLevelValues();
}

let currentLevel = 0;

const angleSlider = document.getElementById("angleSlider");
const velocitySlider = document.getElementById("velocitySlider");
const heightSlider = document.getElementById("heightSlider");

const angleValue = document.getElementById("angleValue");
const velocityValue = document.getElementById("velocityValue");
const heightValue = document.getElementById("heightValue");

const angleInput = document.getElementById("angleInput");
const velocityInput = document.getElementById("velocityInput");
const heightInput = document.getElementById("heightInput");

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function updateDisplayFromSlider(slider, display, textInput) {
    let value = Number(slider.value);
    display.textContent = value;
    textInput.value = value;
}

function updateDisplayFromInput(textInput, slider, display) {
    let value = Number(textInput.value);
    const min = Number(textInput.min);
    const max = Number(textInput.max);
    if (Number.isNaN(value)) {
        value = Number(slider.value);
    }
    value = clamp(value, min, max);
    slider.value = value;
    display.textContent = value;
    textInput.value = value;
}

function applyLevelValues() {
    if (!levelConfigs[currentLevel]) return;
    const levelData = levelConfigs[currentLevel];
    angleSlider.value = levelData.launchAngle;
    velocitySlider.value = levelData.initialVelocity;
    heightSlider.value = levelData.initialHeight;
    updateDisplayFromSlider(angleSlider, angleValue, angleInput);
    updateDisplayFromSlider(velocitySlider, velocityValue, velocityInput);
    updateDisplayFromSlider(heightSlider, heightValue, heightInput);
}

angleSlider.addEventListener("input", () => updateDisplayFromSlider(angleSlider, angleValue, angleInput));
velocitySlider.addEventListener("input", () => updateDisplayFromSlider(velocitySlider, velocityValue, velocityInput));
heightSlider.addEventListener("input", () => updateDisplayFromSlider(heightSlider, heightValue, heightInput));

angleInput.addEventListener("input", () => updateDisplayFromInput(angleInput, angleSlider, angleValue));
velocityInput.addEventListener("input", () => updateDisplayFromInput(velocityInput, velocitySlider, velocityValue));
heightInput.addEventListener("input", () => updateDisplayFromInput(heightInput, heightSlider, heightValue));

document.addEventListener("DOMContentLoaded", () => {
    angleValue.textContent = angleSlider.value;
    velocityValue.textContent = velocitySlider.value;
    heightValue.textContent = heightSlider.value;
    angleInput.value = angleSlider.value;
    velocityInput.value = velocitySlider.value;
    heightInput.value = heightSlider.value;
});