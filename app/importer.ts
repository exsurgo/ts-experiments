"use strict";
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
        //for (let fileName of fileNames) {
            let fileName = fileNames[0];

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
            if (!this.processDataTable(data)) {
                this.log(`Data headers for file ${fileName} are not valid\n`);
            }

        //}

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
                        row.forEach((col: string, i) => {
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

    private convertSnakeCase(name: string) : string {
        return name.replace(/(\-\w)/g, function(m) {
            return m[1].toUpperCase();
        });
    }


    /** Import Definitions **/

    private definitions = {
        course: {
            create: function(data) {
                var course = new Course(data);
                this.courses.set(course.id, course);
            },
            cols: ['course_id', 'course_name', 'state']
        },
        student: {
            create: function(data) {
                var student = new Student(data);
                this.students.set(student.id, student);
            },
            cols: ['user_id', 'user_name', 'state']
        },
        enrollment: {
            create: function(data) {
                var enrollment = new Enrollment(data);
                this.enrollments.set(enrollment.id, enrollment);
            },
            cols: ['course_id', 'user_id', 'state']
        }
    };

    private isValidHeader(name: string, header: Array<string>) : boolean {
        for (let col of header) {
            if (this.definitions[name].cols.indexOf(col) == -1) {
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