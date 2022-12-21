import request from "request-promise"
import fs from "fs"


export async function render() {

    const sheet = await request({"uri":'https://interactive.guim.co.uk/docsdata-test/1C5haByujz_4cFEnnMFyUnsOXrocWm8VuIknfWefqfog.json', json:true});

    fs.writeFileSync(`assets/sheet.json`, JSON.stringify(sheet));

    let promises = []

    sheet.sheets['scrolly-map'].forEach(date => {
        promises.push('assets/russian-control/area-' + date.Date)
    })


    let html = ''

    sheet.sheets['scrolly-map'].forEach(element => {

            html += `<div class="scroll-text__inner">
                            <div class="scroll-text__div">
                                <p>${element.Copy}</p>
                            </div>
                        </div>`
    }); 

    return `<div id="scrolly-1">
    <div class="scroll-wrapper">
        <div class="scroll-inner">
            <div id='gv-wrapper'>
                <div id="date"></div>
            </div>
            
        </div>
        <div class="scroll-text">
            ${html}
        </div>
    </div>
    </div>
    `;

 } 