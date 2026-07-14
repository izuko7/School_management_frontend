// Modèle absences

class Absence{
    constructor(student_id, date, status, justifie, motif){
        this.student_id = student_id;
        this.date = date;
        this.status = status;
        this.justifie = justifie;
        this.motif = motif;
    }
}

export default Absence;