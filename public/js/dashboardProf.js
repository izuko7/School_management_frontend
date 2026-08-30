// vérification du token de l'enseignant 
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'prof') {
    window.location.href = '/login';
}

const fetchAuth = async (url, method = 'GET', body = null) => {

    const options = {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
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

const afficherToast = (message) => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
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

// gestion générique des modales
document.querySelectorAll('.bouton-fermer-global').forEach(bouton => {
    bouton.addEventListener('click', (e) => {
        const modale = bouton.closest('.modale-overlay');
        modale.classList.remove('ouverte');
    });
});

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
    const messageBienvenue = document.getElementById('bienvenue-name');

    profilNom.textContent = users.name;
    profilRole.textContent = users.role;
    profilInitial.textContent = initial;
    messageBienvenue.textContent = `Bonjour, ${users.name} ! `
}

donneUsers();

// -------------------------------------------- //

const getTeacherId = async () => {
    const teachers = await fetchAuth('/teachers');
    const teacherConnected = teachers.find(teacher => teacher.user_id === utilisateur.id);
    return teacherConnected.id;
}

const chargerMatieresProf = async () => {
    const teacherId = await getTeacherId();
    const subjects = await fetchAuth('/subjects');

    const filtreMatiere = subjects.filter((matiere) => matiere.teacher_id === teacherId);
    return filtreMatiere;
}

const AvoirTouteLesClassesProf = async () => {
    const mesMatieres = await chargerMatieresProf();
    const classeId = mesMatieres.map((matiere) => matiere.classe_id);
    const classeIdUniques = [...new Set(classeId)];
    return classeIdUniques;
}

const afficherStatClasse = async () => {
    const classeIdUniques = await AvoirTouteLesClassesProf();
    const statClasse = document.getElementById('stat-chiffre-classes');
    statClasse.textContent = classeIdUniques.length;
}

afficherStatClasse();

const afficherStatEleve = async () => {
    const classeIdUniques = await AvoirTouteLesClassesProf();
    const students = await fetchAuth('/students');
    const mesEleves = students.filter((student) => classeIdUniques.includes(student.classe_id));
    const nbreElves = document.getElementById('stat-chiffre-eleves');
    nbreElves.textContent = mesEleves.length;
}

afficherStatEleve();

const afficherStatMoyenne = async () => {
    const mesMatieres = await chargerMatieresProf();
    const subjectId = mesMatieres.map((matiere) => matiere.id);

    const grades = await fetchAuth('/grades');
    const mesNotes = grades.filter((note) => subjectId.includes(note.subject_id));

    const statMoyenne = document.getElementById('stat-chiffre-moyenne');

    if (mesNotes.length === 0) {
        statMoyenne.textContent = '—/20';
        return;
    }

    const somme = mesNotes.reduce((total, note) => total + note.note, 0);
    const moyenne = somme / mesNotes.length;

    statMoyenne.textContent = `${moyenne.toFixed(1)}/20`;
}

afficherStatMoyenne();

const remplirSelecteurClasse = async () => {
    const classeIdUniques = await AvoirTouteLesClassesProf();
    const classes = await fetchAuth('/classes');

    const mesClasses = classes.filter((classe) => classeIdUniques.includes(classe.id));
    const selecteur = document.getElementById('selecteur-classe');

    mesClasses.forEach((classe) => {
        const option = document.createElement('option');
        option.value = classe.id;
        option.textContent = classe.nom;
        selecteur.appendChild(option);
    })
}

remplirSelecteurClasse();

const selecteur = document.getElementById('selecteur-classe');

const getElevesDeClasse = async (classeId) => {
    const students = await fetchAuth('/students');
    const filtreStudent = students.filter((eleve) => eleve.classe_id === classeId);
    return filtreStudent;
}

const getNombreAbsences = async (studentId) => {
    const absences = await fetchAuth('/absences');
    const filtreAbsences = absences.filter((absence) => absence.student_id === studentId);
    return filtreAbsences.length;
}

const avoirMoyenneEleve = async (studentId) => {
    const grades = await fetchAuth('/grades');
    const mesNotes = grades.filter((note) => note.student_id === studentId);

    if (mesNotes.length === 0) {
        return 0;
    }

    const somme = mesNotes.reduce((total, note) => total + note.note, 0);
    const moyenne = somme / mesNotes.length;
    return moyenne;
}

const getDerniereNote = async (studentId) => {
    const grades = await fetchAuth('/grades');
    const mesNotes = grades.filter((note) => note.student_id === studentId);

    if (mesNotes.length === 0) {
        return null;
    }

    const parseDate = (dateStr) => dayjs(dateStr, ["DD/MM/YY", "DD/MM/YYYY", "YYYY-MM-DD"]);

    mesNotes.sort((a, b) => parseDate(b.date).valueOf() - parseDate(a.date).valueOf());

    return mesNotes[0];
}

const afficherTableauEleves = async (classeId) => {
    const mesEleves = await getElevesDeClasse(classeId);

    const lignesData = await Promise.all(
        mesEleves.map(async (eleve) => {
            const [moyenne, absences, derniereNote] = await Promise.all([
                avoirMoyenneEleve(eleve.id),
                getNombreAbsences(eleve.id),
                getDerniereNote(eleve.id)
            ]);
            return { eleve, moyenne, absences, derniereNote };
        })
    );

    const tableauHTML = lignesData.map((ligne) => {
        const statut = ligne.moyenne >= 14 ? 'Excellent' : ligne.moyenne >= 10 ? 'Bien' : 'En difficulté';
        const noteAffichee = ligne.derniereNote ? ligne.derniereNote.note : '—';
        const noteId = ligne.derniereNote ? ligne.derniereNote.id : null;

        return `
            <tr>
                <td>${ligne.eleve.nom}</td>
                <td>${ligne.moyenne.toFixed(1)}/20</td>
                <td>${ligne.absences}</td>
                <td>${noteAffichee}</td>
                <td>${statut}</td>
                <td>
                    ${noteId ? `<button class="bouton-action bouton-modifier-note" data-id="${noteId}"><i class="fa-solid fa-pen"></i></button>` : ''}
                </td>
            </tr>
        `;
    }).join('');

    const tbody = document.getElementById('tbody-eleves');
    tbody.innerHTML = tableauHTML;
}

selecteur.addEventListener('change', () => {
    const classeSelectionne = parseInt(selecteur.value);
    afficherTableauEleves(classeSelectionne);
});

let idNoteEnEdition = null;

document.getElementById('tbody-eleves').addEventListener('click', async (e) => {
    const bouton = e.target.closest('.bouton-modifier-note');
    if (!bouton) return;

    const id = bouton.dataset.id;
    const grades = await fetchAuth('/grades');
    const grade = grades.find(g => g.id === parseInt(id));

    idNoteEnEdition = grade.id;
    document.getElementById('modif_note').value = grade.note;
    document.getElementById('modif_date').value = dayjs(grade.date, 'DD/MM/YYYY').format('YYYY-MM-DD');

    document.getElementById('modaleModifierNote').classList.add('ouverte');
});

document.getElementById('formulaireModifierNote').addEventListener('submit', async (e) => {
    e.preventDefault();
    const note = parseFloat(document.getElementById('modif_note').value);
    const date = dayjs(document.getElementById('modif_date').value).format('DD/MM/YYYY');

    await fetchAuth(`/grades/${idNoteEnEdition}`, 'PUT', { note, date });
    afficherToast('Note modifiée avec succès');
    document.getElementById('modaleModifierNote').classList.remove('ouverte');
    afficherTableauEleves(parseInt(selecteur.value));
});