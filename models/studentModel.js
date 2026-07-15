// Modèle Etudiant

class Student {
    constructor(matricule, nom, prenom, date_naissance, classe_id, user_id){
        this.matricule = matricule;
        this.nom = nom;
        this.prenom = prenom;
        this.date_naissance = date_naissance;
        this.classe_id = classe_id;
        this.user_id = user_id;
    }
}

export default Student;