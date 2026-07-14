// Modèle notes

class Grade {
    constructor(student_id, subject_id, note, date, type){
        this.student_id = student_id;
        this.subject_id = subject_id;
        this.note = note;
        this.date = date;
        this.type = type;
    }
}

export default Grade;