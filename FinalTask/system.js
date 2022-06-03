const width = 900;
const height = 600;

const svg = d3.select("body")
  .append("svg")
  .attr("width",width)
  .attr("height",height);

const projection = d3.geoMercator()
    .center([0,0])
    .translate([width/2, height/2])
    .scale(130);

const path = d3.geoPath(projection);

d3.json("data/countries.geo.json").then(function(json){
    //
})

svg.append("g")
    .selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d",path)
    .attr("stroke","dimgray")
    .attr("stroke-width",0.5)
    .attr("fill","lightgray");