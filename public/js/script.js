const formulaire = document.getElementById('formulaireConnexion');
const messageErreur = document.getElementById('messageError');

formulaire.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const pseudoname = document.getElementById('pseudoname').value;
    const motdepasse = document.getElementById('motDePasse').value;

    try {
        const reponse = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({pseudoname, motdepasse})
        });

        const donnees = await reponse.json();

        if(!reponse.ok){
            messageErreur.textContent = donnees.error;
        }
    } catch (error) {
        messageErreur.textContent = `Impossible de contacter le serveur. Vérifiez votre connexion.`
    }
})