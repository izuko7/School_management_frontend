// vérification du token de l'enseignant 
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'prof') {
    window.location.href = '/login';
}

// toast 
const afficherToast = (message, type = 'succes') => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast afficher ${type}`;

    setTimeout(() => {
        toast.classList.remove('afficher');
    }, 3000);
};

const fetchAuth = async (url, method = 'GET', body = null) => {

    const options = {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    const reponse = await fetch(url, options);

    if (reponse.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
        throw new Error("Token expiré");
    }

    return reponse.json();
};


const logOut = document.getElementById('boutonDeconnexion');
logOut.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/accueil'
})

const boutonBurger = document.getElementById('boutonBurger');
const boutonFermerSidebar = document.getElementById('boutonFermerSidebar');
const sidebar = document.querySelector('.sidebar');

boutonBurger.addEventListener('click', function () {
    sidebar.classList.add('ouvert');
});

boutonFermerSidebar.addEventListener('click', function () {
    sidebar.classList.remove('ouvert');
});

function decoderToken(token) {
    const playLoad = token.split('.')[1];
    const decoded = JSON.parse(atob(playLoad));
    return decoded;
}

const utilisateur = decoderToken(token);

const donneUsers = async () => {
    const users = await fetchAuth(`/users/${utilisateur.id}`);

    let initial;
    const mot = users.name.split(' ');

    if (mot.length >= 2) {
        initial = `${mot[0][0]}${mot[1][0]}`
    } else {
        initial = mot[0].substring(0, 2).toUpperCase();
    }

    const profilNom = document.getElementById('profilNom');
    const profilRole = document.getElementById('profilRole');
    const profilInitial = document.getElementById('profilAvatar');

    profilNom.textContent = users.name;
    profilRole.textContent = users.role;
    profilInitial.textContent = initial;
}

donneUsers();

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