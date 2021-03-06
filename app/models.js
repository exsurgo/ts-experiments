"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
/**
 * Base model
 */
class Model {
    constructor(values) {
        Object.assign(this, values);
    }
    get isActive() {
        return this.state === 'active';
    }
}
/**
 * Course data
 */
class Course extends Model {
    constructor(values) {
        super(values);
    }
    toString() {
        return `Course: ${this.name} (${this.id})`;
    }
}
exports.Course = Course;
/**
 * Student data
 */
class Student extends Model {
    constructor(values) {
        super(values);
    }
    toString() {
        return `Student: ${this.name} (${this.id})`;
    }
}
exports.Student = Student;
/**
 * Join between course and student
 */
class Enrollment extends Model {
    constructor(values) {
        super(values);
    }
    // Unique id for enrollment based on student/course id
    get id() {
        return this.courseId + '-' + this.userId;
    }
    toString() {
        return this.student.toString() + '->' + this.course.toString();
    }
}
exports.Enrollment = Enrollment;
//# sourceMappingURL=models.js.map