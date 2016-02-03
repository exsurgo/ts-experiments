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
class Importer {
    constructor() {
        this.courses = new Map();
        this.students = new Map();
        this.enrollments = new Map();
        /** Import Definitions **/
        this.definitions = {
            course: {
                create: function (data) {
                    var course = new models_1.Course(data);
                    this.courses.set(course.id, course);
                },
                cols: ['course_id', 'course_name', 'state']
            },
            student: {
                create: function (data) {
                    var student = new models_1.Student(data);
                    this.students.set(student.id, student);
                },
                cols: ['user_id', 'user_name', 'state']
            },
            enrollment: {
                create: function (data) {
                    var enrollment = new models_1.Enrollment(data);
                    this.enrollments.set(enrollment.id, enrollment);
                },
                cols: ['course_id', 'user_id', 'state']
            }
        };
        /** Log **/
        /**
         * Write import results to the log
         */
        this._log = '';
    }
    run() {
        return __awaiter(this, void 0, Promise, function* () {
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
            //for (let fileName of fileNames) {
            let fileName = fileNames[0];
            // Read and parse the individual CSV file
            var data;
            try {
                data = yield utils.readDataFile(fileName);
                this.log(`Importing File: ${fileName} (${data.length} records)`);
            }
            catch (ex) {
                this.log('Could not read file: ' + fileName);
            }
            // Process this data table, and convert rows to models
            if (!this.processDataTable(data)) {
                this.log(`Data headers for file ${fileName} are not valid\n`);
            }
            //}
        });
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
                        row.forEach((col, i) => {
                            // Convert snake_case to camelCase props
                            let propName = this.convertSnakeCase(header[i]);
                            values[propName] = col;
                        });
                        def.create(values);
                    }
                });
                return true;
            }
        }
        return false;
    }
    convertSnakeCase(name) {
        return name.replace(/(\-\w)/g, function (m) {
            return m[1].toUpperCase();
        });
    }
    isValidHeader(name, header) {
        for (let col of header) {
            if (this.definitions[name].cols.indexOf(col) == -1) {
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