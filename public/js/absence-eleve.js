// vérification du token de l'élève 
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'etudiant') {
    window.location.href = '/login';
}

const fetchAuth = async (url, method = 'GET') => {

    const options = {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const reponse = await fetch(url, options)

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

function decoderToken(token) {
    const playLoad = token.split('.')[1];
    const decoded = JSON.parse(atob(playLoad));
    return decoded;
}

const utilisateur = decoderToken(token);

const donneUsers = async () => {
    const users = await fetchAuth(`/users/${utilisateur.id}`);

    let initial = '';
    const mot = users.name.trim().split(' ');

    if (mot.length >= 2) {
        for (let i = 0; i < mot.length; i++) {
            if (mot[i]) {
                initial += mot[i][0];
            }
        }
    } else {
        initial = mot[0].substring(0, 2);
    }

    initial = initial.toUpperCase();

    const profilNom = document.getElementById('profilNom');
    const profilRole = document.getElementById('profilRole');
    const profilInitial = document.getElementById('profilAvatar');

    profilNom.textContent = users.name;
    profilRole.textContent = users.role;
    profilInitial.textContent = initial;
}
donneUsers();

const boutonBurger = document.getElementById('boutonBurger');
const boutonFermerSidebar = document.getElementById('boutonFermerSidebar');
const sidebar = document.querySelector('.sidebar');

boutonBurger.addEventListener('click', function () {
    sidebar.classList.add('ouvert');
});

boutonFermerSidebar.addEventListener('click', function () {
    sidebar.classList.remove('ouvert');
});

// Récupérer les infos de l'élève connecté
const getStudentInfo = async () => {
    const students = await fetchAuth('/students');
    return students.find(s => s.user_id === utilisateur.id);
};

// Afficher toutes les absences de l'élève
const afficherMesAbsences = async () => {
    const student = await getStudentInfo();
    const absences = await fetchAuth('/absences');
    const mesAbsences = absences.filter(a => a.student_id === student.id);

    const tbody = document.getElementById('corpsTableauMesAbsences');

    const statutTexte = { absent: 'Absent', retard: 'Retard', present: 'Présent' };

    tbody.innerHTML = mesAbsences.map(absence => {
        const justificationTexte = absence.justifie
            ? `Justifiée${absence.motif ? ' — ' + absence.motif : ''}`
            : 'Non justifiée';

        return `
            <tr>
                <td>${absence.date}</td>
                <td>${justificationTexte}</td>
                <td>${statutTexte[absence.status] || absence.status}</td>
            </tr>
        `;
    }).join('');
};

afficherMesAbsences();