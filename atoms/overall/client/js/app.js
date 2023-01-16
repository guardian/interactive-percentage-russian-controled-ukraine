import { Map as mapGl} from 'maplibre-gl';
import ukraine from 'assets/geoBoundaries-UKR-ADM0_simplified.json'
import oblasts from 'assets/oblasts.json'
import dark from 'assets/gv-dark.json'
import ScrollyTeller from "shared/js/scrollyteller";
import sheet from 'assets/sheet.json'
import labels from 'assets/labels-continent.json'
import { merge } from "topojson-client"
import areas from 'assets/output-topo-10.json'
import {numberWithCommas} from 'shared/js/util.js'
import moment from 'moment'
import { gsap } from 'gsap';

const isMobile = window.matchMedia('(max-width: 600px)').matches;

const atomEl = document.getElementById('gv-wrapper');

//http://isw-extracted-email-attachments-use1.s3-website-us-east-1.amazonaws.com/ukraine_control/

const width = window.innerWidth;
const height = window.innerHeight;

atomEl.style.width = width + "px";
atomEl.style.height = height + "px";

//
dark.sources.oblasts.data = oblasts;
dark.sources['ukraine-fill'].data = ukraine;
dark.sources['ukraine-border'].data = ukraine;
dark.sources.labels.data = labels;
dark.sources.overlay.data = null;
dark.sources['overlay-russia'].data = null;
dark.sources['overlay-russia-advance'].data = null;

// console.log(areas.objects['merged-layers'])

const firstDate = moment("24-02-2022",'DD-MM-YYYY').utc()
const lastDate = moment("14-11-2023",'DD-MM-YYYY').utc()

let filesDates = [firstDate.format('DD-MM-YYYY')];

while(firstDate.add(1, 'days').diff(lastDate) < 0) {
	filesDates.push(firstDate.format('DD-MM-YYYY'));
}

// console.log(filesDates)

filesDates.push(lastDate.format('DD-MM-YYYY'))

const scrollySteps = sheet.sheets['scrolly-map'];

let map = new mapGl({
	container: 'gv-wrapper', // container id
	style:dark,
	bounds: [[19.9887767459112276,43.5721421004375600],[42.7570271492437328,53.2178718244825504]],
	interactive:false
});

map.on('load', () => {

	const scrolly = new ScrollyTeller({
		parent: document.querySelector("#scrolly-1"),
		triggerTop: .75, // percentage from the top of the screen that the trigger should fire
		triggerTopMobile: 0.75,
		transparentUntilActive: false
	});

	let dateAnimation = { index: 0 };

	function tick() {
		const currentIndex = Math.round(dateAnimation.index);
		const currentDate = filesDates[currentIndex];
		updateMap(currentDate);
	}

	scrollySteps.forEach((d,i) => {

		scrolly.addTrigger({num: i+1, do: () => {

			console.log('trigger step', i);
			
			let currentPos = dateAnimation.index;
			let endDate = scrollySteps[i].Date;
			let endPos = filesDates.indexOf(endDate);
			let numberOfDaysToAnimate = Math.abs(endPos - currentPos);

			console.log('animate to date', endDate);
			// console.log('number of days to animate', numberOfDaysToAnimate);

			gsap.fromTo(dateAnimation, {index: currentPos}, {index: endPos, overwrite: true, duration:numberOfDaysToAnimate * 0.01, ease: "linear", onUpdate: tick});
		}})
	})

    scrolly.watchScroll();
})

function updateMap(currentDate) {
	let topo = merge(areas, areas.objects['merged-layers'].geometries.filter(f => f.properties.date === currentDate && f.properties.type === 'Claimed_Ukrainian_Counteroffensives'))
	let russiaArea = areas.objects['merged-layers'].geometries.filter(f => f.properties.date === currentDate && f.properties.type === 'Russian_CoT_in_Ukraine_Shapefiles')
	let russiaAreaTotal = 0;
	russiaArea.forEach(element => {
		russiaAreaTotal += +element.properties.area
	})
	let topoRussia = merge(areas, russiaArea)
	let topoRussiaAdvance = merge(areas, areas.objects['merged-layers'].geometries.filter(f => f.properties.date === currentDate && f.properties.type === 'Russian_Advances_Shapefile'))

	map.getSource('overlay').setData(topo);
	map.getSource('overlay-russia').setData(topoRussia);
	map.getSource('overlay-russia-advance').setData(topoRussiaAdvance);

	// document.getElementsByClassName('scroll-text__fixed__text')[0].innerHTML = sheet.sheets['scrolly-map'][i].Copy;
	document.getElementsByClassName('scroll-text__fixed__date')[0].innerHTML = currentDate;
	document.getElementsByClassName('scroll-text__fixed__area')[0].innerHTML = numberWithCommas(parseInt(russiaAreaTotal / 1000)) + ' km2';	
}