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

// 

const chargerPresence = async () => {

    const classeIdChoisie = parseInt(document.getElementById('filtre_classe').value);
    const datechoisie = document.getElementById('filtre_date').value;

    const dateConvertie = datechoisie ? dayjs(datechoisie).format('DD/MM/YYYY') : null;

    const selectElement = document.getElementById('corpsTableauPresences');

    if(isNaN(classeIdChoisie)) {
        selectElement.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--gris-clair);">Veuillez sélectionner une classe</td>
            </tr>
        `;
        return;
    }

    const students = await fetchAuth('/students');
    const absences = await fetchAuth('/absences');
    const classes = await fetchAuth('/classes');

    const filtreStudent =  students.filter((eleve) => eleve.classe_id === classeIdChoisie);

    const filtreAbsences = absences.filter((absence) => {
        const appartientClasse = filtreStudent.some((eleve) => eleve.id === absence.student_id);
        const dateCorrespond = dateConvertie ? absence.date === dateConvertie : true;
        return appartientClasse && dateCorrespond
        
    });

    const lignesHTML = filtreAbsences.map((absence) => {
        const eleve = students.find(s => s.id === absence.student_id);

        const statutClasse = absence.status === 'present' ? 'badge-actif' : 'badge-inactif';

        const TexteDeJustification = absence.justifie
            ? `Justifiée${absence.motif ? ' — ' + absence.motif : ''}`
            : 'Non justifié';

        return `
            <tr>
                <td>${eleve.nom} ${eleve.prenom}</td>
                <td>${absence.date}</td>
                <td><span class="badge ${statutClasse}">${absence.status}</span></td>
                <td>${TexteDeJustification}</td>
                <td>
                    <button class="bouton-action bouton-justifier" data-id="${absence.id}">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    selectElement.innerHTML = lignesHTML;
}

chargerPresence();


const chargerClasseFiltre = async () => {
    const classes = await fetchAuth('/classes');
    const optionsHTML = classes.map((classe) => {
        return `<option value="${classe.id}">${classe.nom}</option>`
    }).join('');

    document.getElementById('filtre_classe').innerHTML = `<option value="">Sélectionner une classe</option>` + optionsHTML;
};

chargerClasseFiltre();


document.getElementById('formulaireFiltrePresences').addEventListener('submit', (e) => {
    e.preventDefault();
    chargerPresence();
});