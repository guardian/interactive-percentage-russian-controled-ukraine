### Running locally

Please run on node 16: `nvm install 16` `nvm use 16`

You need the gulp-cli installed globally: `npm install -g gulp-cli`

Make sure you are using the correct version of node with NVM: run `nvm use` in the root of the repo. 
If you don't have nvm installed, add it: `brew install nvm`.

Install node modules: `npm i`

To run locally: `npm start` or `gulp`.  

### Test harness

When the dotcom team makes changes to the website, the local test harness needs to be updated to reflect the new reality.

Update article and DCR templates in test harness:

```
npm run update-harness
```

If the script doesn't work, that's an indication that there has been a breaking change on the website. In that case, try to find out what has changed and talk to the dotcom team. If the change does not affect the working of interactives but just the working of the script, then the `harness/update-harness.js` script needs to be updated.


#### Viewing multiple atoms together

To specifiy the atoms you'd like to view together add the names to the array 'multipleAtomSetup' in the config. You can also add custom paragrphs, by adding the word 'paragraph' to the array. To edit this paragraph you simply need to change the text in 'mockParagraph' in the config. 

You can also add custom HTML, this will sit after the atoms. To do this simply edit the 'multipleAtoms.html' in the harnesses folder.

Atoms will only affect each other when they are being in embedded in an interactive article templates or an immersive article templates. In the simplest article template they are added in iframes so all their code is sandboxed and can't affect either the page or other atoms.

### Create a new atom 

Duplicate an existing atom. Remember to change the path in the server/render.js file to point to the html file in the new atom. 

### Deploy to S3

To deploy to the Interactives S3 bucket you need AWS credentials for the Interactives account in your command line. You can get these from the Guardian's permissions manager system [Janus](https://janus.gutools.co.uk/). You need to be assigned these permissions and be on a Guardian network or VPN to see them on Janus. 

Fill out config.json:

```
{
    "title": "Title of your interactive",
    "docData": "Any associated external data",
    "path": "year/month/unique-title"
}
```

Deploy: `gulp deploylive`

Get the deployed links: `gulp url`

The link can be pasted into a Composer file 


### Testing in apps

To test on the Guardian apps - follow our 
[Testing in Apps guide here](https://github.com/guardian/interactive-atom-template-2019/blob/master/docs/guide-to-apps-testing.md)

To test with dark mode on apps - see [Testing in Dark Mode](https://github.com/guardian/interactive-atom-template-2019/blob/master/docs/dark-mode-in-apps.md)


### Reusable React components 

If your project uses React and is likely to use generic web components like search bars etc, it might save time to use the Digital Team's resuable components library. Intro to [their components library here](https://guardian.github.io/source/?path=/story/components--page).


### Loading resources (e.g. assets)

Resources must be loaded with absolute paths, otherwise they won't work when deployed.
Use the template string `<%= path %>` in any CSS, HTML or JS, it will be replaced
with the correct absolute path.

```html
<img src="<%= path %>/image.png" />
```

```css
.test {
    background-image: url('<%= path %>/image.png');
}
```

```js
var url = '<%= path %>/image.png';
```


### Using the ScrollyTeller module
The ScrollyTeller module is written as a class. You can check the scrollyteller-example branch for a full example.

Import it as normal into your project
```
import ScrollyTeller from "./scrollyteller"
```

Instantiate a new instance of it and pass in a config object
```
const scrolly = new ScrollyTeller({
    parent: document.querySelector("#scrolly-1"),
    triggerTop: 1/3, // percentage from the top of the screen that the trigger should fire
    triggerTopMobile: 0.75,
    transparentUntilActive: true
});
```

Add your trigger points:
```
scrolly.addTrigger({num: 1, do: () => {
    console.log("Console log 1");
}});
```

And finally start off the scroll listener:

```
scrolly.watchScroll();
```

You'll also need to comment in the _scrolly.scss code in main.scss, as well as structuring your HTML in the following way:
```
<div id="scrolly-1">
    <div class="scroll-wrapper">
        <div class="scroll-inner">
            <svg id="data-viz">
            </svg>
        </div>
        <div class="scroll-text">
            <div class="scroll-text__inner">
                <div class="scroll-text__div">
                    <p>1</p>
                </div>
            </div>
            <div class="scroll-text__inner">
                <div class="scroll-text__div"> 
                    <p>2</p>
                </div>
            </div>
            <div class="scroll-text__inner">
                <div class="scroll-text__div">
                    <p>3</p>
                </div>
            </div>
        </div>
    </div>
</div>
```

## Using ScrollyTeller Progress code 

This module should do what the module above but also returns two numbers - one the total progress of the scrolly teller from 0 to 1, 1 being scrolling complete, and also the progress within any given section or box, generated by the scrolly.gradual function.

In your `app.js` file you'll need to do something like this. 

```javascript
const scrolly1 = document.querySelector("#scrolly-1")

const callback = () => console.log("do something") 

const scrolly = new ScrollyTeller({
    parent: scrolly1,
    triggerTop: 1/3, // percentage from the top of the screen that the trigger should fire
    triggerTopMobile: 0.75,
    transparentUntilActive: true,
    callback:callback,
    overall: () => {}
})

scrolly.gradual( (progressInBox, i, abs, total) => {
        console.log("in box progress", progressInBox)
})

scrolly.overall((overallProgress) => {
    console.log("overall progress?", overallProgress)
})


// And finally start off the scroll listener
scrolly.watchScroll()

```
