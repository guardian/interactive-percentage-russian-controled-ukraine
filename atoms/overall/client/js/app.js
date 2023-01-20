import { Map as mapGl} from 'maplibre-gl';
import ukraine from 'assets/geoBoundaries-UKR-ADM0_simplified.json'
import separatists from 'assets/separatists.json'
import separatistsLine from 'assets/separatists-edges.json'
import oblasts from 'assets/oblasts.json'
import dark from 'assets/gv-dark.json'
import ScrollyTeller from "shared/js/scrollyteller";
import sheet from 'assets/sheet.json'
import labels from 'assets/labels-continent.json'
import { merge } from "topojson-client"
import areas from 'assets/output-topo-10.json'
import moment from 'moment'
import { gsap } from 'gsap';

navigator.sayswho= (function(){
    var ua= navigator.userAgent;
    var tem; 
    var M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

console.log(navigator.sayswho);
console.log(window.location.href)
console.log(window.location.hostname)
console.log(window.location.pathname)
console.log(window.location.protocol)

const isMobile = window.matchMedia('(max-width: 600px)').matches;

const atomEl = document.getElementById('gv-wrapper');

let headline = null;
let standfirst = null;
let byline = null;
let details = null;
let date = document.createElement("div");
date.classList.add('header-wrapper__date')
document.querySelector('.header-wrapper__content').appendChild(date);

if(window.location.protocol == 'https:' || window.location.protocol == 'http:')
{
	headline = document.querySelector('[data-gu-name="headline"] h1').innerHTML;
	standfirst = document.querySelector('[data-gu-name="standfirst"] p').innerHTML;
	byline = document.querySelector('[data-link-name="byline"] div');
	details = document.querySelector('[data-gu-name="meta"]');
	
	document.querySelector('.header-wrapper__date').innerHTML = details.innerText;
}
else{
	
	headline = document.querySelector('.headline.selectable').innerHTML;
	standfirst = document.querySelector('.standfirst.selectable p').innerHTML;
	byline = document.querySelector('.meta__byline');
	details = document.querySelector('.meta__published__date');
	console.log(details)
	document.querySelector('.header-wrapper__date').appendChild(details)
}

document.querySelector('.header-wrapper__content').appendChild(byline);

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
dark.sources['ukraine-fill'].data = ukraine;
dark.sources['ukraine-border'].data = ukraine;
dark.sources.labels.data = labels;
dark.sources.overlay.data = null;
dark.sources['overlay-russia'].data = null;
dark.sources['overlay-russia-advance'].data = null;

const firstDate = moment("24-02-2022",'DD-MM-YYYY').utc()
const lastDate = moment("18-01-2023",'DD-MM-YYYY').utc()

let filesDates = [firstDate.format('DD-MM-YYYY')];

while(firstDate.add(1, 'days').diff(lastDate) < 0) {
	filesDates.push(firstDate.format('DD-MM-YYYY'));
}

filesDates.push(lastDate.format('DD-MM-YYYY'))

const scrollySteps = sheet.sheets['scrolly-map'];

let map = new mapGl({
	container: 'gv-wrapper', // container id
	style:dark,
	bounds: [[22,44],[40.2272345111246636,52.5]],
	//bounds: [[19.9887767459112276,43.5721421004375600],[42.7570271492437328,53.2178718244825504]],
	interactive:false
});

map.on('load', () => {

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

			console.log(i, '--------------')

			if(i == 0){
				console.log('over')
				document.getElementsByClassName('header-wrapper')[0].classList.remove('over');
				document.getElementsByClassName('scroll-text__fixed')[0].classList.add('over');
				
			}
			else{
				document.getElementsByClassName('header-wrapper')[0].classList.add('over');
				document.getElementsByClassName('scroll-text__fixed')[0].classList.remove('over');
				document.getElementsByClassName('scroll-text__fixed')[0].style.padding = '16px';
			}

			if(i > 1){
			
				let currentPos = dateAnimation.index;
				let endDate = scrollySteps[i].Date;
				let endPos = filesDates.indexOf(endDate);

				document.getElementsByClassName('scroll-text__fixed__text')[0].innerHTML = scrollySteps[i].Copy;
				
				animation = gsap.fromTo(dateAnimation, {index: currentPos}, {index: endPos, overwrite: true, duration:0.5, ease: "linear", onUpdate: tick});

			}
			else{

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

	map.getSource('separatists').setData({
		"type": "FeatureCollection","features": []
	});
	map.getSource('separatists-line').setData({
		"type": "FeatureCollection","features": []
	});

	let topo = merge(areas, areas.objects['merged-layers'].geometries.filter(f => f.properties.date === currentDate && f.properties.type === 'Claimed_Ukrainian_Counteroffensives'))
	let russiaArea = areas.objects['merged-layers'].geometries.filter(f => f.properties.date === currentDate && f.properties.type === 'Russian_CoT_in_Ukraine_Shapefiles')
	let topoRussia = merge(areas, russiaArea)
	let topoRussiaAdvance = merge(areas, areas.objects['merged-layers'].geometries.filter(f => f.properties.date === currentDate && f.properties.type === 'Russian_Advances_Shapefile'))

	map.getSource('overlay').setData(topo);
	map.getSource('overlay-russia').setData(topoRussia);
	map.getSource('overlay-russia-advance').setData(topoRussiaAdvance);

	document.getElementsByClassName('scroll-text__fixed__date')[0].innerHTML = moment(currentDate, "DD-MM-YYYY").format("D MMM YYYY");
console.log(currentDate)
	document.getElementsByClassName('hr')[0].style.width = Math.ceil((filesDates.indexOf(currentDate) * 100) / filesDates.length) + '%';
	document.getElementsByClassName('hr')[0].style.opacity = 1;
}

const resetMap = () => {

	map.getSource('overlay').setData({
		"type": "FeatureCollection","features": []
		});
	map.getSource('overlay-russia').setData({
		"type": "FeatureCollection","features": []
	});
	map.getSource('overlay-russia-advance').setData({
		"type": "FeatureCollection","features": []
	});

	document.getElementsByClassName('scroll-text__fixed__date')[0].innerHTML = '';

	map.getSource('separatists').setData(separatists);
	map.getSource('separatists-line').setData(separatistsLine);

}