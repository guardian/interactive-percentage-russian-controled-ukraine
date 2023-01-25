import { Map as mapGl} from 'maplibre-gl';
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
import { merge } from "topojson-client"
import areas from 'assets/output-topo-10.json'
import moment from 'moment'
import { gsap } from 'gsap';

const isMobile = window.matchMedia('(max-width: 600px)').matches;

const atomEl = document.getElementById('gv-wrapper');

let headline = null;
let standfirst = null;
let byline = null;
let details = null;

if(window.location.protocol == 'https:' || window.location.protocol == 'http:')
{

	headline = document.querySelector('[data-gu-name="headline"] h1').innerHTML;
	standfirst = document.querySelector('[data-gu-name="standfirst"] p').innerHTML;
	byline = document.querySelector('[data-link-name="byline"] div');
	details = document.querySelector('[data-gu-name="meta"]').innerText.split('\n');
	document.querySelector('.header-wrapper__date').innerHTML = details[1];

}
else{
	
	headline = document.querySelector('.headline.selectable').innerHTML;
	standfirst = document.querySelector('.standfirst.selectable p').innerHTML;
	byline = document.querySelector('.meta__byline');
	details = document.querySelector('.meta__published__date');
	document.querySelector('.header-wrapper__date').appendChild(details)
}


document.querySelector('.header-wrapper__byline').appendChild(byline);
document.querySelector(".header-wrapper__content .content__headline").innerHTML = headline;
document.querySelector(".header-wrapper__content .scroll-text__fixed__header").innerHTML = standfirst;

//http://isw-extracted-email-attachments-use1.s3-website-us-east-1.amazonaws.com/ukraine_control/

const width = window.innerWidth;
const height = window.innerHeight;

atomEl.style.width = width + "px";
atomEl.style.height = height + "px";

dark.sources.oblasts.data = oblasts;
dark.sources.separatists.data = separatists;
dark.sources['separatists-line'].data = separatistsLine;
dark.sources.annexed.data = annexed;
dark.sources.patch.data = patch;
dark.sources['ukraine-fill'].data = ukraine;
dark.sources['ukraine-border'].data = ukraine;
dark.sources.labels.data = labels;
dark.sources.overlay.data = null;
dark.sources['overlay-russia'].data = null;
dark.sources['overlay-russia-advance'].data = null;


const firstDate = moment("24-02-2022",'DD-MM-YYYY').utc()
const lastDate = moment("22-01-2023",'DD-MM-YYYY').utc()

let filesDates = [firstDate.format('DD-MM-YYYY')];

while(firstDate.add(1, 'days').diff(lastDate) < 0) {
	filesDates.push(firstDate.format('DD-MM-YYYY'));
}

filesDates.push(lastDate.format('DD-MM-YYYY'))

const scrollySteps = sheet.sheets['scrolly-map'];

let map = new mapGl({
	container: 'gv-wrapper', // container id
	style:dark,
	bounds: [[22,44],[40.5,52.5]],
	//bounds: [[19.9887767459112276,43.5721421004375600],[42.7570271492437328,53.2178718244825504]],
	interactive:false
});

map.on('load', () => {

	document.querySelector('.interactive-atom').style.height = '100%'

	const scrolly = new ScrollyTeller({
		parent: document.querySelector("#scrolly-1"),
		triggerTop: 0.5, // percentage from the top of the screen that the trigger should fire
		triggerTopMobile: 0.5,
		transparentUntilActive: false
	});

	let dateAnimation = { index: 0 };

	let animation = gsap.fromTo(null, {index: 0}, {index: 0, overwrite: true, duration:0, ease: "linear"});

	function tick() {
		const currentIndex = Math.round(dateAnimation.index);
		const currentDate = filesDates[currentIndex];
		updateMap(currentDate);
	}
	
	scrollySteps.forEach((d,i) => {

		scrolly.addTrigger({num: i+1, do: () => {

			console.log(i)

			if(i == 0){

				document.getElementsByClassName('header-wrapper')[0].classList.remove('over');
				document.getElementsByClassName('scroll-text__fixed')[0].classList.add('over');
				map.setFilter('Autonomous Republic', false);
				//map.setLayoutProperty('separatists-fill', "visibility", "visible")
			}
			else{

				document.getElementsByClassName('header-wrapper')[0].classList.add('over');
				document.getElementsByClassName('scroll-text__fixed')[0].classList.remove('over');
				document.querySelector('.scroll-text__fixed').classList.remove('over');
				map.setLayoutProperty('Autonomous Republic', 'visibility', 'none')
				//map.setLayoutProperty('separatists-fill', "visibility", "visible")
			}

			if(i == 1){
				map.setLayoutProperty('Autonomous Republic', 'visibility', 'visible')
				map.setFilter('Autonomous Republic', ["match",['get', 'NAME_1'], ["Russian\ncontrol"], true, false]);
				map.setPaintProperty('Autonomous Republic', "text-color", "#333")
			}

			if(i == 2)
			{
				map.setLayoutProperty('Autonomous Republic', 'visibility', 'visible')
				map.setFilter('Autonomous Republic', ["match",['get', 'NAME_1'], ["Russian\ncontrol","Russian\noperations"], true, false]);
				map.setPaintProperty('Autonomous Republic', "text-color", "#880105")
				
			}
			if(i == 3)
			{
				map.setLayoutProperty('Autonomous Republic', 'visibility', 'visible')
				map.setFilter('Autonomous Republic', ["match",['get', 'NAME_1'], ["Ukraine\nregained\ncontrol"], true, false]);
				map.setPaintProperty('Autonomous Republic', "text-color", "#ff7f00")
				
			}

			if(i > 1){
			
				let currentPos = dateAnimation.index;
				let endDate = scrollySteps[i].Date;
				let endPos = filesDates.indexOf(endDate);

				map.setPaintProperty('separatists-fill', "fill-opacity",0)
				map.setPaintProperty('separatists-line', "line-opacity",0)
				map.setPaintProperty('patch', "fill-opacity", 1)
				map.setPaintProperty('overlay', "fill-opacity", 1)
				map.setPaintProperty('overlay-russia', "fill-opacity", 1)
				map.setPaintProperty('overlay-russia-advance', "fill-opacity", 1)

				document.getElementsByClassName('scroll-text__fixed__text')[0].innerHTML = scrollySteps[i].Copy;
				
				animation = gsap.fromTo(dateAnimation, {index: currentPos}, {index: endPos, overwrite: true, duration:0.5, ease: "linear", onUpdate: tick});

			}
			else{

				map.setPaintProperty('separatists-fill', "fill-opacity", 1)
				map.setPaintProperty('separatists-line', "line-opacity",1)
				map.setPaintProperty('patch', "fill-opacity", 0)

				document.getElementsByClassName('hr')[0].style.width = 0 + '%';
				document.getElementsByClassName('hr')[0].style.opacity = 0;

				document.getElementsByClassName('scroll-text__fixed__text')[0].innerHTML = sheet.sheets['scrolly-map'][i].Copy;
				document.getElementsByClassName('scroll-text__fixed__date')[0].innerHTML = "";
				
				gsap.fromTo(dateAnimation, {index: 0}, {index: 0, overwrite: true, duration:0, ease: "linear"});

				animation.kill();
				resetMap()

			}
		}})
	})

    scrolly.watchScroll();
})

function updateMap(currentDate) {
	
	let topo = merge(areas, areas.objects['merged-layers'].geometries.filter(f => f.properties.date === currentDate && f.properties.type === 'Claimed_Ukrainian_Counteroffensives'))
	let russiaArea = areas.objects['merged-layers'].geometries.filter(f => f.properties.date === currentDate && f.properties.type === 'Russian_CoT_in_Ukraine_Shapefiles')
	let topoRussia = merge(areas, russiaArea)
	let topoRussiaAdvance = merge(areas, areas.objects['merged-layers'].geometries.filter(f => f.properties.date === currentDate && f.properties.type === 'Russian_Advances_Shapefile'))

	map.getSource('overlay').setData(topo);
	map.getSource('overlay-russia').setData(topoRussia);
	map.getSource('overlay-russia-advance').setData(topoRussiaAdvance);

	document.getElementsByClassName('scroll-text__fixed__date')[0].innerHTML = moment(currentDate, "DD-MM-YYYY").format("D MMM YYYY");
	
	document.getElementsByClassName('hr')[0].style.width = Math.ceil((filesDates.indexOf(currentDate) * 100) / filesDates.length) + '%';
	document.getElementsByClassName('hr')[0].style.opacity = 1;

	if(moment(currentDate, 'DD-MM-YYYY') >= moment('30-09-2022', 'DD-MM-YYYY'))
	{
		map.setFilter('Annexed', ["match",['get', 'NAME_1'], ["Illegally\nannexed\nregions"], true, false]);
		map.setLayoutProperty('Annexed', "visibility",  "visible");
		map.setLayoutProperty('Annexed-line', "visibility",  "visible");
	}	
	else{
		map.setLayoutProperty('Annexed', "visibility",  "none");
		map.setLayoutProperty('Annexed-line', "visibility",  "none");
	}
}

const resetMap = () => {


	map.setPaintProperty('overlay', "fill-opacity", 0)
	map.setPaintProperty('overlay-russia', "fill-opacity", 0)
	map.setPaintProperty('overlay-russia-advance', "fill-opacity", 0)

	document.getElementsByClassName('scroll-text__fixed__date')[0].innerHTML = '';

	//map.getSource('separatists-line').setData(separatistsLine);

}