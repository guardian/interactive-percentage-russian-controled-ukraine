const axios = require('axios')
const jsdom = require("jsdom")
const fs = require('fs')

const articleURL = "https://www.theguardian.com/world/2021/nov/02/south-africas-anc-on-course-for-worst-ever-electoral-performance-in-local-polls"
const interactiveURL = "https://www.theguardian.com/environment/ng-interactive/2021/dec/23/why-cop26-coal-power-pledges-dont-go-far-enough-visualised"

console.log("Updating templates...")

let articlePromise = axios.get(articleURL)
  .then(function (response) {
    createArticleTemplate(response.data)
  })
  .catch(function (error) {
    console.log(error)
  })

let interactivePromise = axios.get(interactiveURL)
  .then(function (response) {
    createInteractiveTemplates(response.data)
  })
  .catch(function (error) {
    console.log(error)
  })

Promise.all([articlePromise, interactivePromise]).then(() => {
  console.log("Done")
})

////////////////////////////////////////////////////////////////////////////////
// ARTICLE
////////////////////////////////////////////////////////////////////////////////

function createArticleTemplate(html) {
  let template = prepareArticleTemplate(html)

  let path = './harness/article.html'
  console.log("Writing article template to " + path)
  fs.writeFileSync(path, template)
}

function prepareArticleTemplate(html) {
  const dom = new jsdom.JSDOM(html)
  const document = dom.window.document

  removeUnwantedArticleElements(document)
  replaceArticleFurniture(document)
  insertIFrameElement(document)

  let serialized = dom.serialize()

   // this replacement needs to happen after serialization to prevent escaping
  serialized = serialized.replace("{{ title }}", "<%= title %>")
  serialized = serialized.replace("{{ headline }}", "<%= headline %>")
  serialized = serialized.replace("{{ standfirst }}", "<%= standfirst %>")

  serialized = serialized.replace("{{ iframe }}", `<iframe class="interactive-atom-fence" style="width:100%" srcdoc="
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset=&quot;utf-8&quot;>
            <meta name=&quot;viewport&quot; content=&quot;width=device-width,minimum-scale=1,initial-scale=1&quot;>
            <script>
                var fonts=[].slice.apply(window.parent.document.styleSheets).filter(function(sheet){return sheet.ownerNode.className.indexOf(&quot;webfont&quot;)>-1}).map(function(sheet){return sheet.ownerNode.textContent}).join(&quot; &quot;);var css=document.createElement(&quot;style&quot;);css.textContent=fonts;document.head.appendChild(css);
            </script>
            <style>
                <%- css %>
            </style>
        </head>
        <body>
            <%- html %>
            <script>
                <%- js %>
            </script>
            <script>
                function resize(){window.frameElement.height=document.body.offsetHeight}window.addEventListener(&quot;resize&quot;,resize);resize();
            </script>
        </body>
    </html>
  "></iframe>`)

  return serialized
}

function removeUnwantedArticleElements(document) {
  // remove all <script> tags
  document.querySelectorAll('script').forEach(element => {
    element.remove()
  })

  // remove banner ad from top of page
  document.querySelector('.top-banner-ad-container').remove()

  let headline = document.querySelector('[data-gu-name="headline"]')
  headline.querySelector('div:first-child>div:first-child>div').remove()

  let media = document.querySelector('[data-gu-name="media"]')
  media.remove()

  // remove email form
  document.querySelector('#footer__email-form').remove()

  // remove content
  let content = articleContentNode(document)
  content.innerHTML = ''
}

function replaceArticleFurniture(document) {
  let title = document.querySelector('title')
  title.innerHTML = '{{ title }}'

  let headline = document.querySelector('[data-gu-name="headline"]')
  headline.querySelector("h1").innerHTML = '{{ headline }}'

  let standfirst = document.querySelector('[data-gu-name="standfirst"]')
  standfirst.querySelector("p").innerHTML = '{{ standfirst }}'

  let byline = document.querySelector('[data-link-name="byline"]')
  byline.querySelector("div").innerHTML = 'Visuals team'
}

function articleContentNode(document) {
  return document.querySelector('#maincontent>div:first-child')
}

function insertIFrameElement(document) {
  let content = articleContentNode(document)

  let figure = document.createElement('figure')
  figure.className = 'element element-atom'
  figure.innerHTML = '{{ iframe }}'
    content.appendChild(figure)
}

////////////////////////////////////////////////////////////////////////////////
// INTERACTIVES
////////////////////////////////////////////////////////////////////////////////

const WEIGHTING = {
  INLINE: {
    class: 'element element-atom',
    target: './harness/dcr-interactive__inline.html',
  },
  SHOWCASE: {
    class: 'element element-atom element-showcase',
    target: './harness/dcr-interactive__showcase.html',
  },
  IMMERSIVE: {
    class: 'element element-atom element-immersive',
    target: './harness/dcr-interactive__immersive.html',
  },
}

function createInteractiveTemplates(html) {
  for (const key in WEIGHTING) {
    let template = prepareTemplate(html, WEIGHTING[key])

    let path = WEIGHTING[key].target
    console.log("Writing interactive template to " + path)
    fs.writeFileSync(path, template)
  }
}

function prepareTemplate(html, weighting) {
  const dom = new jsdom.JSDOM(html)
  const document = dom.window.document

  let content = contentNode(document)

  let paragraphClass = content.querySelector('p').className

  let figureClassList = content.querySelector('figure.element-atom').classList
  let figureClass = figureClassList[figureClassList.length - 1]

  removeUnwantedElements(document)
  replaceFurniture(document)
  insertMockElements(document, weighting, figureClass, paragraphClass)

  let serialized = dom.serialize()

   // this replacement needs to happen after serialization to prevent escaping
  serialized = serialized.replace("{{ title }}", "<%= title %>")
  serialized = serialized.replace("{{ headline }}", "<%= headline %>")
  serialized = serialized.replace("{{ standfirst }}", "<%= standfirst %>")
  serialized = serialized.replace("--my-custom-property: '{{ paragraphStyle }}';", "<%= paragraphStyle %>")
  serialized = serialized.replace("{{ paragraphBefore }}", "<%= paragraphBefore %>")
  serialized = serialized.replace("{{ html }}", "<%= html %>")

  return serialized
}

function contentNode(document) {
  return document.querySelector('.content__main-column--interactive')
}

function removeUnwantedElements(document) {
    // remove all <script> tags
    document.querySelectorAll('script').forEach(element => {
      element.remove()
    })
  
    // remove banner ad from top of page
    document.querySelector('.top-banner-ad-container').remove()
  
    // remove Cop26 badge
    let aside = document.querySelector('[data-gu-name="title"]')
    aside.querySelector('.content__labels>div:first-child>div').remove()

    // remove content
    let content = contentNode(document)
    content.innerHTML = ''
}

function replaceFurniture(document) {
  let title = document.querySelector('title')
  title.innerHTML = '{{ title }}'

  let headline = document.querySelector('.content__headline')
  headline.innerHTML = '{{ headline }}'

  let standfirst = document.querySelector('.content__standfirst>p')
  standfirst.innerHTML = '{{ standfirst }}'

  let byline = document.querySelector('.byline')
  byline.innerHTML = 'Visuals team'
}

function insertMockElements(document, weighting, figureClass, paragraphClass) {
  let content = contentNode(document)

  let paragraph = document.createElement('p')
  paragraph.className = paragraphClass
  paragraph.style = "--my-custom-property: '{{ paragraphStyle }}'"
  paragraph.innerHTML = "{{ paragraphBefore }}"
  content.appendChild(paragraph)

  let figure = document.createElement('figure')
  if (weighting !== WEIGHTING.INLINE) {
    figure.className = weighting.class + ' ' + figureClass
  } else {
    figure.className = weighting.class
  }
  content.appendChild(figure)

  let innerFigure = document.createElement('figure')
  innerFigure.className = 'interactive interactive-atom'
  innerFigure.innerHTML = `<link rel="stylesheet" type="text/css" href="main.css" />
                            {{ html }}
                            <script>
                                  <%= js %>
                            </script>
                          </figure>`
  figure.appendChild(innerFigure)
}