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

// Récupérer les infos de l'élève connecté
const getStudentInfo = async () => {
    const students = await fetchAuth('/students');
    return students.find(s => s.user_id === utilisateur.id);
};

// Stat : moyenne générale
const afficherMoyenne = async () => {
    const student = await getStudentInfo();
    const grades = await fetchAuth('/grades');
    const mesNotes = grades.filter(g => g.student_id === student.id);

    const statMoyenne = document.getElementById('statMoyenne');
    const statMoyenneSous = document.getElementById('statMoyenneSous');

    if (mesNotes.length === 0) {
        statMoyenne.textContent = '—/20';
        statMoyenneSous.textContent = 'Aucune note';
        return;
    }

    const somme = mesNotes.reduce((total, note) => total + note.note, 0);
    const moyenne = somme / mesNotes.length;

    statMoyenne.textContent = `${moyenne.toFixed(1)}/20`;
    statMoyenneSous.textContent = `Sur ${mesNotes.length} note(s)`;
};

afficherMoyenne();

// Stat : nombre de matières de la classe
const afficherStatMatieres = async () => {
    const student = await getStudentInfo();
    const subjects = await fetchAuth('/subjects');
    const mesMatieres = subjects.filter(s => s.classe_id === student.classe_id);

    document.getElementById('statMatieres').textContent = mesMatieres.length;
    document.getElementById('statMatieresSous').textContent = 'Cette année';
};

afficherStatMatieres();

// Stat : rang de classe
const afficherRang = async () => {
    const student = await getStudentInfo();
    const students = await fetchAuth('/students');
    const grades = await fetchAuth('/grades');

    const elevesDeLaClasse = students.filter(s => s.classe_id === student.classe_id);

    const moyennesElevesClasse = elevesDeLaClasse.map((eleve) => {
        const notesEleve = grades.filter(g => g.student_id === eleve.id);
        const moyenne = notesEleve.length === 0
            ? 0
            : notesEleve.reduce((total, note) => total + note.note, 0) / notesEleve.length;
        return { id: eleve.id, moyenne };
    });

    moyennesElevesClasse.sort((a, b) => b.moyenne - a.moyenne);

    const rang = moyennesElevesClasse.findIndex(e => e.id === student.id) + 1;

    document.getElementById('statRang').textContent = `${rang}e`;
    document.getElementById('statRangSous').textContent = `Sur ${elevesDeLaClasse.length} élèves`;
};

afficherRang();

// Tableau : matières + prof de la classe
const afficherTableauMatieres = async () => {
    const student = await getStudentInfo();
    const subjects = await fetchAuth('/subjects');
    const teachers = await fetchAuth('/teachers');

    const mesMatieres = subjects.filter(s => s.classe_id === student.classe_id);

    const lignesHTML = mesMatieres.map((matiere) => {
        const prof = teachers.find(t => t.id === matiere.teacher_id);
        const nomProf = prof ? `${prof.nom} ${prof.prenom}` : 'Non assigné';

        return `
            <tr>
                <td>${matiere.nom}</td>
                <td>${nomProf}</td>
            </tr>
        `;
    }).join('');

    document.getElementById('corpsTableauNotes').innerHTML = lignesHTML;
};

afficherTableauMatieres();