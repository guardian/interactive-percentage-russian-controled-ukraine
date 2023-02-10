import request from "request-promise"
import fs from "fs"
// import { merge } from "topojson-client"
// import moment from 'moment'



export async function render() {

    const sheet = await request({"uri":'https://interactive.guim.co.uk/docsdata-test/1C5haByujz_4cFEnnMFyUnsOXrocWm8VuIknfWefqfog.json', json:true});

    fs.writeFileSync(`assets/sheet.json`, JSON.stringify(sheet));

    // const areas = await request({"uri":'https://interactive.guim.co.uk/isw/topojson.json', json:true})

    // const firstDate = moment("24-02-2022",'DD-MM-YYYY').utc()
    // const lastDate = moment("31-01-2023",'DD-MM-YYYY').utc()

    // let filesDates = [firstDate.format('DD-MM-YYYY')];

    // while(firstDate.add(1, 'days').diff(lastDate) < 0) {
    //     filesDates.push(firstDate.format('DD-MM-YYYY'));
    // }

    // filesDates.push(lastDate.format('DD-MM-YYYY'))

    // const geojsonUkr = filesDates.map(currentDate => merge(areas, areas.objects['merged-layers'].geometries.filter(f => f.properties.date === currentDate && f.properties.type === 'Claimed_Ukrainian_Counteroffensives')))
    // const geojsonRusAdv = filesDates.map(currentDate => merge(areas, areas.objects['merged-layers'].geometries.filter(f => f.properties.date === currentDate && f.properties.type === 'Russian_Advances_Shapefile')))
    // const geojsonRusCon = filesDates.map(currentDate => merge(areas, areas.objects['merged-layers'].geometries.filter(f => f.properties.date === currentDate && f.properties.type === 'Russian_CoT_in_Ukraine_Shapefiles')))

    // fs.writeFileSync(`assets/geojson-ukr.json`, JSON.stringify(geojsonUkr));
    // fs.writeFileSync(`assets/geojson-russian-advance.json`, JSON.stringify(geojsonRusAdv));
    // fs.writeFileSync(`assets/geojson-russian-control.json`, JSON.stringify(geojsonRusCon));


    let html = ''
    
    sheet.sheets['scrolly-map'].forEach(element => {
        
        html += `<div class="scroll-text__inner">
                        <div class="scroll-text__div">
                        </div>
                    </div>`
    });

    return `
    <div id="scrolly-1">
        <div class="scroll-wrapper">
            <div class="scroll-inner">
                <div id='gv-wrapper'>

                    <div class="header-wrapper">
                        <div class="header-background"></div>

                        <div class="header-wrapper__content">

                            <h1 class="content__headline"></h1>

                            <div class="scroll-text__fixed__header"></div>

                            <div class="header-wrapper__byline"></div>
                            
                            <div class="header-wrapper__date"></div>
                        </div>

                    </div>

                    

                    <div class="scroll-text__fixed over">
                        <hr class="hr"></hr>
                        <h2 class="scroll-text__fixed__date"></h2>
                        <div class="scroll-text__fixed__text"></div>
                    </div>

                    <div class="scroll-text__wrapper"></div>
                       
                </div>
            </div>
            <div class="scroll-text">
                ${html}
            </div>
        </div>
    </div>`;

 } 