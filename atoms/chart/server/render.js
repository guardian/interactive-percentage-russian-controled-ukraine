import request from "request-promise"

export async function render() {

    const sheet = await request({"uri":'https://interactive.guim.co.uk/docsdata-test/1C5haByujz_4cFEnnMFyUnsOXrocWm8VuIknfWefqfog.json', json:true});

    let html = ''

    sheet.sheets['scrolly-chart'].forEach(element => {
        
        html += `<div class="scroll-text__inner">
                    <div class="scroll-text__div">
                    </div>
                </div>`
    });

    return `
    <div id="scrolly-2">
        <div class="scroll-wrapper">
            <div class="scroll-inner">
                <div id='gv-wrapper-2'>
                    <div class="scroll-text__fixed-2 over">
                        <hr class="hr-2"></hr>
                        <h2 class="scroll-text__fixed__date">
                        ${sheet.sheets['scrolly-chart'][0].Header}
                        </h2>
                        <p class='date'></p>
                        <div class="scroll-text__fixed__text">
                            <p>${sheet.sheets['scrolly-chart'][0].Copy}</p>
                        </div>
                    </div>
                       
                </div>
            </div>
            <div class="scroll-text">
                ${html}
            </div>
        </div>
    </div>`

 } 