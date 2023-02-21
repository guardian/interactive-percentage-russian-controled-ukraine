import { Map as mapGl } from 'maplibre-gl';
import ukraine from 'assets/geoBoundaries-UKR-ADM0_simplified.json'
import separatists from 'assets/separatists.json'
import separatistsLine from 'assets/separatists-edges.json'
import annexed from 'assets/annexed-regions.json'
import patch from 'assets/patch.json'
import oblasts from 'assets/oblasts.json'
import dark from 'assets/gv-dark.json'
import ScrollyTeller from "shared/js/scrollyteller";
import sheet from 'assets/sheet.json'
import labels from 'assets/labels.json'
import { feature } from "topojson-client"
import moment from 'moment'
import { gsap } from 'gsap'

const fnBrowserDetect = () => {
                 
	let userAgent = navigator.userAgent;
	let browserName;
	
	if(userAgent.match(/chrome|chromium|crios/i)){
		browserName = "chrome";
	  }else if(userAgent.match(/firefox|fxios/i)){
		browserName = "firefox";
	  }  else if(userAgent.match(/safari/i)){
		browserName = "safari";
	  }else if(userAgent.match(/opr\//i)){
		browserName = "opera";
	  } else if(userAgent.match(/edg/i)){
		browserName = "edge";
	  }else{
		browserName="No browser detection";
	  }
	
	 return browserName
}

const getMobileOperatingSystem = () => {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

//------------------------HEADER----------------------------------------------

let subjectLabels = null;
let headline = null;
let standfirst = null;
let byline = null;
let details = null;
let social = null;

if (window.location.protocol == 'https:' || window.location.protocol == 'http:') {

	subjectLabels = document.querySelector('.content__labels ').innerHTML;
	headline = document.querySelector('[data-gu-name="headline"] h1').innerHTML;
	standfirst = document.querySelector('[data-gu-name="standfirst"] p').innerHTML;
	byline = document.querySelector('[data-link-name="byline"] div');
	details = document.querySelector('[data-gu-name="meta"]').innerText.split('\n');
	social = document.querySelector('.meta__social').innerHTML;
	document.querySelector('.header-wrapper__date').innerHTML = details[1];
	

}
else {

	headline = document.querySelector('.headline.selectable').innerHTML;
	standfirst = document.querySelector('.standfirst.selectable p').innerHTML;
	byline = document.querySelector('.meta__byline');
	details = document.querySelector('.meta__published__date');
	document.querySelector('.header-wrapper__date').appendChild(details)

	if(getMobileOperatingSystem() == 'Android'){
		document.querySelector('.scroll-text__fixed').style.top = '56px';
	}
	
}



document.querySelector('.header-wrapper__byline').appendChild(byline);
document.querySelector('.header-wrapper__content__labels').innerHTML = subjectLabels
document.querySelector(".header-wrapper__content .content__headline").innerHTML = headline;
document.querySelector(".header-wrapper__content .scroll-text__fixed__header").innerHTML = standfirst;
document.querySelector('.header-wrapper__meta__social').innerHTML = social;


//------------------------resize map container------------------------------------------

let isMobile = window.matchMedia('(max-width: 600px)').matches;

const isSafari = fnBrowserDetect() == 'safari' ? true : false;

let atomEl = document.getElementById('gv-wrapper');

let width = document.documentElement.clientWidth;

//---------------------------feed map styles with extra data-------------------------------------------------------------

dark.sources.oblasts.data = oblasts;
dark.sources.separatists.data = separatists;
dark.sources['separatists-line'].data = separatistsLine;
dark.sources.annexed.data = annexed;

dark.sources.patch.data = patch;
dark.sources['ukraine-fill'].data = ukraine;
dark.sources['ukraine-border'].data = ukraine;
dark.sources.labels.data = labels;

//---------------------------generate file dates-------------------------------

const filesDates = ["24-02-2022","25-02-2022","26-02-2022","27-02-2022","28-02-2022","01-03-2022","02-03-2022","03-03-2022","04-03-2022","05-03-2022","06-03-2022","07-03-2022","08-03-2022","09-03-2022","10-03-2022","11-03-2022","12-03-2022","16-03-2022","18-03-2022","23-03-2022","27-03-2022","29-03-2022","30-03-2022","31-03-2022","01-04-2022","02-04-2022","03-04-2022","04-04-2022","05-04-2022","06-04-2022","09-04-2022","11-04-2022","12-04-2022","14-04-2022","18-04-2022","19-04-2022","20-04-2022","22-04-2022","23-04-2022","24-04-2022","27-04-2022","28-04-2022","29-04-2022","01-05-2022","04-05-2022","06-05-2022","08-05-2022","10-05-2022","13-05-2022","17-05-2022","20-05-2022","21-05-2022","24-05-2022","26-05-2022","29-05-2022","01-06-2022","02-06-2022","04-06-2022","05-06-2022","10-06-2022","11-06-2022","13-06-2022","16-06-2022","20-06-2022","22-06-2022","25-06-2022","27-06-2022","30-06-2022","03-07-2022","05-07-2022","08-07-2022","11-07-2022","15-07-2022","18-07-2022","21-07-2022","25-07-2022","27-07-2022","31-07-2022","04-08-2022","08-08-2022","11-08-2022","13-08-2022","16-08-2022","20-08-2022","23-08-2022","25-08-2022","28-08-2022","01-09-2022","02-09-2022","04-09-2022","06-09-2022","07-09-2022","08-09-2022","09-09-2022","10-09-2022","11-09-2022","12-09-2022","13-09-2022","15-09-2022","17-09-2022","22-09-2022","23-09-2022","24-09-2022","25-09-2022","28-09-2022","30-09-2022","01-10-2022","02-10-2022","03-10-2022","04-10-2022","05-10-2022","07-10-2022","09-10-2022","14-10-2022","18-10-2022","22-10-2022","27-10-2022","31-10-2022","03-11-2022","06-11-2022","09-11-2022","12-11-2022","15-11-2022","18-11-2022","22-11-2022","26-11-2022","30-11-2022","03-12-2022","05-12-2022","08-12-2022","12-12-2022","17-12-2022","21-12-2022","24-12-2022","28-12-2022","31-12-2022","04-01-2023","09-01-2023","12-01-2023","14-01-2023","18-01-2023","21-01-2023","24-01-2023","27-01-2023","29-01-2023","03-02-2023","06-02-2023","11-02-2023","13-02-2023", "19-02-2023"];

//---------------------------set the scrolly up------------------------------

const scrolly = new ScrollyTeller({
	parent: document.querySelector("#scrolly-1"),
	triggerTop: 0.5, // percentage from the top of the screen that the trigger should fire
	triggerTopMobile: 0.5,
	transparentUntilActive: false
});

//---------------------------render the map----------------------------------


const renderMap = async (webpEnabled) => {

	const topoFile = await fetch('<%= path %>/output-topo-10-filtered.json')
	
	const areas = await topoFile.json()
	
	const data = feature(areas, areas.objects['merged-layers']);

	

	//--------------------------------------preload finished---------------------------------------

	dark.sources.overlays.data = data;

	//--------------------------------------make the map----------------------------------------

	let map = new mapGl({
		container: 'gv-wrapper', // container id
		style: dark,
		bounds: isMobile ? [[22, 44], [40.5, 54.5]] : [[22, 44], [40.5, 52.5]],
		interactive: false,
		trackResize:true
	});
	

	onresize = (event) => {

		console.log('on resize map')

		isMobile = window.matchMedia('(max-width: 600px)').matches;

		width = document.documentElement.clientWidth;

		atomEl.style.width = width + "px";
		atomEl.style.height = "100vh";

		map.resize()

		map.fitBounds(isMobile ? [[22, 44], [40.5, 54.5]] : [[22, 44], [40.5, 52.5]])

	};

	map.on('load', () => {

		//---------------------------------set page style back to original------------------------------------

		document.querySelector('.loading-overlay__inner').style.opacity = 0;

		map.setLayoutProperty("ukraine-border-halo", "visibility", 'visible')
		map.setLayoutProperty("ukraine-border", "visibility", 'visible')
		map.setLayoutProperty("separatists-fill", "visibility", 'visible')
		
		// document.body.style.overflow = 'initial';

		//----------------------------------set the scrolly-------------------------------------------------------------------
		const scrollySteps = sheet.sheets['scrolly-map'];

		const dateAnimation = { index: 0 };

		function tick(i) {

			const currentIndex = Math.round(dateAnimation.index);
			const currentDate = filesDates[currentIndex];

			updateMap(i, currentDate);
		}

		let animation = gsap.fromTo(null, { index: 0 }, { index: 0, overwrite: true, duration: 0, ease: "linear" });

		
		scrollySteps.forEach((d, i) => {

			scrolly.addTrigger({
				num: i + 1, do: () => {

					if(!isSafari)
					{
						let currentPos = dateAnimation.index;
						let endDate = scrollySteps[i].Date;
						let endPos = filesDates.indexOf(endDate);

						animation.kill()
						animation = gsap.fromTo(dateAnimation, { index: currentPos }, { index: endPos, overwrite: true, duration: 0.8, ease: "linear", onStart: resetLabels, onUpdate: tick, onUpdateParams: [i], onComplete: updateLabels, onCompleteParams: [i, scrollySteps[i].Date] })
					}
					else{
						updateMap(i, scrollySteps[i].Date);
						resetLabels();
						updateLabels(i, scrollySteps[i].Date);
					}
				}
			})
		})

		scrolly.watchScroll();

		const resetLabels = () => {
			map.getStyle().layers.forEach(l => { if (l.type == "symbol") map.setLayoutProperty(l.id, "visibility", "none") });
		}

		const updateLabels = (i, currentDate = '') => {

			if(i > 0)
			{
				map.setLayoutProperty("patch", "visibility", 'visible')
				map.setLayoutProperty('Admin-0 capital', 'visibility', 'visible');
				map.setLayoutProperty('Admin-0 country', 'visibility', 'visible');
				map.setLayoutProperty('Admin-1 capital', 'visibility', 'visible');

				if (i == 1) {
					map.setLayoutProperty('Admin-1 capital', 'visibility', 'visible')
					map.setLayoutProperty('Admin-0 country', 'visibility', 'visible')
					map.setLayoutProperty('Admin-0 capital', 'visibility', 'visible')
					map.setLayoutProperty('Autonomous Republic', 'visibility', 'visible')
					map.setPaintProperty('Autonomous Republic', "text-color", "#333")
					map.setFilter('Autonomous Republic', ["match", ['get', 'NAME_1'], ["Russian\ncontrol"], true, false]);
				}
				if (i == 2) {
					map.setLayoutProperty('Autonomous Republic', 'visibility', 'visible')
					map.setPaintProperty('Autonomous Republic', "text-color", "#880105")
					map.setFilter('Autonomous Republic', ["match", ['get', 'NAME_1'], ["Russian\ncontrol", "Russian\noperations"], true, false]);

				}
				if (i == 3) {
					map.setLayoutProperty('Autonomous Republic', 'visibility', 'visible')
					map.setPaintProperty('Autonomous Republic', "text-color", "#ff7f00")
					map.setFilter('Autonomous Republic', ["match", ['get', 'NAME_1'], ["Ukraine\nregained\ncontrol"], true, false]);
				}

				if (moment(currentDate, 'DD-MM-YYYY') >= moment('30-09-2022', 'DD-MM-YYYY')) {
					map.setFilter('Annexed', ["match", ['get', 'NAME_1'], ["Illegally\nannexed\nin 2022"], true, false]);
					map.setLayoutProperty('Annexed', "visibility", "visible");
					map.setLayoutProperty('Annexed-line', "visibility", "visible");
				}
				else {
					map.setLayoutProperty('Annexed', "visibility", "none");
					map.setLayoutProperty('Annexed-line', "visibility", "none");
				}
			}
			else{
				resetLabels()
				map.setLayoutProperty('Annexed-line', "visibility", "none");
				//map.setPaintProperty("background", 'background-color', '#FFFFFF')
			}

			if(isMobile)
			{
				map.setFilter('Admin-1 capital', ["match", ["get","NAME_1"],["Kherson","Kharkiv", "Donetsk"], true, false]);
			}

		}

		const updateMap = (i, currentDate) => {

			if (i == 0) {
				resetLabels()
				document.querySelector('.header-wrapper').classList.remove('over');
				document.querySelector('.scroll-text__fixed').classList.add('over');
				document.querySelector('.scroll-text__fixed').classList.add('over');
				document.querySelector('#gv-wrapper').style.borderTop = '1px solid #506991';
			}
			else {
				document.querySelector('.header-wrapper').classList.add('over');
				document.querySelector('.scroll-text__fixed').classList.remove('over');
				document.querySelector('#gv-wrapper').style.borderTop = 'none';
			}

			if (i > 1) {

				map.setPaintProperty('separatists-fill', "fill-opacity", 0)
				map.setPaintProperty('separatists-line', "line-opacity", 0)
				map.setPaintProperty('patch', "fill-opacity", 1)
				map.setPaintProperty('overlays', "fill-opacity", 1)

				document.getElementsByClassName('scroll-text__fixed__text')[0].innerHTML = scrollySteps[i].Copy;

				if (currentDate) {

					map.setFilter("overlays",
						["all",
							["==", 'date', currentDate]
						]
					)

					map.setLayoutProperty('overlays', 'visibility', 'visible')
	
					document.getElementsByClassName('scroll-text__fixed__date')[0].innerHTML = moment(currentDate, "DD-MM-YYYY").format("D MMM YYYY");
	
					document.getElementsByClassName('hr')[0].style.width = Math.ceil((filesDates.indexOf(currentDate) * 100) / filesDates.length) + 1 + '%';
					document.getElementsByClassName('hr')[0].style.opacity = 1;
	
				}

			}
			else {

				map.setLayoutProperty('overlays', 'visibility', 'none')

				map.setPaintProperty('separatists-fill', "fill-opacity", 1)
				map.setPaintProperty('separatists-line', "line-opacity", 1)
				map.setPaintProperty('patch', "fill-opacity", 0)

				document.getElementsByClassName('hr')[0].style.width = 0 + '%';
				document.getElementsByClassName('hr')[0].style.opacity = 0;

				document.getElementsByClassName('scroll-text__fixed__text')[0].innerHTML = sheet.sheets['scrolly-map'][i].Copy;
				document.getElementsByClassName('scroll-text__fixed__date')[0].innerHTML = "";

			}

		}


	})

}


renderMap()






