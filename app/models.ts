"use strict";


/**
 * Base model
 */
class Model {

    state: string;

    get isActive() {
        return state === 'active';
    }

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
        return `Course: ${this.name} (${this.id})`;
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

    toString(): string {
        return `Student: ${this.name} (${this.id})`;
    }

}

/**
 * Join between course and student
 */
export class Enrollment extends Model {

    // Unique id for enrollment based on student/course id
    get id() : string {
        return this.courseId + '-' + this.userId;
    }

    courseId: string;
    course: Course;

    userId: string;
    student: Student;

    constructor(values?: Object) {
        super(values);
    }

    toString(): string {
        return this.student.toString() + '->' + this.course.toString();
    }

}
