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
    bouton.addEventListener('click', () => { const modale = document.getElementById(bouton.dataset.modale); modale.classList.add('ouverte'); });
});

document.querySelectorAll('.bouton-fermer-global').forEach(bouton => {
    bouton.addEventListener('click', (e) => {
        const modale = bouton.closest('.modale-overlay');
        modale.classList.remove('ouverte');
    });
});


// fonction afficher les classes et formulaire de création d'élève

const chargerClasse = async () => {
    const classeDonne = await fetchAuth('/classes');
    const optionsHTML = classeDonne.map((classe) => {
        return `<option value="${classe.id}">${classe.nom}</option>`
    }).join('');

    const selectElement = document.getElementById('classe_id');
    selectElement.innerHTML = optionsHTML;
};

chargerClasse();


document.getElementById('formulaireAjoutEleve').addEventListener(
    'submit', async (e) => {
        e.preventDefault();

        const champNom = document.getElementById('nom').value;
        const chamPrenom = document.getElementById('prenom').value;
        const pseudoname = document.getElementById('pseudoname').value;
        const motdepasse = document.getElementById('motdepasse').value;
        const matricule = document.getElementById('matricule').value;
        const dateNaissance = document.getElementById('date_naissance').value;
        const classeId = document.getElementById('classe_id').value;

        const students = await fetchAuth('/students');
        const pseudo = await fetchAuth('/users');
        const matriculeExiste = students.some(s => s.matricule === matricule);
        const pseudoExiste = pseudo.some(s => s.pseudoname === pseudoname);

        if(matriculeExiste) {
            afficherToast("Ce matricule est déjà utilisé !");
            return;
        }

        if(pseudoExiste) {
            afficherToast("ce pseudo est déjà utilisé !");
            return;
        }

        const body = {
            name: `${champNom} ${chamPrenom}`,
            role: 'etudiant',
            pseudoname: pseudoname,
            motdepasse: motdepasse,
        }

        const nouvelUserEleve = await fetchAuth('/users', 'POST', body)

        const bodyStudent = {
            matricule: matricule,
            nom: champNom,
            prenom: chamPrenom,
            date_naissance: dateNaissance,
            classe_id: classeId,
            user_id: nouvelUserEleve.result.lastInsertRowid
        }

        const eleveCree = await fetchAuth('/students', 'POST', bodyStudent);

        e.target.reset();
        document.getElementById('modaleAjoutEleve').classList.remove('ouverte');
        chargerTousLesEleves();
    }
)

const chargerTousLesEleves = async () => {
    const students = await fetchAuth('/students');
    const classes = await fetchAuth('/classes');

    document.getElementById('nombreEleves').textContent = students.length;

    const lignesHTML = students.map((student) => {
        const classe = classes.find(c => c.id === student.classe_id);
        const nomClasse = classe ? classe.nom : "Non assignée";

        return `
            <tr>
                <td>${student.nom} ${student.prenom}</td>
                <td>${student.matricule}</td>
                <td>${nomClasse}</td>
                <td>${student.date_naissance}</td>
                <td>
                    <button class="bouton-action bouton-modifier" data-id="${student.id}">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="bouton-action bouton-supprimer" data-id="${student.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    const tbody = document.getElementById('corpsTableauEleves');
    tbody.innerHTML = lignesHTML;
}

chargerTousLesEleves();

let idEleveASupprimer = null;

document.getElementById('corpsTableauEleves').addEventListener(
    'click', (e) => {
        const bouton = e.target.closest('.bouton-supprimer');
        if(!bouton) return;

        idEleveASupprimer = bouton.dataset.id;
        document.getElementById('modaleConfirmationSuppression').classList.add('ouverte');

    }
);

document.getElementById('confirmerSuppression').addEventListener('click', async () => {
    try {
        await fetchAuth(`/students/${idEleveASupprimer}`, 'DELETE');

        document.getElementById('modaleConfirmationSuppression').classList.remove('ouverte');
        afficherToast("Elève supprimé avec succès");
        chargerTousLesEleves();
    } catch (error) {
        afficherToast(`Erreur lors de la suppression de l'elève`);
    }
});