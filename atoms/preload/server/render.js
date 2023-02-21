import request from "request-promise"
import fs from "fs"
import React from 'react'
import renderToString from 'preact-render-to-string'
import App from 'shared/components/App.js'

export async function render() {

    const sheet = await request({"uri":'https://interactive.guim.co.uk/docsdata-test/1C5haByujz_4cFEnnMFyUnsOXrocWm8VuIknfWefqfog.json', json:true});
    fs.writeFileSync(`assets/sheet.json`, JSON.stringify(sheet));

    const content = sheet.sheets['scrolly-map']
    const html = renderToString(<App content={content} />)
    return `${html}`

 } 