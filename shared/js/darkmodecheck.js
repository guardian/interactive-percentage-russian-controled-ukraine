export const checkAppForDarkMode = () => {

    // eg AMP pages this is not present so just return. Dark mode can't work on iframed atoms in AMP
    if(!window.parent) {
      return; 
    }
  
    // check the parent window to see if this atom is embedded in an app
    const parentIsIos = window.parent.document.querySelector(".ios") // null if not present
    const parentIsAndroid = window.parent.document.querySelector(".android")

    // if it is in an app, add the 'in-app' class name to the body
    if(parentIsIos || parentIsAndroid){ document.querySelector("body").classList.add("in-app") }
    
    // hack for android app - it also needs this for an annoying reason 
    const parentIsInDarkMode = window.parent.document.querySelector(".dark-mode-on")
    if(parentIsInDarkMode) { document.querySelector("body").classList.add("dark-mode-on") }
  }
  