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


// Menu burger 
const boutonBurger = document.getElementById('boutonBurger');
const boutonFermerSidebar = document.getElementById('boutonFermerSidebar');
const sidebar = document.getElementById('sidebar');

boutonBurger.addEventListener('click', () => {
    sidebar.classList.add('ouvert');
});

boutonFermerSidebar.addEventListener('click', () => {
    sidebar.classList.remove('ouvert');
});

document.querySelectorAll('.sidebar .nav-item').forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('ouvert');
    });
});


// modaux 

const boutonsOuvrir = document.querySelectorAll('[data-modale]');
boutonsOuvrir.forEach((bouton) => {
    bouton.addEventListener('click', () => { const modale = document.getElementById(bouton.dataset.modale); modale.classList.add('ouverte'); });
});

document.querySelectorAll('.bouton-fermer-global').forEach(bouton => {
    bouton.addEventListener('click', (e) => {
        const modale = bouton.closest('.modale-overlay');
        modale.classList.remove('ouverte');
    });
});


// afficher tous les enseignants

const chargerToutLesEnseignants = async () => {
    const enseignants = await fetchAuth('/teachers');

    document.getElementById('nombreEnseignants').textContent = enseignants.length;

    const lignesHTML = enseignants.map((enseignant) => {
        return `
            <tr>
                <td>${enseignant.matricule}</td>
                <td>${enseignant.nom} ${enseignant.prenom}</td>
                <td>
                    <button class="bouton-action bouton-modifier" data-id="${enseignant.id}">
                    <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="bouton-action bouton-supprimer" data-id="${enseignant.id}">
                        <i class="fa-solid fa-trash"></i>                     
                    </button>               
                </td>
            </tr>
        `;
    }).join('');

    const tbody = document.getElementById('corpsTableauEnseignants');
    tbody.innerHTML = lignesHTML;
}

chargerToutLesEnseignants();


// bouton supprimer 
let idEnseignantASupprimer = null;

document.getElementById('corpsTableauEnseignants').addEventListener(
    'click', (e) => {
        const bouton = e.target.closest('.bouton-supprimer');
        if(!bouton) return;

        idEnseignantASupprimer = bouton.dataset.id;
        document.getElementById('modaleConfirmationSuppression').classList.add('ouverte');
    }
);

document.getElementById('confirmerSuppression').addEventListener('click', async () => {
    try {
        await fetchAuth(`/teachers/${idEnseignantASupprimer}`, 'DELETE');

        document.getElementById('modaleConfirmationSuppression').classList.remove('ouverte');
        afficherToast("Enseignant supprimé avec succès");
        chargerToutLesEnseignants();
    } catch (error) {
        afficherToast(`Erreur lors de la suppression de l'enseignant`);
    }
});


// ouverture modale "Ajouter" -> champs requis

document.getElementById('boutonOuvrirModaleEnseignant').addEventListener(
    'click', ()=> {
        document.getElementById('pseudoname').required = true;
        document.getElementById('motdepasse').required = true;
    }
)


// clic bouton modifier -> pré-remplissage

let idAModifier = null;
let userEnEditon = null;

document.getElementById('corpsTableauEnseignants').addEventListener('click', async (e) => {
    const boutonModifer = e.target.closest('.bouton-modifier');
    if(!boutonModifer) return;

    const id = boutonModifer.dataset.id;

    const teacher = await fetchAuth(`/teachers/${id}`);
    const user = await fetchAuth(`/users/${teacher.user_id}`);

    idAModifier = teacher.id;
    userEnEditon = teacher.user_id;

    document.getElementById('nom').value = teacher.nom;
    document.getElementById('prenom').value = teacher.prenom;
    document.getElementById('pseudoname').value = user.pseudoname;
    document.getElementById('matricule').value = teacher.matricule;
    document.getElementById('modaleAjoutEnseignant').classList.add('ouverte');

    document.getElementById('pseudoname').required = false;
    document.getElementById('motdepasse').required = false;
});


// soumission du formulaire (création OU modification)

document.getElementById('formulaireAjoutEnseignant').addEventListener('submit', async (e) => {
    e.preventDefault();

    const idEnEdition = idAModifier;

    const champNom = document.getElementById('nom').value;
    const chamPrenom = document.getElementById('prenom').value;
    const pseudoname = document.getElementById('pseudoname').value;
    const motdepasse = document.getElementById('motdepasse').value;
    const matricule = document.getElementById('matricule').value;

    if(idEnEdition) {
        const bodyTeacher = {
            matricule: matricule,
            nom: champNom,
            prenom: chamPrenom,
        };

        await fetchAuth(`/teachers/${idAModifier}`, 'PUT', bodyTeacher);

        const bodyUser = {
            pseudoname: pseudoname
        };

        if(motdepasse){
            bodyUser.motdepasse = motdepasse;
        }

        await fetchAuth(`/users/${userEnEditon}`, 'PUT', bodyUser);

        afficherToast('Enseignant modifié avec succès')

    } else {
        const teacher = await fetchAuth('/teachers');
        const pseudo = await fetchAuth('/users');
        const matriculeExiste = teacher.some(s => s.matricule === matricule);
        const pseudoExiste = pseudo.some(s => s.pseudoname === pseudoname);

        if(matriculeExiste){
            afficherToast('Ce matricule est déjà utilisé');
            return;
        }

        if(pseudoExiste){
            afficherToast('Ce pseudonyme est déjà utilisé');
            return;
        }

        const body = {
            name: `${champNom} ${chamPrenom}`,
            role: 'prof',
            pseudoname: pseudoname,
            motdepasse: motdepasse,
        }

        const nouvelUserTeacher = await fetchAuth('/users', 'POST', body);

        const bodyTeacher = {
            matricule: matricule,
            nom: champNom,
            prenom: chamPrenom,
            user_id: nouvelUserTeacher.result.lastInsertRowid
        }

        await fetchAuth('/teachers', 'POST', bodyTeacher);
        afficherToast('Enseignant créé avec succès');
    }

    e.target.reset();
    idAModifier = null;
    userEnEditon = null;
    document.getElementById('modaleAjoutEnseignant').classList.remove('ouverte');
    chargerToutLesEnseignants();
});