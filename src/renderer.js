const body = document.getElementsByTagName('body');
const textToBeTyped = document.getElementById('textToBeTyped');     
const restartBtn = document.getElementById('restart');
const typingArea = document.getElementById('typingArea');
const chrono = document.getElementById('chrono');
const importBtn = document.getElementById('importer');


const testText = "Ce texte sert à tester certaines fonctionnalités de l'application Keyboard Master. Vous pouvez le changer en important un nouveau texte à partir d'un fichier au format .txt.";

let typedTextArray = [];    // Utiliser pour compter les mots tapé correctement
let wrongTypedText = [];    // Utiliser pour compter les mots mal tapé

// Variables pour le chrono
let startTime = null;
let intervalId = null;
let minutes;      // Utiliser après pour le calcul des scores
let seconds;

console.log('Render is working fine.');

textToBeTyped.innerText = testText;     // Affichage tu texte de test dans la zone de recopie

typingArea.addEventListener('input', () => {
    const textArray = textToBeTyped.innerText.split(' '); //  Création d'un tableau du texte à recopier
    const typingAreaText = typingArea.value; // Récupération du text taper dans la zone de saisie
    const index = typedTextArray.length + wrongTypedText.length;
    const currentWord = textArray[index];

    if (typedTextArray.length + wrongTypedText.length === 0) startChrono(); // Lance le chrono des la première saisie

    // Coloration du texte taper selon si c'est correct ou non
    if (!currentWord.startsWith(typingAreaText) && typingAreaText !=='') {
        typingArea.style.color = 'red';
    }
    else if (currentWord.startsWith(typingAreaText)) {
        typingArea.style.color = 'black';
    }

    // Validation du mot si un espace ou un retour à la ligne ou une tabulation est détecter
    if (/\s$/.test(typingAreaText)) { // \s = n'importe quel caractère d'espacement (espace, retour à la ligne, tabulation)
        const wordTyped = typingAreaText.trim();  // Mot tapé sans espace

        if (currentWord === wordTyped) { // 'black' en valeur RGB
            typedTextArray.push(typingArea.value.trim());
        } else {
            wrongTypedText.push(typingArea.value.trim());
        }
                
        typingArea.value = '';
        typingArea.placeholder = '';
    }

    // Si on a recopier tout le texte
    if (textArray.length === typedTextArray.length + wrongTypedText.length) {
        stopChrono();
        afficherScore();
        typedTextArray.forEach(word => {
            console.log(word);
        })
    }

});

// Réinitialize toute les variables pour recommencer le test
restartBtn.addEventListener('click', () =>{
    const score = document.getElementById('score');
    const column1 = document.getElementById('column1');
    const column2 = document.getElementById('column2');

    typingArea.value = '';
    console.log('restart button');
    typedTextArray = [];
    wrongTypedText = [];
    typingArea.placeholder = "Tape le texte ici…";
    resetChrono();
    score.style.visibility = "hidden";
    column1.style.visibility = "hidden";
    column2.style.visibility = "hidden";
});

// Lancer le chrono
function startChrono() {
    if (intervalId !== null) return; // Évite de relancer le chrono

    startTime = Date.now();

    intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        minutes = Math.floor(elapsed / 60000);
        seconds = Math.floor((elapsed % 60000) / 1000);

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
};

importBtn.addEventListener('click', async () => {
    const newText = await window.electronAPI.importText();  // Chargement du texte à importer en
    const cleanText = newText.replace(/\n/gm, " ");   // Suppression des saut de lignes et retour à la ligne
    const score = document.getElementById('score');
    const column1 = document.getElementById('column1');
    const column2 = document.getElementById('column2');
    
    if (newText.length > 0) {
        textToBeTyped.innerText = cleanText; // Affichage dans la zone de texte à recopier
        typedTextArray = [];
        wrongTypedText = [];
    } else {
        textToBeTyped.innerText = testText;
        typedTextArray = [];
        wrongTypedText = [];
        alert("Importation échoué.")
    }

    score.style.visibility = "hidden";
    column1.style.visibility = "hidden";
    column2.style.visibility = "hidden";

});

function afficherScore() {
    const score = document.getElementById('score');
    
    let nbCaractere = 0;
    typedTextArray.forEach(word => {
        nbCaractere += word.length;     // Comptage du nombre de caractère totale tapé
    })

    if (score === null) {
        let p = document.createElement('p');    // Création d'un tag p pour afficher les statistiques du l'utilisateur
        p.id = "score";
    
        p.innerText = "Nombre de mots correctement tapé : " + typedTextArray.length
        + "\n" + "Nombre de mot moyen que ça représente : " + Math.round(nbCaractere / 5)
        + "\n" + "Nombre de mot(s) mal tapé : " + wrongTypedText.length
        + "\n" + "Vitesse de frappe en mot par minute (MPM) : "  + Math.round((nbCaractere / 5) * (60 / (minutes * 60 + seconds)))
        + "\n" + "Temps moyen par mot : " + Math.round(((minutes * 60 + seconds) / (nbCaractere / 5)) * 1000) / 1000 + "s";
        document.body.appendChild(p);

        // Conteneur pour deux colonnes
        let row = document.createElement('div');
        row.className = "row";

        let text = "Ici on va affichier les mots";

        // Colonne 1
        let column1 = document.createElement('div');
        column1.className = "column";
        column1.id = "column1";
        p = document.createElement('p');
        p.innerText = "Mots correctement tapés :\n" + typedTextArray.join(', ');
        column1.appendChild(p);
        row.appendChild(column1);

        // Colonne 2
        let column2 = document.createElement('div');
        column2.className = "column";
        column2.id = "column2";
        p = document.createElement('p');
        p.innerText = "Erreurs de frappes :\n" + wrongTypedText.join(', ');
        column2.appendChild(p);
        row.appendChild(column2);

        document.body.appendChild(row);

    } else {
        score.innerText = "Nombre de mots correctement tapé : " + typedTextArray.length
        + "\n" + "Nombre de mot moyen que ça représente : " + Math.round(nbCaractere / 5)
        + "\n" + "Nombre de mot(s) mal tapé : " + wrongTypedText.length
        + "\n" + "Vitesse de frappe en mot par minute (MPM) : "  + Math.round((nbCaractere / 5) * (60 / (minutes * 60 + seconds)))
        + "\n" + "Temps moyen par mot : " + Math.round(((minutes * 60 + seconds) / (nbCaractere / 5)) * 1000) / 1000 + "s";

        score.style.visibility = "visible";

        // Modification de la première colonne
        let column1 = document.getElementById('column1');
        let p = column1.firstChild;
        p.innerText = "Mots correctement tapés :\n" + typedTextArray.join(', ');
        column1.style.visibility = "visible";

        // Modification de la deuxième colonne
        let column2 = document.getElementById('column2');
        p = column2.firstChild;
        p.innerText = "Erreurs de frappes :\n" + wrongTypedText.join(', ');
        column2.style.visibility = "visible";
    }
}