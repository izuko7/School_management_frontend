// Vérification d'accès admin (de base)
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'admin') {
    window.location.href = '/login';
}

// toast 
const afficherToast = (message) => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
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


// boutton de déconnexion 
const logOut = document.getElementById('boutonDeconnexion');
logOut.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/accueil'
})

// donnée utilisateur 
function decoderToken(token) {
    const playLoad = token.split('.')[1];
    const decoded = JSON.parse(atob(playLoad));
    return decoded;
}

const utilisateur = decoderToken(token);

const donneUsers = async () => {
    // Encore plus clean !
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


// Menu burgur 
// Gestion du menu Burger (Sidebar mobile)
const boutonBurger = document.getElementById('boutonBurger');
const boutonFermerSidebar = document.getElementById('boutonFermerSidebar');
const sidebar = document.getElementById('sidebar');

// Ouvrir avec le burger
boutonBurger.addEventListener('click', () => {
    sidebar.classList.add('ouvert');
});

// Fermer avec la croix
boutonFermerSidebar.addEventListener('click', () => {
    sidebar.classList.remove('ouvert');
});

// Fermer le menu si on clique sur un lien à l'intérieur
document.querySelectorAll('.sidebar .nav-item').forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('ouvert');
    });
});


// modaux 
const boutonsOuvrir = document.querySelectorAll('[data-modale]');
boutonsOuvrir.forEach((bouton) => {
    bouton.addEventListener('click', () => { 
        const modale = document.getElementById(bouton.dataset.modale); 
        modale.classList.add('ouverte'); 
    });
});

document.querySelectorAll('.bouton-fermer-global').forEach(bouton => {
    bouton.addEventListener('click', (e) => {
        const modale = bouton.closest('.modale-overlay');
        modale.classList.remove('ouverte');
    });
});


// fonction charger classes 
const chargerTouteLesClasses = async () => {
    const classes = await fetchAuth('/classes');

    document.getElementById('nombreClasses').textContent = classes.length;

    const lignesHTML = classes.map((classe) =>{
         return `
            <tr>
                <td>${classe.nom}</td>
                <td>${classe.niveau}</td>
                <td>${classe.capacite}</td>
                <td>
                    <button class="bouton-action bouton-modifier" data-id="${classe.id}">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="bouton-action bouton-supprimer" data-id="${classe.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    const tbody = document.getElementById('corpsTableauClasses');
    tbody.innerHTML = lignesHTML;

}

chargerTouteLesClasses();

// boutton supprimer 
let idClasseASupprimer = null;

document.getElementById('corpsTableauClasses').addEventListener(
    'click', (e)=> {
        const bouton = e.target.closest('.bouton-supprimer');
        if(!bouton) return;

        idClasseASupprimer = bouton.dataset.id;
        document.getElementById('modaleConfirmationSuppression').classList.add('ouverte');
    }
);

document.getElementById('confirmerSuppression').addEventListener('click', async () => {
    try {
        await fetchAuth(`/classes/${idClasseASupprimer}`, 'DELETE');

        document.getElementById('modaleConfirmationSuppression').classList.remove('ouverte');
        afficherToast('Classe supprimé avec succès');
        chargerTouteLesClasses();
    } catch (error) {
        afficherToast('Erreur lores de la suppression de la classes');
    }
});

// clic boutton modifier pré-remplissage 
let idAEditer = null;

document.getElementById('corpsTableauClasses').addEventListener('click', async (e) => {
    const boutonModifer = e.target.closest('.bouton-modifier');
    if(!boutonModifer) return;

    const id = boutonModifer.dataset.id;

    const classes = await fetchAuth(`/classes/${id}`);

    idAEditer = classes.id;

    document.getElementById('nom_classe').value = classes.nom;
    document.getElementById('niveau').value = classes.niveau;
    document.getElementById('capacite').value = classes.capacite;
    document.getElementById('modaleAjoutClasse').classList.add('ouverte');
});

// soumission du formulaire (création OU modification)

document.getElementById('formulaireAjoutClasse').addEventListener('submit', async (e) => {
    e.preventDefault();

    const idEnEdition = idAEditer;

    const champNomClasse = document.getElementById('nom_classe').value;
    const champNiveau = document.getElementById('niveau').value;
    const champCapacite = document.getElementById('capacite').value;

    if (idEnEdition) {
        const bodyClasse = {
            nom: champNomClasse,
            niveau: champNiveau,
            capacite: champCapacite,
        };

        await fetchAuth(`/classes/${idEnEdition}`, 'PUT', bodyClasse);
        afficherToast('Classe modifiée avec succès');
    } else {
        const classes = await fetchAuth('/classes');
        const nomClasseExiste = classes.some(s => s.nom === champNomClasse);

        if (nomClasseExiste) {
            afficherToast('Cette classe existe déjà !');
            return;
        }

        const bodyClasse = {
            nom: champNomClasse,
            niveau: champNiveau,
            capacite: champCapacite,
        };

        await fetchAuth('/classes', 'POST', bodyClasse);
        afficherToast('Classe créée avec succès');
    }

    e.target.reset();
    idAEditer = null;
    document.getElementById('modaleAjoutClasse').classList.remove('ouverte');
    chargerTouteLesClasses();
});