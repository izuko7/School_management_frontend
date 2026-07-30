// Afficher le mot de passe 
const btnOeil = document.getElementById('boutonOeil');
const mdp = document.getElementById('motDePasse');

if(btnOeil && mdp) {
    btnOeil.addEventListener('click', () => {
        const isclosed = mdp.type === 'password';
        mdp.type = isclosed ? 'text' : 'password';

        const icone = btnOeil.querySelector('i');
        icone.classList.toggle('fa-eye');
        icone.classList.toggle('fa-eye-slash');
    });
}




const formulaire = document.getElementById('formulaireConnexion');
const messageErreur = document.getElementById('messageError');
const chargement = document.getElementById('boutonConnexion');

formulaire.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const pseudoname = document.getElementById('pseudoname').value;
    const motdepasse = document.getElementById('motDePasse').value;
    const textOriginal = chargement.textContent;

    try {

        chargement.disabled = true;
        chargement.textContent = 'Connexion...';

        const reponse = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({pseudoname, motdepasse})
        });

        const donnees = await reponse.json();

        if(!reponse.ok){
            messageErreur.textContent = donnees.error;
        }else{
            localStorage.setItem('token', donnees.token);
            localStorage.setItem('role', donnees.role);
            // console.log(localStorage);
            const pagesParRole = {
                admin: '/dashboard/admin',
                prof: '/dashboard/prof',
                etudiant: '/dashboard/etudiant'
            };

            window.location.href = pagesParRole[donnees.role];
        }

    } catch (error) {

        messageErreur.textContent = `Impossible de contacter le serveur. Vérifiez votre connexion.`

    } finally{
        chargement.disabled = false;
        chargement.textContent = textOriginal;
    }
})