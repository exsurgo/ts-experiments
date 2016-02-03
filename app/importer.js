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
var utils = require('./utils');
var models_1 = require('./models');
/**
 * Used to import, process and log data imports
 * Valid imported records are stored in Maps
 */
class Importer {
    constructor() {
        /** Imported Data **/
        this.courses = new Map();
        this.students = new Map();
        this.enrollments = new Map();
        /** Import Definitions **/
        // Definitions are used to map data table columns
        // to model properties, and data arrays to models
        this.definitions = {
            course: {
                create: function (data) {
                    var course = new models_1.Course(data);
                    this.courses.set(course.id, course);
                },
                cols: {
                    'course_id': 'id',
                    'course_name': 'name',
                    'state': 'state'
                }
            },
            student: {
                create: function (data) {
                    var student = new models_1.Student(data);
                    this.students.set(student.id, student);
                },
                cols: {
                    'user_id': 'id',
                    'user_name': 'name',
                    'state': 'state'
                }
            },
            enrollment: {
                create: function (data) {
                    var enrollment = new models_1.Enrollment(data);
                    this.enrollments.set(enrollment.id, enrollment);
                },
                cols: {
                    'course_id': 'courseId',
                    'user_id': 'userId',
                    'state': 'state'
                }
            }
        };
        /** Log **/
        /**
         * Write import results to the log
         */
        this._log = '';
    }
    /**
     * Import and process all data files
     */
    run() {
        return __awaiter(this, void 0, Promise, function* () {
            this.log('');
            // Get all files in data directory
            var fileNames;
            try {
                fileNames = yield utils.getDataFiles();
                this.log(`Importing Course Data (${fileNames.length} files)\n`);
            }
            catch (ex) {
                this.log('Could not read from data directory');
                return;
            }
            // Import and process each file
            for (let fileName of fileNames) {
                // Read and parse the individual CSV file
                var data;
                try {
                    data = yield utils.readDataFile(fileName);
                    this.log(`Importing File: ${fileName} (${data.length} records)`);
                }
                catch (ex) {
                    this.log('Could not read file: ' + fileName);
                    continue;
                }
                // Process this data table, and convert rows to models
                // Also, ensure the headers are valid
                if (!this.processDataTable(data)) {
                    this.log(`Data headers for file ${fileName} are not valid`);
                }
            }
            this.log('');
            // Process enrollments, assign student/course refs
            // Enrollments are valid if student id or course id is invalid
            // Discard the enrollment if it is invalid
            var toRemove = [];
            this.enrollments.forEach((enrollment) => {
                var course = this.courses.get(enrollment.courseId);
                var student = this.students.get(enrollment.userId);
                // Invalid Course found
                if (!course) {
                    this.log('Invalid Enrollment, Course: ' + enrollment.courseId);
                    toRemove.push(enrollment);
                }
                // Invalid Student found
                if (!student) {
                    this.log('Invalid Enrollment, Student: ' + enrollment.userId);
                    toRemove.push(enrollment);
                }
                // Assign student/course refs
                enrollment.course = course;
                enrollment.student = student;
            });
            // Remove invalid enrollments
            for (let enrollment of toRemove) {
                this.enrollments.delete(enrollment.id);
            }
            this.log('');
            // Log active courses
            var activeCourses = this.getActiveCourses();
            this.log(`${activeCourses.length} Active Courses Imported:\n`);
            for (let course of activeCourses) {
                this.log(course.toString());
                // Log active students for each course
                var activeStudents = this.getActiveStudentsForCourse(course.id);
                for (let student of activeStudents) {
                    this.log('\t' + student.toString());
                }
                this.log('');
            }
            this.log('\nImport completed successfully');
        });
    }
    /**
     * Retrieve active courses
     */
    getActiveCourses() {
        var active = [];
        this.courses.forEach((course) => {
            if (course.isActive) {
                active.push(course);
            }
        });
        return active;
    }
    /**
     * Retrieve active students for a course
     * Enrollment and Student must be active
     */
    getActiveStudentsForCourse(courseId) {
        var active = [];
        this.enrollments.forEach((enrollment) => {
            if (enrollment.course.id == courseId &&
                enrollment.isActive &&
                enrollment.student.isActive) {
                active.push(enrollment.student);
            }
        });
        return active;
    }
    /** Data Table Processing **/
    /**
     *  Process an individual imported data table.  This basically
     *  looks at all rows/cols in the data table, validates the headers,
     *  converts the rows to models, and stores them in maps
     */
    processDataTable(table) {
        var header = table[0];
        for (let modelName in this.definitions) {
            // Check each definition for a match
            if (this.isValidHeader(modelName, header)) {
                var def = this.definitions[modelName];
                // Process each data row except header
                table.forEach((row, i) => {
                    if (i > 0) {
                        // Process each column in row
                        // Convert row to object and assign to model
                        let values = {};
                        row.forEach((colValue, i) => {
                            // Get property name
                            var propName = def.cols[header[i]];
                            values[propName] = colValue;
                        });
                        def.create.call(this, values);
                    }
                });
                return true;
            }
        }
        return false;
    }
    /**
     * Check headers to determine is the data structure is correct
     */
    isValidHeader(name, header) {
        var def = this.definitions[name];
        // Ensure header contains all columns
        for (let col of header) {
            if (!def.cols[col]) {
                return false;
            }
        }
        return true;
    }
    log(...content) {
        for (let item of content) {
            this._log += item.toString() + '\n';
        }
    }
    /**
     * Get logged import results
     */
    getLog() {
        return this._log;
    }
}
exports.Importer = Importer;
//# sourceMappingURL=importer.js.map