const width = 900;
const height = 900;

const svg = d3.select("body")
  .append("svg")
  .attr("width",width)
  .attr("height",height);

const projection = d3.geoMercator()
    .center([0, 5 ])
    .scale(150)
    .rotate([-180,0]);

const path = d3.geoPath()
    .projection(projection);

const g = svg.append("g");
d3.json("https://tk-ohmori.github.io/infovis/FinalTask/dataworld-countries.geo.json").then(function(data) {
    g.selectAll("path")
        .data(topojson.feature(data, data.objects.countries).features)
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
            console.log(d)
        })
})

