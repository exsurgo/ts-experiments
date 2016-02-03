"use strict";
import * as _ from 'lodash';
import * as utils from './utils';
import {Course, Student, Enrollment} from './models';

export class Importer {

    public courses: Map<string, Course> = new Map();
    public students: Map<string, Student> = new Map();
    public enrollments: Map<string, Enrollment> = new Map();

    async run() : Promise<void> {

        // Get all files in data directory
        var fileNames: Array<string>;
        try {
            fileNames = await utils.getDataFiles();
            this.log(`Importing Course Data (${fileNames.length} files)\n`);
        }
        catch(ex) {
            this.log('Could not read from data directory');
            return;
        }

        // Import and process each file
        for (let fileName of fileNames) {

            // Read and parse the individual CSV file
            var data: Array<Array<string>>;
            try {
                data = await utils.readDataFile(fileName);
                this.log(`Importing File: ${fileName} (${data.length} records)`);
            }
            catch(ex) {
                this.log('Could not read file: ' + fileName);
            }

            // Process this data table, and convert rows to models
            // Also, ensure the headers are valid
            if (!this.processDataTable(data)) {
                this.log(`Data headers for file ${fileName} are not valid\n`);
            }

        }

        // Process enrollments, assign student/course refs
        // Enrollments are valid if student id or course id is invalid
        // Discard the enrollment if it is invalid
        var toRemove: Array<Enrollment> = [];
        this.enrollments.forEach((enrollment: Enrollment) => {

            var course: Course = this.courses.get(enrollment.courseId);
            var student: Student = this.students.get(enrollment.studentId);

            // Invalid Course Found
            if (!course) {
                this.log('Invalid Enrollment, Course: ' + enrollment.courseId);
                toRemove.push(enrollment);
            }

            // Invalid
            if (!student) {
                this.log('Invalid Enrollment, Student: ' + enrollment.studentId);
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


    }


    /** Data Table Processing **/

    /**
     *  Process an individual imported data table.  This basically
     *  looks at all rows/cols in the data table, validates the headers,
     *  converts the rows to models, and stores them in maps
     */
    private processDataTable(table: Array<Array<string>>) : boolean {

        var header = table[0];

        for (let modelName in this.definitions) {

            // Check each definition for a match
            if (this.isValidHeader(modelName, header)) {

                var def = this.definitions[modelName];

                // Process each data row except header
                table.forEach((row: Array<string>, i) => {
                    if (i > 0) {

                        // Process each column in row
                        // Convert row to object and assign to model
                        let values = {};
                        row.forEach((colValue: string, i) => {
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


    /** Import Definitions **/

    // Definitions for importing data tables
    private definitions = {
        course: {
            create: function(data) {
                var course = new Course(data);
                this.courses.set(course.id, course);
            },
            cols: {
                'course_id': 'id',
                'course_name': 'name',
                'state': 'state'
            }
        },
        student: {
            create: function(data) {
                var student = new Student(data);
                this.students.set(student.id, student);
            },
            cols: {
                'user_id': 'id',
                'user_name': 'name',
                'state': 'state'
            }
        },
        enrollment: {
            create: function(data) {
                var enrollment = new Enrollment(data);
                this.enrollments.set(enrollment.id, enrollment);
            },
            cols: {
                'course_id': 'courseId',
                'user_id': 'userId',
                'state': 'state'
            }
        }
    };

    /**
     * Check headers to determine is the data structure is correct
     */
    private isValidHeader(name: string, header: Array<string>) : boolean {

        var def = this.definitions[name];

        // Ensure header contains all columns
        for (let col of header) {
            if (!def.cols[col]) {
                return false;
            }
        }

        return true;

    }


    /** Log **/

    /**
     * Write import results to the log
     */
    private _log: string = '';
    private log(...content: Array<any>) : void {
        for (let item of content) {
            this._log += item.toString() + '\n';
        }
    }

    /**
     * Get logged import results
     */
    public getLog(): string {
        return this._log;
    }

}