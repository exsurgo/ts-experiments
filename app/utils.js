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
var fs = require('fs');
var path = require('path');
const parse = require('csv-parse');
/**
 * Retrieves absolute path to data directory or file
 */
function getDataPath(fileName) {
    return path.join(process.cwd(), 'data', fileName ? fileName : '');
}
exports.getDataPath = getDataPath;
/**
 * Get a list of file in data directory
 */
function getDataFiles() {
    return __awaiter(this, void 0, Promise, function* () {
        return new Promise((resolve) => {
            fs.readdir(getDataPath(), function (err, data) {
                resolve(data);
            });
        });
    });
}
exports.getDataFiles = getDataFiles;
/**
 * Read content of data file.  Auto-parse based on extension.
 */
function readDataFile(filePath) {
    return __awaiter(this, void 0, Promise, function* () {
        return new Promise((resolve) => {
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
                    throw new Error(`Could not parse file: ${filePath}`);
                }
            });
        });
    });
}
exports.readDataFile = readDataFile;
//# sourceMappingURL=utils.js.map