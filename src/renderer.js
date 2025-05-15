const textToBeTyped = document.getElementById('textToBeTyped');
const restartBtn = document.getElementById('restart');
const typingArea = document.getElementById('typingArea');
const chrono = document.getElementById('chrono');

let typedTextArray = [];
let startTime = null;
let intervalId = null;

console.log('render is working fine.');

typingArea.addEventListener('input', () => {
    const textArray = textToBeTyped.innerText.split(' '); //  Création d'un tableau du texte à recopier
    const typingAreaText = typingArea.value; // Récupération du text taper dans la zone de saisie
    const index = typedTextArray.length;
    const currentWord = textArray[index];

    startChrono(); // Lance le chrono des la première saisie

    // Coloration du texte taper selon si c'est correct ou non
    if (!currentWord.startsWith(typingAreaText)) {
        typingArea.style.color = 'red';
    }
    else if (currentWord.startsWith(typingAreaText)) {
        typingArea.style.color = 'black';
    }

    // Validation du mot si un espace ou un retour à la ligne ou une tabulation est détecter
    if (/\s$/.test(typingAreaText)) { // \s = n'importe quel caractère d'espacement (espace, retour à la ligne, tabulation)
        window.electronAPI.detectSpacing(typingAreaText);
        typedTextArray.push(typingArea.value.trim());

        typingArea.value = '';
        typingArea.placeholder = '';
    }

    // Si on a recopier tout text
    if (textArray.length === typedTextArray.length) {
        stopChrono();
        console.log("Test terminé.");
    }

});

// Réinitialize toute les variables pour recommencer le test
restartBtn.addEventListener('click', () =>{
    typingArea.value = '';
    console.log('restart button');
    typedTextArray = [];
    typingArea.placeholder = "Tape le texte ici…";
    resetChrono();
});

// Lancer le chrono
function startChrono() {
    if (intervalId !== null) return; // Évite de relancer le chrono

    startTime = Date.now();

    intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        let minutes = Math.floor(elapsed / 60000);
        let seconds = Math.floor((elapsed % 60000) / 1000);

        // Clamp à 59:59 max (facultatif)
        if (minutes >= 60) {
            minutes = 59;
            seconds = 59;
            clearInterval(intervalId);
            intervalId = null;
        }

        chrono.textContent =
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
};

// Remettre le chrono à 0
function resetChrono() {
    clearInterval(intervalId);
    intervalId = null;
    chrono.textContent = "00:00";
};

// Stoper le chrono
function stopChrono() {
    clearInterval(intervalId);
    intervalId = null;
}