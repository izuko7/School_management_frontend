// Date cible du compte à rebours (Exemple : dans 45 jours)
// Tu peux changer la date comme ceci : new Date("2024-12-31T23:59:59")
const dateCible = new Date();
dateCible.setDate(dateCible.getDate() + 45); // Ajoute 45 jours à aujourd'hui

function mettreAJourCompteARebours() {
    const maintenant = new Date().getTime();
    const distance = dateCible - maintenant;

    // Calculs du temps
    const jours = Math.floor(distance / (1000 * 60 * 60 * 24));
    const heures = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secondes = Math.floor((distance % (1000 * 60)) / 1000);

    // Affichage avec un zéro initial si < 10
    document.getElementById("jours").innerText = jours < 10 ? "0" + jours : jours;
    document.getElementById("heures").innerText = heures < 10 ? "0" + heures : heures;
    document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("secondes").innerText = secondes < 10 ? "0" + secondes : secondes;

    // Si le compte à rebours est terminé
    if (distance < 0) {
        clearInterval(interval);
        document.getElementById("compteARebours").innerHTML = "<p style='font-size: 1.5rem; font-weight: 600; color: var(--vert-positif);'>Disponible maintenant !</p>";
    }
}

// Lancer la fonction immédiatement et l'exécuter toutes les secondes
mettreAJourCompteARebours();
const interval = setInterval(mettreAJourCompteARebours, 1000);

// Afficher la date du jour (comme sur le dashboard)
document.getElementById("dateJour").innerText = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });