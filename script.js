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
    levelsScreen.classList.add("hidden"); 
    gameScreen.classList.add("hidden");
}

function level(num) {
    levelsScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    currentLevel = num - 1;
    applyLevelValues();
    startTimer();
}

function backToLevels(){
    levelsScreen.classList.remove("hidden");
    gameScreen.classList.add("hidden");
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

let simRunning = false;

function physicsSimulation() {
    let accel = [0, -9.81];
    let vel = [
        Number(velocitySlider.value) * Math.cos(Number(angleSlider.value) * Math.PI / 180),
        Number(velocitySlider.value) * Math.sin(Number(angleSlider.value) * Math.PI / 180)
    ];

    let pos = [0, Number(heightSlider.value)];
    let t = Date.now();
    let elapsed = 0;

    const goal = levelConfigs[currentLevel].targetPosition;

    simRunning = true;

    function loop() {
        if (!simRunning) return;

        let now = Date.now();
        let dt = now - t;
        t = now;
        elapsed += dt;

        // physics update
        pos[0] += vel[0] * dt / 1000;
        pos[1] += vel[1] * dt / 1000;

        vel[0] += accel[0] * dt / 1000;
        vel[1] += accel[1] * dt / 1000;

        // ground hit
        if (pos[1] <= 0) {
            simRunning = false;

            if (Math.hypot(pos[0] - goal[0], pos[1] - goal[1]) < 5) {
                let finalTime = stopTimer();

                alert(`Level ${currentLevel + 1} Complete! Time: ${(finalTime / 1000).toFixed(3)}s`);

                if (!levelCompletions[currentLevel] || elapsed < bestTimes[currentLevel]) {
                    levelCompletions[currentLevel] = true;
                    bestTimes[currentLevel] = elapsed;
                }
                
                backToLevels();
            } else {
                alert('Level failed - try again!');
                resumeTimer();
            }

            return;
        }
        requestAnimationFrame(loop);
    }

    loop();
}

function launchProjectile(){
    pauseTimer();
    physicsSimulation();
}

let startTime = 0;
let elapsedTime = 0;
let timerRunning = false;
let paused = false;

function startTimer() {
    elapsedTime = 0;
    startTime = Date.now();
    timerRunning = true;
    paused = false;
}

function pauseTimer() {
    if (timerRunning && !paused) {
        elapsedTime += (Date.now() - startTime);
        paused = true;
    }
}

function resumeTimer() {
    if (paused) {
        startTime = Date.now();
        paused = false;
    }
}

function stopTimer() {
    if (!paused) {
        elapsedTime += (Date.now() - startTime);
    }
    timerRunning = false;
    return elapsedTime;
}