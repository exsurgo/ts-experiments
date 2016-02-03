"use strict";
import {Importer} from './app/importer';


async function main() {

    // Import all data and log results
    var importer = new Importer();
    await importer.run();
    console.log(importer.getLog());

}

main();