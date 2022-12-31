import fs from 'fs'
import path from 'path'
import turf from 'turf'

const directoryPath = path.join(__dirname, '../../../files');

let csv = 'folder,file,oblast,area-m2'+'\r'

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

                            let clipped = JSON.parse(rawdata)

                            clipped.features.forEach(feature => {
                                //console.log(f,feature.properties.NAME_1,turf.area(feature))
                                csv += file+','+f+','+feature.properties.NAME_1+','+turf.area(feature)+'\r'
                                //console.log(feature.NAME_1,turf.area(feature))
                            })

                            fs.writeFileSync(`assets/areas.csv`, csv);

                            //console.log(turf.area(JSON.parse(rawdata)))
                        } catch (error) {
                            console.log(error, file)
                        }
                    }
                })
            })
        }     
    });

    
})


