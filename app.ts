"use strict";
import {Importer} from './app/importer';


async function main() {

    var importer = new Importer();
    await importer.run();
    console.log(importer.getLog());

}

main();