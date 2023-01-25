
import ScrollyTeller from "shared/js/scrollyteller";
import moment from 'moment'
import * as d3B from 'd3'
import sheet from 'assets/sheet.json'

const d3 = Object.assign({}, d3B);

const isMobile = window.matchMedia('(max-width: 600px)').matches;

const width = window.innerWidth;
const height = window.innerHeight;

const margin = { left: 5, top: isMobile ? window.innerHeight / 3 : 0, right: 0, bottom: 20 }

const svg = d3.select('#gv-wrapper-2')
	.append('svg')
	.attr('id', 'chart')
	.attr('width', width + 'px')
	.attr('height', height + 'px');

const scrolly = new ScrollyTeller({
	parent: document.querySelector("#scrolly-2"),
	triggerTop: 0.5, // percentage from the top of the screen that the trigger should fire
	triggerTopMobile: 0.5,
	transparentUntilActive: false
});

const chartData = sheet.sheets['chart-data'];

const keys = Object.keys(chartData[0]).slice(1);

const areas = []

chartData.forEach(d => keys.forEach(k => areas.push(+d[k])))

let areaChart = svg.append('g')

console.log(chartData)

let stackedData = d3.stack()
.keys(keys)
.offset(d3.stackOffsetNone)
.order(d3.stackOrderNone)
(chartData)


console.log(stackedData)


let color = d3.scaleOrdinal().domain(keys)
  .range(["ffebee", "ef9a9a", "e57373", "ef5350", "b71c1c"])

let max = d3.max(stackedData.map(d => {return d3.max( d.map(f => {return d3.max(f)}))}))

let x = d3.scaleTime()
.domain(d3.extent(chartData, d =>  moment(d.date, "DD/MM/YYYY")))	
.range([margin.left, width - margin.left - margin.right]);

let y = d3.scaleLinear()
.domain([0, max])
.range([height - margin.bottom , margin.top]);

let xAxis = svg.append("g")
.attr("transform", "translate(0," + (height - margin.bottom) + ")")
.attr("class", "xaxis")
.call(
	d3.axisBottom(x)
	.ticks(5)
)

let yAxis =  svg.append("g")
.call(
	d3.axisLeft(y)
	.ticks(5)
)

let area = d3.area()
.x(d =>  x(moment(d.data.date, "DD/MM/YYYY")))
.y0(d =>  y(+d[0]))
.y1(d =>  y(+d[1]))

areaChart
.selectAll("none")
.data(stackedData)
.enter()
.append("path")


const scrollySteps = sheet.sheets['scrolly-chart'];

document.querySelector('.scroll-text__fixed-2').classList.remove('over');

scrollySteps.forEach((d, i) => {

	scrolly.addTrigger({
		num: i + 1, do: () => {

			document.querySelector('.scroll-text__fixed-2 .scroll-text__fixed__date').innerHTML = scrollySteps[i].Header;
			document.querySelector('.scroll-text__fixed-2 .scroll-text__fixed__text').innerHTML = scrollySteps[i].Copy;
			document.querySelector('.hr-2').style.width = Math.ceil(((i + 1) * 100) / scrollySteps.length) + '%';
			console.log(scrollySteps[i].Date)

			areaChart
			.selectAll("path")
			.data(() => {

				let newStacked = d3.stack()
				.keys(keys)
				.offset(d3.stackOffsetNone)
				.order(d3.stackOrderNone)
				(getData(scrollySteps[i].Date))

				x.domain([moment(chartData[0].date,'DD/MM/YYYY'), moment(scrollySteps[i].Date, 'DD/MM/YYYY')])

				xAxis
				.transition()
				.duration(500)
				.call(
					d3.axisBottom(x)
					.ticks(5)
				)

				return newStacked

			})
			.attr("fill", d => '#' + color(d.key))
			.transition()
			.duration(500)
			.attr("d", area)

		}
	})
})


scrolly.watchScroll();


const getData = (endDate) => {

	let newData = chartData.map(f => {

		if(moment(f.date,'DD/MM/YYYY') <= moment(endDate, 'DD/MM/YYYY')){
			return f
		}
		else{

			let obj = {}

			keys.forEach(key => {

				obj[key] = chartData[chartData.length-1][key]
			})

			obj.date = f.date

			return obj
		}

	})

	return newData

}
