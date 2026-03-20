levels.classList.add("hidden");
levelone.classList.add("hidden");
leveltwo.classList.add("hidden");
levelthree.classList.add("hidden");
levelfour.classList.add("hidden");
levelfive.classList.add("hidden");
levelsix.classList.add("hidden");
levelseven.classList.add("hidden");
leveleight.classList.add("hidden");

levelCompletions = [false, false, false, false, false, false, false, false];
bestTimes = [null, null, null, null, null, null, null, null];

function startGame() {
    menu.classList.add("hidden");
    levels.classList.remove("hidden"); 
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
}

function level(num) {
    levels.classList.add("hidden");
    switch(num){
        case 1:
        levelone.classList.remove("hidden"); 
        break;

        case 2:
        leveltwo.classList.remove("hidden"); 
        break;

        case 3:
        levelthree.classList.remove("hidden"); 
        break;

        case 4:
        levelfour.classList.remove("hidden");
        break;

        case 5:
        levelfive.classList.remove("hidden"); 
        break;

        case 6:
        levelsix.classList.remove("hidden"); 
        break;

        case 7:
        levelseven.classList.remove("hidden"); 
        break;

        case 8:
        leveleight.classList.remove("hidden"); 
        break;
    }
}