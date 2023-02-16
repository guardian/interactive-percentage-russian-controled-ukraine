import { Map as mapGl } from 'maplibre-gl';
import ukraine from 'assets/geoBoundaries-UKR-ADM0_simplified.json'
import oblasts from 'assets/oblasts.json'
import dark from 'assets/gv-dark.json'
import ScrollyTeller from "shared/js/ScrollyTellerProgress";
import sheet from 'assets/sheet.json'
import labels from 'assets/labels-continent.json'
import { feature } from "topojson-client"
import { numberWithCommas } from 'shared/js/util.js'
import moment from 'moment'
import separatists from 'assets/separatists.json'
import separatistsLine from 'assets/separatists.json'
import annexed from 'assets/annexed-regions.json'
import patch from 'assets/patch.json'

const isMobile = window.matchMedia('(max-width: 600px)').matches;

const atomEl = document.getElementById('gv-wrapper');

//http://isw-extracted-email-attachments-use1.s3-website-us-east-1.amazonaws.com/ukraine_control/

const width = window.innerWidth;
const height = window.innerHeight;

atomEl.style.width = width + "px";
atomEl.style.height = height + "px";

//
dark.sources.oblasts.data = oblasts;
dark.sources.separatists.data = separatists;
dark.sources['separatists-line'].data = separatistsLine;
dark.sources.annexed.data = annexed;
dark.sources.patch.data = patch;
dark.sources['ukraine-fill'].data = ukraine;
dark.sources['ukraine-border'].data = ukraine;
dark.sources.labels.data = labels;


const filesDates = ["24-02-2022", "25-02-2022", "26-02-2022", "27-02-2022", "28-02-2022", "01-03-2022", "02-03-2022", "03-03-2022", "04-03-2022", "05-03-2022", "06-03-2022", "07-03-2022", "08-03-2022", "09-03-2022", "10-03-2022", "11-03-2022", "12-03-2022", "16-03-2022", "18-03-2022", "23-03-2022", "27-03-2022", "29-03-2022", "30-03-2022", "31-03-2022", "01-04-2022", "02-04-2022", "03-04-2022", "04-04-2022", "05-04-2022", "06-04-2022", "09-04-2022", "11-04-2022", "12-04-2022", "14-04-2022", "18-04-2022", "19-04-2022", "20-04-2022", "22-04-2022", "23-04-2022", "24-04-2022", "27-04-2022", "28-04-2022", "29-04-2022", "01-05-2022", "04-05-2022", "06-05-2022", "08-05-2022", "10-05-2022", "13-05-2022", "17-05-2022", "20-05-2022", "21-05-2022", "24-05-2022", "26-05-2022", "29-05-2022", "01-06-2022", "02-06-2022", "04-06-2022", "05-06-2022", "10-06-2022", "11-06-2022", "13-06-2022", "16-06-2022", "20-06-2022", "22-06-2022", "25-06-2022", "27-06-2022", "30-06-2022", "03-07-2022", "05-07-2022", "08-07-2022", "11-07-2022", "15-07-2022", "18-07-2022", "21-07-2022", "25-07-2022", "27-07-2022", "31-07-2022", "04-08-2022", "08-08-2022", "11-08-2022", "13-08-2022", "16-08-2022", "20-08-2022", "23-08-2022", "25-08-2022", "28-08-2022", "01-09-2022", "02-09-2022", "04-09-2022", "06-09-2022", "07-09-2022", "08-09-2022", "09-09-2022", "10-09-2022", "11-09-2022", "12-09-2022", "13-09-2022", "15-09-2022", "17-09-2022", "22-09-2022", "23-09-2022", "24-09-2022", "25-09-2022", "28-09-2022", "30-09-2022", "01-10-2022", "02-10-2022", "03-10-2022", "04-10-2022", "05-10-2022", "07-10-2022", "09-10-2022", "14-10-2022", "18-10-2022", "22-10-2022", "27-10-2022", "31-10-2022", "03-11-2022", "06-11-2022", "09-11-2022", "12-11-2022", "15-11-2022", "18-11-2022", "22-11-2022", "26-11-2022", "30-11-2022", "03-12-2022", "05-12-2022", "08-12-2022", "12-12-2022", "17-12-2022", "21-12-2022", "24-12-2022", "28-12-2022", "31-12-2022", "04-01-2023", "09-01-2023", "12-01-2023", "14-01-2023", "18-01-2023", "21-01-2023", "24-01-2023", "27-01-2023", "29-01-2023", "03-02-2023", "06-02-2023", "11-02-2023", "14-02-2023"];


// while(firstDate.add(1, 'days').diff(lastDate) < 0) {
// 	filesDates.push(firstDate.format('DD-MM-YYYY'));
// }

// filesDates.push(lastDate.format('DD-MM-YYYY'))

const renderMap = async (webpEnabled) => {

	const topoFile = await fetch('<%= path %>/output-topo-10-filtered.json')
	
	const areas = await topoFile.json()
	
	const data = feature(areas, areas.objects['merged-layers']);
	console.log(data)
	dark.sources.overlays.data = data;


	let map = new mapGl({
		container: 'gv-wrapper', // container id
		style: dark,
		bounds: [[19.9887767459112276, 43.5721421004375600], [42.7570271492437328, 53.2178718244825504]],
		interactive: false

	});



	map.on('load', () => {

		

		const scrolly = new ScrollyTeller({
			parent: document.querySelector("#scrolly-1"),
			triggerTop: 0.75, // percentage from the top of the screen that the trigger should fire
			triggerTopMobile: .75,
			transparentUntilActive: true,
			overall: () => { }
		})

		scrolly.gradual((progressInBox, i, abs, total) => {

			let iniDate = sheet.sheets['scrolly-map'][i].Date;
			let endDate = i == sheet.sheets['scrolly-map'].length - 1 ? iniDate : sheet.sheets['scrolly-map'][i + 1].Date;
			let iniPos = filesDates.indexOf(iniDate);
			let endPos = filesDates.indexOf(endDate);
			let totalFiles = endPos - iniPos;
			let currentPos = parseInt(iniPos + (totalFiles * (progressInBox * 100) / 100));
			let currentDate = filesDates[currentPos]

			if (i > 0 && i <= sheet.sheets['scrolly-map'].length - 1) {

				console.log(currentDate)

				map.setPaintProperty('overlays', "fill-opacity", 1)

				map.setFilter("overlays",
					["all",
						["==", 'date', currentDate]
					]
				)

				map.setLayoutProperty('overlays', 'visibility', 'visible')


				document.getElementsByClassName('scroll-text__fixed__text')[0].innerHTML = sheet.sheets['scrolly-map'][i].Copy;
				document.getElementsByClassName('scroll-text__fixed__date')[0].innerHTML = currentDate;
				//document.getElementsByClassName('scroll-text__fixed__area')[0].innerHTML = numberWithCommas(parseInt(russiaAreaTotal / 1000)) + ' km2';


			}
			else {

				document.getElementsByClassName('scroll-text__fixed__text')[0].innerHTML = sheet.sheets['scrolly-map'][i].Copy;
				document.getElementsByClassName('scroll-text__fixed__date')[0].innerHTML = currentDate;
				document.getElementsByClassName('scroll-text__fixed__area')[0].innerHTML = '';
			}

		})

		scrolly.watchScroll();
	})

}


renderMap()

