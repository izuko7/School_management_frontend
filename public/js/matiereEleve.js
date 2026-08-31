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
            // Sécurité : on prend la lettre SEULEMENT si le mot n'est pas vide
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
    const messageBienvenue = document.getElementById('bienvenue-name');

    profilNom.textContent = users.name;
    profilRole.textContent = users.role;
    profilInitial.textContent = initial;
    messageBienvenue.textContent = `Bonjour, ${users.name} ! `;
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

const remplirSelectMatieres = async () => {
    const student = await getStudentInfo();
    const subjects = await fetchAuth('/subjects');
    const mesMatieres = subjects.filter(s => s.classe_id === student.classe_id);

    const optionsHTML = mesMatieres.map(m => `<option value="${m.id}">${m.nom}</option>`).join('');
    document.getElementById('filtre_matiere').innerHTML = `<option value="">Sélectionner une matière</option>` + optionsHTML;
};

remplirSelectMatieres();

document.getElementById('filtre_matiere').addEventListener('change', async (e) => {
    const matiereId = parseInt(e.target.value);
    const tbody = document.getElementById('corpsTableauMesNotes');

    if (isNaN(matiereId)) {
        tbody.innerHTML = '';
        return;
    }

    const student = await getStudentInfo();
    const grades = await fetchAuth('/grades');
    const mesNotes = grades.filter(g => g.student_id === student.id && g.subject_id === matiereId);

    tbody.innerHTML = mesNotes.map(note => `
        <tr>
            <td>${note.date}</td>
            <td>${note.type}</td>
            <td>${note.note}/20</td>
        </tr>
    `).join('');
});