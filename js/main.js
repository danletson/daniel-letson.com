function Marquee(selector, speed) {
  const parentSelector = document.querySelector(selector);
  const clone = parentSelector.innerHTML;
  const firstElement = parentSelector.children[0];
  let i = 0;
  console.log(firstElement);
  parentSelector.insertAdjacentHTML("beforeend", clone);
  parentSelector.insertAdjacentHTML("beforeend", clone);
  parentSelector.insertAdjacentHTML("beforeend", clone);
  parentSelector.insertAdjacentHTML("beforeend", clone);

  setInterval(function () {
    firstElement.style.marginLeft = `-${i}px`;
    if (i > firstElement.clientWidth) {
      i = 0;
    }
    i = i + speed;
  }, 0);
}

//after window is completed load
//1 class selector for marquee
//2 marquee speed 0.2
window.addEventListener("load", Marquee(".marquee", 0.2));

// let logo = Snap.select('svg#logo');
// let d = logo.select('.d');
// let l = logo.select('.l');
// logo.mouseover(function() {
//     console.log(l);
//     l.animate(
//       { transform: 'R90,275,275t0,65'},120);
//     d.animate(
//       { transform: 'R-45,97,97'},120);
//   });
// logo.mouseout(function() {
//     console.log(l);
//     l.animate(
//        { transform: 'R0,275,275t0,0'},120);
//     d.animate(
//        { transform: 'R0,97,97'},120);
//   });

// Glide

const slider = new Glide(".glide", {
  type: "carousel",
  startAt: 1,
  perView: 1
}).mount();

document.querySelector(".glide__arrow--right").addEventListener("click", () => {
  slider.go(">");
});

document.querySelector(".glide__arrow--left").addEventListener("click", () => {
  slider.go("<");
});

const containerDiv = d3.select('#container')

const mindShare = await d3.csv("mindShare.csv");

// console.log(mindShare);

const milestones = await d3.csv("milestones.csv");

// console.log(milestones);

// Declare the chart dimensions and margins.
const width = parseInt(d3.select(".datavis").style("width"));
// console.log(width);
const height = 148;
const marginTop = 20;
const marginRight = 120;
const marginBottom = 30;
const marginLeft = 32;

// const colors = ["tomato", "lightsalmon", "gold", "mediumaquamarine", "dodgerblue", "mediumorchid"];
const colors = ["#FF833A", "#E2AD3B", "#9DEF60", "#00E392", "#00BEBE", "#1783D8"]
// const colors = ["rgb(88,181,225)", "rgb(163,215,30)", "rgb(175,142,230)", "rgb(93,242,62)", "rgb(253,159,159)", "rgb(36,255,205)"];

function highlight(d) {
  // console.log(d);
  d3.selectAll(".chartArea:not(.chartArea" + d.index + ")").transition().duration('150').attr('opacity', .2);
  d3.selectAll(".chartArea" + d.index).transition().duration('150').attr('opacity', 1);
}

function noHighlight(d) {
  d3.selectAll(".chartArea").transition().duration('150').attr('opacity', 1);
}

function milestoneHighlight(d) {
  // console.log(d);
  let highlightedAreas = d.areas.split('');

  d3.selectAll(".chartArea").attr("opacity", 0.2);

  highlightedAreas.forEach(i => {
    d3.selectAll(".chartArea" + i).attr("opacity", 1);
  });

  d3.selectAll(".milestoneIndicator:not(.milestoneIndicator" + d.index + ")").transition().duration(250).attr("opacity", 0);
  d3.selectAll(".milestoneIndicator" + d.index).transition().duration(150).attr("opacity", 1);
  d3.selectAll(".chartTitle").attr("style", "opacity:0");
  d3.selectAll(".milestoneText").attr("style", "opacity:0");
  d3.selectAll(".milestoneText" + d.index).attr("style", "opacity:1");
}

function milestoneNoHighlight(d) {
  d3.selectAll(".milestoneIndicator").transition().duration(150).attr("opacity", 0.5);
  d3.selectAll(".chartArea").attr("opacity", 1);
  d3.selectAll(".chartTitle").attr("style", "opacity:1");
  d3.selectAll(".milestoneText").attr("style", "opacity:0");
}

// Declare the x(horizontal position) scale.
const series = d3.stack()
  .offset(d3.stackOffsetExpand)
  .keys(d3.union(d3.reverse(mindShare.map(d => d.areaOfInterest)))) // distinct series keys, in input order
  .value(([, group], key) => group.get(key).value) // get value for each series key and stack
  (d3.index(mindShare, d => d.year, d => d.areaOfInterest)); // group by stack then series key

// console.log(series);

// Prepare the scales for positional and color encodings.
const x = d3.scaleLinear()
  .domain(d3.extent(mindShare, d => d.year))
  .range([marginLeft, width - marginRight]);

// Declare the y (vertical position) scale.
const y = d3.scaleLinear()
  .rangeRound([height - marginBottom, marginTop]);

const color = d3.scaleOrdinal()
  .domain(series.map(d => d.key))
  .range(colors);

// Construct an area shape.
const area = d3.area()
  .curve(d3.curveBumpX)
  .x(d => x(d.data[0]))
  .y0(d => y(d[0]))
  .y1(d => y(d[1]));

// Create the SVG container.
const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto;");

// svg.append("title")
// .text("A stream chart, showing changes in 6 categories of work over time. The chart begins in 2010, where the majority of work is categorized as 'Fabrication'. By 2024, the chart shows a more balanced breakdown between the categories of 'Strategy', 'UX', 'Frontend', 'Research', and to a lesser extent 'Branding'.")

svg.append("g")
  .selectAll("legendTitle")
  .data(series)
  .enter()
  .append("text")
  .attr("class", d => "legendTitle chartArea chartArea" + d.index)
  .text(d => d.key)
  .attr("text-anchor", "start")
  .attr("x", width - marginRight + 8)
  .attr("y", function (d, i) { return (height - marginBottom - 6) - (i * 16) })
  .attr("fill", d => color(d.key))
  .on("mouseover", (event, d) => highlight(d))
  .on("mouseleave", (event, d) => noHighlight(d))

// Append a path for each series.
svg.append("g")
  .selectAll()
  .data(series)
  .join("path")
  .attr("fill", d => color(d.key))
  .attr("opacity", 0.2)
  .attr("shape-rendering", "geometricPrecision")
  .attr("d", area)
  // .attr("stroke", "#160c1d")
  .attr("class", d => "chartArea chartArea" + d.index)
  .on("mouseover", (event, d) => highlight(d))
  .on("mouseleave", (event, d) => noHighlight(d))
  .append("title")
  .text(d => d.key);

svg.selectAll('path')
  .transition().delay(function (d) { return d.index * 100 }).duration(300).attr('opacity', 1);

const highlightedYears = [2009, 2014, 2019, 2024];

svg.append("g")
  .attr("class", "xAxis")
  .attr("transform", `translate(0,${height - marginBottom - 8})`)
  .call(d3.axisBottom(x)
    .ticks(15)
    .tickSizeInner(16)
    .tickFormat(function (d) { return highlightedYears.includes(d) ? d : "" })
  )
  // .tickValues([2010, 2024]).tickFormat(function (d) { return d === 2010 ? "Then" : "Now" }))
  .call(g => g.select(".domain").remove())
  .selectAll(".tick text")
  .attr("x", 0)
  .attr("y", 12);

svg.selectAll(".xAxis .tick line")
  .attr("opacity", .5)
  .attr("stroke", "white")
  .attr("y2", function (d) { return highlightedYears.includes(d) ? 8 : 0 });

svg.append("g")
  .attr("class", "yAxis")
  .attr("transform", `translate(${marginLeft - 4},0)`)
  .call(d3.axisLeft(y)
    .tickValues([0.50, 1.00])
    .tickSizeInner(0)
    .tickSizeOuter(0)
    .tickFormat(d3.format(".0%"))
  )
  .call(g => g.select(".domain").remove());


// Append circle and text for each milestone
let milestonesGroup = svg.append("g")
  .selectAll()
  .data(milestones)
  .enter()
  .append("circle")
  .attr("class", function (d, i) { return "milestone milestone" + i })
  .attr("r", 15)
  .attr("fill", "rgba(0,0,0,0)")
  .attr("data-areas", d => d.areas)
  .attr("cx", d => x(d.year))
  .attr("cy", height - (marginBottom / 2) + 5)
  .on("mouseover", (event, d) => milestoneHighlight(d))
  .on("mouseleave", (event, d) => milestoneNoHighlight(d));

svg.append("g")
  .attr("class", "milestoneIndicators")
  .selectAll()
  .data(milestones)
  .enter()
  .append("circle")
  .attr("class", function (d, i) { return "milestoneIndicator milestoneIndicator" + i })
  .attr("cx", d => x(d.year))
  .attr("cy", height - (marginBottom / 2))
  .attr("r", 4)
  .attr("opacity", 0.5)
  .attr("fill", "white");

svg.append("g")
  .attr("class", "milestoneIndicators")
  .selectAll()
  .data(milestones)
  .enter()
  .append("line")
  .attr("class", function (d, i) { return "milestoneIndicator milestoneIndicator" + i })
  .attr("x1", d => x(d.year))
  .attr("x2", d => x(d.year))
  .attr("y1", marginTop)
  .attr("y2", height - (marginBottom / 2) - 4)
  .attr("opacity", 0.5)
  .attr("stroke", "white")

containerDiv.selectAll()
  .data(milestones)
  .enter()
  .append("div")
  .attr("class", function (d, i) { return "milestoneText milestoneText" + i })
  .html(function (d) { return d.milestone })

// Append the SVG element.
container.append(svg.node());