import fs from 'fs'
import path from 'path'
import turf from 'turf'

const directoryPath = path.join(__dirname, '../../../files');

fs.readdir(directoryPath, function (err, folders) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    folders.forEach(function (file) {

        if(! /^\..*/.test(file)) {

            fs.readdir(directoryPath + '/' + file, function (err, files) {

                files.forEach(f => {

                    if(! /^\..*/.test(f)) {

                        try {
                            let rawdata = fs.readFileSync(path.join(directoryPath + '/' + file + '/' + f + '/clipped.json'));
                            console.log(turf.area(JSON.parse(rawdata)))
                        } catch (error) {
                            console.log(error, file)
                        }
                    }
                    
                })
            })
        }     
    });
})



console.log('hola')