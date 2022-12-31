import { Map as mapGl} from 'maplibre-gl';
import ukraine from 'assets/geoBoundaries-UKR-ADM0_simplified.json'
import oblasts from 'assets/oblasts.json'
import dark from 'assets/gv-dark.json'
import ScrollyTeller from "shared/js/ScrollyTeller";
import sheet from 'assets/sheet.json'
import labels from 'assets/labels-continent.json'
import { merge } from "topojson-client"
import areas from 'assets/output-topo-10.json'
// import ukraineControl from 'assets/ukraine-control.json'
// import russiaControl from 'assets/russia-control.json'
// import russiaAdvance from 'assets/russia-advance.json'
import turf from 'turf'
//import merged from 'assets/ukraine-conrol/merged-topo.json'




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


let map = new mapGl({
	container: 'gv-wrapper', // container id
	style:dark,
	bounds: [[19.9887767459112276,43.5721421004375600],[42.7570271492437328,53.2178718244825504]],
	interactive:false
	
});


function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}
const dates = sheet.sheets['scrolly-map'].map(d => d.Date).filter(f => f != '').filter(onlyUnique);

map.on('load', () => {


    const scrolly = new ScrollyTeller({
		parent: document.querySelector("#scrolly-1"),
		triggerTop: .5, // percentage from the top of the screen that the trigger should fire
		triggerTopMobile: 0.6,
		transparentUntilActive: true
	});

	// const scrolly = new ScrollyTeller({
	// 	parent: document.querySelector("#scrolly-1"),
	// 		triggerTop: 0.5, // percentage from the top of the screen that the trigger should fire
	// 		triggerTopMobile:.5,
	// 		transparentUntilActive: false,
	// 		overall: () => {}
	// 	})


	sheet.sheets['scrolly-map'].forEach((element, i) => {

		scrolly.addTrigger({num: i+1, do: () => {

			console.log('**********',i, sheet.sheets['scrolly-map'].length-1)
	
			if(i < sheet.sheets['scrolly-map'].length-1)
			{
	
				let date = sheet.sheets['scrolly-map'][i].Date;


				let topo = merge(areas, areas.objects['merged-layers'].geometries.filter(f => f.properties.date === date && f.properties.type === 'Claimed_Ukrainian_Counteroffensives'))
				//let topo = merge(ukraineControl, ukraineControl.objects.merged.geometries.filter(f => f.properties.date === date))
	
				let topoRussia = merge(areas, areas.objects['merged-layers'].geometries.filter(f => f.properties.date === date && f.properties.type === 'Russian_CoT_in_Ukraine_Shapefiles'))
	
				let topoRussiaAdvance = merge(areas, areas.objects['merged-layers'].geometries.filter(f => f.properties.date === date && f.properties.type === 'Russian_Advances_Shapefile'))

	
				map.getSource('overlay').setData(topo);
				map.getSource('overlay-russia').setData(topoRussia);
				map.getSource('overlay-russia-advance').setData(topoRussiaAdvance);
	
				document.getElementById('date').innerHTML = date;
	
				// console.log(iniDate , ':', iniPos, '->', endDate , ':', endPos, currentPos, ':', filesDates[currentPos])
			}
	
		}})


		
	});

	



    scrolly.watchScroll();
})

