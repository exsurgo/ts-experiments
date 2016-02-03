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
}
/**
 * Course data
 */
class Course extends Model {
    constructor(values) {
        super(values);
    }
    toString() {
        return `${this.name} (${this.id})`;
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
}
exports.Student = Student;
/**
 * Join between course and student
 */
class Enrollment extends Model {
    constructor(values) {
        super(values);
    }
    get id() {
        return this.courseId + '-' + this.studentId;
    }
}
exports.Enrollment = Enrollment;
//# sourceMappingURL=models.js.map