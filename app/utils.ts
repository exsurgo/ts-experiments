"use strict";
import * as fs from 'fs';
import * as path from 'path';
const parse = require('csv-parse');


/**
 * Retrieves absolute path to data directory or file
 */
export function getDataPath(fileName?: string) : string {
    return path.join(process.cwd(), 'data', fileName ? fileName : '');
}

/**
 * Get a list of file in data directory
 */
export async function getDataFiles() : Promise<Array<string>> {
    return new Promise<Array<string>>((resolve) => {
        fs.readdir(getDataPath(), function (err, data) {
            resolve(data);
        });
    });
}

/**
 * Read content of data file.  Auto-parse based on extension.
 */
export async function readDataFile(filePath: string) : Promise<Array<Array<string>>> {

    return new Promise<Array<Array<string>>>((resolve) => {

        fs.readFile(getDataPath(filePath), 'utf8', function (err, content) {

            // Parse based on file ext.. .csv, .json, etc.
            var ext = path.extname(filePath);
            if (ext === '.csv') {
                parse(content, function (err, data) {
                    resolve(data);
                });
            }
            else if (ext === '.json') {
                resolve(JSON.parse(content));
            }
            else {
                throw new Error(`Could not parse file: ${filePath}`)
            }

        });

    });

}

