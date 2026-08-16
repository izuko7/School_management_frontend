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

        if(matriculeExiste) {
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

        e.target.reset();
        document.getElementById('modaleAjoutEleve').classList.remove('ouverte');
    }
)