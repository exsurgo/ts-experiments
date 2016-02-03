"use strict";


/**
 * Base model
 */
class Model {

    state: string;

    constructor(values?: Object) {
        Object.assign(this, values);
    }

}

/**
 * Course data
 */
export class Course extends Model {

    id: string;
    name: string;

    constructor(values?: Object) {
        super(values);
    }

    toString(): string {
        return `${this.name} (${this.id})`;
    }

}

/**
 * Student data
 */
export class Student extends Model {

    id: string;
    name: string;

    constructor(values?: Object) {
        super(values);
    }

}

/**
 * Join between course and student
 */
export class Enrollment extends Model {

    get id() : string {
        return this.courseId + '-' + this.studentId;
    }

    courseId: string;
    course: Course;
    studentId: string;
    student: Student;

    constructor(values?: Object) {
        super(values);
    }

}
