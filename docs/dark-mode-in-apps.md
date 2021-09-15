# Getting interactives to work with dark mode in apps 

If a user is viewing the Guardian app in "dark mode", by default, interactive atoms and chart atoms will get a white background applied to them. This makes sure that the default black text is visible on dark mode. 

However, a white background can look bad on some interactives. For interactives where design is more important, you may want to override the white background with a transparent or dark one and add specific CSS styles for dark mode. 

NB: This should work for pages rendered through the old app rendering platform. Currently any page with an interactive atom on it gets put through the old rendering platform.  


## Viewing dark mode on your computer

The background-color attribute is set behind a dark-mode media query so you will only see this in Inspector if you have set your browser or Macbook to dark mode. 

To do this on your Mac go to:

**System Preferences > General > Appearance > Dark**

The apps-rendering page should now be in dark-mode and you should be able to see that all atoms have the default white background. 


## Overriding the white background and adding dark-mode styles 

Your interactives CSS needs to set the `background-color` of the `body` more forcibly than the Apps-Rendering CSS. You will need to use something like:

```
@media (prefers-color-scheme: dark) {
        body {
            background: transparent !important;
        } 
        h1, h2, p, span {
            color: white;
        }
        text {
            fill: white; 
        }
    }
```

You can add a class or id to the body if you need to make the CSS more specific.

Importantly, you want to make sure this applies only on apps. Macbooks can have dark mode but until dotcom implements dark mode, we only want dark mode styles to appear in apps. To do that: 

Add some code like this to your `app.js` file. And wrap all your dark mode code above in an `.in-app { }` selector. This means it will only apply when the atom is embedded in an app article page. 

```
const checkApp = () => {   
  // check the parent window to see if this atom is embedded in an app
  const parentIsIos = window.parent.document.querySelector(".ios") // null if not present
  const parentIsAndroid = window.parent.document.querySelector(".android") // null if not present

  // if it is in an app, add the 'in-app' class name to the body
  if(parentIsIos || parentIsAndroid){ document.querySelector("body").classList.add("in-app") }
}


checkApp()
```

You don't need to do this for interactive pages, only article pages (it's a way of getting around the iframe that is used by article pages). 



## If apps-rendering ever does pages with interactive atoms

The new Apps-Rendering platform CSS reaches into the iframe that hosts the interactive and sets the `background-color` of the `body` to white. [Code here](https://github.com/guardian/apps-rendering/blob/2436d412831ff14a0709b1813fd0421c95eb3663/src/components/atoms/interactiveAtom.tsx#L37).

You can view this in action by opening a published page in your computer browser in the apps-rendering view: 

**Guardian article > Teleporter > apps-rendering**

Inspect the body element of the iframe that hosts your interactive. 

Old apps-rendering [sets the white background here](https://github.com/guardian/mobile-apps-article-templates/blob/master/ArticleTemplates/assets/scss/themes/darkMode/_darkModeShared.scss).

