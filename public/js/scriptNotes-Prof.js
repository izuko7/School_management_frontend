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

const afficherToast = (message, type = 'succes') => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast afficher ${type}`;

    setTimeout(() => {
        toast.classList.remove('afficher');
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

// recupérer les identifiants du professeur connecté 
const getTeacherId = async () => {
    const teachers = await fetchAuth('/teachers');
    const teacherConnected = teachers.find((teacher) => teacher.user_id === utilisateur.id);
    return teacherConnected.id;
}

// recuperation des matières de l'enseignant 
const chargerMatieresProf = async () => {
    const teacherId = await getTeacherId();
    const subjects = await fetchAuth('/subjects');

    const filtreMatiere = subjects.filter((matiere) => matiere.teacher_id === teacherId);
    return filtreMatiere;
}

// extraire les classes de l'enseignant 
const AvoirTouteLesClassesProf = async () => {
    const mesMatieres = await chargerMatieresProf();
    const classeId = mesMatieres.map((matiere) => matiere.classe_id);
    const classeIdUniques = [...new Set(classeId)];
    return classeIdUniques;
}

const remplirSelecteurClasse = async () => {
    const classeIdUniques = await AvoirTouteLesClassesProf();
    const classes = await fetchAuth('/classes');

    const mesClasses = classes.filter((classe) => classeIdUniques.includes(classe.id));
    const selecteur = document.getElementById('contexte_classe');

    mesClasses.forEach((classe) => {
        const option = document.createElement('option');
        option.value = classe.id;
        option.textContent = classe.nom;
        selecteur.appendChild(option);
    })
}

remplirSelecteurClasse();

const selecteur = document.getElementById('contexte_classe');

selecteur.addEventListener('change', async () => {
    const classeId = parseInt(selecteur.value);
    const selectMatiere = document.getElementById('contexte_matiere');

    if (isNaN(classeId)) {
        selectMatiere.innerHTML = '';
        return;
    }

    const mesMatieres = await chargerMatieresProf();
    const matieresDeCetteClasse = mesMatieres.filter((matiere) => matiere.classe_id === classeId);

    selectMatiere.innerHTML = '';

    matieresDeCetteClasse.forEach((matiere) => {
        const option = document.createElement('option');
        option.value = matiere.id;
        option.textContent = matiere.nom;
        selectMatiere.appendChild(option);
    })
})

// remplir le selecteur type 
const remplirSelecteurType = async () => {
    const grades = await fetchAuth('/grades');
    const gradeType = grades.map((grade) => grade.type);
    const noteType = [...new Set(gradeType)];

    const selectType = document.getElementById('contexte_type');

    const valeursExistantes = [...selectType.options].map((option) => option.value);

    noteType.forEach((type) => {
        if (valeursExistantes.includes(type)) {
            return;
        }

        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        selectType.appendChild(option);
    })
}

remplirSelecteurType();

document.getElementById('formulaireContexteEval').addEventListener('submit', async (e) => {
    e.preventDefault();

    const classeId = parseInt(document.getElementById('contexte_classe').value);

    const students = await fetchAuth('/students');
    const elevesDeLaClasse = students.filter((eleve) => eleve.classe_id === classeId);

    const lignesHTML = elevesDeLaClasse.map((eleve) => {
        return `
            <tr>
                <td>${eleve.nom} ${eleve.prenom}</td>
                <td><input type="number" class="input-note" data-eleve-id="${eleve.id}" min="0" max="20" step="0.5"></td>
            </tr>
        `;
    }).join('');

    document.getElementById('corpsTableauSaisie').innerHTML = lignesHTML;
    document.getElementById('blocSaisieNotes').style.display = 'block';
});

document.getElementById('boutonEnregistrerNotes').addEventListener('click', async () => {
    // 1. Récupérer le contexte commun
    const subjectId = parseInt(document.getElementById('contexte_matiere').value);
    const dateBrute = document.getElementById('contexte_date').value;
    const type = document.getElementById('contexte_type').value;

    // Conversion de la date au format attendu par le backend
    const dateFormatee = dateBrute ? dayjs(dateBrute).format('DD/MM/YYYY') : null;

    const inputsNotes = document.querySelectorAll('.input-note');

    const requetes = [...inputsNotes]
        .filter((input) => input.value !== '')
        .map((input) => {
            const studentId = parseInt(input.dataset.eleveId);
            const note = parseFloat(input.value);

            return fetchAuth('/grades', 'POST', {
                student_id: studentId,
                subject_id: subjectId,
                note: note,
                date: dateFormatee,
                type: type
            });
        });

    if (requetes.length === 0) {
        afficherToast('Aucune note à enregistrer', 'succes');
        return;
    }

    try {
        await Promise.all(requetes);
        afficherToast('Note(s) ajoutée(s) avec succès');
        document.getElementById('corpsTableauSaisie').innerHTML = '';
        document.getElementById('blocSaisieNotes').style.display = 'none';
        document.getElementById('formulaireContexteEval').reset();
    } catch (error) {
        console.error(error);
        afficherToast('Erreur lors de l\'enregistrement des notes', 'erreur');
    }
});