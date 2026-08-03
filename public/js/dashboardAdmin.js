// Vérification d'accès admin
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'admin') {
    window.location.href = '/login';
}


const logOut = document.getElementById('boutonDeconnexion');
logOut.addEventListener('click', (e)=>{
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


// const chargerStats = async () => {
//         const reponse = await fetch('/students', {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     });

//     const students = await reponse.json();

//     const statStudents = document.getElementById('stat-chiffre');
//     statStudents.textContent = students.length;
    
// }

// chargerStats();

const chargerUneStat = async(url, idElement)=> {

    const reponse = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const students = await reponse.json();

    const statStudents = document.getElementById(idElement);
    statStudents.textContent = students.length;

}

chargerUneStat('/students', 'stat-chiffre-etudiant');
chargerUneStat('/teachers', 'stat-chiffre-prof');
chargerUneStat('/classes', 'stat-chiffre-classe');


const chargerElevesRecents = async () => {
    // 1. Récupérer les étudiants
    const reponseStudents = await fetch('/students', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const students = await reponseStudents.json();

    // 2. Récupérer les classes
    const reponseClasses = await fetch('/classes', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const classes = await reponseClasses.json();

    // 3. Construire les lignes HTML
    const lignesHTML = students.map((student) => {
        const classe = classes.find(c => c.id === student.classe_id);
        const nomClasse = classe ? classe.nom : "Non assignée";
        
        return `
            <tr>
                <td>${student.nom} ${student.prenom}</td>
                <td>${nomClasse}</td>
                <td>${student.matricule}</td>
                <td><span class="badge badge-actif">Actif</span></td>
                <td><button class="bouton-action"><i class="fa-solid fa-ellipsis"></i></button></td>
            </tr>
        `;
    }).join('');

    // 4. Injecter dans le tableau
    const tbody = document.querySelector('.tableau-eleves tbody');
    tbody.innerHTML = lignesHTML;
};

chargerElevesRecents();

function decoderToken(token) {
    const playLoad = token.split('.')[1];
    const decoded = JSON.parse(atob(playLoad));
    return decoded;
}

const utilisateur = decoderToken(token);

const donneUsers = async () => {
    const reponseUser = await fetch(`/users/${utilisateur.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const users = await reponseUser.json();

    const mot = users.name.split(' ');
    const initial = `${mot[0][0]}${mot[1][0]}`


    const profilNom = document.getElementById('spanprofilNom');
    const profilRole = document.getElementById('spanprofilRole');
    const profilInitial = document.getElementById('profilAvatar');

    profilNom.textContent = users.name;
    profilRole.textContent = users.role;
    profilInitial.textContent = initial;


}

donneUsers();


