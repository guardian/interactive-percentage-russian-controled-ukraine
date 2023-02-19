import ScrollyTeller from "shared/js/scrollyteller";
import moment from 'moment'
import * as d3B from 'd3'
import sheet from 'assets/sheet.json'
import SvgText from 'svg-text';
import { numberWithCommas } from 'shared/js/util'

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

let isMobile = window.matchMedia('(max-width: 600px)').matches;

const d3 = Object.assign({}, d3B);

let width = document.documentElement.clientWidth;

let height = window.innerHeight;

let marginTopMobile = height < 600 ? window.innerHeight / 2 : window.innerHeight / 2.6

let margin = { left: 5, top: isMobile ? marginTopMobile : 6, right: 15, bottom: 30 }

const svg = d3.select('#gv-wrapper-2')
	.append('svg')
	.attr('id', 'chart')
	.attr('width', width - margin.right + 'px')
	.attr('height',height + 'px');

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

let xAxis = (g) => {

	return g
		.attr("class", "xaxis")
		.attr("transform", "translate(0," + (height - margin.bottom) + ")")
		.call(
			d3.axisBottom(x)
				.ticks(isMobile ? 3 : 5)
				.tickFormat(d => {

					let format = +d.getDate() != 1 ? "%-d %b" : "%b"

					return d3.timeFormat(format)(d)
				})
		)

}

svg.append("g").call(xAxis);

let yAxis = (g) => {
	return g
		.attr("class", 'yaxis')
		.call(d3.axisLeft(y)
			.tickFormat(d => numberWithCommas(d))
			.tickSizeInner(-width)
			.ticks(3)
		)
		.selectAll("text")
		.text((d,i) => {

			let label = d / 1000
			if(i === 1)label += 'k sq m (8.6%)'
			if(i === 2)label += 'k sq miles (17.2%)'
			return label
		})
		.style("text-anchor", isMobile ? "end" : "start")
		.attr('x', isMobile ? width -2 : 2)
		.attr('y', -10);
}

svg.append("g").call(yAxis);


const text = new SvgText({
	text: 'Russian-contolled land in Ukraine (brackets show % of total Ukraine)',
	element: document.querySelector('#chart'),
	maxWidth: 150,
	textOverflow: 'ellipsis',
	x: isMobile ? width -2 : 2,
	y: +d3.selectAll('.yaxis .tick')._groups[0][2].attributes[2].nodeValue.split(',')[1].split(')')[0] - 60,
	className: 'yaxisLabel',
	align: isMobile ? "right" : "left"
});

let newStacked = []

stackedData.forEach(entry => {

	let a = entry.map(e => {
		let a = [0, 0];
		a['data'] = e.data

		return a
	})
	let i = entry.index;
	let k = entry.key

	newStacked.push(a)
	newStacked[i]['index'] = i
	newStacked[i]['key'] = k

})

areaChart
	.selectAll("none")
	.data(newStacked)
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
let index = 0;

scrollySteps.forEach((d, i) => {

	scrolly.addTrigger({
		num: i + 1, do: () => {

			index = i;

			document.querySelector('.scroll-text__fixed-2 .scroll-text__fixed__date').innerHTML = scrollySteps[i].Header;
			document.querySelector('.scroll-text__fixed-2 .scroll-text__fixed__text').innerHTML = scrollySteps[i].Copy;
			document.querySelector('.hr-2').style.width = Math.ceil(((i + 1) * 100) / scrollySteps.length) + '%'

			let current = getData(scrollySteps[i].Date).find(f => f.date === scrollySteps[i].Date.replace(/-/g, '/'))

			let areas = []
			if (current) {
				Object.keys(current).forEach(k => {
					if (!isNaN(+current[k])) {
						areas.push(+current[k])
					}
				})
				document.querySelector('.area').innerHTML = numberWithCommas(areas.reduce((a, b) => a + b)) + ' sq miles controlled by Russia';
			}

			newStacked = getStack(getData(scrollySteps[i].Date), keys)

			x.domain([moment(chartData[0].date, 'DD/MM/YYYY'), moment(scrollySteps[i].Date, 'DD/MM/YYYY')])

			updateChart()
			updateAxis()
			updateLabels()

			d3.select('.date').node().innerHTML = moment(scrollySteps[i].Date, 'DD/MM/YYYY').format("D MMM YYYY")

		}
	})
})


scrolly.watchScroll();

const updateChart = () => {

	areaChart
		.selectAll("path")
		.data(newStacked)
		.attr("fill", d => '#' + getColor(d.key))
		.transition()
		.duration(500)
		.attr("d", area)

}

const updateLabels = () => {
	svg.selectAll('.label')
		.transition()
		.duration(500)
		.attr('x', d => {

			let lastDate = null;

			for (let i = 0; i < d.length; i++) {

				if (d[i][0] == d[i][1]) {
					lastDate = d[i].data.date
					break;
				}
			}

			if (lastDate) {
				midDate = moment((moment(d[0].data.date, 'DD/MM/YYYY') + moment(lastDate, 'DD/MM/YYYY')) / 2).format("DD/MM/YYYY");

			}
			else {

				midDate = moment((moment(chartData[0].date, 'DD/MM/YYYY') + moment(scrollySteps[index].Date, 'DD-MM-YYYY')) / 2).format("DD/MM/YYYY");
			}

			let posX = x(moment(midDate, "DD/MM/YYYY"))

			if(posX <= 45){
				posX-=20;
			}

			return posX + 'px'

		})
		.attr('y', d => {

			let lastDate = null;

			for (let i = 0; i < d.length; i++) {

				if (d[i][0] == d[i][1]) {
					lastDate = d[i].data.date
					break;
				}

			}

			if (lastDate) {
				midDate = moment((moment(d[0].data.date, 'DD/MM/YYYY') + moment(lastDate, 'DD/MM/YYYY')) / 2).format("DD/MM/YYYY");

			}
			else {
				midDate = moment((moment(chartData[0].date, 'DD/MM/YYYY') + moment(scrollySteps[index].Date, 'DD-MM-YYYY')) / 2).format("DD/MM/YYYY");
			}

			let date = d.find(f => f.data.date === midDate)

			let y0 = y(date[0])
			let y1 = y(date[1])

			return y0 + ((y1 - y0) / 2)


		})
		.style('text-anchor', d => {

			let lastDate = null;

			for (let i = 0; i < d.length; i++) {

				if (d[i][0] == d[i][1]) {
					lastDate = d[i].data.date
					break;
				}

			}
			let pos;

			isMobile && index >= 2 && lastDate ? pos = 'start' : pos = 'middle'

			return pos
		})
		.text(d => {

			let label = d.key
			if(label == "Luhans'k") label = "Luhansk"
			else if(label == "Donets'k") label = "Donetsk"
			else if(label == "Ivano-Frankivs'k") label = "Ivano-Frankivsk"
			else if(label == "Khmel'nyts'kyy") label = "Khmelnytskyi"
			else if(label == "Ternopil'") label = "Ternopil"
			else if(label == "L'viv") label = "Lviv"

			return label

		})

}

const updateAxis = () => {

	svg.selectAll(".xaxis")
		.call(xAxis);

	svg.selectAll(".yaxis")
		.call(yAxis);

	let posX = isMobile ? width - 2 : 2;
	let posY = +d3.selectAll('.yaxis .tick')._groups[0][2].attributes[2].nodeValue.split(',')[1].split(')')[0] - 60;

	d3.select('.yaxisLabel')
		.attr('transform', `translate(${posX} , ${posY})`)

	d3.selectAll('.yaxisLabel tspan')
		.attr('text-anchor', isMobile ? 'end' : 'start')

}


const getColor = (key) => {

	return d3.scaleOrdinal()
		.domain(keys)
		.range(["ffebee", "ef9a9a", "e57373", "ef5350", "b71c1c"])
		(key)

}

window.addEventListener("resize", () => {

	width = document.documentElement.clientWidth;
	height = window.innerHeight;

	isMobile = window.matchMedia('(max-width: 740px)').matches;

	marginTopMobile = height < 600 ? window.innerHeight / 2 : window.innerHeight / 3

	margin = { left: 5, top: isMobile ? marginTopMobile : 6, right: 15, bottom: 30 }

	x.range([margin.left, width - margin.right]);
	y.range([height - margin.bottom, margin.top]);

	svg
		.attr('width', width - margin.right + 'px')
		.attr('height', height + 'px');

	updateChart()
	updateAxis()
	updateLabels()
});