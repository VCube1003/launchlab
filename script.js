const menu = document.getElementById("menu");
const levelsScreen = document.getElementById("levels");
const gameScreen = document.getElementById("gameScreen");

const angleControl = document.getElementById("angleControl");
const velocityControl = document.getElementById("velocityControl");
const heightControl = document.getElementById("heightControl");

levelsScreen.classList.add("hidden");
gameScreen.classList.add("hidden");
saveModal.classList.add("hidden");
loadModal.classList.add("hidden");
angleControl.classList.add("hidden");
velocityControl.classList.add("hidden");
heightControl.classList.add("hidden");

let numLevels = 8;
let levelCompletions = [false, false, false, false, false, false, false, false];
let bestTimes = [null, null, null, null, null, null, null, null];

const levelConfigs = [{
    targetPosition: [50, 0],
    initialVelocity: 25,
    launchAngle: 0,
    adjustableParameter: "height",
    constraintRange: [0, 50]
}, {
    targetPosition: [30, 0],
    initialHeight: 0,
    launchAngle: 30,
    adjustableParameter: "velocity",
    constraintRange: [0, 100]
}, {
    targetPosition: [50, 0],
    initialHeight: 0,
    initialVelocity: 25,
    adjustableParameter: "angle",
    constraintRange: [0, 90]
}, {
    targetPosition: [100, 0],
    initialHeight: 30,
    launchAngle: 45,
    adjustableParameter: "velocity",
    constraintRange: [0, 100]
}, 
{
    targetPosition: [100, 0],
    initialVelocity: 50,
    launchAngle: 0,
    adjustableParameter: "height",
    constraintRange: [0, 50]
}, 
{
    targetPosition: [100, 0],
    initialVelocity: 50,
    launchAngle: 0,
    adjustableParameter: "height",
    constraintRange: [0, 50]
}, 
{
    targetPosition: [100, 0],
    initialVelocity: 50,
    launchAngle: 0,
    adjustableParameter: "height",
    constraintRange: [0, 50]
}, 
{
    targetPosition: [100, 0],
    initialVelocity: 50,
    launchAngle: 0,
    adjustableParameter: "height",
    constraintRange: [0, 50]
}
];

function saveCodeTimeValidation(time){
    return /^\d+(\.\d{1,3})?$/.test(time);
}

function encode(){
    let code = "";
    for (i = 0; i < numLevels; i++){
        code += levelCompletions[i] ? "1" : "0";
    }
    for (i = 0; i < numLevels; i++){
        code += "|" + (bestTimes[i] !== null ? String(bestTimes[i]) : "null");
    }
    return code;
}

function decode(code){
    let parts = code.split("|");
    if (parts.length !== numLevels+1 || parts[0].length !== numLevels) {
        return false;
    }
    for (i = 0; i < numLevels; i++){
        if (parts[0][i] !== "0" && parts[0][i] !== "1"){
            return false;
        }
    }
    for (i = 1; i < parts.length; i++){
        if (!saveCodeTimeValidation(parts[i]) && !(parts[i] === "null")) {
            return false;
        }
    }
    for (i = 0; i < numLevels; i++){
        if (parts[0][i] === "1"){
            levelCompletions[i] = true;
        }
        else{
            levelCompletions[i] = false;
        }
    }
    for (i = 1; i < parts.length; i++){
        if (parts[i] === "null"){
            bestTimes[i - 1] = null;
        }
        else{
            bestTimes[i - 1] = Number(parts[i]);
        }
    }
    return true;
}

function copySaveCode() {
    let box = document.getElementById("saveCodeBox");
    box.select();
    document.execCommand("copy");
}

function closeSave() {
    document.getElementById("saveModal").style.display = "none";
}

function startGame() {
    menu.classList.add("hidden");
    levelsScreen.classList.remove("hidden"); 
}

function saveGame() {
    saveModal.classList.remove("hidden");

    let code = encode();

    document.getElementById("saveCodeBox").value = code;
    document.getElementById("saveModal").style.display = "flex";

    navigator.clipboard.writeText(code).catch(() => {});
}

function loadGame() {
    loadModal.classList.remove("hidden");
    document.getElementById("loadModal").style.display = "flex";
}

function confirmLoad() {
    let code = document.getElementById("loadCodeInput").value;

    if (decode(code)) {
        alert("Save loaded successfully!");
        closeLoad();
    } else {
        alert("Invalid save code.");
    }
}

function closeLoad() {
    document.getElementById("loadModal").style.display = "none";
}

function howToPlay(){
    alert("How to Play");
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
    simRunning = false;
    isSimulating = false;
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

const infoTargetPosition = document.getElementById("infoTargetPosition");
const infoStartingPosition = document.getElementById("infoStartingPosition");
const infoInitialVelocity = document.getElementById("infoInitialVelocity");
const infoLaunchAngle = document.getElementById("infoLaunchAngle");

const controlsInfo = document.getElementById("controlsInfo");
const simulationInfo = document.getElementById("simulationInfo");

const simPosition = document.getElementById("simPosition");
const simVelocity = document.getElementById("simVelocity");
const simTime = document.getElementById("simTime");

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

function setControlVisibility(adjustableParameter) {
    angleControl.classList.add("hidden");
    velocityControl.classList.add("hidden");
    heightControl.classList.add("hidden");
    if (adjustableParameter === "angle") {
        angleControl.classList.remove("hidden");
    } else if (adjustableParameter === "velocity") {
        velocityControl.classList.remove("hidden");
    } else if (adjustableParameter === "height") {
        heightControl.classList.remove("hidden");
    }
}

function updateControlsInfo() {
    const levelData = levelConfigs[currentLevel];
    const targetPos = levelData.targetPosition;
    
    // Get current values
    let currentHeight = levelData.initialHeight !== undefined ? levelData.initialHeight : 0;
    if (levelData.adjustableParameter === "height") {
        currentHeight = Number(heightSlider.value);
    }
    
    let currentVelocity = levelData.initialVelocity !== undefined ? levelData.initialVelocity : 0;
    if (levelData.adjustableParameter === "velocity") {
        currentVelocity = Number(velocitySlider.value);
    }
    
    let currentAngle = levelData.launchAngle !== undefined ? levelData.launchAngle : 0;
    if (levelData.adjustableParameter === "angle") {
        currentAngle = Number(angleSlider.value);
    }
    
    infoTargetPosition.textContent = `Target Position: (${targetPos[0]}, ${targetPos[1]})`;
    infoStartingPosition.textContent = `Starting Position: (0, ${currentHeight})`;
    infoInitialVelocity.textContent = `Initial Velocity: ${currentVelocity}`;
    infoLaunchAngle.textContent = `Angle of Launch: ${currentAngle}°`;
}

function getCurrentHeight() {
    const levelData = levelConfigs[currentLevel];
    if (levelData.adjustableParameter === "height") {
        return Number(heightSlider.value);
    }
    return Number(levelData.initialHeight || 0);
}

function getCurrentLaunchAngle() {
    const levelData = levelConfigs[currentLevel];
    if (levelData.adjustableParameter === "angle") {
        return Number(angleSlider.value);
    }
    return Number(levelData.launchAngle || 0);
}

function drawStaticScene(goal) {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scale = 7;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Clear all
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Ground
    ctx.fillStyle = "lightgreen";
    const groundHeight = 35;
    ctx.fillRect(0, canvasHeight - groundHeight, canvasWidth, groundHeight);

    // Flag at target
    const goalX = goal[0] * scale;
    const goalY = canvasHeight - groundHeight - goal[1] * scale;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(goalX, goalY);
    ctx.lineTo(goalX, goalY - 30);
    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.fillRect(goalX, goalY - 30, 15, 10);

    // Cannon base position (left side)
    const cannonX = 5;
    const cannonTopY = canvasHeight - groundHeight - getCurrentHeight() * scale;
    const angle = getCurrentLaunchAngle();

    // Draw cannon arm with rotation from horizontal
    ctx.save();
    ctx.translate(cannonX, cannonTopY);
    ctx.rotate(-angle * Math.PI / 180); // canvas y+ is down
    ctx.fillStyle = "gray";
    ctx.fillRect(0, -7, 45, 14); // cannon barrel length
    ctx.restore();

    // Draw cannon base
    ctx.fillStyle = "black";
    ctx.fillRect(cannonX - 5, cannonTopY - 10, 15, 20);
}

let activeSlider, activeDisplay, activeInput;

function applyLevelValues() {
    if (!levelConfigs[currentLevel]) return;
    const levelData = levelConfigs[currentLevel];
    setControlVisibility(levelData.adjustableParameter);

    const fixedAngle = levelData.launchAngle;
    const fixedVelocity = levelData.initialVelocity;
    const fixedHeight = levelData.initialHeight;

    if (levelData.adjustableParameter === "angle") {
        activeSlider = angleSlider;
        activeDisplay = angleValue;
        activeInput = angleInput;
    } else if (levelData.adjustableParameter === "velocity") {
        activeSlider = velocitySlider;
        activeDisplay = velocityValue;
        activeInput = velocityInput;
    } else {
        activeSlider = heightSlider;
        activeDisplay = heightValue;
        activeInput = heightInput;
    }

    const [minConstraint, maxConstraint] = levelData.constraintRange || [0, 100];
    activeSlider.min = minConstraint;
    activeSlider.max = maxConstraint;
    const defaultValue = Math.round((minConstraint + maxConstraint) / 2);
    activeSlider.value = clamp(defaultValue, minConstraint, maxConstraint);
    activeDisplay.textContent = activeSlider.value;
    activeInput.value = activeSlider.value;

    if (fixedAngle !== undefined) angleSlider.value = fixedAngle;
    if (fixedVelocity !== undefined) velocitySlider.value = fixedVelocity;
    if (fixedHeight !== undefined) heightSlider.value = fixedHeight;

    controlsInfo.classList.remove("hidden");
    simulationInfo.classList.add("hidden");
    updateControlsInfo();
    
    // Draw static canvas elements
    const goal = levelData.targetPosition;
    updateDisplay([0, levelData.initialHeight || 0], [0,0], 0, goal, []);
}

angleSlider.addEventListener("input", () => updateDisplayFromSlider(angleSlider, angleValue, angleInput));
velocitySlider.addEventListener("input", () => updateDisplayFromSlider(velocitySlider, velocityValue, velocityInput));
heightSlider.addEventListener("input", () => updateDisplayFromSlider(heightSlider, heightValue, heightInput));

angleInput.addEventListener("input", () => updateDisplayFromInput(angleInput, angleSlider, angleValue));
velocityInput.addEventListener("input", () => updateDisplayFromInput(velocityInput, velocitySlider, velocityValue));
heightInput.addEventListener("input", () => updateDisplayFromInput(heightInput, heightSlider, heightValue));

angleInput.addEventListener("input", () => {
    updateControlsInfo();
    drawStaticScene(levelConfigs[currentLevel].targetPosition);
});
velocityInput.addEventListener("input", () => {
    updateControlsInfo();
    drawStaticScene(levelConfigs[currentLevel].targetPosition);
});
heightInput.addEventListener("input", () => {
    updateControlsInfo();
    drawStaticScene(levelConfigs[currentLevel].targetPosition);
});

angleSlider.addEventListener("input", () => {
    updateControlsInfo();
    drawStaticScene(levelConfigs[currentLevel].targetPosition);
});
velocitySlider.addEventListener("input", () => {
    updateControlsInfo();
    drawStaticScene(levelConfigs[currentLevel].targetPosition);
});
heightSlider.addEventListener("input", () => {
    updateControlsInfo();
    drawStaticScene(levelConfigs[currentLevel].targetPosition);
});

document.addEventListener("DOMContentLoaded", () => {
    angleValue.textContent = angleSlider.value;
    velocityValue.textContent = velocitySlider.value;
    heightValue.textContent = heightSlider.value;
    angleInput.value = angleSlider.value;
    velocityInput.value = velocitySlider.value;
    heightInput.value = heightSlider.value;
});

let simRunning = false;
let isSimulating = false;

function updateDisplay(p, v, t, goal, trail){
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scale = 7;
    const canvasHeight = canvas.height;

    simPosition.textContent = `Position: (${p[0].toFixed(2)}, ${p[1].toFixed(2)})`;
    simVelocity.textContent = `Velocity: (${v[0].toFixed(2)}, ${v[1].toFixed(2)})`;
    simTime.textContent = `Time: ${(t / 1000).toFixed(3)}s`;

    drawStaticScene(goal);

    // Draw trail
    ctx.fillStyle = "red";
    for (let point of trail) {
        const x = point[0] * scale;
        const y = canvasHeight - point[1] * scale - 35;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    if (isSimulating) {
        const x = p[0] * scale;
        const y = canvasHeight - p[1] * scale - 35;
        ctx.beginPath();
        ctx.arc(x, y, 7.5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
    }
}

function updateButtonColor(levelNum){
    const levelBtn = document.getElementById(`l${levelNum}`);
    levelBtn.style.backgroundColor = "#c1ff72";
}

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
    isSimulating = true;

    controlsInfo.classList.add("hidden");
    simulationInfo.classList.remove("hidden");

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scale = 7; // pixels per unit
    const canvasHeight = 450;

    let trail = [];

    function loop() {
        if (!simRunning) return;

        let now = Date.now();
        let dt = now - t;
        t = now;
        elapsed += dt;

        // Add current position to trail
        trail.push([pos[0], pos[1]]);

        // physics update
        pos[0] += vel[0] * dt / 1000;
        pos[1] += vel[1] * dt / 1000;

        vel[0] += accel[0] * dt / 1000;
        vel[1] += accel[1] * dt / 1000;

        updateDisplay(pos, vel, elapsed, goal, trail);

        // ground hit
        if (pos[1] < 0) {
            simRunning = false;
            isSimulating = false;

            if (Math.hypot(pos[0] - goal[0], pos[1] - goal[1]) < 5) {
                let finalTime = (stopTimer() / 1000).toFixed(3);

                alert(`Level ${currentLevel + 1} Complete! Time: ${finalTime}s`);

                if ((!levelCompletions[currentLevel]) || (finalTime < bestTimes[currentLevel])) {
                    levelCompletions[currentLevel] = true;
                    bestTimes[currentLevel] = finalTime;
                }
                updateButtonColor(currentLevel + 1);
                backToLevels();
            } else {
                alert('Level failed - try again!');
                const adjustableParam = levelConfigs[currentLevel].adjustableParameter;
                if (adjustableParam === "angle") {
                    angleControl.classList.remove("hidden");
                } else if (adjustableParam === "velocity") {
                    velocityControl.classList.remove("hidden");
                } else if (adjustableParam === "height") {
                    heightControl.classList.remove("hidden");
                }
                controlsInfo.classList.remove("hidden");
                simulationInfo.classList.add("hidden");
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
    isSimulating = true;
    const adjustableParam = levelConfigs[currentLevel].adjustableParameter;
    if (adjustableParam === "angle") {
        angleControl.classList.add("hidden");
    } else if (adjustableParam === "velocity") {
        velocityControl.classList.add("hidden");
    } else if (adjustableParam === "height") {
        heightControl.classList.add("hidden");
    }
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