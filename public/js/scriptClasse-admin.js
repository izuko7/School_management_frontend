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
        // Réinitialiser le formulaire si on ferme la modale d'ajout/édition
        if (modale.id === 'modaleAjoutClasse') {
            resetFormClasse();
        }
    });
});


// ajouter une classe 
document.getElementById('formulaireAjoutClasse').addEventListener(
    'submit', async (e) => {
        e.preventDefault();

        const champNomClasse = document.getElementById('nom_classe').value;
        const champNiveau = document.getElementById('niveau').value;
        const champCapacite = document.getElementById('capacite').value;

        const classes = await fetchAuth('/classes');
        const classeExiste = classes.some(c => c.nom === champNomClasse);

        if(classeExiste){
            afficherToast('Cette classe existe déjà !');
            return;
        }

        const bodyClasse = {
            nom: `${champNomClasse}`,
            niveau: `${champNiveau}`,
            capacite: `${champCapacite}`
        }

        const nouvelleClasse = await fetchAuth('/classes', 'POST', bodyClasse);
        
        e.target.reset();
        document.getElementById('modaleAjoutClasse').classList.remove('ouverte');
        chargerTouteLesClasses();
    }
)


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

