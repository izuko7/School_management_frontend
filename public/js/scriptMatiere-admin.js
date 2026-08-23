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

// afficher toute les matières 
const chargerTouteLesMatières = async () => {
    const subjects = await fetchAuth('/subjects');
    const classes = await fetchAuth('/classes');
    const teachers = await fetchAuth('/teachers');

    document.getElementById('nombreMatieres').textContent = subjects.length;

    const ligneHTML = subjects.map((matiere) => {
        const classe = classes.find(c => c.id === matiere.classe_id);
        const teacher = teachers.find(c => c.id === matiere.teacher_id);

        const nomClasse = classe ? classe.nom : 'Inconnue';
        const nomEnseignant = teacher ? `${teacher.nom} ${teacher.prenom}` : 'Inconnu';

         return `
            <tr>
                <td>${matiere.nom}</td>
                <td>${nomClasse}</td>
                <td>${nomEnseignant}</td>
                <td>
                    <button class="bouton-action bouton-modifier" data-id="${matiere.id}">
                    <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="bouton-action bouton-supprimer" data-id="${matiere.id}">
                        <i class="fa-solid fa-trash"></i>                     
                    </button>               
                </td>
            </tr>
        `;

    }).join('');

    const tbody = document.getElementById('corpsTableauMatieres');
    tbody.innerHTML = ligneHTML;
}

chargerTouteLesMatières();

const peuplerSelectClasses = async() => {
    const classes = await fetchAuth('/classes');
    const select = document.getElementById('classe_id');

    select.innerHTML = classes.map((classe) => {
        return `<option value="${classe.id}">${classe.nom}</option>`
    }).join('');
}

peuplerSelectClasses();

const peuplerSelectEnseignants = async () => {
    const teachers = await fetchAuth('/teachers');
    const select = document.getElementById('teacher_id');

    select.innerHTML = teachers.map((teacher) => {
        return `<option value="${teacher.id}">${teacher.nom} ${teacher.prenom}</option>`
    }).join('');
}

peuplerSelectEnseignants();

// supprimer les matières 

let idMatiereASupprimer = null;

document.getElementById('corpsTableauMatieres').addEventListener('click', (e) =>{
    const bouton = e.target.closest('.bouton-supprimer');
    if(!bouton) return;

    idMatiereASupprimer = bouton.dataset.id;
    document.getElementById('modaleConfirmationSuppression').classList.add('ouverte');
});

document.getElementById('confirmerSuppression').addEventListener('click', async () => {
    if(!idMatiereASupprimer) return;

    try {
        await fetchAuth(`/subjects/${idMatiereASupprimer}`, 'DELETE');

        document.getElementById('modaleConfirmationSuppression').classList.remove('ouverte');
        afficherToast('Matière supprimée avec succès');
        idMatiereASupprimer = null;
        chargerTouteLesMatières();
    } catch (error) {
        afficherToast('Erreur lors de la suppression de la matière');
    }
});

// clic bouton modifier pré-remplissage
let idAEditer = null;

// clic bouton "Ajouter une matière" (nouvelle matière, pas modification)
document.getElementById('boutonOuvrirModaleMatiere').addEventListener('click', () => {
    idAEditer = null;
    document.getElementById('formulaireAjoutMatiere').reset();
});

document.getElementById('corpsTableauMatieres').addEventListener('click', async (e) => {
    const boutonModifier = e.target.closest('.bouton-modifier');
    if (!boutonModifier) return;

    const id = boutonModifier.dataset.id;
    const matiere = await fetchAuth(`/subjects/${id}`);

    idAEditer = matiere.id;

    document.getElementById('nom_matiere').value = matiere.nom;
    document.getElementById('classe_id').value = matiere.classe_id;
    document.getElementById('teacher_id').value = matiere.teacher_id;
    document.getElementById('modaleAjoutMatiere').classList.add('ouverte');
});

// soumission du formulaire (création OU modification)

document.getElementById('formulaireAjoutMatiere').addEventListener('submit', async (e) => {
    e.preventDefault();

    const idEnEdition = idAEditer;

    const champNom = document.getElementById('nom_matiere').value;
    const champClasseId = Number(document.getElementById('classe_id').value);
    const champTeacherId = Number(document.getElementById('teacher_id').value);

    const bodyMatiere = {
        nom: champNom,
        classe_id: champClasseId,
        teacher_id: champTeacherId,
    };

    if (idEnEdition) {
        await fetchAuth(`/subjects/${idEnEdition}`, 'PUT', bodyMatiere);
        afficherToast('Matière modifiée avec succès');
    } else {
        const subjects = await fetchAuth('/subjects');

        const matiereExiste = subjects.some(s => {
            return s.nom.trim().toLowerCase() === champNom.trim().toLowerCase()
                && s.classe_id === champClasseId;
        });

        if (matiereExiste) {
            afficherToast('Cette matière existe déjà dans cette classe !');
            return;
        }

        await fetchAuth('/subjects', 'POST', bodyMatiere);
        afficherToast('Matière créée avec succès');
    }

    e.target.reset();
    idAEditer = null;
    document.getElementById('modaleAjoutMatiere').classList.remove('ouverte');
    chargerTouteLesMatières();
});