
import ScrollyTeller from "shared/js/scrollyteller";
import moment from 'moment'
import * as d3B from 'd3'
import sheet from 'assets/sheet.json'
import SvgText from 'svg-text';

const d3 = Object.assign({}, d3B);

const isMobile = window.matchMedia('(max-width: 600px)').matches;

const width = document.documentElement.clientWidth;
const height = window.innerHeight;

const marginTopMobile = height < 600 ? window.innerHeight / 2 : window.innerHeight / 3

const margin = { left:5, top: isMobile ? marginTopMobile : 6, right: 0, bottom: 30 }

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

const getStack = (data, keys) => {

	return d3.stack()
		.keys(keys)
		(data)

}

let stackedData = getStack(chartData, keys)

let x = d3.scaleTime()
	.domain(d3.extent(chartData, d => moment(d.date, "DD/MM/YYYY")))
	.range([margin.left, width - margin.right]);

let max = d3.max(stackedData.map(d => { return d3.max(d.map(f => { return d3.max(f) })) }))

let y = d3.scaleLinear()
	.domain([0, max])
	.range([height - margin.bottom, margin.top]);

let area = d3.area()
	.x(d => x(moment(d.data.date, "DD/MM/YYYY")))
	.y0(d => y(+d[0]))
	.y1(d => y(+d[1]))

let areaChart = svg.append('g')

let xAxis = svg.append("g")
	.attr("transform", "translate(0," + (height - margin.bottom) + ")")
	.attr("class", "xaxis")
	.call(
		d3.axisBottom(x)
			.ticks(5)
			.tickFormat(d3.timeFormat("%-d %b"))
	)

let yAxis = svg.append("g")
	.attr("class", "yaxis")
	.call(
		d3.axisLeft(y)
			.ticks(3)
			.tickSizeInner(-width)

	)
	.selectAll("text")
	.attr('dx', isMobile ? width : margin.left + 3)
	.attr('dy', -5 + 'px')
	.attr('text-anchor', isMobile ? "end" : "start")
	.text((d, i) => i == 2 ? (+d).toLocaleString('en-GB', { maximumFractionDigits: 0 }) + ' sqm' : (+d).toLocaleString('en-GB', { maximumFractionDigits: 0 }))

const text = new SvgText({
	text: 'Russian-controlled Ukrainian land',
	element: document.querySelector('#chart'),
	maxWidth: 150,
	textOverflow: 'ellipsis',
	x:isMobile ? d3.selectAll('.yaxis .tick text').attr("dx") - 2 : margin.left,
	y:+d3.selectAll('.yaxis .tick').nodes()[2].attributes.transform.value.split(',')[1].split(')')[0] - 55,
	className:'yaxis',
	align:isMobile ? "right" : "left"
  });

text.y = text.bounds.height

areaChart
	.selectAll("none")
	.data(() => {
		let arr = []
		
		stackedData.forEach(entry => {
	
			let a = entry.map(e => {
				let a = [0,0];
				a['data'] = e.data

				return a
			})
			let i = entry.index;
			let k = entry.key

			arr.push(a)
			arr[i]['index'] = i
			arr[i]['key'] = k
			
		})

		return arr
	})
	.enter()
	.append("path")
	.attr('d', area)

const scrollySteps = sheet.sheets['scrolly-chart'];

const getData = (endDate) => {

	let newData = chartData.map(f => {

		if (moment(f.date, 'DD/MM/YYYY') <= moment(endDate, 'DD/MM/YYYY')) {
			return f
		}
		else {

			let obj = {}

			keys.forEach(key => {

				obj[key] = chartData[chartData.length - 1][key]
			})

			obj.date = f.date

			return obj
		}

	})

	return newData

}

let labels = svg.append('g')
	.selectAll('none')
	.data(stackedData)
	.enter()
	.append('text')
	.attr('class', 'label')
	.attr('y', height)

document.querySelector('.scroll-text__fixed-2').classList.remove('over');

let midDate;

scrollySteps.forEach((d, i) => {

	scrolly.addTrigger({
		num: i + 1, do: () => {

			document.querySelector('.scroll-text__fixed-2 .scroll-text__fixed__date').innerHTML = scrollySteps[i].Header;
			document.querySelector('.scroll-text__fixed-2 .scroll-text__fixed__text').innerHTML = scrollySteps[i].Copy;
			document.querySelector('.hr-2').style.width = Math.ceil(((i + 1) * 100) / scrollySteps.length) + '%'

			areaChart
				.selectAll("path")
				.data(() => {

					let newStacked = getStack(getData(scrollySteps[i].Date), keys)

					x.domain([moment(chartData[0].date, 'DD/MM/YYYY'), moment(scrollySteps[i].Date, 'DD/MM/YYYY')])

					return newStacked

				})
				.attr("fill", d => '#' + getColor(d.key))
				.transition()
				.duration(500)
				.attr("d", area)

			

			svg.selectAll('.label')
				.transition()
				.duration(500)
				.attr('x', d => {

					let lastDate = null;

					for (let i = 0; i < d.length; i++) {

						if(d[i][0] == d[i][1]){
							lastDate = d[i].data.date
							break;
						}

					}

					if(lastDate)
					{
						midDate = moment((moment(d[0].data.date, 'DD/MM/YYYY') + moment(lastDate, 'DD/MM/YYYY')) / 2).format("DD/MM/YYYY");
						
					}
					else
					{

						midDate = moment((moment(chartData[0].date, 'DD/MM/YYYY') + moment(scrollySteps[i].Date, 'DD-MM-YYYY')) / 2).format("DD/MM/YYYY");
					}

					return  `${x(moment(midDate, "DD/MM/YYYY"))}px`

					
				})
				.attr('y', d => {

					let lastDate = null;

					for (let i = 0; i < d.length; i++) {

						if(d[i][0] == d[i][1]){
							lastDate = d[i].data.date
							break;
						}

					}

					if(lastDate)
					{
						midDate = moment((moment(d[0].data.date, 'DD/MM/YYYY') + moment(lastDate, 'DD/MM/YYYY')) / 2).format("DD/MM/YYYY");
						
					}
					else
					{
						midDate = moment((moment(chartData[0].date, 'DD/MM/YYYY') + moment(scrollySteps[i].Date, 'DD-MM-YYYY')) / 2).format("DD/MM/YYYY");
					}

					let date = d.find(f => f.data.date === midDate)
			
					let y0 = y(date[0])
					let y1 = y(date[1])
			
					return y0 + ((y1 - y0) / 2)
			
			
				})
				.style('text-anchor', d => {

					let lastDate = null;

					for (let i = 0; i < d.length; i++) {

						if(d[i][0] == d[i][1]){
							lastDate = d[i].data.date
							break;
						}

					}
					let pos;

					isMobile && i >= 2 && lastDate ? pos = 'start' : pos = 'middle'

					return pos
				})
				.text(d => d.key == "Kiev" ? "Kyiv" : d.key)

			d3.select('.date').node().innerHTML =  moment(scrollySteps[i].Date, 'DD/MM/YYYY').format("D MMM YYYY")

			let timeFormat = i == 0 ? d3.timeFormat("%-d %b") : d3.timeFormat("%b")
			xAxis
				.transition()
				.duration(500)
				.call(
					d3.axisBottom(x)
						.ticks(5)
						.tickFormat(timeFormat)
				)
			.selectAll("text")


		}
	})
})


scrolly.watchScroll();




const getColor = (key) => {

	return d3.scaleOrdinal()
		.domain(keys)
		.range(["ffebee", "ef9a9a", "e57373", "ef5350", "b71c1c"])
		(key)

}