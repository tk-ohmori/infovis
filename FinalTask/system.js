const width = 900;
const height = 900;

const svg = d3.select("body")
  .append("svg")
  .attr("width",width)
  .attr("height",height);

const projection = d3.geoMercator()
    .center([0,0])
    .translate([width/2, height/2])
    .scale(130);

const path = d3.geoPath(projection);

d3.json("https://tk-ohmori.github.io/infovis/FinalTask/data/countries.geo.json").then(function(data) {
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d",path)
        .attr("stroke", "dimgray")
        .attr("stroke-width",0.5)
        .attr("fill","lightgray")
        .on('mouseover', (e, d) => {
            if(d.properties.name != 'Bermuda') e.target.setAttribute('fill', 'white')
        })
        .on('mouseleave', (e, d) => {
            e.target.setAttribute('fill', 'lightgray')
        })
        .on('click', (e, d) => {
            console.log(d.properties.name)
        })
})

