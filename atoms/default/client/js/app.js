import { Map as mapGl} from 'maplibre-gl';
//import ukraine from 'assets/OSMB-ea847b38919f684e19312574b67b45941236d33c.json'
//import oblasts from 'assets/oblasts.json'
import dark from 'assets/gv-dark.json'
import ScrollyTeller from "shared/js/ScrollyTellerProgress";
import sheet from 'assets/sheet.json'
//import labels from 'assets/labels-continent.json'
import { merge } from "topojson-client"
import ukraineControl from 'assets/ukraine-control.json'
import russiaControl from 'assets/russia-control.json'
import russiaAdvance from 'assets/russia-advance.json'
//import merged from 'assets/ukraine-conrol/merged-topo.json'

const isMobile = window.matchMedia('(max-width: 600px)').matches;

const atomEl = document.getElementById('gv-wrapper');


//http://isw-extracted-email-attachments-use1.s3-website-us-east-1.amazonaws.com/ukraine_control/

const width = window.innerWidth;
const height = window.innerHeight;

atomEl.style.width = width + "px";
atomEl.style.height = height + "px";

//
//dark.sources.oblasts.data = oblasts;
//dark.sources['ukraine-border'].data = ukraine;
//dark.sources.labels.data = labels;
dark.sources.overlay.data = null;
dark.sources['overlay-russia'].data = null;
dark.sources['overlay-russia-advance'].data = null;

const filesDates = [
"24-02-2022","25-02-2022","26-02-2022","27-02-2022","28-02-2022","01-03-2022","02-03-2022","03-03-2022","04-03-2022","05-03-2022","06-03-2022","07-03-2022","08-03-2022","09-03-2022","10-03-2022","11-03-2022","12-03-2022","13-03-2022","14-03-2022","15-03-2022","16-03-2022","17-03-2022","18-03-2022","19-03-2022","20-03-2022","21-03-2022","22-03-2022","23-03-2022","24-03-2022","25-03-2022","26-03-2022","27-03-2022","28-03-2022","29-03-2022","30-03-2022","31-03-2022","01-04-2022","02-04-2022","03-04-2022","04-04-2022","05-04-2022","06-04-2022","07-04-2022","08-04-2022","09-04-2022","10-04-2022","11-04-2022","12-04-2022","13-04-2022","14-04-2022","15-04-2022","16-04-2022","17-04-2022","18-04-2022","19-04-2022","20-04-2022","21-04-2022","22-04-2022","23-04-2022","24-04-2022","25-04-2022","26-04-2022","27-04-2022","28-04-2022","29-04-2022","30-04-2022","01-05-2022","02-05-2022","03-05-2022","04-05-2022","05-05-2022","06-05-2022","07-05-2022","08-05-2022","09-05-2022","10-05-2022","11-05-2022","12-05-2022","13-05-2022","14-05-2022","15-05-2022","16-05-2022","17-05-2022","18-05-2022","19-05-2022","20-05-2022","21-05-2022","22-05-2022","23-05-2022","24-05-2022","25-05-2022","26-05-2022","27-05-2022","28-05-2022","29-05-2022","30-05-2022","31-05-2022","01-06-2022","02-06-2022","03-06-2022","04-06-2022","05-06-2022","06-06-2022","07-06-2022","08-06-2022","09-06-2022","10-06-2022","11-06-2022","12-06-2022","13-06-2022","14-06-2022","15-06-2022","16-06-2022","17-06-2022","18-06-2022","19-06-2022","20-06-2022","21-06-2022","22-06-2022","23-06-2022","24-06-2022","25-06-2022","26-06-2022","27-06-2022","28-06-2022","29-06-2022","30-06-2022","01-07-2022","02-07-2022","03-07-2022","04-07-2022","05-07-2022","06-07-2022","07-07-2022","08-07-2022","09-07-2022","10-07-2022","11-07-2022","12-07-2022","13-07-2022","14-07-2022","15-07-2022","16-07-2022","17-07-2022","18-07-2022","19-07-2022","20-07-2022","21-07-2022","22-07-2022","23-07-2022","24-07-2022","25-07-2022","26-07-2022","27-07-2022","28-07-2022","29-07-2022","30-07-2022","31-07-2022","01-08-2022","02-08-2022","03-08-2022","04-08-2022","05-08-2022","06-08-2022","07-08-2022","08-08-2022","09-08-2022","10-08-2022","11-08-2022","12-08-2022","13-08-2022","14-08-2022","15-08-2022","16-08-2022","17-08-2022","18-08-2022","19-08-2022","20-08-2022","21-08-2022","22-08-2022","23-08-2022","24-08-2022","25-08-2022","26-08-2022","27-08-2022","28-08-2022","29-08-2022","30-08-2022","31-08-2022","01-09-2022","02-09-2022","03-09-2022","04-09-2022","05-09-2022","06-09-2022","07-09-2022","08-09-2022","09-09-2022","10-09-2022","11-09-2022","12-09-2022","13-09-2022","14-09-2022","15-09-2022","16-09-2022","17-09-2022","18-09-2022","19-09-2022","20-09-2022","21-09-2022","22-09-2022","23-09-2022","24-09-2022","25-09-2022","26-09-2022","27-09-2022","28-09-2022","29-09-2022","30-09-2022","01-10-2022","02-10-2022","03-10-2022","04-10-2022","05-10-2022","06-10-2022","07-10-2022","08-10-2022","09-10-2022","10-10-2022","11-10-2022","12-10-2022","13-10-2022","14-10-2022","15-10-2022","16-10-2022","17-10-2022","18-10-2022","19-10-2022","20-10-2022","21-10-2022","22-10-2022","23-10-2022","24-10-2022","25-10-2022","26-10-2022","27-10-2022","28-10-2022","29-10-2022","30-10-2022","31-10-2022","01-11-2022","02-11-2022","03-11-2022","04-11-2022","05-11-2022","06-11-2022","07-11-2022","08-11-2022","09-11-2022","10-11-2022","11-11-2022","12-11-2022","13-11-2022","14-11-2022","15-11-2022","16-11-2022","17-11-2022","18-11-2022","19-11-2022","20-11-2022","21-11-2022","22-11-2022"]

//let topo = merge(ukraineControl, ukraineControl.objects.Claimed_Ukrainian_Counteroffensives.geometries)

// let overlay = {
// 	'type': 'Feature',
// 	'properties': {},
// 	'geometry': topo
// }

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


    // const scrolly = new ScrollyTeller({
	// 	parent: document.querySelector("#scrolly-1"),
	// 	triggerTop: .5, // percentage from the top of the screen that the trigger should fire
	// 	triggerTopMobile: 0.6,
	// 	transparentUntilActive: true
	// });

	const scrolly = new ScrollyTeller({
		parent: document.querySelector("#scrolly-1"),
			triggerTop: 0.5, // percentage from the top of the screen that the trigger should fire
			triggerTopMobile:.5,
			transparentUntilActive: false,
			overall: () => {}
		})


	scrolly.gradual( (progressInBox, i, abs, total) => {

		console.log('**********',i, sheet.sheets['scrolly-map'].length-1)

		if(i < sheet.sheets['scrolly-map'].length-1)
		{

			let iniDate = sheet.sheets['scrolly-map'][i].Date;
			let endDate = sheet.sheets['scrolly-map'][i+1].Date;
			let iniPos = filesDates.indexOf(iniDate);
			let endPos = filesDates.indexOf(endDate);
			let totalFiles = endPos - iniPos;

			let currentPos = parseInt(iniPos + (totalFiles * (progressInBox*100) / 100));
			let currentDate = filesDates[currentPos]

			let topo = merge(ukraineControl, ukraineControl.objects.merged.geometries.filter(f => f.properties.date === currentDate))

			let topoRussia = merge(russiaControl, russiaControl.objects.merged.geometries.filter(f => f.properties.date === currentDate))

			let topoRussiaAdvance = merge(russiaAdvance, russiaAdvance.objects.merged.geometries.filter(f => f.properties.date === currentDate))

			map.getSource('overlay').setData(topo);
			map.getSource('overlay-russia').setData(topoRussia);
			map.getSource('overlay-russia-advance').setData(topoRussiaAdvance);

			// document.getElementById('date').innerHTML = currentDate;

			// console.log(iniDate , ':', iniPos, '->', endDate , ':', endPos, currentPos, ':', filesDates[currentPos])
		}
		
	})


    scrolly.watchScroll();
})

