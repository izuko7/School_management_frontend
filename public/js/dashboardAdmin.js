// Vérification d'accès admin (de base)
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'admin') {
    window.location.href = '/login';
}

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


// Plus besoin de réécrire les headers, ni le check 401 !
const chargerUneStat = async (url, idElement) => {
    const students = await fetchAuth(url);
    const statStudents = document.getElementById(idElement);
    statStudents.textContent = students.length;
}

chargerUneStat('/students', 'stat-chiffre-etudiant');
chargerUneStat('/teachers', 'stat-chiffre-prof');
chargerUneStat('/classes', 'stat-chiffre-classe');


const chargerElevesRecents = async () => {
    // Super clean !
    const students = await fetchAuth('/students/recents');
    const classes = await fetchAuth('/classes');

    const lignesHTML = students.map((student) => {
        const classe = classes.find(c => c.id === student.classe_id);
        const nomClasse = classe ? classe.nom : "Non assignée";

        return `
            <tr>
                <td>${student.nom} ${student.prenom}</td>
                <td>${nomClasse}</td>
                <td>${student.matricule}</td>
                <td><span class="badge badge-actif">Actif</span></td>
                <td><button class="bouton-action"><i class="fa-solid fa-ellipsis"></i></button></td>
            </tr>
        `;
    }).join('');

    const tbody = document.querySelector('.tableau-eleves tbody');
    tbody.innerHTML = lignesHTML;
};

chargerElevesRecents();

// fonction activité 
const iconesParType = {
    inscription_etudiant: { classe: 'icone-indigo', icone: 'fa-user-graduate' },
    inscription_professeur: { classe: 'icone-violet', icone: 'fa-chalkboard-user' },
    matiere: { classe: 'icone-bleu', icone: 'fa-book' },
    note: { classe: 'icone-jaune', icone: 'fa-file-lines' },
    absence: { classe: 'icone-rose', icone: 'fa-calendar-check' }
};

const iconeParDefaut = { classe: 'icone-gris', icone: 'fa-circle-info' };

const chargerActivite = async () => {
    const activites = await fetchAuth('/activites');

    const listeHTML = activites.map((activite) => {
        const infosIcone = iconesParType[activite.type] || iconeParDefaut;

        return `
            <li>
                <span class="icone-activite ${infosIcone.classe}"><i class="fa-solid ${infosIcone.icone}"></i></span>
                <span class="activite-texte">${activite.message}</span>
                <span class="activite-temps">${activite.date_creation}</span>
            </li>
        `;
    }).join('');

    const listeElement = document.querySelector('.liste-activite');
    if (listeElement) {
        listeElement.innerHTML = listeHTML;
    }
};

chargerActivite();


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

    const profilNom = document.getElementById('spanprofilNom');
    const profilRole = document.getElementById('spanprofilRole');
    const profilInitial = document.getElementById('profilAvatar');
    const messageBienvenue = document.getElementById('bienvenue-name');

    profilNom.textContent = users.name;
    profilRole.textContent = users.role;
    profilInitial.textContent = initial;
    messageBienvenue.textContent = `Bonjour, ${users.name} ! `
}

donneUsers();



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

// --------------------------------------- 

const chargerClasse = async () => {

    const classesDonne = await fetchAuth('/classes');

    const optionsHTML = classesDonne.map((classes) => {
        return `<option value="${classes.id}">${classes.nom}</option>`
    }).join('');

    const selectElement = document.getElementById('classe_id');
    selectElement.innerHTML = optionsHTML;

};

chargerClasse();

// ajouter un eleve 

document.getElementById('formulaireAjoutEleve').addEventListener(
    'submit', async (e) => {

        e.preventDefault();

        const champNom = document.getElementById('nom').value;
        const chamPrenom = document.getElementById('prenom').value;
        const pseudonyme = document.getElementById('pseudoname').value;
        const matricule = document.getElementById('matricule').value;
        const dateNaissance = document.getElementById('date_naissance').value;
        const classeId = document.getElementById('classe_id').value;
        const motDePasse = document.getElementById('motdepasse').value;
        const students = await fetchAuth('/students');
        const pseudo = await fetchAuth('/users');
        const matriculeExiste = students.some(s => s.matricule === matricule);
        const pseudoExiste = pseudo.some(s => s.pseudoname === pseudonyme);

        if (matriculeExiste) {
            afficherToast("Ce matricule est déjà utilisé !");
            return;
        }

        if (pseudoExiste) {
            afficherToast("Ce pseudonyme est déjà utilisé !");
            return;
        }

        const body = {
            name: `${champNom} ${chamPrenom}`,
            role: 'etudiant',
            pseudoname: pseudonyme,
            motdepasse: motDePasse,

        }

        const nouvelUserEleve = await fetchAuth('/users', 'POST', body)

        console.log(nouvelUserEleve);

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

        chargerUneStat('/students', 'stat-chiffre-etudiant');

        chargerElevesRecents();

    }
);


// ajouter un enseignant 

document.getElementById('formulaireAjoutEnseignant').addEventListener(
    'submit', async(e) => {

        e.preventDefault();

        const champMatricule = document.getElementById('ens_matricule').value;
        const champNomprof = document.getElementById('ens_nom').value;
        const champPrenomprof = document.getElementById('ens_prenom').value;
        const pseudony = document.getElementById('ens_pseudoname').value;
        const motDePasse = document.getElementById('ens_motdepasse').value;

        const pseudo = await fetchAuth('/users');
        const enseignant = await fetchAuth('/teachers');
        const pseudoExiste = pseudo.some(s => s.pseudoname === pseudony);
        const matriculeProfExiste = enseignant.some(s => s.matricule === champMatricule);


        if (pseudoExiste) {
            afficherToast("Ce pseudonyme est déjà utilisé !");
            return;
        }

        if(matriculeProfExiste) {
            afficherToast('Ce matricule est déjà utilisé !');
            return;
        }


        const bodyUserProf = {
            name: `${champNomprof} ${champPrenomprof}`,
            role: 'prof',
            pseudoname: pseudony,
            motdepasse: motDePasse
        }

        const nouvelUserProf = await fetchAuth('/users', 'POST', bodyUserProf)

        console.log(nouvelUserProf);

        const bodyProf = {
            matricule: champMatricule,
            nom: champNomprof,
            prenom: champPrenomprof,
            user_id: nouvelUserProf.result.lastInsertRowid
        }

        const profCree = await fetchAuth('/teachers', 'POST', bodyProf);

        e.target.reset();

        document.getElementById('modaleAjoutEnseignant').classList.remove('ouverte');

        chargerUneStat('/teachers', 'stat-chiffre-prof');

    }
);