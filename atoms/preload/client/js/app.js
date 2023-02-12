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


//------------------------HEADER----------------------------------------------

let headline = null;
let standfirst = null;
let byline = null;
let details = null;

if (window.location.protocol == 'https:' || window.location.protocol == 'http:') {

	headline = document.querySelector('[data-gu-name="headline"] h1').innerHTML;
	standfirst = document.querySelector('[data-gu-name="standfirst"] p').innerHTML;
	byline = document.querySelector('[data-link-name="byline"] div');
	details = document.querySelector('[data-gu-name="meta"]').innerText.split('\n');
	document.querySelector('.header-wrapper__date').innerHTML = details[1];

}
else {

	headline = document.querySelector('.headline.selectable').innerHTML;
	standfirst = document.querySelector('.standfirst.selectable p').innerHTML;
	byline = document.querySelector('.meta__byline');
	details = document.querySelector('.meta__published__date');
	document.querySelector('.header-wrapper__date').appendChild(details)
}


document.querySelector('.header-wrapper__byline').appendChild(byline);
document.querySelector(".header-wrapper__content .content__headline").innerHTML = headline;
document.querySelector(".header-wrapper__content .scroll-text__fixed__header").innerHTML = standfirst;


//------------------------resize map container------------------------------------------

let isMobile = window.matchMedia('(max-width: 600px)').matches;

let atomEl = document.getElementById('gv-wrapper');

let width = document.documentElement.clientWidth;
let height = window.innerHeight;

atomEl.style.width = width + "px";
atomEl.style.height = height + "px";

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

const firstDate = moment("24-02-2022", 'DD-MM-YYYY').utc()
const lastDate = moment("10-02-2023", 'DD-MM-YYYY').utc()

let filesDates = [firstDate.format('DD-MM-YYYY')];

while (firstDate.add(1, 'days').diff(lastDate) < 0) {
	filesDates.push(firstDate.format('DD-MM-YYYY'));
}

filesDates.push(lastDate.format('DD-MM-YYYY'))

//---------------------------render the map----------------------------------


const renderMap = async (webpEnabled) => {

	const topoFile = await fetch('<%= path %>/output-topo-10.json')
	const areas = await topoFile.json()

	const data = feature(areas, areas.objects['merged-layers']);

	dark.sources.overlays.data = data;

	//--------------------------------------preload finish---------------------------------------

	//--------------------------------------make the map----------------------------------------

	let map = new mapGl({
		container: 'gv-wrapper', // container id
		style: dark,
		bounds: isMobile ? [[22, 44], [40.5, 54.5]] : [[22, 44], [40.5, 52.5]],
		interactive: false,
		trackResize:true
	});

	onresize = (event) => {

		isMobile = window.innerWidth < 768

		width = document.documentElement.clientWidth;
		height = window.innerHeight;

		atomEl.style.width = width + "px";
		atomEl.style.height = height + "px";

		map.fitBounds(isMobile ? [[22, 44], [40.5, 54.5]] : [[22, 44], [40.5, 52.5]])

	};

	map.on('load', () => {

		//---------------------------------set page style back to original------------------------------------

		document.querySelector('.loading-overlay__inner').style.display = 'none';
		document.querySelector('#content__headline').style.display = 'block';
		document.querySelector('.scroll-text__fixed__header').style.display = 'block';
		document.querySelector('.header-wrapper__byline').style.display = 'block';
		document.querySelector('.header-wrapper__date').style.display = 'block';
		

		document.body.style.overflow = 'initial';

		document.body.style.backgroundColor = '#ffffff';

		let divs = document.querySelectorAll(".content--interactive > div:first-child")
		divs[0].style.borderLeft = '1px solid #dcdcdc';
		divs[0].style.borderRight = '1px solid #dcdcdc';

		let atoms = document.querySelectorAll('.interactive')

		for (var i = 0; i < atoms.length; i++) {
			atoms[i].style.height = '100%';
		}

		//----------------------------------set the scrolly-------------------------------------------------------------------

		const scrollySteps = sheet.sheets['scrolly-map'];

		const scrolly = new ScrollyTeller({
			parent: document.querySelector("#scrolly-1"),
			triggerTop: 0.5, // percentage from the top of the screen that the trigger should fire
			triggerTopMobile: 0.5,
			transparentUntilActive: false
		});

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
					map.setFilter('Annexed', ["match", ['get', 'NAME_1'], ["Illegally\nannexed\nregions"], true, false]);
					map.setLayoutProperty('Annexed', "visibility", "visible");
					map.setLayoutProperty('Annexed-line', "visibility", "visible");
				}
				else {
					map.setLayoutProperty('Annexed', "visibility", "none");
					map.setLayoutProperty('Annexed-line', "visibility", "none");
				}
			}

		}

		const updateMap = (i, currentDate) => {

			if (i == 0) {
				resetLabels()
				document.querySelector('.header-wrapper').classList.remove('over');
				document.querySelector('.scroll-text__fixed').classList.add('over');
			}
			else {
				document.querySelector('.header-wrapper').classList.add('over');
				document.querySelector('.scroll-text__fixed').classList.remove('over');
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
	
					document.getElementsByClassName('hr')[0].style.width = Math.ceil((filesDates.indexOf(currentDate) * 100) / filesDates.length) + '%';
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

const isSafari = fnBrowserDetect() == 'safari' ? true : false;

renderMap()






