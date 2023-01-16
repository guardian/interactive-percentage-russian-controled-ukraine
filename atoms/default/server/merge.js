import fs from 'fs'
import path from 'path'

const directoryPath = path.join(__dirname, '../../../files/Russian_CoT_in_Ukraine_Shapefiles');


fs.promises.readdir(directoryPath)
.then(filenames => {

    let clean = filenames.splice(1,filenames.length)

    let directories = clean.map(f => {

        if(json){
            JSON.parse(fs.readFileSync(directoryPath + '/' + f))
        }
        
    })

    Promise.all(directories)
    .then(result => {

        result.forEach(r => {

            r.arcs.forEach(a => {

            })
            
            let key = Object.keys(r.objects)[0]

            newFile.objects.merged.geometries.push(r.objects[key].geometries)
        })

        //console.log(newFile)

        fs.writeFileSync(`${directoryPath}/merged-topo.json`,JSON.stringify(newFile))
    })
    
})
.catch(err => {
    console.log(err)
})

