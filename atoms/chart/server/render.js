import request from "request-promise"
import React from 'react'
import renderToString from 'preact-render-to-string'
import App from 'shared/components/App-chart.js'

export async function render() {

    const sheet = await request({"uri":'https://interactive.guim.co.uk/docsdata-test/1C5haByujz_4cFEnnMFyUnsOXrocWm8VuIknfWefqfog.json', json:true});

    const content = sheet.sheets['scrolly-chart']
    const html = renderToString(<App content={content} />)
    return `${html}`

 } 