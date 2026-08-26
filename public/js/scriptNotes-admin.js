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

// Peupler le select des classes (comme sur les autres pages)
const chargerClasseFiltre = async () => {
    const classes = await fetchAuth('/classes');
    const optionsHTML = classes.map((classe) => {
        return `<option value="${classe.id}">${classe.nom}</option>`;
    }).join('');

    document.getElementById('filtre_classe').innerHTML = `<option value="">Sélectionner une classe</option>` + optionsHTML;
};

chargerClasseFiltre();


// Peupler dynamiquement le select des matières selon la classe choisie
document.getElementById('filtre_classe').addEventListener('change', async (e) => {
    const classeId = parseInt(e.target.value);
    const selectMatiere = document.getElementById('filtre_matiere');

    if (isNaN(classeId)) {
        selectMatiere.innerHTML = `<option value="">Sélectionner une matière</option>`;
        return;
    }

    const subjects = await fetchAuth('/subjects');
    const matieresDeClasse = subjects.filter(s => s.classe_id === classeId);

    const optionsHTML = matieresDeClasse.map((matiere) => {
        return `<option value="${matiere.id}">${matiere.nom}</option>`;
    }).join('');

    selectMatiere.innerHTML = `<option value="">Sélectionner une matière</option>` + optionsHTML;
});


//  Charger et afficher les notes filtrées
const chargerNotes = async () => {
    const classeIdChoisie = parseInt(document.getElementById('filtre_classe').value);
    const matiereIdChoisie = parseInt(document.getElementById('filtre_matiere').value);

    const tbody = document.getElementById('corpsTableauNotes');

    // Si aucune classe OU aucune matière n'est choisie, on n'affiche rien
    if (isNaN(classeIdChoisie) || isNaN(matiereIdChoisie)) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--gris-clair);">Veuillez sélectionner une classe et une matière</td>
            </tr>
        `;
        return;
    }

    const students = await fetchAuth('/students');
    const grades = await fetchAuth('/grades');
    const subjects = await fetchAuth('/subjects');

    // Filtrer les élèves de la classe choisie
    const filtreStudent = students.filter(s => s.classe_id === classeIdChoisie);

    // Filtrer les notes qui appartiennent à ces élèves ET à la matière choisie
    const filtreGrades = grades.filter((grade) => {
        const appartientClasse = filtreStudent.some(s => s.id === grade.student_id);
        const appartientMatiere = grade.subject_id === matiereIdChoisie;
        return appartientClasse && appartientMatiere;
    });

    document.getElementById('nombreNotes').textContent = filtreGrades.length;

    const lignesHTML = filtreGrades.map((grade) => {
        const eleve = students.find(s => s.id === grade.student_id);
        const matiere = subjects.find(s => s.id === grade.subject_id);

        return `
            <tr>
                <td>${eleve.nom} ${eleve.prenom}</td>
                <td>${matiere.nom}</td>
                <td>${grade.note}</td>
                <td>${grade.date}</td>
                <td>${grade.type}</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = lignesHTML;
};

document.getElementById('formulaireFiltreNotes').addEventListener('submit', (e) => {
    e.preventDefault();
    chargerNotes();
});