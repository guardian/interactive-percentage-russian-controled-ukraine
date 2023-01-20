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

                    

                    <div class="scroll-text__fixed">
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