"use strict";


export class Course extends Model {

    id: string;
    name: string;

    constructor(values?: Object) {
        super(values);
    }

}

export class Student extends Model {

    id: string;
    name: string;

    constructor(values?: Object) {
        super(values);
    }

}


export class Enrollment extends Model {

    courseId: string;
    course: Course;
    studentId: string;
    student: Student;

    constructor(values?: Object) {
        super(values);
    }

}

class Model {

    constructor(values?: Object) {
        Object.assign(this, values);
    }

}