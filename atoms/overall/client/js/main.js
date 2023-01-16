var el = document.createElement('script');
el.src = '<%= atomPath %>/app.js';
document.body.appendChild(el);



setTimeout(() => {
  if (window.resize) {  
    const html = document.querySelector('html')
    const body = document.querySelector('body')
  
    html.style.overflow = 'hidden'
    html.style.margin = '0px'
    html.style.padding = '0px'
  
    body.style.overflow = 'hidden'
    body.style.margin = '0px'
    body.style.padding = '0px'
  
  window.resize()
  }
  // Detect vertical scrollbar width and assign to css variable for sizing full viewport width elements
  document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");
  document.documentElement.style.setProperty('--half-scrollbar-width', ((window.innerWidth - document.documentElement.clientWidth) / 2) + "px");
},100)