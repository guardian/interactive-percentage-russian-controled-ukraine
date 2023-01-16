import { Map as mapGl} from 'maplibre-gl';
import ukraine from 'assets/geoBoundaries-UKR-ADM0_simplified.json'
import oblasts from 'assets/oblasts.json'
import dark from 'assets/gv-dark.json'
import ScrollyTeller from "shared/js/ScrollyTellerProgress";
import sheet from 'assets/sheet.json'
import labels from 'assets/labels-continent.json'
import { merge } from "topojson-client"
import areas from 'assets/output-topo-10.json'
import {numberWithCommas} from 'shared/js/util.js'
import moment from 'moment'

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

const firstDate = moment("24-02-2022",'DD-MM-YYYY').utc()
const lastDate = moment(sheet.sheets['scrolly-map'][sheet.sheets['scrolly-map'].length-1].Date,'DD-MM-YYYY').utc()

let filesDates = [firstDate.format('DD-MM-YYYY')];

while(firstDate.add(1, 'days').diff(lastDate) < 0) {
	filesDates.push(firstDate.format('DD-MM-YYYY'));
}

filesDates.push(lastDate.format('DD-MM-YYYY'))

let map = new mapGl({
	container: 'gv-wrapper', // container id
	style:dark,
	bounds: [[19.9887767459112276,43.5721421004375600],[42.7570271492437328,53.2178718244825504]],
	interactive:false
	
});

map.on('load', () => {

	const scrolly = new ScrollyTeller({
		parent: document.querySelector("#scrolly-1"),
			triggerTop: 0.75, // percentage from the top of the screen that the trigger should fire
			triggerTopMobile:.75,
			transparentUntilActive: true,
			overall: () => {}
		})

	scrolly.gradual( (progressInBox, i, abs, total) => {

		let iniDate = sheet.sheets['scrolly-map'][i].Date;
		let endDate = i == sheet.sheets['scrolly-map'].length-1 ? iniDate : sheet.sheets['scrolly-map'][i+1].Date;
		let iniPos = filesDates.indexOf(iniDate);
		let endPos = filesDates.indexOf(endDate);
		let totalFiles = endPos - iniPos;		
		let currentPos = parseInt(iniPos + (totalFiles * (progressInBox * 100) / 100));
		let currentDate = filesDates[currentPos]

		if(i > 0 && i <= sheet.sheets['scrolly-map'].length-1)
		{
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

			document.getElementsByClassName('scroll-text__fixed__text')[0].innerHTML = sheet.sheets['scrolly-map'][i].Copy;
			document.getElementsByClassName('scroll-text__fixed__date')[0].innerHTML = currentDate;
			document.getElementsByClassName('scroll-text__fixed__area')[0].innerHTML = numberWithCommas(parseInt(russiaAreaTotal / 1000)) + ' km2';


		}
		else{
			//console.log('paso por aqui')
			map.getSource('overlay').setData({
				"type": "FeatureCollection",				"features": []
			});
			map.getSource('overlay-russia').setData({
				"type": "FeatureCollection",				"features": []
			});
			map.getSource('overlay-russia-advance').setData({
				"type": "FeatureCollection",				"features": []
			});

			document.getElementsByClassName('scroll-text__fixed__text')[0].innerHTML = sheet.sheets['scrolly-map'][i].Copy;
			document.getElementsByClassName('scroll-text__fixed__date')[0].innerHTML = currentDate;
			document.getElementsByClassName('scroll-text__fixed__area')[0].innerHTML = '';
		}
		
	})

    scrolly.watchScroll();
})

const controlText = (text) => {

	
	console.log(document.getElementsByClassName('scroll-text__fixed__text')[0].innerHTML = text)
}

