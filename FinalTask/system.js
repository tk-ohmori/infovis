let selected = ['Japan', 'United States of America', 'China', 'South Korea', 'United Kingdom']

d3.json("https://tk-ohmori.github.io/infovis/FinalTask/data/world-110m2.geo.json")
    .then(function(data) {
        var geo_map = new GeoMap({
            parent: '#map_region',
            width: 600,
            height: 450,
            center: -135,
            bottom: 20
        }, data);
        geo_map.update();
    });


/////////

// const width = 900;
// const height = 500;

// const svg = d3.select("body")
//   .append("svg")
//   .attr("width",width)
//   .attr("height",height);

// const projection = d3.geoMercator()
//     .center([10, 5])
//     .scale(130)
//     .rotate([-135,-10]);

// const path = d3.geoPath()
//     .projection(projection);

// const g = svg.append("g");
// d3.json("https://tk-ohmori.github.io/infovis/FinalTask/data/world-110m2.geo.json").then(function(data) {
//     g.selectAll("path")
//         .data(topojson.feature(data, data.objects.countries).features)
//         .enter()
//         .append("path")
//         .attr("d",path)
//         .attr("stroke", "dimgray")
//         .attr("stroke-width",0.5)
//         .attr("fill","lightgray")
//         .on('mouseover', (e, d) => {
//             if(d.properties.name != 'Bermuda') e.target.setAttribute('fill', 'white')
//         })
//         .on('mouseleave', (e, d) => {
//             e.target.setAttribute('fill', 'lightgray')
//         })
//         .on('click', (e, d) => {
//             console.log(d.properties.name)
//         })
// })

