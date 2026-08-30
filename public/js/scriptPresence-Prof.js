// vérification du token de l'enseignant 
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'prof') {
    window.location.href = '/login';
}

// toast 
const afficherToast = (message, type = 'succes') => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast afficher ${type}`;

    setTimeout(() => {
        toast.classList.remove('afficher');
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



document.getElementById('formulaireContextePresence').addEventListener('submit', async (e) => {
    e.preventDefault();
    const classeId = parseInt(document.getElementById('contexte_classe').value);
    const students = await fetchAuth('/students');
    const eleves = students.filter(s => s.classe_id === classeId);

    const lignesHTML = eleves.map((eleve) => `
        <tr>
            <td>${eleve.nom} ${eleve.prenom}</td>
            <td>
                <select class="select-statut" data-eleve-id="${eleve.id}">
                    <option value="present">Présent</option>
                    <option value="absent">Absent</option>
                    <option value="retard">Retard</option>
                </select>
            </td>
        </tr>
    `).join('');

    document.getElementById('corpsTableauPresence').innerHTML = lignesHTML;
    document.getElementById('blocSaisiePresences').style.display = 'block';
});

document.getElementById('boutonEnregistrerPresences').addEventListener('click', async () => {
    const dateBrute = document.getElementById('contexte_date').value;
    const dateFormatee = dayjs(dateBrute).format('DD/MM/YYYY');

    const selects = document.querySelectorAll('.select-statut');
    const requetes = [...selects].map((select) => {
        return fetchAuth('/absences', 'POST', {
            student_id: parseInt(select.dataset.eleveId),
            date: dateFormatee,
            status: select.value,
            justifie: 0
        });
    });

    await Promise.all(requetes);
    afficherToast("Appel enregistré avec succès", 'succes');
    document.getElementById('blocSaisiePresences').style.display = 'none';
    document.getElementById('formulaireContextePresence').reset();
});