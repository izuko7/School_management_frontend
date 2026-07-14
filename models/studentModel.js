// Modèle Etudiant

class Student {
    constructor(matricule, nom, prenom, age, classe_id, user_id){
        this.matricule = matricule;
        this.nom = nom;
        this.prenom = prenom;
        this.age = age;
        this.classe_id = classe_id;
        this.user_id = user_id;
    }
}

export default Student;